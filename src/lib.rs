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
//!
//! ## Usage
//!
//! ```rust
//! use cf_proxy::fetch2;
//! 
//! // The fetch2 function is exposed as a WASM bindgen function
//! // and can be called from JavaScript/TypeScript
//! ```

use wasm_bindgen::prelude::wasm_bindgen;
use worker::*;
use console_error_panic_hook;
use url;

mod client;
mod socket;
mod tls;
mod http2;
mod http1;
mod tls_verifier;
mod utils;

use client::{make_request, HttpProtocol};
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
#[wasm_bindgen]
pub async fn fetch2(request: ::worker::worker_sys::web_sys::Request) -> ::worker::worker_sys::web_sys::Response {
    console_error_panic_hook::set_once();
    // Convert web_sys::Request to worker::Request
    let mut worker_request: ::worker::Request = match ::worker::FromRequest::from_raw(request) {
        Ok(req) => req,
        Err(_) => {
            ::worker::console_error!("Error converting request");
            let error_response = Response::error("Invalid request", 400).unwrap();
            match ::worker::IntoResponse::into_raw(error_response) {
                Ok(res) => return res,
                Err(_) => return Response::error("INTERNAL SERVER ERROR", 500).unwrap().into(),
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
                Err(_) => return Response::error("INTERNAL SERVER ERROR", 500).unwrap().into(),
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
                Err(_) => return Response::error("INTERNAL SERVER ERROR", 500).unwrap().into(),
            }
        }
    };
    
    // Extract host, port, and path from the URL
    let host = match target_url_obj.host_str() {
        Some(host) => host.to_string(),
        None => {
            ::worker::console_error!("Host not found in URL");
            let error_response = Response::error("Host not found", 400).unwrap();
            match ::worker::IntoResponse::into_raw(error_response) {
                Ok(res) => return res,
                Err(_) => return Response::error("INTERNAL SERVER ERROR", 500).unwrap().into(),
            }
        }
    };
    
    // Port selection: 443 for HTTPS, 80 for HTTP
    let port = match target_url_obj.scheme() {
        "https" => 443,
        "http" => 80,
        _ => {
            ::worker::console_error!("Unsupported scheme");
            let error_response = Response::error("Unsupported scheme", 400).unwrap();
            match ::worker::IntoResponse::into_raw(error_response) {
                Ok(res) => return res,
                Err(_) => return Response::error("INTERNAL SERVER ERROR", 500).unwrap().into(),
            }
        }
    };
    
    let path = if target_url_obj.path().is_empty() {
        "/".to_string()
    } else {
        format!("{}{}", target_url_obj.path(), target_url_obj.query().map(|q| format!("?{}", q)).unwrap_or_default())
    };
    
    // Convert headers to Vec<(String, String)> format
    let mut headers_vec = Vec::new();
    for (key, value) in headers.entries() {
        headers_vec.push((key, value));
    }

    // Extract the request body
    let body_stream = match worker_request.stream() {
        Ok(stream) => Some(stream),
        Err(_) => None,
    };

    // Use automatic protocol selection
    let protocol = HttpProtocol::Auto;
    
    match make_request(host, port, &path, &method, headers_vec, body_stream, protocol).await {
        Ok(response) => {
            match ::worker::IntoResponse::into_raw(response) {
                Ok(res) => res,
                Err(_) => Response::error("INTERNAL SERVER ERROR", 500).unwrap().into(),
            }
        },
        Err(_) => {
            ::worker::console_error!("Proxy request failed");
            let error_response = Response::error("Proxy request failed", 500).unwrap();
            match ::worker::IntoResponse::into_raw(error_response) {
                Ok(res) => res,
                Err(_) => Response::error("INTERNAL SERVER ERROR", 500).unwrap().into(),
            }
        }
    }
}

