# Contributing to cloudflare-stealth

Thank you for your interest in contributing to cloudflare-stealth! We welcome contributions from the community and appreciate your help in making this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Guidelines](#issue-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Rust 1.70+** - For building the WebAssembly component
- **Node.js 18+** - For TypeScript wrapper and build tools
- **Git** - For version control
- **Cloudflare Workers CLI (`wrangler`)** - For testing Workers

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cloudflare-stealth.git
   cd cloudflare-stealth
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/alpgul/cloudflare-stealth.git
   ```

## Development Setup

### Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Rust dependencies (if building from source)
cargo build
```

### Build the Project

```bash
# Complete build (Rust + TypeScript)
npm run build

# Or build step by step
npm run build:rust  # Build Rust WASM
npm run build:dist   # Build TypeScript bundle
```

### Verify Installation

```bash
# Run tests
npm test

# Check code formatting
npm run format:check

# Run linters
npm run lint
```

## Making Changes

### Branch Strategy

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [Code Style](#code-style) guidelines

3. Test your changes thoroughly

4. Update documentation if necessary

### Types of Contributions

We welcome various types of contributions:

- **Bug Fixes**: Fix issues and improve stability
- **New Features**: Add new functionality
- **Performance Improvements**: Optimize existing code
- **Documentation**: Improve docs, examples, and comments
- **Tests**: Add or improve test coverage
- **Examples**: Create new usage examples

## Submitting Changes

### Commit Guidelines

Follow these commit message conventions:

```
type(scope): brief description

Longer description if needed

Fixes #issue_number
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(http): add HTTP/2 support for better performance

fix(wasm): resolve memory leak in streaming responses

docs: update API documentation with new examples
```

### Pull Request Process

1. **Update your branch**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Push your changes**:
   ```bash
   git push origin your-feature-branch
   ```

3. **Create a Pull Request** on GitHub with:
   - Clear title and description
   - Reference to related issues
   - Screenshots/videos for UI changes
   - Test results

4. **Respond to feedback** and make requested changes

## Code Style

### Rust Code Style

- Follow standard Rust formatting: `cargo fmt`
- Use `cargo clippy` for linting
- Document public APIs with `///` comments
- Use meaningful variable and function names

### TypeScript Code Style

- Follow the project's ESLint configuration
- Use `npm run format` for automatic formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### General Guidelines

- Write clear, readable code
- Add comments for complex logic
- Keep functions small and focused
- Use consistent naming conventions
- Follow existing code patterns

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for new features
- Ensure existing tests still pass
- Add integration tests for complex functionality
- Test error conditions and edge cases

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── fixtures/       # Test data and fixtures
```

## Documentation

### Code Documentation

- Document all public APIs
- Use clear, concise descriptions
- Include usage examples
- Update README.md for significant changes

### API Documentation

- Update API reference in README.md
- Add examples for new features
- Document breaking changes clearly

## Issue Guidelines

### Before Creating an Issue

1. Search existing issues to avoid duplicates
2. Check if the issue is already fixed in the latest version
3. Gather relevant information

### Issue Templates

Use the appropriate issue template:
- **Bug Report**: For reporting bugs
- **Feature Request**: For suggesting new features
- **Question**: For asking questions
- **Documentation**: For documentation improvements

### Bug Reports

Include the following information:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)
- Code samples if applicable

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the README.md and examples

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to cloudflare-stealth! 🚀
