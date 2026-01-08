#!/usr/bin/env bash
#
# Install ralph CLI and Pi integration
#

set -euo pipefail

UNINSTALL=false
if [[ "${1:-}" == "--uninstall" ]]; then
    UNINSTALL=true
    shift
fi

INSTALL_DIR="${1:-/usr/local/bin}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "$UNINSTALL" == true ]]; then
    echo "Uninstalling ralph..."

    if [[ -f "$INSTALL_DIR/ralph" ]]; then
        if [[ ! -w "$INSTALL_DIR" ]]; then
            sudo rm -f "$INSTALL_DIR/ralph"
        else
            rm -f "$INSTALL_DIR/ralph"
        fi
        echo "✓ Removed ralph from $INSTALL_DIR/ralph"
    fi

    rm -rf "$HOME/.pi/agent/skills/ralph"
    rm -rf "$HOME/.pi/agent/tools/ralph"
    rm -f "$HOME/.pi/agent/hooks/ralph-file-tracker.ts"
    echo "✓ Removed Pi integrations"
    exit 0
fi

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

# Install Pi hook
PI_HOOKS_DIR="$HOME/.pi/agent/hooks"
if [[ -d "$SCRIPT_DIR/pi-integration/hook" ]]; then
    mkdir -p "$PI_HOOKS_DIR"
    cp "$SCRIPT_DIR/pi-integration/hook/ralph-file-tracker.ts" "$PI_HOOKS_DIR/"
    echo "✓ Installed Pi hook to $PI_HOOKS_DIR/"
fi

echo ""
echo "Run 'ralph help' to get started"
echo "In Pi, say 'create a ralph loop for...' to use the skill"
