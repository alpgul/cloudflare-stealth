//! # Utilities Module
//!
//! This module provides utility functions for converting between different
//! HTTP body types and response formats.

use worker::*;
use http_body_util::BodyExt;
use futures::TryStreamExt;

/// Converts Hyper Body to Worker Response with true streaming support
/// 
/// This function takes a Hyper HTTP body and converts it to a Cloudflare Worker Response
/// with proper streaming support. It handles the conversion from Hyper's body format
/// to Worker's streaming format.
/// 
/// # Arguments
/// 
/// * `body` - Hyper HTTP body (Incoming type)
/// 
/// # Returns
/// 
/// * `Result<Response>` - Worker Response with streaming body
/// 
/// # Streaming Process
/// 
/// 1. Converts Hyper body to BodyDataStream
/// 2. Maps bytes to Vec<u8> for Worker compatibility
/// 3. Creates streaming Response using Response::from_stream
pub async fn convert_hyper_body_to_worker_response(
    body: hyper::body::Incoming
) -> Result<Response> {
    console_log!("🔄 Converting Hyper body to Worker Response (streaming)...");
    
    // Convert Hyper body to BodyDataStream
    let data_stream = body.into_data_stream();
    
    // Convert BodyDataStream to TryStream (Bytes -> Vec<u8>)
    let try_stream = data_stream
        .map_ok(|bytes| bytes.to_vec())
        .map_err(|e| format!("Stream error: {}", e));
    
    console_log!("📦 BodyDataStream converted to TryStream");
    
    // Create streaming Response using Response::from_stream()
    let response = Response::from_stream(try_stream)
        .map_err(|e| format!("Response creation failed: {}", e))?;
    
    console_log!("✅ Hyper body Worker Response created successfully (streaming)");
    
    Ok(response)
}