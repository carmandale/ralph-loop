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

## Solution: Pi-Agent Hook + Per-Plan/Task/Session Manifests

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Pi-Agent Session                                                │
│                                                                 │
│  ┌─────────────┐     ┌──────────────────────────────────────┐  │
│  │ edit tool   │────▶│ ralph-file-tracker.ts (hook)         │  │
│  │ write tool  │     │                                      │  │
│  └─────────────┘     │ 1. Read RALPH_MANIFEST env var       │  │
│                      │ 2. Append path to session manifest   │  │
│                      └──────────────────────────────────────┘  │
│                                     │                          │
│                                     ▼                          │
│                      ┌──────────────────────────────────────┐  │
│                      │ .ralph/manifests/<plan>/task-<n>/    │  │
│                      │   <session>.txt                      │  │
│                      │                                      │  │
│                      │ src/FileA.swift                      │  │
│                      │ src/FileB.swift                      │  │
│                      └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ bin/ralph (commit phase)                                        │
│                                                                 │
│ 1. Read manifest for current task/session                       │
│ 2. git add only those files                                     │
│ 3. git commit                                                   │
│ 4. Clear manifest after commit                                  │
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
    
    if (process.env.RALPH_TRACKING !== "1") return;
    const manifestPath = process.env.RALPH_MANIFEST;
    const repoRoot = process.env.RALPH_ROOT;
    if (!manifestPath || !repoRoot) return;

    const manifestDir = path.dirname(manifestPath);
    fs.mkdirSync(manifestDir, { recursive: true });

    const filePath = event.input.path as string;
    const relPath = normalizeToRepoRelative(repoRoot, filePath, ctx.cwd);
    if (!relPath) return;
    fs.appendFileSync(manifestPath, relPath + "\n");
  });
}

function normalizeToRepoRelative(repoRoot: string, rawPath: string, cwd: string): string | null {
  const abs = path.isAbsolute(rawPath) ? rawPath : path.resolve(cwd, rawPath);
  const normalizedRoot = path.resolve(repoRoot);
  const normalizedPath = path.resolve(abs);
  if (!normalizedPath.startsWith(normalizedRoot + path.sep)) return null;
  return path.relative(normalizedRoot, normalizedPath);
}
```

Hook contract (no fallback):
- Only track when `RALPH_TRACKING=1`
- Requires `RALPH_MANIFEST` (full path) and `RALPH_ROOT`
- Stores repo-root-relative paths, one per line

### Component 2: Environment Variables in `bin/ralph`

Before each task execution:

```bash
# Before invoking agent
export RALPH_TRACKING=1
export RALPH_ROOT="$(git rev-parse --show-toplevel)"
export RALPH_PLAN="$(basename "$(get_current_plan)" .md)"
export RALPH_TASK_NUM="$task_num"
export RALPH_SESSION="$(uuidgen)"
export RALPH_MANIFEST="$RALPH_ROOT/.ralph/manifests/$RALPH_PLAN/task-$RALPH_TASK_NUM/$RALPH_SESSION.txt"
```

### Component 3: Modified Commit Logic in `bin/ralph`

Replace current commit logic:

```bash
do_commit() {
    local task_num="$1"
    local total_count="$2"
    local task_text="$3"
    
    local manifest_file="$(get_manifest_file_for_task "$task_num")"
    
    # Check if manifest exists and has content
    if [[ ! -f "$manifest_file" ]] || [[ ! -s "$manifest_file" ]]; then
        info "No files tracked for this task - skipping commit"
        return 0
    fi
    
    # Stage only files from manifest (deduped)
    git reset
    local staged_count=0
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        git add -A -- "$file" 2>/dev/null && ((staged_count++))
    done < <(sort -u "$manifest_file")
    
    if [[ $staged_count -eq 0 ]]; then
        info "No tracked files exist - skipping commit"
        rm -f "$manifest_file"
        return 0
    fi
    
    if git diff --cached --quiet; then
        info "Nothing to commit (tracked files unchanged)"
        return 0
    fi

    # Commit staged files
    local msg="Task $task_num/$total_count: $task_text"
    if git commit -m "$msg" 2>/dev/null; then
        success "Committed $staged_count file(s)"
    else
        info "Nothing to commit (files unchanged)"
    fi
    
    # Clear manifest after successful commit
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
├── active-session             # plan|task|session|manifest (text)
└── manifests/                 # NEW
    └── phase-1-setup/
        └── task-1/
            └── <session>.txt
```

## Behavior Matrix

| Scenario | Manifest | Commit Result |
|----------|----------|---------------|
| Task edits FileA, FileB | Contains FileA, FileB | Commits both |
| Task is no-op (verification) | Empty | Skips commit |
| Agent 2 edits FileX (no ralph) | Not in manifest | Ignored |
| Agent 2 edits FileX (different plan) | In different manifest | Ignored |
| Two agents on same task | Different sessions | No collision |
| bash creates file (edge case) | Not tracked | Not committed |

## Edge Cases

### Bash File Creation

If agent does `bash echo "x" > file.txt`, the hook won't catch it. This is acceptable because:
- Real code changes go through `edit`/`write` tools
- Bash file creation is rare for source code
- Could add bash output parsing later if needed

### Plan Switch Mid-Task

If user switches plans while a task is running:
- Environment variables are set at task START
- Hook writes to the session manifest defined by `RALPH_MANIFEST`
- Even if `.ralph/current` changes, tracking stays correct

### Concurrent Tasks (Same Directory)

Two agents running the same plan/task simultaneously:
- Each sets its own `RALPH_SESSION` and `RALPH_MANIFEST`
- Manifests never collide

## Implementation Plan

1. **Create hook** - `~/.pi/agent/hooks/ralph-file-tracker.ts` (or project-local)
2. **Add env var export** - In `bin/ralph` task launch
3. **Track active session** - `.ralph/active-session` for continue runs
4. **Replace commit logic** - Use manifest-based commit in `do_commit()`
5. **Add manifests to .gitignore** - `.ralph/manifests/`
6. **Test scenarios** - Single agent, multi-agent, plan switching

## Open Questions

1. Should hook be global (`~/.pi/agent/hooks/`) or project-local (`.pi/hooks/`)?
   - **Recommendation:** Ship as global hook, works for all ralph loops

2. Should we track bash file operations?
   - **Recommendation:** Not for v1, add if needed

3. What about `read` tool? Track files read for context?
   - **Recommendation:** No, only track writes

## Verification Notes

Manual scenarios run in a temporary repo using a stub `pi` command that wrote
to `RALPH_MANIFEST` (hook execution not verified against a live Pi session):

- Single-agent task committed only the tracked file.
- No-op task produced no commit.
- Foreign (untracked) change remained uncommitted.
- YOLO multi-task produced one commit per task (plus init commit).
- Deletion staged correctly (`git show --name-status` showed `D`).
