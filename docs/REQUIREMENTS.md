# Requirements

## What Ralph Does

1. Create a plan (markdown with checkboxes)
2. Loop through tasks one at a time
3. Verify build after each task
4. Commit after each task
5. Get help when stuck

## Agent Strategy

| Role | Tool | When |
|------|------|------|
| Worker | Pi | All coding |
| Advisor | Oracle | Hard problems |
| Reviewer | codex review | Before commits |

## Not Building

- ❌ Multi-provider plugins
- ❌ Complex automation modes
- ❌ Structured schemas
- ❌ Agent coordination
- ❌ Custom guard rails (use AGENTS.md)

## Success Criteria

1. Create plan in < 30 seconds
2. One task = one focus
3. Build gate catches breaks
4. Help is one command away
