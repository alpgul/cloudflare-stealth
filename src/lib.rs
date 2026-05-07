//! # Cloudflare Proxy Library
//!
//! This library provides a high-performance HTTP proxy implementation for Cloudflare Workers.
//! It supports both HTTP/1.1 and HTTP/2 protocols with automatic protocol negotiation via ALPN.
//!
//! ## Features
//!
//! - **Protocol Support**: HTTP/1.1 and HTTP/2 with automatic negotiation
//! - **TLS Support**: Secure connections with custom certificate verification
//! - **Streaming**: Full request/response streaming support
//! - **WASM Compatible**: Designed for Cloudflare Workers environment
//! - **Post-Quantum Security**: ML-KEM768 key exchange for quantum-resistant connections
//!
//! ## Usage
//!
//! ```rust
//! use cf_proxy::fetch2;
//!
//! // The fetch2 function is exposed as a WASM bindgen function
//! // and can be called from JavaScript/TypeScript
//! */

use wasm_bindgen::prelude::wasm_bindgen;
use worker::*;
mod client;
mod crypto_provider;
mod hpke_provider;
mod http1;
mod http2;
mod socket;
mod tls;
mod utils;

use client::{make_request, HttpProtocol};

/// Initialize crypto providers for WASM32 target
///
/// This function installs both the ring provider (for standard algorithms)
/// and the ML-KEM provider (for post-quantum key exchange).
#[cfg(target_arch = "wasm32")]
fn init_crypto_providers() {
    // Install ML-KEM provider (for post-quantum key exchange)
    // This also installs ring provider internally
    crate::crypto_provider::install()
        .expect("Failed to install ML-KEM crypto provider");
}

/// Main proxy function exposed to JavaScript/TypeScript via WASM bindgen.
///
/// This function acts as a high-performance HTTP proxy that:
/// - Parses incoming requests from Cloudflare Workers
/// - Establishes secure connections to target servers
/// - Supports both HTTP/1.1 and HTTP/2 protocols
/// - Returns streaming responses back to the client
///
/// # Arguments
///
/// * `request` - The incoming web request from Cloudflare Workers
///
/// # Returns
///
/// * `Response` - The proxied response from the target server
///
/// # Errors
///
/// Returns appropriate HTTP error responses for various failure scenarios:
/// - 400 Bad Request for invalid URLs or malformed requests
/// - 500 Internal Server Error for proxy failures
///
#[wasm_bindgen]
pub fn greet() {
    console_error_panic_hook::set_once();
    ::worker::console_log!("Hello, cf-proxy!");
}

#[wasm_bindgen]
pub async fn fetch2(
    request: ::worker::worker_sys::web_sys::Request,
) -> ::worker::worker_sys::web_sys::Response {
    console_error_panic_hook::set_once();

    // Initialize crypto providers (only once, on first call)
    #[cfg(target_arch = "wasm32")]
    {
        use std::sync::Once;
        static INIT: Once = Once::new();
        INIT.call_once(|| {
            init_crypto_providers();
        });
    }

    // Convert web_sys::Request to worker::Request
    let worker_request: ::worker::Request = match ::worker::FromRequest::from_raw(request) {
        Ok(req) => req,
        Err(_) => {
            ::worker::console_error!("Error converting request");
            let error_response = Response::error("Invalid request", 400).unwrap();
            match ::worker::IntoResponse::into_raw(error_response) {
                Ok(res) => return res,
                Err(_) => {
                    return Response::error("INTERNAL SERVER ERROR", 500)
                        .unwrap()
                        .into()
                }
            }
        }
    };

    // Extract information from the request
    let url = match worker_request.url() {
        Ok(url) => url.to_string(),
        Err(_) => {
            let error_response = Response::error("Invalid URL in request", 400).unwrap();
            match ::worker::IntoResponse::into_raw(error_response) {
                Ok(res) => return res,
                Err(_) => {
                    return Response::error("INTERNAL SERVER ERROR", 500)
                        .unwrap()
                        .into()
                }
            }
        }
    };
    let method = worker_request.method().to_string();
    let headers = worker_request.headers();

    // Parse the target URL
    let target_url_obj = match url::Url::parse(&url) {
        Ok(url_obj) => url_obj,
        Err(_) => {
            ::worker::console_error!("Error parsing URL");
            let error_response = Response::error("Invalid URL", 400).unwrap();
            match ::worker::IntoResponse::into_raw(error_response) {
                Ok(res) => return res,
                Err(_) => {
                    return Response::error("INTERNAL SERVER ERROR", 500)
                        .unwrap()
                        .into()
                }
            }
        }
    };

    // Extract host, port, and path from the URL
    let host = match target_url_obj.host_str() {
        Some(host) => host.to_string(),
        None => {
            ::worker::console_error!("Error extracting host");
            let error_response = Response::error("Invalid host", 400).unwrap();
            match ::worker::IntoResponse::into_raw(error_response) {
                Ok(res) => return res,
                Err(_) => {
                    return Response::error("INTERNAL SERVER ERROR", 500)
                        .unwrap()
                        .into()
                }
            }
        }
    };

    let port = target_url_obj.port().unwrap_or_else(|| {
        if target_url_obj.scheme() == "https" {
            443
        } else {
            80
        }
    });

    let path = target_url_obj.path();
    let path = if path.is_empty() { "/" } else { path };

    // Determine protocol preference
    let protocol = if target_url_obj.scheme() == "https" {
        HttpProtocol::Auto
    } else {
        HttpProtocol::Http1
    };

    // Convert worker::Headers to Vec<(String, String)>
    let mut headers_vec = Vec::new();
    for name in headers.keys() {
        if let Ok(Some(value)) = headers.get(&name) {
            headers_vec.push((name.to_string(), value.to_string()));
        }
    }

    // Make the request
    match make_request(host, port, path, &method, headers_vec, None, protocol).await {
        Ok(response) => {
            // Convert worker::Response to web_sys::Response
            match ::worker::IntoResponse::into_raw(response) {
                Ok(res) => res,
                Err(_) => {
                    ::worker::console_error!("Error converting response");
                    Response::error("INTERNAL SERVER ERROR", 500).unwrap().into()
                }
            }
        }
        Err(e) => {
            ::worker::console_error!("Proxy error: {:?}", e);
            Response::error("Proxy error", 500).unwrap().into()
        }
    }
}
