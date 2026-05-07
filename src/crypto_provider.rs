//! # ML-KEM768 Crypto Provider for rustls
//!
//! Post-quantum key exchange support using ML-KEM768 via libcrux-ml-kem.
//! Implements both pure ML-KEM768 and hybrid X25519MLKEM768 key exchange groups.
//!
//! Compatible with WASM32-unknown-unknown target (Cloudflare Workers).
//!
//! Note: ML-KEM groups are implemented but not registered by default to avoid
//! compatibility issues with servers that don't recognize post-quantum extensions.

#![allow(dead_code)]

use std::boxed::Box;
use std::vec::Vec;

use rustls::crypto::ring::kx_group;

// ============================================================================
// Pure ML-KEM768 Implementation
// ============================================================================

/// ML-KEM768 key exchange (pure post-quantum)
#[derive(Debug)]
pub(super) struct MlKem768;

impl MlKem768 {
    pub(super) const ENCAPS_LEN: usize = 1184;
    pub(super) const CIPHERTEXT_LEN: usize = 1088;
}

impl rustls::crypto::SupportedKxGroup for MlKem768 {
    fn start(&self) -> Result<Box<dyn rustls::crypto::ActiveKeyExchange>, rustls::Error> {
        let mut randomness = [0u8; 64];
        getrandom::fill(&mut randomness)
            .map_err(|_| rustls::Error::from(rustls::crypto::GetRandomFailed))?;

        let key_pair = libcrux_ml_kem::mlkem768::generate_key_pair(randomness);
        let (decaps_key, encaps_key) = key_pair.into_parts();

        Ok(Box::new(MlKem768Active {
            decaps_key,
            encaps_key_bytes: encaps_key.as_slice().to_vec(),
        }))
    }

    fn start_and_complete(
        &self,
        client_share: &[u8],
    ) -> Result<rustls::crypto::CompletedKeyExchange, rustls::Error> {
        let encaps_key = libcrux_ml_kem::mlkem768::MlKem768PublicKey::try_from(client_share)
            .map_err(|_| rustls::Error::PeerMisbehaved(rustls::PeerMisbehaved::InvalidKeyShare))?;

        let mut randomness = [0u8; 32];
        getrandom::fill(&mut randomness)
            .map_err(|_| rustls::Error::from(rustls::crypto::GetRandomFailed))?;

        let (ciphertext, shared_secret) =
            libcrux_ml_kem::mlkem768::encapsulate(&encaps_key, randomness);

        Ok(rustls::crypto::CompletedKeyExchange {
            group: self.name(),
            pub_key: Vec::from(ciphertext.as_ref()),
            secret: rustls::crypto::SharedSecret::from(shared_secret.as_ref()),
        })
    }

    fn ffdhe_group(&self) -> Option<rustls::ffdhe_groups::FfdheGroup<'static>> {
        None
    }

    fn name(&self) -> rustls::NamedGroup {
        rustls::NamedGroup::MLKEM768
    }

    fn usable_for_version(&self, version: rustls::ProtocolVersion) -> bool {
        version == rustls::ProtocolVersion::TLSv1_3
    }
}

struct MlKem768Active {
    decaps_key: libcrux_ml_kem::mlkem768::MlKem768PrivateKey,
    encaps_key_bytes: Vec<u8>,
}

impl rustls::crypto::ActiveKeyExchange for MlKem768Active {
    fn complete(
        self: Box<Self>,
        peer_pub_key: &[u8],
    ) -> Result<rustls::crypto::SharedSecret, rustls::Error> {
        let ciphertext = libcrux_ml_kem::mlkem768::MlKem768Ciphertext::try_from(peer_pub_key)
            .map_err(|_| rustls::Error::PeerMisbehaved(rustls::PeerMisbehaved::InvalidKeyShare))?;

        let shared_secret = libcrux_ml_kem::mlkem768::decapsulate(&self.decaps_key, &ciphertext);

        Ok(rustls::crypto::SharedSecret::from(shared_secret.as_ref()))
    }

    fn pub_key(&self) -> &[u8] {
        &self.encaps_key_bytes
    }

    fn ffdhe_group(&self) -> Option<rustls::ffdhe_groups::FfdheGroup<'static>> {
        None
    }

    fn group(&self) -> rustls::NamedGroup {
        rustls::NamedGroup::MLKEM768
    }
}

// ============================================================================
// Hybrid Key Exchange Implementation
// ============================================================================

#[derive(Clone, Copy, Debug)]
struct HybridLayout {
    classical_share_len: usize,
    pq_client_share_len: usize,
    pq_server_share_len: usize,
    pq_first: bool,
}

