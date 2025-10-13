//! # TLS Certificate Verifier Module
//!
//! This module provides a custom TLS certificate verifier that accepts all certificates.
//! This implementation is specifically designed for proxy scenarios where certificate
//! validation is not required or desired.
//!
//! ## Overview
//!
//! The `DangerousNoVerifierServer` struct implements the `ServerCertVerifier` trait
//! from the Rustls library, providing a "dangerous" verifier that bypasses all
//! certificate validation checks. This is useful in scenarios where:
//!
//! - You're building a proxy server that needs to connect to various endpoints
//! - You're working in a controlled development environment
//! - You need to connect to servers with self-signed or invalid certificates
//! - You're implementing certificate pinning at a higher level
//!
//! ## Security Considerations
//!
//! ⚠️ **CRITICAL SECURITY WARNING** ⚠️
//!
//! This verifier completely bypasses certificate validation, which means:
//!
//! - **No certificate chain validation** - Invalid or expired certificates are accepted
//! - **No hostname verification** - Certificates for different domains are accepted
//! - **No signature verification** - Forged signatures are accepted
//! - **Man-in-the-middle vulnerability** - Attackers can intercept connections
//!
//! ## Usage Guidelines
//!
//! ### ✅ Safe Usage Scenarios
//!
//! - **Proxy servers** where certificate validation is handled upstream
//! - **Development environments** with self-signed certificates
//! - **Internal networks** with trusted infrastructure
//! - **Testing environments** where certificate issues are expected
//!
//! ### ❌ Unsafe Usage Scenarios
//!
//! - **Production applications** without additional security measures
//! - **Client applications** connecting to untrusted servers
//! - **Financial or sensitive data** transmission
//! - **Public-facing services** without proper certificate management
//!
//! ## Implementation Details
//!
//! This verifier implements all required methods of the `ServerCertVerifier` trait:
//!
//! - `verify_server_cert()` - Always returns success without validation
//! - `verify_tls12_signature()` - Always returns success without verification
//! - `verify_tls13_signature()` - Always returns success without verification
//! - `supported_verify_schemes()` - Returns comprehensive list of signature schemes
//!
//! ## Example Usage
//!
//! ```rust
//! use rustls::ClientConfig;
//! use cf_proxy::tls_verifier::DangerousNoVerifierServer;
//! use std::sync::Arc;
//!
//! // Create a client configuration with the dangerous verifier
//! let mut config = ClientConfig::builder()
//!     .dangerous()
//!     .with_custom_certificate_verifier(Arc::new(DangerousNoVerifierServer))
//!     .with_no_client_auth();
//! ```
//!
//! ## Alternative Approaches
//!
//! For production use, consider these safer alternatives:
//!
//! - **Custom certificate verifier** with specific validation rules
//! - **Certificate pinning** for known endpoints
//! - **Certificate transparency** verification
//! - **Custom CA bundle** for internal certificates
//! - **Hybrid approach** with fallback to dangerous verifier

use rustls::{
    client::danger::{HandshakeSignatureValid, ServerCertVerified, ServerCertVerifier}, 
    pki_types::{CertificateDer, ServerName, UnixTime}, 
    DigitallySignedStruct, SignatureScheme
};

/// Dangerous certificate verifier that accepts all certificates without validation
/// 
/// This struct implements the `ServerCertVerifier` trait from Rustls, providing
/// a "dangerous" verifier that completely bypasses all certificate validation
/// checks. It accepts any certificate presented by the server, regardless of
/// validity, expiration, hostname mismatch, or signature verification.
/// 
/// ## Security Implications
/// 
/// ⚠️ **EXTREME SECURITY RISK** ⚠️
/// 
/// This verifier creates significant security vulnerabilities:
/// 
/// - **Man-in-the-middle attacks**: Attackers can intercept and modify traffic
/// - **Certificate spoofing**: Invalid or malicious certificates are accepted
/// - **Hostname impersonation**: Certificates for wrong domains are accepted
/// - **Expired certificates**: Outdated certificates are accepted
/// - **Self-signed certificates**: Untrusted certificates are accepted
/// 
/// ## When to Use
/// 
/// This verifier should ONLY be used in these specific scenarios:
/// 
/// 1. **Proxy servers** where certificate validation is handled by upstream clients
/// 2. **Development environments** with self-signed certificates
/// 3. **Internal networks** with trusted infrastructure
/// 4. **Testing environments** where certificate issues are expected
/// 5. **Legacy systems** with certificate compatibility issues
/// 
/// ## When NOT to Use
/// 
/// Never use this verifier in these scenarios:
/// 
/// - Production applications without additional security measures
/// - Client applications connecting to untrusted servers
/// - Financial or sensitive data transmission
/// - Public-facing services without proper certificate management
/// - Any scenario where security is a primary concern
/// 
/// ## Implementation Behavior
/// 
/// All verification methods return success without performing any checks:
/// 
/// - `verify_server_cert()` - Always returns `ServerCertVerified::assertion()`
/// - `verify_tls12_signature()` - Always returns `HandshakeSignatureValid::assertion()`
/// - `verify_tls13_signature()` - Always returns `HandshakeSignatureValid::assertion()`
/// - `supported_verify_schemes()` - Returns comprehensive list of signature schemes
/// 
/// ## Example Usage
/// 
/// ```rust
/// use rustls::ClientConfig;
/// use cf_proxy::tls_verifier::DangerousNoVerifierServer;
/// use std::sync::Arc;
/// 
/// // Create a client configuration with the dangerous verifier
/// let mut config = ClientConfig::builder()
///     .dangerous()
///     .with_custom_certificate_verifier(Arc::new(DangerousNoVerifierServer))
///     .with_no_client_auth();
/// ```
/// 
/// ## Thread Safety
/// 
/// This struct is thread-safe and can be safely shared across multiple threads
/// using `Arc<DangerousNoVerifierServer>`.
#[derive(Debug)]
pub struct DangerousNoVerifierServer;

