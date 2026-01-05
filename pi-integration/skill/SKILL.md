---
name: ralph
description: Create and run Ralph loops for structured AI-driven development. Triggered by "create a ralph loop for X" or "ralph plan for X". Uses interview to clarify requirements, creates phased task plans, and optionally runs in YOLO mode for autonomous execution.
---

# Ralph Loop Skill

Create bulletproof development plans that execute reliably in YOLO mode.

## Trigger Phrases

- "create a ralph loop for..."
- "ralph plan for..."
- "yolo this feature..."
- "make a ralph loop and start with an interview"

## The Bulletproof Process

```
1. RESEARCH    - Understand the codebase before asking questions
       ↓
2. INTERVIEW   - Gather requirements with specific, actionable questions
       ↓
3. DESIGN      - Define the architecture and file changes
       ↓
4. PLAN        - Write atomic, complete tasks with verification
       ↓
5. REVIEW      - Present plan to user for approval
       ↓
6. EXECUTE     - ralph yolo or ralph next
```

---

## Phase 1: RESEARCH (Required)

**Before creating ANY interview, understand the codebase.**

### What to Research

1. **Find existing patterns** - How does similar functionality work?
2. **Identify files to modify** - What will change?
3. **Understand the architecture** - Where does this fit?
4. **Note naming conventions** - Match existing style

### Research Commands

```bash
# Find relevant files
rg -l "keyword" --type swift
find . -name "*.swift" -path "*/Views/*" | head -20

# Understand existing patterns  
rg -A5 "struct.*View.*:" --type swift | head -50

# Check file structure
tree -L 3 path/to/relevant/code/

# Read key files
cat path/to/existing/similar/feature.swift | head -100
```

### Research Output

Document findings before interview:
```
## Research Findings

**Existing patterns:**
- Views are in Features/*/Views/
- State is in Features/*/State/
- Uses @Observable pattern

**Files that will change:**
- MainSplitView.swift (add new component)
- SomeState.swift (add new property)

**Files to create:**
- NewFeatureView.swift
- NewFeatureState.swift

**Naming conventions:**
- Views: SomethingView.swift
- State: SomethingState.swift
```

---

## Phase 2: INTERVIEW (Required)

**Use the interview tool to gather requirements. Never guess.**

### Interview Question Categories

Every interview MUST cover:

1. **Scope** - What exactly are we building?
2. **Location** - Where does it appear/integrate?
3. **Behavior** - How does it work?
4. **Edge Cases** - What could go wrong?
5. **Acceptance** - How do we know it's done?

### Interview Template

```json
{
  "title": "Ralph Plan: [Feature Name]",
  "description": "I've researched the codebase. Help me understand the requirements.\n\n**What I found:**\n[Brief research summary]",
  "questions": [
    {
      "id": "scope",
      "type": "single",
      "question": "What exactly should this feature do?",
      "options": ["Option A (describe)", "Option B (describe)", "Both", "Something else (explain below)"],
      "context": "Based on my research, [context]"
    },
    {
      "id": "scope_details",
      "type": "text",
      "question": "Any additional scope details?",
      "required": false
    },
    {
      "id": "location",
      "type": "single",
      "question": "Where should [feature] appear?",
      "options": ["Location A", "Location B", "New location"],
      "context": "Currently, similar features are in [location]"
    },
    {
      "id": "behavior_primary",
      "type": "single",
      "question": "When [trigger], what should happen?",
      "options": ["Behavior A", "Behavior B", "Configurable"]
    },
    {
      "id": "behavior_secondary",
      "type": "single",
      "question": "[Follow-up behavior question]?",
      "options": ["Option A", "Option B", "Option C"]
    },
    {
      "id": "edge_cases",
      "type": "multi",
      "question": "Which edge cases should I handle?",
      "options": ["Error state", "Empty state", "Loading state", "Offline mode", "Other (specify)"]
    },
    {
      "id": "edge_case_details",
      "type": "text",
      "question": "Any specific edge case handling?",
      "required": false
    },
    {
      "id": "acceptance",
      "type": "text",
      "question": "How will you verify this works correctly?",
      "context": "Describe what you'll test or look for"
    },
    {
      "id": "constraints",
      "type": "text",
      "question": "Any constraints or requirements I should know?",
      "required": false
    }
  ]
}
```

### Interview Rules

1. **Include research context** - Show what you learned
2. **Offer specific options** - Not vague "what do you want?"
3. **Include recommendations** - Guide the user
4. **Ask about acceptance** - How do we know it's done?
5. **Allow freeform input** - For details you didn't anticipate

---

## Phase 3: DESIGN (Required)

**After interview, design the solution before writing tasks.**

### Design Document Template

