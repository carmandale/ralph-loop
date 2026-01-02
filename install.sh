#!/usr/bin/env bash
#
# Install ralph to /usr/local/bin
#

set -euo pipefail

INSTALL_DIR="${1:-/usr/local/bin}"

# Check if we have permission
if [[ ! -w "$INSTALL_DIR" ]]; then
    echo "Need sudo to install to $INSTALL_DIR"
    sudo cp bin/ralph "$INSTALL_DIR/ralph"
    sudo chmod +x "$INSTALL_DIR/ralph"
else
    cp bin/ralph "$INSTALL_DIR/ralph"
    chmod +x "$INSTALL_DIR/ralph"
fi

echo "✓ Installed ralph to $INSTALL_DIR/ralph"
echo ""
echo "Run 'ralph help' to get started"