impl ServerCertVerifier for DangerousNoVerifierServer {
    /// Verifies the server certificate chain without performing any validation
    /// 
    /// This method is called by Rustls during the TLS handshake to verify the
    /// server's certificate chain. In this dangerous implementation, it always
    /// returns success without performing any validation checks.
    /// 
    /// ## Parameters
    /// 
    /// * `_end_entity` - The end-entity certificate (leaf certificate)
    /// * `_intermediates` - Intermediate certificates in the chain
    /// * `_server_name` - The server name being connected to (SNI)
    /// * `_ocsp_response` - OCSP response for certificate status checking
    /// * `_now` - Current time for certificate expiration checking
    /// 
    /// ## Returns
    /// 
    /// Always returns `Ok(ServerCertVerified::assertion())` without validation.
    /// 
    /// ## Security Implications
    /// 
    /// This method bypasses all critical certificate validation:
    /// 
    /// - **No certificate chain validation** - Invalid chains are accepted
    /// - **No expiration checking** - Expired certificates are accepted
    /// - **No hostname verification** - Wrong domain certificates are accepted
    /// - **No OCSP checking** - Revoked certificates are accepted
    /// - **No signature verification** - Forged certificates are accepted
    /// 
    /// ## Example
    /// 
    /// ```rust
    /// use cf_proxy::tls_verifier::DangerousNoVerifierServer;
    /// 
    /// let verifier = DangerousNoVerifierServer;
    /// // This will always succeed regardless of certificate validity
    /// let result = verifier.verify_server_cert(
    ///     &cert_der,
    ///     &intermediates,
    ///     &server_name,
    ///     &ocsp_response,
    ///     now
    /// );
    /// assert!(result.is_ok());
    /// ```
    fn verify_server_cert(
        &self,
        _end_entity: &CertificateDer,
        _intermediates: &[CertificateDer],
        _server_name: &ServerName,
        _ocsp_response: &[u8],
        _now: UnixTime,
    ) -> Result<ServerCertVerified, rustls::Error> {
        Ok(ServerCertVerified::assertion())
    }

    /// Verifies TLS 1.2 signature without performing any validation
    /// 
    /// This method is called by Rustls during TLS 1.2 handshake to verify
    /// the signature in the digitally signed struct. In this dangerous
    /// implementation, it always returns success without performing any
    /// signature verification checks.
    /// 
    /// ## Parameters
    /// 
    /// * `_message` - The message that was signed
    /// * `_cert` - The certificate containing the public key
    /// * `_dss` - The digitally signed struct containing the signature
    /// 
    /// ## Returns
    /// 
    /// Always returns `Ok(HandshakeSignatureValid::assertion())` without validation.
    /// 
    /// ## Security Implications
    /// 
    /// This method bypasses critical signature verification:
    /// 
    /// - **No signature verification** - Forged signatures are accepted
    /// - **No message integrity checking** - Modified messages are accepted
    /// - **No certificate key validation** - Wrong keys are accepted
    /// - **No algorithm validation** - Weak algorithms are accepted
    /// 
    /// ## TLS 1.2 Context
    /// 
    /// In TLS 1.2, this method verifies the signature in the `CertificateVerify`
    /// message, which proves that the server possesses the private key
    /// corresponding to the public key in the certificate.
    fn verify_tls12_signature(
        &self,
        _message: &[u8],
        _cert: &CertificateDer,
        _dss: &DigitallySignedStruct,
    ) -> Result<HandshakeSignatureValid, rustls::Error> {
        Ok(HandshakeSignatureValid::assertion())
    }