```markdown
## Design: [Feature Name]

### Interview Summary
- Scope: [answer]
- Location: [answer]
- Behavior: [answer]
- Edge cases: [answer]
- Acceptance: [answer]

### Architecture

**New files to create:**
| File | Purpose |
|------|---------|
| NewView.swift | Main UI component |
| NewState.swift | State management |

**Files to modify:**
| File | Changes |
|------|---------|
| MainSplitView.swift | Add NewView to layout |
| AppState.swift | Add newState property |

**Integration points:**
- NewView will be added to MainSplitView in the detail area
- NewState will be owned by AppState
- NewView observes NewState via @Environment

### UI Mockup (if applicable)
```
┌─────────────────────────────────────┐
│  [Existing UI]                      │
├─────────────────────────────────────┤
│  [New Feature Here]                 │
│  - Element A                        │
│  - Element B                        │
└─────────────────────────────────────┘
```

### Verification Checklist
- [ ] Feature appears in correct location
- [ ] Primary behavior works
- [ ] Edge cases handled
- [ ] User acceptance criteria met
```

---

## Phase 4: PLAN (Critical)

**Write tasks that are atomic, complete, and verifiable.**

### Task Anatomy

Every task MUST have:

1. **WHAT** - The specific change to make
2. **WHERE** - The exact file(s) to modify
3. **HOW** - Brief implementation approach
4. **VERIFY** - How to confirm it worked

### Task Writing Rules

#### Rule 1: Atomic = One Concern

❌ BAD: "Add sync panel with drag handle and animations"
✅ GOOD: Three separate tasks

#### Rule 2: Complete = Create + Integrate

❌ BAD: "Create SyncConsolePanel view"
✅ GOOD: "Create SyncConsolePanel view in SharedUI/Common/ AND replace SyncProgressView with it in MainSplitView.swift"

#### Rule 3: Specific Files Named

❌ BAD: "Add the button to the toolbar"
✅ GOOD: "Add refresh button to toolbar in MediaOrganizationView.swift toolbarContent"

#### Rule 4: Verification Included

❌ BAD: "Add drag handle"
✅ GOOD: "Add drag handle to panel. VERIFY: Dragging handle resizes panel height"

### Task Templates

**For creating a new view:**
```
- [ ] Create [ViewName] in [path/to/file.swift]
      - Structure: [brief description]
      - VERIFY: File compiles, preview renders
      
- [ ] Integrate [ViewName] into [ParentView] in [path/to/parent.swift]
      - Replace/add to: [specific location in parent]
      - VERIFY: View appears in correct location when [trigger]
```

**For modifying behavior:**
```
- [ ] Update [function/property] in [file.swift]
      - Change: [what changes]
      - VERIFY: [how to test]
```

**For adding state:**
```
- [ ] Add [property] to [StateClass] in [file.swift]
      - Type: [type]
      - Default: [value]
      
- [ ] Wire [property] to UI in [View.swift]
      - Binding/observation: [how]
      - VERIFY: Changing state updates UI
```

### Plan Structure

```markdown
# Plan: [Feature Name]

## Context
[What we're building and why]

## Interview Responses ([date])
- Scope: [answer]
- Location: [answer]
- Behavior: [answer]

## Design
[Key architecture decisions from design phase]

## Tasks

### Phase 1: Foundation
- [ ] 1.1 [Task with WHAT, WHERE, VERIFY]
- [ ] 1.2 [Task with WHAT, WHERE, VERIFY]

### Phase 2: Core Implementation  
- [ ] 2.1 [Task with WHAT, WHERE, VERIFY]
- [ ] 2.2 [Task with WHAT, WHERE, VERIFY]

### Phase 3: Integration
- [ ] 3.1 [Task with WHAT, WHERE, VERIFY]

### Phase 4: Verification
- [ ] 4.1 VERIFY: [Acceptance criteria 1]
- [ ] 4.2 VERIFY: [Acceptance criteria 2]

## Success Criteria
- [ ] [Criterion 1 from interview]
- [ ] [Criterion 2 from interview]

## Files Changed
| File | Action |
|------|--------|
| path/to/new.swift | CREATE |
| path/to/existing.swift | MODIFY |
```

---

## Phase 5: REVIEW (Required)

**Present the plan to the user before execution.**

### Review Checklist

Before presenting, verify:

- [ ] Every "create" task has a corresponding "integrate" task
- [ ] Every task names specific files
- [ ] Every task has a VERIFY step
- [ ] Phase 4 has explicit verification tasks
- [ ] Success criteria match interview answers
- [ ] Files Changed table is complete

### Review Prompt

