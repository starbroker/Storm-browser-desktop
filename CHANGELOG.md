# CHANGELOG

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-13

### Added
- Initial Electron desktop browser implementation
- Multi-platform build support (Windows, macOS, Linux)
- Security hardening with context isolation
- Preload script for secure IPC communication
- Automated CI/CD pipeline with GitHub Actions

### Fixed
- Electron security vulnerabilities (nodeIntegration, contextIsolation)
- electron-builder configuration schema validation
- Build script naming consistency
- Truncated workflow MSIX certificate generation step

### Security
- Disabled Node integration in BrowserWindow
- Enabled context isolation
- Implemented sandboxing
- Added secure preload script for IPC communication
