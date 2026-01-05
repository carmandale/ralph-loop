---
name: ralph
description: Create and run Ralph loops for structured AI-driven development. Triggered by "create a ralph loop for X" or "ralph plan for X". Uses interview to clarify requirements, creates phased task plans, and optionally runs in YOLO mode for autonomous execution.
---

# Ralph Loop Skill

Create structured development plans and execute them with focused, one-task-at-a-time loops.

## When to Use

- User says "create a ralph loop for..."
- User says "ralph plan for..." or "yolo this feature..."
- User has a feature, bug fix, or improvement that needs structured execution
- User wants autonomous (YOLO) or interactive task execution

## Workflow Overview

```
1. Understand the request
       ↓
2. Assess complexity → Light vs Deep interview
       ↓
3. Research codebase if needed
       ↓
4. Interview to clarify requirements
       ↓
5. Create plan with grouped tasks
       ↓
6. Ask: Interactive or YOLO?
       ↓
7. Execute (ralph next or ralph yolo)
```

## Input Types Supported

| Input | How to Handle |
|-------|---------------|
| Natural language description | Parse intent, identify scope |
| Existing plan/spec file | Read file, extract tasks |
| Bead ID | Run `bd show <id>` to get context |
| Codebase analysis needed | Research patterns before planning |

## Step 1: Assess Complexity

**Simple tasks** (1-5 tasks, clear scope):
- Light interview: just confirm approach
- Example: "add a button to refresh data"

**Medium tasks** (5-15 tasks, some ambiguity):
- Medium interview: clarify key decisions
- Example: "add user authentication"

**Complex tasks** (15+ tasks, multiple subsystems):
- Deep interview: full requirements gathering
- Example: "add cloud sync with UI for stale detection"

## Step 2: Research (if needed)

Before interviewing, understand the codebase:

```bash
# Find relevant files
rg -l "keyword" --type swift
ast-grep run -l Swift -p 'func $NAME($_) async'

# Check existing patterns
ls -la path/to/relevant/code/
```

Use findings to inform interview questions.

## Step 3: Interview

Use the interview tool with questions tailored to complexity level.

### Light Interview Template

```json
{
  "title": "Quick Clarification: [Feature Name]",
  "description": "Quick questions before I create the plan.",
  "questions": [
    {
      "id": "approach",
      "type": "single",
      "question": "I'm thinking [approach]. Sound right?",
      "options": ["Yes, proceed", "No, let me explain", "You decide"],
      "recommended": "Yes, proceed"
    },
    {
      "id": "scope",
      "type": "single", 
      "question": "Should I include tests?",
      "options": ["Yes - unit tests", "Yes - integration tests", "No tests needed"],
      "recommended": "Yes - unit tests"
    }
  ]
}
```

### Medium Interview Template

```json
{
  "title": "Plan: [Feature Name]",
  "description": "Help me understand the requirements.",
  "questions": [
    {
      "id": "location",
      "type": "single",
      "question": "Where should [feature] appear?",
      "options": ["Option A", "Option B", "Both", "You decide"],
      "context": "Based on existing code, Option A follows current patterns."
    },
    {
      "id": "behavior",
      "type": "single",
      "question": "When [event], should it [action A] or [action B]?",
      "options": ["Action A", "Action B", "Configurable"]
    },
    {
      "id": "edge-cases",
      "type": "text",
      "question": "Any edge cases I should handle?"
    }
  ]
}
```

### Deep Interview Template

See Media Server Phase 4 as the gold standard:
- Specific questions for each subsystem
- UI placement, behavior, error handling
- Multiple-choice with recommendations
- Context explaining trade-offs

## Step 4: Create Plan

After interview, create a ralph plan:

