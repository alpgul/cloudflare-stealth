//! # HTTP Client Module
//!
//! This module provides the main HTTP client functionality for the proxy.
//! It handles protocol negotiation, connection establishment, and request routing.

use worker::{console_log, ByteStream, Response};
use crate::socket::create_socket;
use crate::tls::create_tls_connection_with_alpn;
use crate::http2::make_http2_response;
use crate::http1::make_http1_response;

/// HTTP protocol type enumeration
/// 
/// Defines the supported HTTP protocols and negotiation strategies:
/// - `Http2`: Force HTTP/2 protocol
/// - `Http1`: Force HTTP/1.1 protocol  
/// - `Auto`: Automatic protocol selection via ALPN negotiation
#[derive(Debug, Clone)]
pub enum HttpProtocol {
    Http2,
    Http1,
    Auto, // Automatic selection via ALPN
}

/// Main HTTP client function with automatic protocol negotiation
/// 
/// This function orchestrates the entire HTTP request process:
/// 1. Creates a TCP socket connection to the target server
/// 2. Establishes TLS connection with ALPN negotiation (for HTTPS)
/// 3. Determines the appropriate HTTP protocol based on negotiation
/// 4. Routes the request to the appropriate protocol handler
/// 5. Returns the streaming response
/// 
/// # Arguments
/// 
/// * `host` - Target server hostname
/// * `port` - Target server port (443 for HTTPS, 80 for HTTP)
/// * `path` - Request path including query parameters
/// * `method` - HTTP method (GET, POST, etc.)
/// * `headers` - HTTP headers as key-value pairs
/// * `body` - Optional request body stream
/// * `protocol` - Protocol preference (Auto, Http1, Http2)
/// 
/// # Returns
/// 
/// * `Result<Response, Box<dyn std::error::Error>>` - The HTTP response or error
/// 
/// # Protocol Selection
/// 
/// The function automatically selects the best protocol:
/// - For HTTPS: Uses ALPN to negotiate between HTTP/2 and HTTP/1.1
/// - For HTTP: Falls back to HTTP/1.1
/// - Respects the protocol preference when possible
pub async fn make_request(
    host: String, 
    port: u16, 
    path: &str,
    method: &str,
    headers: Vec<(String, String)>,
    body: Option<ByteStream>,
    protocol: HttpProtocol
) -> Result<Response, Box<dyn std::error::Error>> {
    console_log!("🚀 HTTP request starting: {}:{} (Protocol: {:?})", host, port, protocol);
    
    // Determine scheme based on port
    let scheme = match port {
        443 => "https",
        80 => "http",
        _ => "https", // Default to https
    };
    console_log!("🔗 Scheme: {} (Port: {})", scheme, port);
    
    // 1. Create socket connection
    let socket = create_socket(&host, port).await?;
    
    // 2. Determine connection type based on scheme
    match scheme {
        "https" => {
            console_log!("🔒 HTTPS connection - Starting TLS handshake...");
            // Establish TLS connection with ALPN
            let (tls_stream, negotiated_protocol) = create_tls_connection_with_alpn(&host, socket, &protocol).await?;
            
            console_log!("🔒 TLS handshake completed, negotiated protocol: {:?}", negotiated_protocol);
            
            // Select HTTP protocol based on negotiated protocol
            match negotiated_protocol {
                Some(protocol) => {
                    console_log!("🎯 Negotiated protocol: {:?}", protocol);
                    
                    match protocol.as_str() {
                        "h2" => {
                            console_log!("📡 HTTP/2 protocol selected");
                            make_http2_response(&host, path, method, &headers, body, tls_stream, scheme).await
                        },
                        "http/1.1" => {
                            console_log!("📡 HTTP/1.1 protocol selected");
                            make_http1_response(&host, path, method, &headers, body, tls_stream, scheme).await
                        },
                        _ => {
                            console_log!("⚠️ Unknown protocol: {:?}, falling back to HTTP/1.1", protocol);
                            make_http1_response(&host, path, method, &headers, body, tls_stream, scheme).await
                        }
                    }
                },
                None => {
                    console_log!("⚠️ Protocol negotiation failed, falling back to HTTP/1.1");
                    make_http1_response(&host, path, method, &headers, body, tls_stream, scheme).await
                }
            }
        },
        "http" => {
            console_log!("🌐 HTTP connection - No TLS handshake, using HTTP/1.1 directly");
            // For HTTP, use plain socket directly
            make_http1_response(&host, path, method, &headers, body, socket, scheme).await
        },
        _ => {
            console_log!("❌ Unsupported scheme: {}", scheme);
            Err("Unsupported scheme".into())
        }
    }
}