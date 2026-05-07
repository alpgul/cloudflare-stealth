//! # WASM-Compatible HPKE Provider for rustls ECH
//!
//! `aws_lc_rs` does not support `wasm32-unknown-unknown`, so rustls's built-in
//! HPKE implementation is unavailable in Cloudflare Workers.
//!
//! This module provides a custom [`rustls::crypto::hpke::Hpke`] implementation
//! using the [`hpke`] crate (RustCrypto, pure Rust, RFC 9180 compliant) that
//! works on WASM targets.
//!
//! ## Supported Suite
//!
//! **DHKEM(P-256, HKDF-SHA256) + HKDF-SHA256 + AES-128-GCM**
//! - `HpkeKem::DHKEM_P256_HKDF_SHA256` (0x0010)
//! - `HpkeKdf::HKDF_SHA256` (0x0001)
//! - `HpkeAead::AES_128_GCM` (0x0001)
//!
//! This is the same suite used by Cloudflare's ECH deployment and the most
//! common suite in the wild.

use std::fmt;

use hpke::{
    Deserializable, OpModeS, Serializable,
    aead::{AeadCtxR, AeadCtxS, AesGcm128},
    kdf::HkdfSha256,
    kem::{DhP256HkdfSha256, Kem},
};
use rustls::Error;
use rustls::crypto::hpke::{
    EncapsulatedSecret, HpkeOpener, HpkePrivateKey, HpkePublicKey, HpkeSealer, HpkeSuite,
};
use rustls::internal::msgs::enums::{HpkeAead, HpkeKdf, HpkeKem};
use rustls::internal::msgs::handshake::HpkeSymmetricCipherSuite;

// Type aliases for the chosen suite
type MyKem = DhP256HkdfSha256;
type MyAead = AesGcm128;
type MyKdf = HkdfSha256;

/// The GREASE HPKE suite: DHKEM(P-256, HKDF-SHA256) + HKDF-SHA256 + AES-128-GCM.
///
/// Exposed as a `static` so `tls.rs` can reference it directly:
/// ```rust,ignore
/// let (pub_key, _priv_key) = GREASE_HPKE_SUITE.generate_key_pair().unwrap();
/// EchGreaseConfig::new(GREASE_HPKE_SUITE, pub_key).into()
/// ```
pub static GREASE_HPKE_SUITE: &dyn rustls::crypto::hpke::Hpke = &WasmHpke;

// ─────────────────────────────────────────────────────────────────────────────
// Core provider struct
// ─────────────────────────────────────────────────────────────────────────────

/// WASM-compatible HPKE provider backed by RustCrypto's `hpke` crate.
#[derive(Debug)]
pub struct WasmHpke;

impl rustls::crypto::hpke::Hpke for WasmHpke {
    // ── Key generation ────────────────────────────────────────────────────────

    fn generate_key_pair(&self) -> Result<(HpkePublicKey, HpkePrivateKey), Error> {
        let mut rng = WasmRng;
        let (private_key, public_key) = MyKem::gen_keypair(&mut rng);

        let pub_bytes = public_key.to_bytes().to_vec();
        let priv_bytes = private_key.to_bytes().to_vec();

        Ok((HpkePublicKey(pub_bytes), HpkePrivateKey::from(priv_bytes)))
    }

    // ── Single-shot seal (used for GREASE / one-shot ECH) ─────────────────────

    fn seal(
        &self,
        info: &[u8],
        aad: &[u8],
        plaintext: &[u8],
        pub_key: &HpkePublicKey,
    ) -> Result<(EncapsulatedSecret, Vec<u8>), Error> {
        let recipient_pk =
            <MyKem as hpke::Kem>::PublicKey::from_bytes(&pub_key.0).map_err(hpke_err)?;

        let mut rng = WasmRng;

        let (enc, ciphertext) = hpke::single_shot_seal::<MyAead, MyKdf, MyKem, _>(
            &OpModeS::Base,
            &recipient_pk,
            info,
            plaintext,
            aad,
            &mut rng,
        )
        .map_err(hpke_err)?;

        Ok((
            EncapsulatedSecret(enc.to_bytes().to_vec()),
            ciphertext,
        ))
    }

    // ── Stateful sealer (used for actual ECH ClientHello encryption) ──────────

    fn setup_sealer(
        &self,
        info: &[u8],
        pub_key: &HpkePublicKey,
    ) -> Result<(EncapsulatedSecret, Box<dyn HpkeSealer + 'static>), Error> {
        let recipient_pk =
            <MyKem as hpke::Kem>::PublicKey::from_bytes(&pub_key.0).map_err(hpke_err)?;

        let mut rng = WasmRng;

        let (enc, sender_ctx) = hpke::setup_sender::<MyAead, MyKdf, MyKem, _>(
            &OpModeS::Base,
            &recipient_pk,
            info,
            &mut rng,
        )
        .map_err(hpke_err)?;

        Ok((
            EncapsulatedSecret(enc.to_bytes().to_vec()),
            Box::new(WasmHpkeSealer {
                ctx: sender_ctx,
            }),
        ))
    }

    // ── Single-shot open ──────────────────────────────────────────────────────

