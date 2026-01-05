# Commands

## ralph init

```bash
ralph init "Add user authentication"
```

Creates `.ralph/` structure and new plan file.

---

## ralph next

```bash
ralph next
```

Shows current task, offers to launch Pi with full context.

Options:
1. Launch Pi
2. Show context only
3. Copy to clipboard

---

## ralph done

```bash
ralph done
```

After build passes:
1. **Done + Commit** - Mark complete, commit changes
2. **Review first** - Run codex review, then complete
3. **Done (no commit)** - Mark complete only
4. **Back to Pi** - Keep working

---

## ralph stuck

```bash
ralph stuck
```

1. **Ask Oracle** - Hard problems
2. **Code Review** - Run codex review
3. **Show Plan** - Re-read context
4. **Add Note** - Capture learning
5. **Skip Task** - Mark skipped with reason

---

## ralph yolo

```bash
ralph yolo
```

Full auto mode:
- Runs Pi non-interactively (`pi -p`)
- Auto build verification
- Auto commit per task
- Codex review at end
- Stops on failure

Requires typing "yolo" to confirm.

---

## ralph review

```bash
ralph review
```

1. Uncommitted changes
2. Last N commits
3. Against a branch

---

## ralph status

```bash
ralph status
```

```
Plan: Add User Authentication
Progress: ████████░░░░ 4/7 (57%)

✓ Create User model
✓ Add password hashing
→ Create login endpoint  ← CURRENT
○ Create signup endpoint
○ Add JWT tokens
○ Add auth middleware
○ Write tests
```

---

## ralph list

```bash
ralph list
# or
ralph ls
```

Shows all plans in the project with progress:

```
═══════════════════════════════════════════════════════════════
RALPH - ALL PLANS
═══════════════════════════════════════════════════════════════

  1) Add User Authentication  [4/7 (57%)]  ← CURRENT
  2) API Rate Limiting  [0/5 (0%)]
  3) Database Migration  [12/12 (100%)]  ✓ complete

Use 'ralph switch <number>' to change active plan
```

---

## ralph switch

```bash
ralph switch        # Interactive - shows list, prompts for number
ralph switch 2      # Direct - switch to plan #2
ralph switch auth   # Fuzzy - switch to plan containing "auth"
```

Switch between multiple plans in the same project:

1. **By number** - Use plan number from `ralph list`
2. **Interactive** - Run without args to see list and choose
3. **By name** - Partial filename match

After switching, shows the new plan's status.

---

## ralph note

```bash
ralph note "Using bcrypt, not argon2"
```

Adds timestamped note to plan.

---

## ralph plan

```bash
ralph plan
```

Opens current plan in `$EDITOR`.
