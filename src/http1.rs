//! # HTTP/1.1 Module
//!
//! This module provides HTTP/1.1 client functionality using the Hyper HTTP library.
//! It handles HTTP/1.1 connection establishment, request sending, and response streaming.

use crate::utils::convert_hyper_body_to_worker_response;
use hyper_util::rt::TokioIo;
use worker::{console_log, Body as WorkerBody, ByteStream, Headers, Response};

/// Establishes HTTP/1.1 connection using Hyper
///
/// This function performs the HTTP/1.1 handshake and returns a sender
/// that can be used to send requests over the connection.
async fn establish_connection<T>(
    stream: T,
) -> Result<hyper::client::conn::http1::SendRequest<WorkerBody>, Box<dyn std::error::Error>>
where
    T: tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin + Send + 'static,
{
    console_log!("🔗 Establishing HTTP/1.1 connection...");

    // Wrap stream with TokioIo
    let io = TokioIo::new(stream);
    let (sender, conn) = hyper::client::conn::http1::handshake(io).await?;
    console_log!("✅ Hyper HTTP/1.1 connection established");

    // Spawn connection in WASM-compatible way
    wasm_bindgen_futures::spawn_local(async move {
        match conn.await {
            Ok(_) => console_log!("✅ Hyper HTTP/1.1 connection completed"),
            Err(e) => console_log!("⚠️ Hyper HTTP/1.1 connection error: {}", e),
        }
    });

    Ok(sender)
}

/// Creates and sends HTTP/1.1 request using Hyper
///
/// This function constructs an HTTP/1.1 request with the provided
/// headers and body, then sends it over the established connection.
///
/// # Arguments
///
/// * `sender` - HTTP/1.1 connection sender
/// * `host` - Target server hostname
/// * `path` - Request path
/// * `method` - HTTP method
/// * `headers` - HTTP headers
/// * `body` - Optional request body
/// * `scheme` - URL scheme
///
/// # Returns
///
/// * `Result<hyper::Response<hyper::body::Incoming>, Box<dyn std::error::Error>>` - HTTP response
async fn send_request(
    mut sender: hyper::client::conn::http1::SendRequest<WorkerBody>,
    host: &str,
    path: &str,
    method: &str,
    headers: &[(String, String)],
    body: Option<ByteStream>,
    scheme: &str,
) -> Result<hyper::Response<hyper::body::Incoming>, Box<dyn std::error::Error>> {
    console_log!("📤 Creating HTTP/1.1 request: {} {}{}", method, host, path);

    // Create request
    let uri = format!("{}://{}{}", scheme, host, path);
    let mut req_builder = hyper::Request::builder().method(method).uri(uri);

    // Add headers
    for (key, value) in headers {
        if let (Ok(header_name), Ok(header_value)) = (
            key.parse::<http::HeaderName>(),
            value.parse::<http::HeaderValue>(),
        ) {
            req_builder = req_builder.header(header_name, header_value);
        }
    }
    // Create body - streaming with ByteStream
    let req = match body {
        Some(body_stream) => {
            console_log!("📦 Request body: ByteStream (streaming)");
            // Convert ByteStream to worker::Body
            let worker_body = WorkerBody::from_stream(body_stream)?;
            req_builder.body(worker_body)?
        }
        None => {
            console_log!("📦 Request body: none (no body)");
            let empty_body = WorkerBody::empty();
            req_builder.body(empty_body)?
        }
    };

    console_log!("📤 Sending Hyper HTTP/1.1 request...");

    // Send request
    let res = sender.send_request(req).await?;
    console_log!(
        "📥 Hyper HTTP/1.1 response received: {} {:?}",
        res.status(),
        res.version()
    );

    Ok(res)
}

/// Converts HTTP/1.1 response to Cloudflare Worker Response
///
/// This function takes a Hyper HTTP/1.1 response and converts it to a format
/// compatible with Cloudflare Workers, including proper headers and streaming body.
///
/// # Arguments
///
/// * `hyper_response` - Hyper HTTP/1.1 response
///
/// # Returns
///
/// * `Result<Response, Box<dyn std::error::Error>>` - Worker Response
async fn convert_response(
    hyper_response: hyper::Response<hyper::body::Incoming>,
) -> Result<Response, Box<dyn std::error::Error>> {
    console_log!("🔄 Converting Hyper response to Worker Response...");

    // Split response into parts
    let (parts, body) = hyper_response.into_parts();

    // Convert headers
    let worker_headers = Headers::new();
    for (key, value) in parts.headers.iter() {
        if let Ok(value_str) = value.to_str() {
            worker_headers.set(key.as_str(), value_str)?;
        }
    }

    // Add metadata headers
    worker_headers.set("X-HTTP-Version", "HTTP/1.1")?;
    worker_headers.set("X-Negotiated-Protocol", "http/1.1")?;
    worker_headers.set("X-Original-Status", &format!("{}", parts.status))?;

    // Convert body directly to Response
    let mut response = convert_hyper_body_to_worker_response(body).await?;

    console_log!("🔍 Starting HTTP/1.1 streaming...");

    // Set status and headers
    response = response
        .with_encode_body(worker::EncodeBody::Manual)
        .with_status(parts.status.as_u16())
        .with_headers(worker_headers);

    Ok(response)
}

/// Creates an HTTP/1.1 response using Hyper client
///
/// This function establishes an HTTP/1.1 connection to the target server and sends
/// the request, returning a streaming response compatible with Cloudflare Workers.
///
/// # Arguments
///
/// * `host` - Target server hostname
/// * `path` - Request path including query parameters
/// * `method` - HTTP method (GET, POST, etc.)
/// * `headers` - HTTP headers as key-value pairs
/// * `body` - Optional request body stream
/// * `stream` - TLS or plain socket stream
/// * `scheme` - URL scheme (http/https)
///
/// # Returns
///
/// * `Result<Response, Box<dyn std::error::Error>>` - The HTTP/1.1 response
pub async fn make_http1_response<T>(
    host: &str,
    path: &str,
    method: &str,
    headers: &[(String, String)],
    body: Option<ByteStream>,
    stream: T,
    scheme: &str,
) -> Result<Response, Box<dyn std::error::Error>>
where
    T: tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin + Send + 'static,
{
    console_log!("🚀 Starting HTTP/1.1 Hyper client...");

    // 1. Establish connection
    let sender = establish_connection(stream).await?;

    // 2. Create and send request
    let hyper_response = send_request(sender, host, path, method, headers, body, scheme).await?;

    // 3. Convert response to Worker Response
    let worker_response = convert_response(hyper_response).await?;

    console_log!("✅ HTTP/1.1 streaming response created successfully");
    Ok(worker_response)
}
