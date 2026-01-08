# Design: Bulletproof File Tracking for Multi-Agent Commits

**Bead:** ralph-loop-7jf  
**Status:** Draft  
**Date:** 2026-01-08

## Problem Statement

In multi-agent scenarios, ralph commits files that other agents edited, attributing them to the wrong task:

1. Agent 1 runs ralph loop (Plan A, task 5)
2. Agent 2 does targeted fixes, edits FileX.swift
3. Agent 1 completes task 5 (which was a no-op verification task)
4. Ralph sees FileX.swift in `git diff`, commits it with "Task 5: ..." message
5. **Result:** Wrong attribution, misleading git history

Current change-aware logic (`ff93d7f`) only checks IF changes exist, not WHO made them.

## Requirements

1. **Track files per-agent** - Only commit files THIS agent edited during THIS task
2. **Per-plan isolation** - Support multiple plans running in same directory
3. **Zero agent burden** - Agent doesn't need to remember or report files
4. **Bulletproof** - Works automatically via tool interception, not self-reporting

## Solution: Pi-Agent Hook + Per-Plan Manifests

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Pi-Agent Session                                                │
│                                                                 │
│  ┌─────────────┐     ┌──────────────────────────────────────┐  │
│  │ edit tool   │────▶│ ralph-file-tracker.ts (hook)         │  │
│  │ write tool  │     │                                      │  │
│  └─────────────┘     │ 1. Read RALPH_PLAN env var           │  │
│                      │ 2. Append path to plan's manifest    │  │
│                      └──────────────────────────────────────┘  │
│                                     │                          │
│                                     ▼                          │
│                      ┌──────────────────────────────────────┐  │
│                      │ .ralph/manifests/<plan-name>.txt     │  │
│                      │                                      │  │
│                      │ src/FileA.swift                      │  │
│                      │ src/FileB.swift                      │  │
│                      └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ bin/ralph (commit phase)                                        │
│                                                                 │
│ 1. Read manifest for current plan                               │
│ 2. git add only those files                                     │
│ 3. git commit                                                   │
│ 4. Clear manifest for next task                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component 1: Hook (`~/.pi/agent/hooks/ralph-file-tracker.ts`)

```typescript
import type { HookAPI } from "@mariozechner/pi-coding-agent/hooks";
import * as fs from "node:fs";
import * as path from "node:path";

export default function (pi: HookAPI) {
  pi.on("tool_result", async (event, ctx) => {
    // Only track edit and write tools
    if (event.toolName !== "edit" && event.toolName !== "write") return;
    
    // Get plan name from env (set by ralph) or fall back to current file
    const planName = process.env.RALPH_PLAN || getPlanFromCurrentFile(ctx.cwd);
    if (!planName) return;  // Not in a ralph loop
    
    // Ensure manifests directory exists
    const manifestDir = path.join(ctx.cwd, ".ralph", "manifests");
    if (!fs.existsSync(manifestDir)) {
      fs.mkdirSync(manifestDir, { recursive: true });
    }
    
    // Append file path to manifest
    const filePath = event.input.path as string;
    const manifestPath = path.join(manifestDir, `${planName}.txt`);
    fs.appendFileSync(manifestPath, filePath + "\n");
  });
}

function getPlanFromCurrentFile(cwd: string): string | null {
  const currentFile = path.join(cwd, ".ralph", "current");
  if (!fs.existsSync(currentFile)) return null;
  
  const planPath = fs.readFileSync(currentFile, "utf-8").trim();
  // Extract plan name from path like ".ralph/plans/my-plan.md"
  const basename = path.basename(planPath, ".md");
  return basename;
}
```

### Component 2: Environment Variable in `bin/ralph`

Before each task execution:

```bash
# In yolo mode task loop, before invoking agent
plan_name=$(basename "$(get_current_plan)" .md)
export RALPH_PLAN="$plan_name"
```

### Component 3: Modified Commit Logic in `bin/ralph`

Replace current commit logic:

```bash
do_commit() {
    local task_num="$1"
    local total_count="$2"
    local task_text="$3"
    
    local plan_name=$(basename "$(get_current_plan)" .md)
    local manifest_file="$RALPH_DIR/manifests/${plan_name}.txt"
    
    # Check if manifest exists and has content
    if [[ ! -f "$manifest_file" ]] || [[ ! -s "$manifest_file" ]]; then
        info "No files tracked for this task - skipping commit"
        return 0
    fi
    
    # Stage only files from manifest (deduped)
    local staged_count=0
    while IFS= read -r file; do
        if [[ -n "$file" && -f "$file" ]]; then
            git add "$file" 2>/dev/null && ((staged_count++))
        fi
    done < <(sort -u "$manifest_file")
    
    if [[ $staged_count -eq 0 ]]; then
        info "No tracked files exist - skipping commit"
        rm -f "$manifest_file"
        return 0
    fi
    
    # Commit staged files
    local msg="Task $task_num/$total_count: $task_text"
    if git commit -m "$msg" 2>/dev/null; then
        success "Committed $staged_count file(s)"
    else
        info "Nothing to commit (files unchanged)"
    fi
    
    # Clear manifest for next task
    rm -f "$manifest_file"
}
```

### Directory Structure

```
.ralph/
├── config.yaml
├── current                    # Points to active plan
├── plans/
│   ├── phase-1-setup.md
│   ├── phase-2-features.md
│   └── phase-3-polish.md
└── manifests/                 # NEW
    ├── phase-1-setup.txt      # Files touched while this plan active
    ├── phase-2-features.txt
    └── phase-3-polish.txt
```

## Behavior Matrix

| Scenario | Manifest | Commit Result |
|----------|----------|---------------|
| Task edits FileA, FileB | Contains FileA, FileB | Commits both |
| Task is no-op (verification) | Empty | Skips commit |
| Agent 2 edits FileX (no ralph) | Not in manifest | Ignored |
| Agent 2 edits FileX (different plan) | In different manifest | Ignored |
| bash creates file (edge case) | Not tracked | Not committed |

## Edge Cases

### Bash File Creation

If agent does `bash echo "x" > file.txt`, the hook won't catch it. This is acceptable because:
- Real code changes go through `edit`/`write` tools
- Bash file creation is rare for source code
- Could add bash output parsing later if needed

### Plan Switch Mid-Task

If user switches plans while a task is running:
- Environment variable `RALPH_PLAN` is set at task START
- Hook writes to the correct manifest based on env var
- Even if `.ralph/current` changes, tracking stays correct

### Concurrent Plans (Same Directory)

Two agents running different plans simultaneously:
- Each sets its own `RALPH_PLAN` env var
- Each writes to its own manifest
- No collision

## Implementation Plan

1. **Create hook** - `~/.pi/agent/hooks/ralph-file-tracker.ts` (or project-local)
2. **Add env var export** - In `bin/ralph` yolo mode task loop
3. **Replace commit logic** - Use manifest-based commit in `do_commit()`
4. **Add manifests to .gitignore** - `.ralph/manifests/`
5. **Test scenarios** - Single agent, multi-agent, plan switching

## Open Questions

1. Should hook be global (`~/.pi/agent/hooks/`) or project-local (`.pi/hooks/`)?
   - **Recommendation:** Ship as global hook, works for all ralph loops

2. Should we track bash file operations?
   - **Recommendation:** Not for v1, add if needed

3. What about `read` tool? Track files read for context?
   - **Recommendation:** No, only track writes
