# Ralph Loop

Keep your AI agent on track with structured loops.

## The Problem

AI agents drift. They rush ahead, skip steps, produce code that doesn't build.

## The Solution

A simple loop:

```
Plan → Task → Execute → Verify Build → Next Task
         ↑                    |
         └────────────────────┘
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

## How It Works

1. **You create a plan** - Markdown file with checkbox tasks
2. **Loop through one task at a time** - Focus prevents drift
3. **Verify build after each task** - Catches problems early
4. **Get help when stuck** - Oracle for advice, Codex for review

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
# Coming soon
npm install -g ralph-loop
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
