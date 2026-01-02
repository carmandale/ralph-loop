# Ralph Loop - Requirements (v2 - Simplified)

## North Star Check ✓

> "The best code is no code. The second best is working code."

This tool should be **minimal**. No abstraction layers. No multi-provider plugins.
Just enough structure to keep an agent on track.

---

## What It Does

1. **Create a plan** (markdown file with checkboxes)
2. **Loop through tasks** (one at a time)
3. **Verify builds** (after each task)
4. **Get help when stuck** (Oracle or code review)

---

## Core Loop

```
ralph init "Add user authentication"
    ↓
Creates: .ralph/plans/001-add-user-auth.md
    ↓
ralph next
    ↓
Shows next unchecked task, launches Pi with context
    ↓
Pi works... you verify build works
    ↓
ralph done   # marks task complete
ralph stuck  # triggers help workflow
    ↓
Repeat until plan complete
```

---

## Agent Strategy (Simplified)

| Role | Tool | When |
|------|------|------|
| **Worker** | Pi | All development work |
| **Advisor** | Oracle (via pi skill) | Hard problems, architecture questions |
| **Reviewer** | `codex review` CLI | Code review before commits |

**No multi-agent orchestration.** Just three tools you call when needed.

---

## Plan Format

Plain markdown. No special schema.

```markdown
# Plan: Add User Authentication

## Context
[Brief description of what we're building]

## Tasks
- [ ] Create User model with email/password
- [ ] Add bcrypt for password hashing  
- [ ] Create login endpoint
- [ ] Create signup endpoint
- [ ] Add JWT token generation
- [ ] Add auth middleware
- [ ] Write tests

## Notes
[Learnings, decisions, blockers]
```

---

## Commands (MVP)

```bash
ralph init "description"  # Create new plan
ralph next                # Show next task, launch Pi with full context
ralph done                # Verify build, mark task complete
ralph stuck               # Get help (Oracle or codex review)
ralph status              # Show progress (4/7 tasks, 57%)
ralph note "message"      # Add timestamped note to plan
```

---

## Implementation

**Language**: Shell script (bash) for MVP. TypeScript later if needed.

**Storage**: `.ralph/` directory in project root
- `plans/` - markdown plan files
- `current` - symlink or file pointing to active plan

**Dependencies**: 
- `pi` (pi-coding-agent)
- `codex` (codex CLI) - optional, for reviews
- Oracle skill in pi - optional, for hard questions

---

## What We're NOT Building

- ❌ Multi-provider plugin system
- ❌ Complex automation modes  
- ❌ Structured plan schemas (JSON/YAML)
- ❌ Agent coordination layer
- ❌ Custom guard rails (use AGENTS.md)
- ❌ Beads integration (can add later if valuable)
- ❌ Git integration beyond what Pi already does

---

## Success Criteria

1. Can create a plan in under 30 seconds
2. Loop keeps agent focused on ONE task
3. Build verification catches drift
4. Help is one command away
5. **Total code < 500 lines**

---

## Gold Stars (DO NOT CUT)

See [GOLD-STARS.md](GOLD-STARS.md) for the seven features that make this magical:

1. ⭐ **Re-Read Loop** - Full context every iteration
2. ⭐ **One Task Focus** - No scope creep
3. ⭐ **Build Gate** - Must build to proceed
4. ⭐ **Stuck → Help** - Lower friction than hacking
5. ⭐ **THINK.ALIGN.ACT** - Discipline in prompts
6. ⭐ **Living Notes** - Capture decisions
7. ⭐ **Progress Visible** - Always know where you are

These are non-negotiable. Everything else can flex.
