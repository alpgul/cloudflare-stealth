//! # TLS Module
//!
//! This module handles TLS connection establishment with ALPN (Application-Layer Protocol Negotiation)
//! support for automatic HTTP protocol selection between HTTP/1.1 and HTTP/2.

use crate::client::HttpProtocol;
use crate::hpke_provider::GREASE_HPKE_SUITE;
use rustls::ClientConfig;
use std::sync::{Arc, OnceLock};
use tokio_rustls::TlsConnector;
use worker::{console_log, Socket};

// Import ChromeFingerprint from rustls
use rustls::client::fingerprint::ChromeFingerprint;
use rustls::client::{EchGreaseConfig, EchMode};
use rustls::crypto::CryptoProvider;
use rustls_platform_verifier::Verifier;

/// Establishes a secure TLS connection with ALPN protocol negotiation
///
/// This function creates a TLS connection to the target server and negotiates
/// the best HTTP protocol (HTTP/1.1 or HTTP/2) using ALPN (Application-Layer Protocol Negotiation).
///
/// # Arguments
///
/// * `host` - Target server hostname for SNI (Server Name Indication)
/// * `socket` - Raw TCP socket connection
/// * `protocol` - Protocol preference for ALPN negotiation
///
/// # Returns
///
/// * `Result<(TlsStream<Socket>, Option<String>), Box<dyn std::error::Error>>` -
///   Tuple containing the TLS stream and the negotiated protocol name
///
/// # ALPN Protocol Selection
///
/// The function configures ALPN based on the protocol preference:
/// - `HttpProtocol::Http2`: Prefers HTTP/2, falls back to HTTP/1.1
/// - `HttpProtocol::Http1`: Only negotiates HTTP/1.1
/// - `HttpProtocol::Auto`: Negotiates both protocols, prefers HTTP/2
///
/// # Security Note
///
/// This implementation uses a custom certificate verifier that combines the platform's
/// native root store with embedded WebPKI root certificates for maximum compatibility.
///
/// # ECH GREASE
///
/// Uses our custom WASM-compatible HPKE provider (DHKEM-P256 + HKDF-SHA256 + AES-128-GCM)
/// since `aws_lc_rs` does not support `wasm32-unknown-unknown`.
static VANILLA_VERIFIER: OnceLock<Arc<Verifier>> = OnceLock::new();

fn get_vanilla_verifier(provider: Arc<CryptoProvider>) -> Arc<Verifier> {
    VANILLA_VERIFIER
        .get_or_init(|| {
            Arc::new(
                Verifier::new_with_extra_roots(
                    webpki_root_certs::TLS_SERVER_ROOT_CERTS.iter().cloned(),
                    provider,
                )
                .expect("Failed to create certificate verifier with embedded CA roots"),
            )
        })
        .clone()
}

fn get_ech_mode() -> EchMode {
    let (public_key, _) = GREASE_HPKE_SUITE
        .generate_key_pair()
        .expect("HPKE key generation failed");
    EchGreaseConfig::new(GREASE_HPKE_SUITE, public_key).into()
}

pub async fn create_tls_connection_with_alpn(
    host: &str,
    socket: Socket,
    protocol: &HttpProtocol,
) -> Result<(tokio_rustls::client::TlsStream<Socket>, Option<String>), Box<dyn std::error::Error>> {
    console_log!("🔒 Starting TLS handshake...");

    let provider = rustls::crypto::CryptoProvider::get_default()
        .expect("CryptoProvider not installed")
        .clone();

    // Configure Rustls with custom certificate verifier (platform verifier + webpki roots)
    let mut config = ClientConfig::builder_with_provider(provider.clone())
        .with_ech(get_ech_mode())
        .unwrap()
        .dangerous()
        .with_custom_certificate_verifier(get_vanilla_verifier(provider))
        .with_no_client_auth();
    config.fingerprint = Some(Arc::new(ChromeFingerprint::INSTANCE));

    // Add ALPN protocols based on protocol preference
    match protocol {
        HttpProtocol::Http2 => {
            config.alpn_protocols = vec![b"h2".to_vec(), b"http/1.1".to_vec()];
            console_log!("🔧 ALPN: HTTP/2 preferred (h2, http/1.1)");
        }
        HttpProtocol::Http1 => {
            config.alpn_protocols = vec![b"http/1.1".to_vec()];
            console_log!("🔧 ALPN: HTTP/1.1 preferred (http/1.1)");
        }
        HttpProtocol::Auto => {
            config.alpn_protocols = vec![b"h2".to_vec(), b"http/1.1".to_vec()];
            console_log!("🔧 ALPN: Automatic selection (h2, http/1.1)");
        }
    }

    let connector = TlsConnector::from(Arc::new(config));

    // Perform TLS handshake
    let host_static = Box::leak(host.to_string().into_boxed_str());
    let server_name = rustls::pki_types::ServerName::try_from(host_static as &str).unwrap();
    let tls_stream = connector.connect(server_name, socket).await?;

    // TLS handshake successful!
    console_log!("✅ TLS handshake successful!");

    // Log TLS version information
    let version = tls_stream.get_ref().1.protocol_version();
    console_log!("🔒 TLS version used: {:?}", version);

    // Extract ALPN negotiated protocol
    let negotiated_protocol = tls_stream
        .get_ref()
        .1
        .alpn_protocol()
        .map(|protocol| String::from_utf8_lossy(protocol).to_string());

    console_log!("🤝 ALPN negotiated protocol: {:?}", negotiated_protocol);

    Ok((tls_stream, negotiated_protocol))
}
