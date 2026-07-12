#!/bin/bash
# Post-install script for StormX Browser DEB package

# Add application to menu (if applicable)
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database /usr/share/applications
fi

# Create symbolic link for easy launching
if [ ! -L /usr/local/bin/stormx-browser ]; then
    ln -s /opt/stormx-browser/stormx-browser /usr/local/bin/stormx-browser 2>/dev/null || true
fi

# Set executable permissions
chmod +x /opt/stormx-browser/stormx-browser 2>/dev/null || true

# Update icon cache
if command -v gtk-update-icon-cache &> /dev/null; then
    gtk-update-icon-cache /usr/share/icons/hicolor 2>/dev/null || true
fi

echo "StormX Browser installed successfully!"
