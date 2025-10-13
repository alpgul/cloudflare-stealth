//! # TLS Module
//!
//! This module handles TLS connection establishment with ALPN (Application-Layer Protocol Negotiation)
//! support for automatic HTTP protocol selection between HTTP/1.1 and HTTP/2.

use rustls::ClientConfig;
use tokio_rustls::{TlsConnector};
use std::sync::Arc;
use worker::{console_log, Socket};
use crate::tls_verifier::DangerousNoVerifierServer;
use crate::client::HttpProtocol;

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
/// This implementation uses a custom certificate verifier that accepts all certificates.
/// This is suitable for proxy scenarios but should be used with caution in production.
pub async fn create_tls_connection_with_alpn(
    host: &str, 
    socket: Socket, 
    protocol: &HttpProtocol
) -> Result<(tokio_rustls::client::TlsStream<Socket>, Option<String>), Box<dyn std::error::Error>> {
    console_log!("🔒 Starting TLS handshake...");
    
    // Configure Rustls with custom certificate verifier (no verification)
    let mut config = ClientConfig::builder()
        .dangerous()
        .with_custom_certificate_verifier(Arc::new(DangerousNoVerifierServer))
        .with_no_client_auth();
    
    // Add ALPN protocols based on protocol preference
    match protocol {
        HttpProtocol::Http2 => {
            config.alpn_protocols = vec![b"h2".to_vec(), b"http/1.1".to_vec()];
            console_log!("🔧 ALPN: HTTP/2 preferred (h2, http/1.1)");
        },
        HttpProtocol::Http1 => {
            config.alpn_protocols = vec![b"http/1.1".to_vec()];
            console_log!("🔧 ALPN: HTTP/1.1 preferred (http/1.1)");
        },
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
    let negotiated_protocol = tls_stream.get_ref().1.alpn_protocol()
        .map(|protocol| String::from_utf8_lossy(protocol).to_string());
    
    console_log!("🤝 ALPN negotiated protocol: {:?}", negotiated_protocol);
    
    Ok((tls_stream, negotiated_protocol))
}
