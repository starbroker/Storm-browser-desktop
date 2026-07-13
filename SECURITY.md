# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in Storm Browser, please email security@example.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

Please do not publicly disclose the vulnerability until we've had time to address it.

## Security Measures

This project implements:
- Context isolation in Electron
- Node integration disabled
- Sandboxing enabled
- Secure IPC communication via preload scripts
- Content Security Policy (CSP) headers
