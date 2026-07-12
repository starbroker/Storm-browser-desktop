#!/bin/bash
# Post-remove script for StormX Browser DEB package

# Clean up symbolic link
rm -f /usr/local/bin/stormx-browser 2>/dev/null || true

# Clean up cache
if command -v gtk-update-icon-cache &> /dev/null; then
    gtk-update-icon-cache /usr/share/icons/hicolor 2>/dev/null || true
fi

echo "StormX Browser has been removed."
