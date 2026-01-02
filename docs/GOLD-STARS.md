# Ralph Loop - Gold Stars ⭐

The features that make this actually useful. Don't simplify these away.

---

## ⭐ 1. The Re-Read Loop

**The Magic**: Agent re-reads the plan before EVERY task.

**Why It Matters**: Agents drift because they lose context. After 10 back-and-forths, they've forgotten the original goal. Re-reading the plan each iteration is like a "memory refresh" that prevents drift.

**Implementation**: When `ralph next` launches Pi, it includes:
- The full plan
- What's done so far
- What's next
- Any notes/decisions made

```
You are continuing work on this plan:

# Plan: Add User Authentication
[full plan content]

## Progress
✓ Task 1 - done
✓ Task 2 - done  
→ Task 3 - YOU ARE HERE
○ Task 4 - next
○ Task 5 - later

Focus ONLY on Task 3. Do not proceed to Task 4.
```

---

## ⭐ 2. One Task, One Focus

**The Magic**: Agent works on exactly ONE task at a time.

**Why It Matters**: Agents try to be "helpful" by doing more. They see Task 3 and think "while I'm here, let me also do Task 4 and refactor this other thing." This creates chaos.

**Implementation**: 
- Plan shows ONE current task clearly
- Instructions explicitly say "do NOT proceed to next task"
- `ralph done` is the ONLY way to advance

---

## ⭐ 3. Build Verification Gate

**The Magic**: Code must build before marking task done.

**Why It Matters**: "It works on my machine" syndrome. Agents make changes that seem fine but break the build. Catching this per-task (not at the end) means problems are small and fixable.

**Implementation**:
```bash
ralph done
# Runs: npm run build / cargo build / make / etc.
# If build fails: "Build failed. Fix before marking done."
# If build passes: "✓ Task complete. Build verified."
```

---

## ⭐ 4. Stuck → Help, Not Quick Fix

**The Magic**: Clear escape hatch that routes to help instead of hacks.

**Why It Matters**: When agents get stuck, they do quick fixes, workarounds, TODO comments. These accumulate into technical debt. The `ralph stuck` command makes "get help" easier than "hack around it."

**Implementation**:
```bash
ralph stuck

What kind of help do you need?
1. Architecture/design question → Ask Oracle
2. Code review / second opinion → Run codex review  
3. Clarify requirements → Show plan, ask user
4. Just need a break → Save state, exit

Choice: _
```

**Key Insight**: The friction to get help must be LOWER than the friction to hack.

---

## ⭐ 5. THINK.ALIGN.ACT in Context

**The Magic**: Every task prompt includes the discipline protocol.

**Why It Matters**: Agents rush. They see a task and immediately start coding. Including THINK.ALIGN.ACT in the prompt forces them to slow down.

**Implementation**: Task prompt includes:
```
Before acting, follow THINK.ALIGN.ACT:

THINK: Do you understand this task? What files are involved?
ALIGN: Is this a significant change? If so, describe your plan first.
ACT: Only proceed after thinking and aligning.

If you're uncertain about anything, say so. Don't guess.
```

---

## ⭐ 6. Living Plan with Notes

**The Magic**: Plan captures decisions and learnings, not just tasks.

**Why It Matters**: "Why did we do it this way?" Future-you (or future-agent) needs context. The Notes section is institutional memory.

**Implementation**:
```markdown
## Notes
- 2024-01-15: Decided to use JWT instead of sessions because [reason]
- 2024-01-15: User model needs soft delete, discovered during Task 2
- 2024-01-16: Oracle recommended bcrypt over argon2 for compatibility
```

`ralph note "message"` appends timestamped notes.

---

## ⭐ 7. Progress Visibility

**The Magic**: Always know where you are.

**Why It Matters**: Long tasks feel endless. Seeing "4/7 tasks done" provides momentum and clarity.

**Implementation**:
```bash
ralph status

Plan: Add User Authentication
Progress: ████████░░░░ 4/7 (57%)

✓ Create User model
✓ Add bcrypt  
✓ Create login endpoint
✓ Create signup endpoint
→ Add JWT token generation  ← CURRENT
○ Add auth middleware
○ Write tests

Time on current task: 23 minutes
Last note: "Oracle recommended bcrypt over argon2"
```

---

## Summary: The Magic Formula

```
Re-read Plan → One Task → Execute with Discipline → Verify Build → Get Help if Stuck → Repeat
```

**Strip away everything else, but keep these seven gold stars.**

| Gold Star | One-liner |
|-----------|-----------|
| Re-Read Loop | Agent sees full context every iteration |
| One Task Focus | Do this, nothing else |
| Build Gate | Must build to proceed |
| Stuck → Help | Lower friction to ask than to hack |
| THINK.ALIGN.ACT | Discipline baked into prompts |
| Living Notes | Decisions captured for posterity |
| Progress Visible | Always know where you are |
