# ralph

Structured loops for AI coding agents. Plan → Task → Build → Commit → Repeat.

## Install

```bash
git clone https://github.com/carmandale/ralph-loop
cd ralph-loop && ./install.sh
```

## Quick Start

```bash
ralph init "Add user authentication"   # Create plan
$EDITOR .ralph/plans/*.md              # Add your tasks
ralph next                              # Start first task
# ... Pi works ...
ralph done                              # Build, commit, next
```

## Commands

| Command | What |
|---------|------|
| `init "desc"` | Create plan |
| `next` | Launch Pi with task context |
| `done` | Build → Commit → Mark complete |
| `stuck` | Get help (Oracle / codex review) |
| `yolo` | Full auto, no prompts |
| `review` | Run codex review |
| `status` | Show progress |
| `list` | Show all plans with progress |
| `switch [n]` | Switch to different plan |
| `note "msg"` | Add note to plan |

## The Loop

```
ralph next
    ↓
Pi works on ONE task
    ↓
ctrl-c when done
    ↓
"Done?" → Build passes → Commit → Next task
    ↓
Repeat until plan complete
```

## Config

`.ralph/config`:
```ini
# Verification commands (run in order, all optional)
build=gj build ms
typecheck=npm run typecheck
test=npm test
lint=npm run lint

[reminders]
⚠️ Use gj tools, not xcodebuild
📅 Xcode 26, January 2026
```

- **Verification commands** run after each task (build → typecheck → test → lint)
- **Reminders** appear in every Pi prompt under "PROJECT RULES"

## Progress Memory

`.ralph/progress.txt` is your LLM's memory across context windows:
- Created automatically on `ralph init`
- LLM appends learnings after each task
- Read at start of each task for continuity
- Never overwritten, only appended

## YOLO Mode

```bash
ralph yolo
# Type "yolo" to confirm
# Runs all tasks non-interactively
# Auto-commits each task
# Codex review at end
```

## Why It Works

1. **Re-read plan every task** - No drift
2. **One task at a time** - No scope creep  
3. **Build gate** - Must build to proceed
4. **Commit per task** - Easy rollback
5. **Help when stuck** - Oracle or review

## License

MIT