impl HybridLayout {
    fn split_client_share<'a>(&self, share: &'a [u8]) -> Option<(&'a [u8], &'a [u8])> {
        self.split(share, self.pq_client_share_len)
    }

    fn split_server_share<'a>(&self, share: &'a [u8]) -> Option<(&'a [u8], &'a [u8])> {
        self.split(share, self.pq_server_share_len)
    }

    fn split<'a>(&self, share: &'a [u8], pq_share_len: usize) -> Option<(&'a [u8], &'a [u8])> {
        if share.len() != self.classical_share_len + pq_share_len {
            return None;
        }
        Some(if self.pq_first {
            let (pq, classical) = share.split_at(pq_share_len);
            (pq, classical)
        } else {
            let (classical, pq) = share.split_at(self.classical_share_len);
            (pq, classical)
        })
    }

    fn concat(&self, pq: &[u8], classical: &[u8]) -> Vec<u8> {
        if self.pq_first {
            [pq, classical].concat()
        } else {
            [classical, pq].concat()
        }
    }
}

static X25519MLKEM768_LAYOUT: HybridLayout = HybridLayout {
    classical_share_len: 32,
    pq_client_share_len: MlKem768::ENCAPS_LEN,
    pq_server_share_len: MlKem768::CIPHERTEXT_LEN,
    pq_first: true,
};

static SECP256R1MLKEM768_LAYOUT: HybridLayout = HybridLayout {
    classical_share_len: 65,
    pq_client_share_len: MlKem768::ENCAPS_LEN,
    pq_server_share_len: MlKem768::CIPHERTEXT_LEN,
    pq_first: true,
};

#[derive(Debug)]
struct HybridKxGroup {
    classical: &'static dyn rustls::crypto::SupportedKxGroup,
    pq: &'static dyn rustls::crypto::SupportedKxGroup,
    name: rustls::NamedGroup,
    layout: HybridLayout,
}

impl rustls::crypto::SupportedKxGroup for HybridKxGroup {
    fn start(&self) -> Result<Box<dyn rustls::crypto::ActiveKeyExchange>, rustls::Error> {
        let classical_active = self.classical.start()?;
        let pq_active = self.pq.start()?;

        let combined_pub_key = self
            .layout
            .concat(pq_active.pub_key(), classical_active.pub_key());

        Ok(Box::new(ActiveHybrid {
            classical: classical_active,
            pq: pq_active,
            name: self.name,
            layout: self.layout,
            combined_pub_key,
        }))
    }

    fn start_and_complete(
        &self,
        client_share: &[u8],
    ) -> Result<rustls::crypto::CompletedKeyExchange, rustls::Error> {
        let (pq_share, classical_share) =
            self.layout
                .split_client_share(client_share)
                .ok_or(rustls::Error::PeerMisbehaved(
                    rustls::PeerMisbehaved::InvalidKeyShare,
                ))?;

        let cl_completed = self.classical.start_and_complete(classical_share)?;
        let pq_completed = self.pq.start_and_complete(pq_share)?;

        let combined_pub_key = self
            .layout
            .concat(&pq_completed.pub_key, &cl_completed.pub_key);
        let secret = self.layout.concat(
            pq_completed.secret.secret_bytes(),
            cl_completed.secret.secret_bytes(),
        );

        Ok(rustls::crypto::CompletedKeyExchange {
            group: self.name,
            pub_key: combined_pub_key,
            secret: rustls::crypto::SharedSecret::from(secret),
        })
    }

    fn ffdhe_group(&self) -> Option<rustls::ffdhe_groups::FfdheGroup<'static>> {
        None
    }

    fn name(&self) -> rustls::NamedGroup {
        self.name
    }

    fn usable_for_version(&self, version: rustls::ProtocolVersion) -> bool {
        version == rustls::ProtocolVersion::TLSv1_3
    }
}

struct ActiveHybrid {
    classical: Box<dyn rustls::crypto::ActiveKeyExchange>,
    pq: Box<dyn rustls::crypto::ActiveKeyExchange>,
    name: rustls::NamedGroup,
    layout: HybridLayout,
    combined_pub_key: Vec<u8>,
}

