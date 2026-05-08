//! # HTTP/1.1 Module
//!
//! This module provides HTTP/1.1 client functionality using the Hyper HTTP library.
//! It handles HTTP/1.1 connection establishment, request sending, and response streaming.

use crate::utils::convert_hyper_body_to_worker_response;
use hyper_util::rt::TokioIo;
use worker::{console_log, Body as WorkerBody, ByteStream, Headers, Response};

/// Establishes HTTP/1.1 connection using Hyper
async fn establish_connection<T>(
    stream: T,
) -> Result<hyper::client::conn::http1::SendRequest<WorkerBody>, Box<dyn std::error::Error>>
where
    T: tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin + Send + 'static,
{
    console_log!("🔗 Establishing HTTP/1.1 connection...");

    let io = TokioIo::new(stream);
    let (sender, conn) = hyper::client::conn::http1::handshake(io)
        .await
        .map_err(|e| format!("Hyper HTTP/1.1 handshake failed: {}", e))?;

    console_log!("✅ Hyper HTTP/1.1 connection established");

    wasm_bindgen_futures::spawn_local(async move {
        if let Err(e) = conn.await {
            console_log!("⚠️ Hyper HTTP/1.1 connection background task failed: {}", e);
        } else {
            console_log!("✅ Hyper HTTP/1.1 connection background task completed");
        }
    });

    Ok(sender)
}

/// Creates and sends HTTP/1.1 request using Hyper
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

    let uri = format!("{}://{}{}", scheme, host, path);
    let mut req_builder = hyper::Request::builder().method(method).uri(uri);

    for (key, value) in headers {
        if let (Ok(header_name), Ok(header_value)) = (
            key.parse::<http::HeaderName>(),
            value.parse::<http::HeaderValue>(),
        ) {
            req_builder = req_builder.header(header_name, header_value);
        }
    }

    let req = match body {
        Some(body_stream) => {
            let worker_body = WorkerBody::from_stream(body_stream)?;
            req_builder.body(worker_body)?
        }
        None => {
            let empty_body = WorkerBody::empty();
            req_builder.body(empty_body)?
        }
    };

    console_log!("📤 Sending Hyper HTTP/1.1 request...");

    let res = sender.send_request(req)
        .await
        .map_err(|e| format!("Failed to send HTTP/1.1 request: {}", e))?;

    console_log!(
        "📥 Hyper HTTP/1.1 response received: {} {:?}",
        res.status(),
        res.version()
    );

    Ok(res)
}

/// Converts HTTP/1.1 response to Cloudflare Worker Response
async fn convert_response(
    hyper_response: hyper::Response<hyper::body::Incoming>,
) -> Result<Response, Box<dyn std::error::Error>> {
    console_log!("🔄 Converting Hyper response to Worker Response...");

    let (parts, body) = hyper_response.into_parts();
    let worker_headers = Headers::new();
    for (key, value) in parts.headers.iter() {
        if let Ok(value_str) = value.to_str() {
            worker_headers.set(key.as_str(), value_str)?;
        }
    }

    worker_headers.set("X-HTTP-Version", "HTTP/1.1")?;
    worker_headers.set("X-Negotiated-Protocol", "http/1.1")?;
    worker_headers.set("X-Original-Status", &format!("{}", parts.status))?;

    let mut response = convert_hyper_body_to_worker_response(body).await?;

    console_log!("🔍 Starting HTTP/1.1 streaming...");

    response = response
        .with_encode_body(worker::EncodeBody::Manual)
        .with_status(parts.status.as_u16())
        .with_headers(worker_headers);

    Ok(response)
}

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

    let sender = establish_connection(stream).await?;
    let hyper_response = send_request(sender, host, path, method, headers, body, scheme).await?;
    let worker_response = convert_response(hyper_response).await?;

    console_log!("✅ HTTP/1.1 streaming response created successfully");
    Ok(worker_response)
}
