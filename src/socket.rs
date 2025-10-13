//! # Socket Module
//!
//! This module provides TCP socket connection functionality for Cloudflare Workers.
//! It handles the creation and management of TCP connections to target servers.

use worker::console_log;

/// Creates a TCP socket connection using Cloudflare Worker Socket
/// 
/// This function establishes a TCP connection to the target server using
/// Cloudflare Workers' socket API. It configures the socket for optimal
/// proxy performance.
/// 
/// # Arguments
/// 
/// * `host` - Target server hostname
/// * `port` - Target server port
/// 
/// # Returns
/// 
/// * `Result<worker::Socket, Box<dyn std::error::Error>>` - TCP socket connection
/// 
/// # Configuration
/// 
/// The socket is configured with `allow_half_open(true)` to handle
/// broken pipe scenarios that can occur in proxy environments.
pub async fn create_socket(host: &str, port: u16) -> Result<worker::Socket, Box<dyn std::error::Error>> {
    console_log!("🔌 Creating TCP socket: {}:{}", host, port);
    
    // Create TCP connection using Cloudflare Worker Socket
    let socket = worker::Socket::builder()
        .allow_half_open(true) // Solve broken pipe issues
        .connect(host, port)?;

    // Wait for socket to open
    socket.opened().await?;
    console_log!("✅ TCP socket created successfully");
    Ok(socket)
}
