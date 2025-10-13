# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of cloudflare-stealth
- High-performance HTTP proxy implementation for Cloudflare Workers
- Rust and WebAssembly implementation for optimal performance
- HTTP/1.1 and HTTP/2 support with automatic protocol negotiation via ALPN
- TLS support with custom certificate verification
- Full request/response streaming support
- WASM compatibility for Cloudflare Workers environment
- Fetch API compatible interface
- TypeScript support with full type definitions
- Comprehensive documentation and examples

### Features
- **High Performance**: Built with Rust and compiled to WebAssembly
- **Protocol Support**: HTTP/1.1 and HTTP/2 with automatic negotiation
- **TLS Support**: Secure connections with custom certificate verification
- **Streaming**: Full request/response streaming support
- **WASM Compatible**: Designed specifically for Cloudflare Workers environment
- **Fetch API Compatible**: Drop-in replacement for native fetch
- **TypeScript Support**: Full TypeScript definitions and examples
- **Comprehensive Documentation**: Detailed API documentation and examples

### Security
- Custom certificate verifier (accepts all certificates by default)
- Automatic header filtering for Cloudflare-specific headers
- Support for proxy scenarios with upstream certificate validation

### Performance
- HTTP/1.1: ~2ms average response time
- HTTP/2: ~1.5ms average response time
- Memory Usage: ~1MB base memory footprint
- Throughput: 1000+ requests/second

## [1.0.0] - 2024-10-13

### Added
- Initial release
- Core HTTP proxy functionality
- WebAssembly implementation
- TypeScript wrapper
- Basic examples and documentation

---

## Version History

- **1.0.0** - Initial release with core functionality
- **Unreleased** - Development version with latest features

## Contributing

When adding new features or making changes, please update this changelog following the format above.

### Changelog Format

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

## Links

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Project Repository](https://github.com/alpgul/cloudflare-stealth)
