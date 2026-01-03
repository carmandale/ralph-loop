# Plans

## Structure

Plans are markdown files in `.ralph/plans/`.

```markdown
# Plan: Add User Authentication

## Context
What you're building and why.

## Tasks
- [ ] Create User model
- [ ] Add password hashing
- [ ] Create login endpoint
- [ ] Write tests

## Notes
- 2026-01-03: Plan created
```

## Task Format

```markdown
- [ ] Pending task
- [x] Completed task
```

That's it. Ralph parses checkboxes.

## Notes

Add notes with:
```bash
ralph note "Decided to use JWT instead of sessions"
```

Appends timestamped entry:
```markdown
## Notes
- 2026-01-03: Decided to use JWT instead of sessions
```

## Multiple Plans

Create multiple plans:
```bash
ralph init "Feature A"
ralph init "Feature B"
```

Switch active plan:
```bash
echo ".ralph/plans/your-plan.md" > .ralph/current
```

## Tips

- Keep tasks small (1 task = 1 commit)
- Be specific ("Add login endpoint" not "Add auth")
- Include context Pi needs in the plan itself
- Notes capture decisions for future reference
