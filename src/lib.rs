//! # Cloudflare Proxy Library
//!
//! This library provides a high-performance HTTP proxy implementation for Cloudflare Workers.
//! It supports both HTTP/1.1 and HTTP/2 protocols with automatic protocol negotiation via ALPN.

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
#[cfg(target_arch = "wasm32")]
fn init_crypto_providers() {
    crate::crypto_provider::install()
        .expect("Failed to install ML-KEM crypto provider");
}

/// Helper function to convert worker::Response to web_sys::Response
fn into_web_sys_response(response: Response) -> ::worker::worker_sys::web_sys::Response {
    match ::worker::IntoResponse::into_raw(response) {
        Ok(res) => res,
        Err(_) => {
            ::worker::console_error!("Critical error converting response");
            Response::error("INTERNAL SERVER ERROR", 500)
                .unwrap()
                .into()
        }
    }
}

/// Helper function to create an error web_sys::Response
fn error_web_sys_response(message: &str, status: u16) -> ::worker::worker_sys::web_sys::Response {
    let error_res = Response::error(message, status).unwrap_or_else(|_| {
        Response::error("INTERNAL SERVER ERROR", 500).unwrap()
    });
    into_web_sys_response(error_res)
}

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

    #[cfg(target_arch = "wasm32")]
    {
        use std::sync::Once;
        static INIT: Once = Once::new();
        INIT.call_once(|| {
            init_crypto_providers();
        });
    }

    match fetch2_internal(request).await {
        Ok(response) => into_web_sys_response(response),
        Err(e) => {
            ::worker::console_error!("Proxy error: {}", e);
            error_web_sys_response(&format!("Proxy error: {}", e), 500)
        }
    }
}

async fn fetch2_internal(
    request: ::worker::worker_sys::web_sys::Request,
) -> Result<Response, Box<dyn std::error::Error>> {
    let worker_request: ::worker::Request = ::worker::FromRequest::from_raw(request)
        .map_err(|_| "Error converting request")?;

    let url_str = worker_request.url().map_err(|_| "Invalid URL in request")?.to_string();
    let method = worker_request.method().to_string();
    let headers = worker_request.headers();

    let target_url = url::Url::parse(&url_str).map_err(|_| "Error parsing URL")?;

    let host = target_url.host_str().ok_or("Error extracting host")?.to_string();
    let port = target_url.port().unwrap_or_else(|| {
        if target_url.scheme() == "https" { 443 } else { 80 }
    });

    let path = target_url.path();
    let path = if path.is_empty() { "/" } else { path };
    let query = target_url.query();
    let path_with_query = match query {
        Some(q) => format!("{}?{}", path, q),
        None => path.to_string(),
    };

    let protocol = if target_url.scheme() == "https" {
        HttpProtocol::Auto
    } else {
        HttpProtocol::Http1
    };

    let mut headers_vec = Vec::new();
    for name in headers.keys() {
        if let Ok(Some(value)) = headers.get(&name) {
            headers_vec.push((name.to_string(), value.to_string()));
        }
    }

    make_request(host, port, &path_with_query, &method, headers_vec, None, protocol).await
}
