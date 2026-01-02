# Ralph Loop

Keep your AI agent on track with structured loops.

## The Problem

AI agents drift. They rush ahead, skip steps, produce code that doesn't build. When stuck, they hack instead of asking for help.

## The Solution

A disciplined loop with seven gold stars:

```
Re-read Plan → One Task → Execute with Discipline → Verify Build → Repeat
                              ↓
                         Stuck? → Get Help (not quick fixes)
```

## Quick Start

```bash
# Create a plan
ralph init "Add user authentication"

# Work through tasks
ralph next    # See next task, launch Pi
# ... Pi works ...
ralph done    # Mark complete, verify build

# Stuck? Get help
ralph stuck   # Ask Oracle or run codex review
```

## Gold Stars ⭐

| Feature | Why It's Magic |
|---------|----------------|
| **Re-Read Loop** | Agent sees full plan context every iteration. No drift. |
| **One Task Focus** | "Do this task. Do NOT proceed to next." Prevents chaos. |
| **Build Gate** | Must build before marking done. Catches problems early. |
| **Stuck → Help** | Lower friction to ask Oracle than to hack a workaround. |
| **THINK.ALIGN.ACT** | Discipline protocol baked into every prompt. |
| **Living Notes** | Capture decisions and learnings in the plan. |
| **Progress Visible** | Always know where you are: "4/7 tasks (57%)" |

See [docs/GOLD-STARS.md](docs/GOLD-STARS.md) for details.

## Agent Roles

| Role | Tool | When |
|------|------|------|
| Worker | Pi | All coding |
| Advisor | Oracle | Hard problems |
| Reviewer | `codex review` | Before commits |

## Philosophy

> "Working code over perfect code."

- No over-engineering
- No abstraction layers
- No multi-agent orchestration
- Just enough structure to ship

## Installation

```bash
# Clone and install
git clone https://github.com/carmandale/ralph-loop.git
cd ralph-loop
./install.sh

# Or manually copy to your PATH
cp bin/ralph /usr/local/bin/
```

## Commands

| Command | Description |
|---------|-------------|
| `ralph init "desc"` | Create new plan |
| `ralph next` | Show/start next task |
| `ralph done` | Mark task complete |
| `ralph stuck` | Get help |
| `ralph status` | Show progress |

## License

MIT
