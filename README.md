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

### Option 1: Manual Commands

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

### Option 2: Pi Skill (Recommended)

Just tell Pi what you want:

```
"Create a ralph loop for adding cloud sync UI"
```

Pi will:
1. Interview you to clarify requirements
2. Research codebase patterns
3. Create a structured plan with grouped tasks
4. Ask: Interactive or YOLO?
5. Execute the plan

## Modes

### Interactive Mode

Work through tasks one at a time with Pi:

```bash
ralph next    # Pi works on current task
ralph done    # Verify build, mark complete
ralph next    # Repeat
```

### YOLO Mode 🚀

Let Pi run through all tasks autonomously:

```bash
ralph yolo
# Type 'yolo' to confirm
# Pi runs non-interactively on each task
# Auto-commits after each successful build
# Stops on failure
# Runs codex review at end
```

**When to use YOLO:**
- Well-defined tasks with clear scope
- UI implementation from interview specs
- Mechanical refactoring
- Any plan where tasks are unambiguous

**Resume after failure:**
```bash
ralph status    # See where we stopped
ralph next      # Fix the issue interactively
ralph yolo      # Continue from current task
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

## Pi Integration

Ralph includes a Pi skill and custom tools for seamless integration.

### Skill: Create Ralph Loops

When you say "create a ralph loop for X", Pi will:

1. **Assess complexity** - Simple tasks get light interviews, complex ones get deep requirements gathering
2. **Research codebase** - Find relevant patterns before asking questions
3. **Interview** - Adaptive questions based on complexity
4. **Create plan** - Grouped tasks by phase/subsystem
5. **Execute** - Interactive or YOLO mode

### Custom Tools

| Tool | Purpose |
|------|---------|
| `ralph_status` | Get current plan progress |
| `ralph_init` | Initialize new ralph project |
| `ralph_create_plan` | Write complete plan file |
| `ralph_set_config` | Set build command and reminders |
| `ralph_launch` | Show command to launch execution |

### Installation for Pi

The skill and tools are installed to `~/.pi/agent/`:

```
~/.pi/agent/
├── skills/ralph/SKILL.md     # Skill instructions
└── tools/ralph/index.ts      # Custom tools
```

## Configuration

Create `.ralph/config` in your project:

```bash
# Build command (required for verification)
build=gj build ms

# Project reminders (injected into every task)
[reminders]
⚠️ Use SwiftUI only, not UIKit
⚠️ Run gj build ms, never xcodebuild
⚠️ Follow existing patterns in codebase
```

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
| `ralph yolo` | Run all tasks autonomously |
| `ralph note "msg"` | Add timestamped note |
| `ralph plan` | Open plan in editor |
| `ralph review` | Run codex review |

## Examples

### Simple Feature

```
User: "Create a ralph loop to add a refresh button"

Pi: Light interview → 3 tasks → Execute
```

### Complex Feature (Real Example: Media Server)

```
User: "Create a ralph loop for cloud sync UI"

Pi: 
1. Research existing UI patterns
2. Deep interview (8 questions about buttons, progress, badges)
3. Create plan with 25 tasks across 8 phases
4. YOLO mode → completes all tasks automatically
5. Codex review at end
```

## License

MIT
