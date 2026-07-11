# Storm Browser

A modern, privacy-focused desktop browser built with Electron and React, featuring a beautiful **ColorOS 16-inspired "Frosted Glass"** design aesthetic.

## Features

### Core Browser Engine
- Built on Chromium via Electron for maximum web compatibility
- Full tab management with horizontal tab strip
- Hardware-accelerated rendering
- Native webview support

### Design System (ColorOS 16 Aesthetic)
- **Frosted Glass** translucent backgrounds with blur effects
- Deep dark mode and clean light mode
- Fluid animations and smooth transitions
- Customizable accent colors
- Multiple layout density options

### Tab Management
- Horizontal tab strip at the top
- Tab titles with favicons
- Quick close buttons
- New tab and private/incognito tab support
- Tab muting for media playback

### Navigation Bar
- Back, Forward, Refresh buttons
- Unified URL/Search bar (Omnibox)
- Shield icon for privacy settings
- Settings menu dropdown
- Reader mode toggle
- Bookmark star button
- Translate page option

### Search Engines
- DuckDuckGo (default)
- Google
- Bing
- StormX (custom)

### Privacy & Security
- Built-in ad blocker
- Tracker protection
- HTTPS enforcement
- Private browsing mode
- Password manager
- Web permissions control

## Installation

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run electron:dev
```

### Building Installers

```bash
# Build for all platforms
npm run electron:build

# Build for Windows only (.exe NSIS installer)
npm run electron:build:win

# Build for macOS only (.dmg - Universal: arm64 + x64)
npm run electron:build:mac

# Build for Linux only
npm run electron:build:linux
```

## GitHub Actions CI/CD

The project includes automated build workflows that generate:
- **macOS**: `.dmg` installer (Universal binary for Intel & Apple Silicon)
- **Windows**: `.exe` NSIS installer (64-bit)
- **Linux**: `.AppImage` and `.deb` packages

Artifacts are automatically uploaded after each build.

## Project Structure

```
storm-browser/
├── src/                    # React source files
│   ├── App.tsx            # Main browser UI component
│   ├── components/        # Reusable UI components
│   │   ├── SettingsModal.tsx
│   │   └── BrowserPageModal.tsx
│   ├── hooks/             # Custom React hooks
│   │   └── useSettings.ts
│   ├── types.ts           # TypeScript type definitions
│   └── index.css          # Global styles with Tailwind
├── main.cjs               # Electron main process
├── preload.cjs            # Electron preload script
├── package.json           # Dependencies and build config
├── vite.config.ts         # Vite bundler configuration
└── .github/workflows/     # CI/CD pipelines
    └── build.yml          # Automated build workflow
```

## Configuration

### package.json Build Options

The `build` section in `package.json` configures electron-builder:

```json
{
  "build": {
    "appId": "com.stormbrowser.app",
    "productName": "Storm Browser",
    "mac": {
      "target": [{"target": "dmg", "arch": ["x64", "arm64"]}]
    },
    "win": {
      "target": [{"target": "nsis", "arch": ["x64"]}]
    }
  }
}
```

## Technologies Used

- **Electron** - Desktop app framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **electron-builder** - Packaging and distribution
- **Lucide React** - Icon library
- **Motion** - Animation library

## License

Apache-2.0
