# Configuration

## File Location

`.ralph/config` in your project root.

## Format

```ini
# Build command (required for build gate)
build=gj build ms

[reminders]
Any text here appears in every Pi prompt.
Use for project rules agents forget.
```

## Build Commands

Auto-detected if not set:

| File | Default |
|------|---------|
| `package.json` | `npm run build` |
| `Cargo.toml` | `cargo build` |
| `Makefile` | `make` |
| `go.mod` | `go build ./...` |

Override with `build=your-command`.

## Reminders

Everything under `[reminders]` is injected into Pi's context:

```
═══════════════════════════════════════════════════════════════
PROJECT RULES (DO NOT VIOLATE):
═══════════════════════════════════════════════════════════════
⚠️ Use gj tools, not xcodebuild
📅 Xcode 26, January 2026
═══════════════════════════════════════════════════════════════
```

Use for:
- Tool requirements (gj, not xcodebuild)
- Date/version context agents forget
- Project-specific conventions
- Dangerous operations to avoid