    /// Verifies TLS 1.3 signature without performing any validation
    /// 
    /// This method is called by Rustls during TLS 1.3 handshake to verify
    /// the signature in the digitally signed struct. In this dangerous
    /// implementation, it always returns success without performing any
    /// signature verification checks.
    /// 
    /// ## Parameters
    /// 
    /// * `_message` - The message that was signed
    /// * `_cert` - The certificate containing the public key
    /// * `_dss` - The digitally signed struct containing the signature
    /// 
    /// ## Returns
    /// 
    /// Always returns `Ok(HandshakeSignatureValid::assertion())` without validation.
    /// 
    /// ## Security Implications
    /// 
    /// This method bypasses critical signature verification:
    /// 
    /// - **No signature verification** - Forged signatures are accepted
    /// - **No message integrity checking** - Modified messages are accepted
    /// - **No certificate key validation** - Wrong keys are accepted
    /// - **No algorithm validation** - Weak algorithms are accepted
    /// 
    /// ## TLS 1.3 Context
    /// 
    /// In TLS 1.3, this method verifies the signature in the `CertificateVerify`
    /// message, which proves that the server possesses the private key
    /// corresponding to the public key in the certificate. TLS 1.3 uses
    /// different signature schemes and message formats compared to TLS 1.2.
    fn verify_tls13_signature(
        &self,
        _message: &[u8],
        _cert: &CertificateDer,
        _dss: &DigitallySignedStruct,
    ) -> Result<HandshakeSignatureValid, rustls::Error> {
        Ok(HandshakeSignatureValid::assertion())
    }

    /// Returns a comprehensive list of supported signature schemes
    /// 
    /// This method returns a list of all signature schemes that this verifier
    /// claims to support. Since this is a dangerous verifier that doesn't
    /// actually verify signatures, it returns a comprehensive list to ensure
    /// compatibility with various TLS implementations.
    /// 
    /// ## Returns
    /// 
    /// Returns a vector containing all major signature schemes:
    /// 
    /// ### RSA Schemes
    /// - `RSA_PKCS1_SHA1` - RSA with PKCS#1 v1.5 padding and SHA-1
    /// - `RSA_PKCS1_SHA256` - RSA with PKCS#1 v1.5 padding and SHA-256
    /// - `RSA_PKCS1_SHA384` - RSA with PKCS#1 v1.5 padding and SHA-384
    /// - `RSA_PKCS1_SHA512` - RSA with PKCS#1 v1.5 padding and SHA-512
    /// - `RSA_PSS_SHA256` - RSA with PSS padding and SHA-256
    /// - `RSA_PSS_SHA384` - RSA with PSS padding and SHA-384
    /// - `RSA_PSS_SHA512` - RSA with PSS padding and SHA-512
    /// 
    /// ### ECDSA Schemes
    /// - `ECDSA_SHA1_Legacy` - ECDSA with SHA-1 (legacy)
    /// - `ECDSA_NISTP256_SHA256` - ECDSA with P-256 and SHA-256
    /// - `ECDSA_NISTP384_SHA384` - ECDSA with P-384 and SHA-384
    /// - `ECDSA_NISTP521_SHA512` - ECDSA with P-521 and SHA-512
    /// 
    /// ### EdDSA Schemes
    /// - `ED25519` - Ed25519 signature scheme
    /// - `ED448` - Ed448 signature scheme
    /// 
    /// ## Compatibility
    /// 
    /// This comprehensive list ensures compatibility with:
    /// 
    /// - **Legacy TLS implementations** using older signature schemes
    /// - **Modern TLS implementations** using newer signature schemes
    /// - **Various certificate authorities** using different key types
    /// - **Different TLS versions** (1.2 and 1.3)
    /// 
    /// ## Security Note
    /// 
    /// While this method returns support for all schemes, the actual
    /// verification methods (`verify_tls12_signature` and `verify_tls13_signature`)
    /// do not perform any validation, making the choice of signature scheme
    /// irrelevant from a security perspective.
    fn supported_verify_schemes(&self) -> Vec<SignatureScheme> {
        vec![
            SignatureScheme::RSA_PKCS1_SHA1,
            SignatureScheme::ECDSA_SHA1_Legacy,
            SignatureScheme::RSA_PKCS1_SHA256,
            SignatureScheme::ECDSA_NISTP256_SHA256,
            SignatureScheme::RSA_PKCS1_SHA384,
            SignatureScheme::ECDSA_NISTP384_SHA384,
            SignatureScheme::RSA_PKCS1_SHA512,
            SignatureScheme::ECDSA_NISTP521_SHA512,
            SignatureScheme::RSA_PSS_SHA256,
            SignatureScheme::RSA_PSS_SHA384,
            SignatureScheme::RSA_PSS_SHA512,
            SignatureScheme::ED25519,
            SignatureScheme::ED448,
        ]
    }
}
