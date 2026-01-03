#!/usr/bin/env bash
#
# Install ralph CLI and Pi integration
#

set -euo pipefail

INSTALL_DIR="${1:-/usr/local/bin}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing ralph..."

# Install CLI
if [[ ! -w "$INSTALL_DIR" ]]; then
    echo "Need sudo to install to $INSTALL_DIR"
    sudo cp "$SCRIPT_DIR/bin/ralph" "$INSTALL_DIR/ralph"
    sudo chmod +x "$INSTALL_DIR/ralph"
else
    cp "$SCRIPT_DIR/bin/ralph" "$INSTALL_DIR/ralph"
    chmod +x "$INSTALL_DIR/ralph"
fi
echo "✓ Installed ralph to $INSTALL_DIR/ralph"

# Install Pi skill
PI_SKILLS_DIR="$HOME/.pi/agent/skills/ralph"
if [[ -d "$SCRIPT_DIR/pi-integration/skill" ]]; then
    mkdir -p "$PI_SKILLS_DIR"
    cp "$SCRIPT_DIR/pi-integration/skill/SKILL.md" "$PI_SKILLS_DIR/"
    echo "✓ Installed Pi skill to $PI_SKILLS_DIR/"
fi

# Install Pi custom tool
PI_TOOLS_DIR="$HOME/.pi/agent/tools/ralph"
if [[ -d "$SCRIPT_DIR/pi-integration/tool" ]]; then
    mkdir -p "$PI_TOOLS_DIR"
    cp "$SCRIPT_DIR/pi-integration/tool/index.ts" "$PI_TOOLS_DIR/"
    echo "✓ Installed Pi tool to $PI_TOOLS_DIR/"
fi

echo ""
echo "Run 'ralph help' to get started"
echo "In Pi, say 'create a ralph loop for...' to use the skill"