```
## Plan Review: [Feature Name]

I've created a plan with [N] tasks across [M] phases.

**Summary:**
- Phase 1: [description] ([n] tasks)
- Phase 2: [description] ([n] tasks)
- Phase 3: [description] ([n] tasks)
- Phase 4: Verification ([n] tasks)

**Files to create:** [list]
**Files to modify:** [list]

**Key decisions from interview:**
- [decision 1]
- [decision 2]

**How to proceed:**
1. **Review plan** - I'll show you the full plan
2. **Edit plan** - Open in editor to adjust
3. **YOLO** - Run all tasks autonomously
4. **Interactive** - Work task by task

Which would you like?
```

---

## Phase 6: EXECUTE

### YOLO Mode (Recommended for well-planned work)

```bash
ralph yolo
# Type 'yolo' to confirm
# Runs all tasks non-interactively
# Auto-commits each task
# Runs codex review at end
```

### Interactive Mode

```bash
ralph next
# Work on one task at a time
# User confirms each completion
```

### On Failure

```bash
ralph status    # See where we stopped
ralph next      # Fix interactively
ralph yolo      # Continue from current task
```

---

## Anti-Patterns (DO NOT DO)

| Anti-Pattern | Why It Fails |
|--------------|--------------|
| Skipping research | Questions are vague, plan is wrong |
| Skipping interview | Assumptions lead to rework |
| "Create X" without integration | Component built but never used |
| No file paths in tasks | Agent guesses wrong location |
| No verification tasks | Feature broken but marked done |
| Huge tasks | Too much scope, partial completion |
| No success criteria | No way to know if done |

---

## Example: Complete Flow

**User:** "Create a ralph loop for adding a refresh button to the toolbar"

### 1. Research
```bash
rg -l "toolbar" --type swift
# Found: MediaOrganizationView.swift has toolbarContent
cat "path/to/MediaOrganizationView.swift" | grep -A20 "toolbarContent"
# Found: Uses ToolbarItemGroup pattern
```

### 2. Interview
```json
{
  "title": "Ralph Plan: Toolbar Refresh Button",
  "questions": [
    {
      "id": "location",
      "type": "single", 
      "question": "Where should the refresh button appear?",
      "options": ["Left toolbar group (with sidebar toggle)", "Right toolbar group (with other actions)", "New dedicated group"],
      "context": "Currently MediaOrganizationView.swift has left nav group and right action group"
    },
    {
      "id": "behavior",
      "type": "single",
      "question": "What should refresh do?",
      "options": ["Reload file list only", "Reload + re-scan for new files", "Full library rebuild"]
    },
    {
      "id": "feedback",
      "type": "single",
      "question": "How should refresh show progress?",
      "options": ["Spinning icon", "Progress overlay", "Toast notification", "No feedback needed"]
    }
  ]
}
```

### 3. Design
```markdown
## Design: Toolbar Refresh Button

### Interview Summary
- Location: Right toolbar group
- Behavior: Reload + re-scan
- Feedback: Spinning icon during refresh

### Files to modify
| File | Changes |
|------|---------|
| MediaOrganizationView.swift | Add refresh button to toolbarContent |
| MediaLibraryState.swift | Add isRefreshing property |
```

### 4. Plan
```markdown
# Plan: Toolbar Refresh Button

## Tasks

### Phase 1: State
- [ ] 1.1 Add `isRefreshing: Bool` to MediaLibraryState.swift
      - Default: false
      - VERIFY: Property exists, compiles

### Phase 2: UI
- [ ] 2.1 Add refresh button to toolbarContent in MediaOrganizationView.swift
      - Location: ToolbarItemGroup(placement: .automatic) 
      - Icon: arrow.clockwise (spinning when isRefreshing)
      - Action: Call state.refreshLibrary()
      - VERIFY: Button appears in toolbar

### Phase 3: Behavior
- [ ] 3.1 Update refreshLibrary() in MediaLibraryState.swift
      - Set isRefreshing = true at start
      - Set isRefreshing = false at end
      - VERIFY: Icon spins during refresh

### Phase 4: Verification
- [ ] 4.1 VERIFY: Button appears in right toolbar group
- [ ] 4.2 VERIFY: Clicking refreshes file list
- [ ] 4.3 VERIFY: Icon spins during refresh

## Success Criteria
- [ ] Refresh button visible in toolbar
- [ ] Clicking triggers file rescan
- [ ] Visual feedback during operation
```

### 5. Review & Execute
```
Plan created with 6 tasks across 4 phases.
Ready to proceed with YOLO mode?
```

---

## Key Principles

1. **Research first** - Understand before asking
2. **Interview always** - Never assume requirements
3. **Design before tasks** - Architecture drives implementation
4. **Atomic + Complete** - One thing, fully integrated
5. **Verify everything** - Build passing ≠ feature working
6. **Review before execute** - Catch issues before YOLO
