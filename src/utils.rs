//! # Utilities Module
//!
//! This module provides utility functions for converting between different
//! HTTP body types and response formats.

use futures::TryStreamExt;
use http_body_util::BodyExt;
use worker::*;

/// Converts Hyper Body to Worker Response with true streaming support
pub async fn convert_hyper_body_to_worker_response(
    body: hyper::body::Incoming,
) -> Result<Response> {
    console_log!("🔄 Converting Hyper body to Worker Response (streaming)...");

    // Convert Hyper body to BodyDataStream
    let data_stream = body.into_data_stream();

    // Convert BodyDataStream to TryStream (Bytes -> Vec<u8>) with explicit error mapping
    let try_stream = data_stream
        .map_ok(|bytes| bytes.to_vec())
        .map_err(|e| format!("Hyper body stream error: {}", e));

    console_log!("📦 BodyDataStream converted to TryStream");

    // Create streaming Response using Response::from_stream()
    let response = Response::from_stream(try_stream)
        .map_err(|e| format!("Worker response creation from stream failed: {}", e))?;

    console_log!("✅ Hyper body Worker Response created successfully (streaming)");

    Ok(response)
}