    fn open(
        &self,
        enc: &EncapsulatedSecret,
        info: &[u8],
        aad: &[u8],
        ciphertext: &[u8],
        secret_key: &HpkePrivateKey,
    ) -> Result<Vec<u8>, Error> {
        let enc_bytes =
            <MyKem as hpke::Kem>::EncappedKey::from_bytes(&enc.0).map_err(hpke_err)?;
        let sk = <MyKem as hpke::Kem>::PrivateKey::from_bytes(secret_key.secret_bytes())
            .map_err(hpke_err)?;

        hpke::single_shot_open::<MyAead, MyKdf, MyKem>(
            &hpke::OpModeR::Base,
            &sk,
            &enc_bytes,
            info,
            ciphertext,
            aad,
        )
        .map_err(hpke_err)
    }

    // ── Stateful opener ───────────────────────────────────────────────────────

    fn setup_opener(
        &self,
        enc: &EncapsulatedSecret,
        info: &[u8],
        secret_key: &HpkePrivateKey,
    ) -> Result<Box<dyn HpkeOpener + 'static>, Error> {
        let enc_bytes =
            <MyKem as hpke::Kem>::EncappedKey::from_bytes(&enc.0).map_err(hpke_err)?;
        let sk = <MyKem as hpke::Kem>::PrivateKey::from_bytes(secret_key.secret_bytes())
            .map_err(hpke_err)?;

        let receiver_ctx =
            hpke::setup_receiver::<MyAead, MyKdf, MyKem>(&hpke::OpModeR::Base, &sk, &enc_bytes, info)
                .map_err(hpke_err)?;

        Ok(Box::new(WasmHpkeOpener { ctx: receiver_ctx }))
    }

    // ── Suite descriptor ──────────────────────────────────────────────────────

    fn suite(&self) -> HpkeSuite {
        HpkeSuite {
            kem: HpkeKem::DHKEM_P256_HKDF_SHA256,
            sym: HpkeSymmetricCipherSuite {
                kdf_id: HpkeKdf::HKDF_SHA256,
                aead_id: HpkeAead::AES_128_GCM,
            },
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sealer (sender context — stateful multi-shot encryption)
// ─────────────────────────────────────────────────────────────────────────────

struct WasmHpkeSealer {
    ctx: AeadCtxS<MyAead, MyKdf, MyKem>,
}

// hpke::AeadCtxS is not Debug by default — we provide a manual impl.
impl fmt::Debug for WasmHpkeSealer {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("WasmHpkeSealer").finish_non_exhaustive()
    }
}

// SAFETY: hpke types contain no raw pointers and are logically thread-safe.
// The WasmHpkeSealer is only used on a single thread in WASM (single-threaded executor).
unsafe impl Send for WasmHpkeSealer {}
unsafe impl Sync for WasmHpkeSealer {}

impl HpkeSealer for WasmHpkeSealer {
    fn seal(&mut self, aad: &[u8], plaintext: &[u8]) -> Result<Vec<u8>, Error> {
        self.ctx
            .seal(plaintext, aad)
            .map_err(hpke_err)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Opener (receiver context — stateful multi-shot decryption)
// ─────────────────────────────────────────────────────────────────────────────

struct WasmHpkeOpener {
    ctx: AeadCtxR<MyAead, MyKdf, MyKem>,
}

impl fmt::Debug for WasmHpkeOpener {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("WasmHpkeOpener").finish_non_exhaustive()
    }
}

unsafe impl Send for WasmHpkeOpener {}
unsafe impl Sync for WasmHpkeOpener {}

impl HpkeOpener for WasmHpkeOpener {
    fn open(&mut self, aad: &[u8], ciphertext: &[u8]) -> Result<Vec<u8>, Error> {
        self.ctx
            .open(ciphertext, aad)
            .map_err(hpke_err)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// WASM-compatible RNG adapter
// ─────────────────────────────────────────────────────────────────────────────

/// Thin wrapper that forwards RNG calls to `getrandom` (WASM-compatible).
struct WasmRng;

impl rand_core::RngCore for WasmRng {
    fn next_u32(&mut self) -> u32 {
        let mut bytes = [0u8; 4];
        self.fill_bytes(&mut bytes);
        u32::from_le_bytes(bytes)
    }

    fn next_u64(&mut self) -> u64 {
        let mut bytes = [0u8; 8];
        self.fill_bytes(&mut bytes);
        u64::from_le_bytes(bytes)
    }

    fn fill_bytes(&mut self, dest: &mut [u8]) {
        getrandom::fill(dest).expect("getrandom failed");
    }

    fn try_fill_bytes(&mut self, dest: &mut [u8]) -> Result<(), rand_core::Error> {
        getrandom::fill(dest)
            .map_err(|_| core::num::NonZeroU32::new(1).unwrap().into())
    }
}

impl rand_core::CryptoRng for WasmRng {}

// ─────────────────────────────────────────────────────────────────────────────
// Error conversion helper
// ─────────────────────────────────────────────────────────────────────────────

fn hpke_err<E: fmt::Display>(e: E) -> Error {
    Error::General(format!("HPKE error: {e}"))
}
