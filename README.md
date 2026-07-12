# StormX Browser - ColorOS 16 Inspired Desktop Browser

## Build Status
![Build Windows](https://github.com/starbroker/Storm-browser-desktop/actions/workflows/build.yml/badge.svg?branch=main)

## 🎨 Features

### ColorOS 16 Design
- Modern, fluid design language inspired by OPPO ColorOS 16
- Smooth animations and transitions
- Clean, intuitive user interface
- Speed Dial & Bookmarks with customizable layouts
- Tabbed browsing with smooth switching

### 🚀 Performance & Privacy
- Lightning-fast loading times
- Optimized memory usage
- Built-in ad blocker and tracker blocker
- Privacy-focused browsing
- Multiple search engine support (DuckDuckGo, Google, Bing, Yahoo)

### 🛠️ Cross-Platform Installers
- **Windows**: EXE (NSIS) and MSIX installers
- **macOS**: DMG package for easy installation
- **Linux**: DEB package for Debian/Ubuntu systems

### ⚙️ Customization
- Dark/Light/System themes
- Accent color picker
- Typography customization
- Built-in search engine selection

## 📦 Installation

### Windows
1. Download the latest version from [GitHub Releases](https://github.com/starbroker/Storm-browser-desktop/releases)
2. Choose either:
   - `StormX-Browser-Setup.exe` - Traditional installer
   - `StormX-Browser-x64.msix` - Microsoft Store package (Windows 10/11)
3. Run the installer and follow the wizard

### macOS
1. Download `StormX-Browser-x64.dmg`
2. Double-click to mount the image
3. Drag "StormX Browser" to your Applications folder
4. Launch from Applications

### Linux
```bash
# Download the .deb file, then:
sudo apt install ./StormX-Browser-x64.deb
stormx-browser
```

## 🚀 Quick Start

### Development

**Prerequisites:**
- Node.js 22+
- npm or yarn

**Setup:**
```bash
# Install dependencies
npm install

# Development mode (hot reload)
npm run electron:dev

# Preview production build
npm run preview
```

### Building Installers

**All platforms:**
```bash
npm run electron:build
```

**Windows only:**
```bash
npm run build:win-exe    # EXE installer
npm run build:win-msix   # MSIX package
```

**macOS only:**
```bash
npm run build:mac
```

**Linux only:**
```bash
npm run build:linux
```

## 📁 Project Structure

```
storm-browser-desktop/
├── src/                          # React components and UI code
├── main.cjs                      # Electron main process
├── .github/workflows/
│   └── build.yml                # Automated multi-platform build pipeline
├── assets/                       # Installer assets and configurations
│   ├── entitlements.mac.plist   # macOS app sandbox settings
│   ├── stormx-browser.desktop   # Linux desktop integration
│   └── icons/                   # Application icons
├── scripts/
│   ├── postinstall.sh           # Linux post-install script
│   └── postremove.sh            # Linux cleanup script
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── package.json                 # Project dependencies & scripts
```

## 🔄 CI/CD Pipeline

The project uses **GitHub Actions** for fully automated, cross-platform builds:

### Build Triggers
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main` or `master`
- Version tags (`v*`)
- Manual workflow dispatch

### Automated Release
To create and publish a release with all installers:

```bash
git tag v1.0.0
git push origin v1.0.0
```

All installers will automatically build and publish to GitHub Releases within minutes.

### Build Artifacts
- ✅ Windows EXE & MSIX installers
- ✅ macOS DMG package
- ✅ Linux DEB package
- ✅ Auto-generated release notes

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **Desktop** | Electron 43 |
| **Build** | Vite, Electron Builder |
| **UI Components** | Lucide Icons, Framer Motion |
| **Styling** | Tailwind CSS 4 |
| **Development** | TypeScript, ESBuild |

## 📝 Scripts Reference

```bash
# Development
npm run dev              # Start Vite dev server
npm run electron:dev    # Start Electron + Vite dev server

# Production Build
npm run build           # Build Vite application
npm run electron:build  # Full Electron build (all platforms)

# Platform-Specific Builds
npm run build:win-exe   # Windows EXE installer
npm run build:win-msix  # Windows MSIX package
npm run build:mac       # macOS DMG installer
npm run build:linux     # Linux DEB package

# Quality
npm run lint            # Type check with TypeScript
npm run preview         # Preview production build
```

## 🔐 Code Signing

### Windows
- Self-signed certificates are automatically generated in CI/CD
- MSIX packages are signed with development certificates

### macOS
- Code signing requires Apple Developer certificates
- Hardened runtime and code signing are configured in entitlements

### Linux
- DEB packages include post-install scripts for system integration

## 📚 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [Electron Builder](https://www.electron.build)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **ColorOS 16** - Design inspiration
- **Electron Team** - Desktop application framework
- **React Community** - UI framework and ecosystem
- **All Contributors** - Who help improve this project

## 📞 Support & Issues

- 🐛 [Report Issues](https://github.com/starbroker/Storm-browser-desktop/issues)
- 💡 [Request Features](https://github.com/starbroker/Storm-browser-desktop/issues/new?labels=enhancement)
- 🔗 [GitHub Discussions](https://github.com/starbroker/Storm-browser-desktop/discussions)

---

**Built with ❤️ for the web**