impl rustls::crypto::ActiveKeyExchange for ActiveHybrid {
    fn complete(
        self: Box<Self>,
        peer_pub_key: &[u8],
    ) -> Result<rustls::crypto::SharedSecret, rustls::Error> {
        let (pq_share, classical_share) =
            self.layout
                .split_server_share(peer_pub_key)
                .ok_or(rustls::Error::PeerMisbehaved(
                    rustls::PeerMisbehaved::InvalidKeyShare,
                ))?;

        let cl_secret = self.classical.complete(classical_share)?;
        let pq_secret = self.pq.complete(pq_share)?;

        let secret = self
            .layout
            .concat(pq_secret.secret_bytes(), cl_secret.secret_bytes());
        Ok(rustls::crypto::SharedSecret::from(secret))
    }

    fn hybrid_component(&self) -> Option<(rustls::NamedGroup, &[u8])> {
        Some((self.classical.group(), self.classical.pub_key()))
    }

    fn complete_hybrid_component(
        self: Box<Self>,
        peer_pub_key: &[u8],
    ) -> Result<rustls::crypto::SharedSecret, rustls::Error> {
        self.classical.complete(peer_pub_key)
    }

    fn pub_key(&self) -> &[u8] {
        &self.combined_pub_key
    }

    fn ffdhe_group(&self) -> Option<rustls::ffdhe_groups::FfdheGroup<'static>> {
        None
    }

    fn group(&self) -> rustls::NamedGroup {
        self.name
    }
}

static X25519MLKEM768: HybridKxGroup = HybridKxGroup {
    classical: kx_group::X25519,
    pq: &MlKem768,
    name: rustls::NamedGroup::X25519MLKEM768,
    layout: X25519MLKEM768_LAYOUT,
};

static SECP256R1MLKEM768: HybridKxGroup = HybridKxGroup {
    classical: kx_group::SECP256R1,
    pq: &MlKem768,
    name: rustls::NamedGroup::secp256r1MLKEM768,
    layout: SECP256R1MLKEM768_LAYOUT,
};

// ============================================================================
// Provider Installation
// ============================================================================

/// Install the crypto provider with full ML-KEM768 support
///
/// Registers classical groups and post-quantum ML-KEM groups.
/// If the server supports ML-KEM, it will be used via X25519MLKEM768 hybrid.
/// Otherwise, falls back to classical X25519.
pub fn install() -> Result<(), rustls::Error> {
    let mut provider = rustls::crypto::ring::default_provider();

    provider.kx_groups.clear();

    // Hybrid post-quantum groups first (preferred if server supports them)
    provider.kx_groups.push(&X25519MLKEM768);
    provider.kx_groups.push(&SECP256R1MLKEM768);

    // Classical groups (fallback for servers without ML-KEM support)
    provider.kx_groups.push(kx_group::X25519);
    provider.kx_groups.push(kx_group::SECP256R1);
    provider.kx_groups.push(kx_group::SECP384R1);

    // Pure ML-KEM768
    provider.kx_groups.push(&MlKem768);

    provider
        .install_default()
        .map_err(|_| rustls::Error::General("Failed to install crypto provider".into()))
}

#[cfg(test)]
mod tests {
    use super::*;
    use rustls::crypto::SupportedKxGroup;

    #[test]
    fn test_mlkem768_basic() {
        let kx = MlKem768;
        assert_eq!(kx.name(), rustls::NamedGroup::MLKEM768);
        assert!(!kx.usable_for_version(rustls::ProtocolVersion::TLSv1_2));
        assert!(kx.usable_for_version(rustls::ProtocolVersion::TLSv1_3));

        let active = kx.start().expect("Failed to generate key pair");
        assert_eq!(active.group(), rustls::NamedGroup::MLKEM768);
        assert_eq!(active.pub_key().len(), MlKem768::ENCAPS_LEN);

        let client_pub_key = active.pub_key();
        let completed = kx
            .start_and_complete(client_pub_key)
            .expect("Failed to complete key exchange");

        assert_eq!(completed.group, rustls::NamedGroup::MLKEM768);
        assert_eq!(completed.pub_key.len(), MlKem768::CIPHERTEXT_LEN);
    }

    #[test]
    fn test_x25519mlkem768_basic() {
        let kx = &X25519MLKEM768 as &dyn rustls::crypto::SupportedKxGroup;
        assert_eq!(kx.name(), rustls::NamedGroup::X25519MLKEM768);

        let active = kx.start().expect("Failed to generate hybrid key pair");
        assert_eq!(active.group(), rustls::NamedGroup::X25519MLKEM768);
        assert_eq!(active.pub_key().len(), 32 + MlKem768::ENCAPS_LEN);

        let (group, pub_key) = active
            .hybrid_component()
            .expect("Should have hybrid component");
        assert_eq!(group, rustls::NamedGroup::X25519);
        assert_eq!(pub_key.len(), 32);
    }
}
