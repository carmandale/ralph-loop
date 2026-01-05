# Configuration

## File Location

`.ralph/config` in your project root.

## Format

```ini
# Verification commands (run in order after each task)
build=gj build ms
typecheck=npm run typecheck
test=npm test
lint=npm run lint

[reminders]
Any text here appears in every Pi prompt.
Use for project rules agents forget.
```

## Verification Commands

All optional. Run in order after each task: `build` → `typecheck` → `test` → `lint`.

| Command | Purpose | Example |
|---------|---------|---------|
| `build` | Primary build | `gj build ms`, `npm run build` |
| `typecheck` | Type checking | `npm run typecheck`, `tsc --noEmit` |
| `test` | Run tests | `npm test`, `pytest` |
| `lint` | Linting | `npm run lint`, `eslint .` |

**Build auto-detection** (if not set):

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

## Progress Memory

`.ralph/progress.txt` provides LLM memory across context windows.

**How it works:**
1. Created automatically on `ralph init`
2. LLM sees previous entries at start of each task
3. LLM appends learnings after completing each task
4. Never overwritten, only appended

**What gets logged:**
- What was done
- Decisions and assumptions made
- Gotchas for future tasks

**Example content:**
```
2026-01-05 11:30 - Plan created: Add cloud sync UI

2026-01-05 11:45 Task 1 (SyncConsolePanel) - Created panel with basic layout.
  Decision: Used @Observable instead of ObservableObject for visionOS compatibility.
  Gotcha: Panel must be in SharedUI/Common/ not Features/

2026-01-05 12:00 Task 2 (Integration) - Replaced SyncProgressView with SyncConsolePanel.
  Note: MainSplitView needed import update for SharedUI module.
```

**Why this matters:**
LLMs lose context between tasks. The progress file lets each task "remember" what previous tasks learned, preventing repeated mistakes and maintaining consistency.
