# Storm Browser Desktop

A desktop browser application built with Electron and React, inspired by ColorOS 16 design.

## Features

- Multi-platform support (Windows, macOS, Linux)
- Modern UI built with React and Tailwind CSS
- AI-powered features via Google Gemini API
- Secure Electron configuration with context isolation
- Automated build pipeline

## Development

### Prerequisites

- Node.js 22+
- npm 10+

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run electron:dev

# Build for production
npm run electron:build

# Build specific platform
npm run build:win-exe  # Windows EXE
npm run build:win-appx # Windows MSIX
npm run build:mac      # macOS DMG
npm run build:linux    # Linux DEB
```

## Security

This project implements security best practices for Electron applications:
- Context isolation enabled
- Node integration disabled
- Sandboxing enabled
- Secure IPC via preload scripts

See [SECURITY.md](SECURITY.md) for more information.

## License

MIT

## Author

Himank (himankcpro@gmail.com)