```bash
cd /path/to/project

# Initialize if needed
[[ -d .ralph ]] || ralph init "Feature description"

# Create plan file
cat > .ralph/plans/YYYYMMDD-HHMMSS-feature-name.md << 'EOF'
# Plan: Feature Name

## Context

[What we're building and why]

**Interview responses (YYYY-MM-DD):**
- Question 1: Answer
- Question 2: Answer

## Tasks

### Phase 1: Foundation
- [ ] Task 1.1: Description
- [ ] Task 1.2: Description

### Phase 2: Core Implementation
- [ ] Task 2.1: Description
- [ ] Task 2.2: Description

### Phase 3: Integration
- [ ] Task 3.1: Description

## Guidelines

[Project-specific rules from interview or codebase]

## Notes

- YYYY-MM-DD: Plan created from interview
EOF

# Set as current plan
echo ".ralph/plans/YYYYMMDD-HHMMSS-feature-name.md" > .ralph/current
```

### Task Grouping Principles

- Group by phase/subsystem (like Phase 4 UI)
- 3-7 tasks per group
- Tasks should be completable in one Pi session
- Each task = one focused change, verifiable by build

### CRITICAL: Task Writing Rules

**The #1 cause of YOLO failures is incomplete task descriptions.**

❌ BAD: "Create SyncConsolePanel view"
✅ GOOD: "Create SyncConsolePanel view AND replace SyncProgressView with it in MainSplitView.swift"

❌ BAD: "Add drag handle"  
✅ GOOD: "Add drag handle to SyncConsolePanel that resizes the panel"

**Every task that creates something must also integrate it:**
- Creating a view? → Specify WHERE it gets used
- Creating a model? → Specify WHAT consumes it
- Adding a function? → Specify WHO calls it

**Separate "create" from "integrate" when complex:**
```
- [ ] 4a. Create SyncConsolePanel view with drag handle and ETA header
- [ ] 4b. Replace SyncProgressView with SyncConsolePanel in MainSplitView.swift
- [ ] 4c. Verify: Panel slides up from bottom when sync starts
```

**Add verification tasks for UI changes:**
```
- [ ] Verify: New panel appears at bottom (not floating)
- [ ] Verify: Drag handle resizes panel
- [ ] Verify: ⌘⇧C toggles panel visibility
```

Build passing ≠ Feature working. Verification tasks catch this.

## Step 5: Ask Mode

Present the choice:

```
Plan created with X tasks across Y phases.

How should we proceed?
1. **Interactive** - I'll work with you task by task (ralph next)
2. **YOLO** - Run all tasks autonomously (ralph yolo)
3. **Review first** - Open the plan for editing before starting
```

## Step 6: Execute

### Interactive Mode

```bash
ralph next
# Pi works on task
# User says "done" or "ralph done"
# Repeat
```

### YOLO Mode

```bash
ralph yolo
# Type 'yolo' to confirm
# Pi runs non-interactively on each task
# Auto-commits after each successful build
# Stops on failure
# Runs codex review at end
```

### Resume After Failure

```bash
ralph status    # See where we stopped
ralph next      # Fix the issue interactively
ralph yolo      # Continue YOLO from current task
```

## Configuration

Ensure `.ralph/config` has correct settings:

```bash
# Build command
build=gj build ms

# Project reminders (injected into every task)
[reminders]
⚠️ Use SwiftUI only, not UIKit
⚠️ Run gj build ms, never xcodebuild
⚠️ Follow existing patterns in codebase
```

## Examples

### Example 1: Simple Feature

User: "create a ralph loop to add a refresh button"

1. Light interview (confirm placement)
2. 3 tasks: add button, wire action, test
3. Ask: Interactive or YOLO?
4. Execute

### Example 2: Complex Feature (Media Server Phase 4)

User: "create a ralph loop for cloud sync UI"

1. Research existing UI patterns
2. Deep interview (8 questions about button placement, progress, badges, etc.)
3. 25 tasks across 8 phases
4. YOLO mode → completes all tasks automatically
5. Codex review at end

## Key Principles

1. **Don't over-engineer** - Match plan complexity to task complexity
2. **Interview before planning** - Don't guess, ask
3. **Grouped tasks** - Logical phases, not flat lists
4. **Build verification** - Every task must pass build
5. **YOLO is powerful** - Use it for well-defined work
6. **Resume gracefully** - Failures are recoverable
