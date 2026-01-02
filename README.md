# Ralph Loop

A CLI tool for RALPH-driven development - agentic AI coding with structured loops and multi-agent collaboration.

## The Problem

AI coding agents often:
- Rush ahead with quick fixes instead of understanding
- Drift off track during complex tasks
- Produce code that doesn't build
- Skip getting help when stuck

## The Solution

Ralph Loop enforces disciplined, loop-based development:

```
Plan → Checklist → Loop {
    Pick task
    Execute (with THINK.ALIGN.ACT)
    Verify build
    Re-read plan
} → Done
```

## Core Principles

### North Star
> "Working Code Over Perfect Code"
> The best code is no code. The second best is working code.

### THINK. ALIGN. ACT Protocol
- **THINK** - Understand before acting
- **ALIGN** - Get approval on significant work  
- **ACT** - Execute only after thinking and aligning

### Multi-Agent Collaboration
When stuck, don't quick-fix. Get help:
- Ask the Oracle (GPT-5 Pro)
- Have another agent review
- Get a second opinion

## RALPH Phases

| Phase | Purpose |
|-------|---------|
| **R**esearch | Understand codebase, read docs |
| **A**nalyze | Break down the problem |
| **L**ist | Create actionable checklist |
| **P**roduce | Generate code |
| **H**armonize | Review, test, refine |

## Supported Agents

- **Pi** (pi-coding-agent) - primary
- **OpenCode**
- **Codex**  
- **Claude**

## Integrations

- Git (commits, branches, history)
- Beads (issue tracking)

## Status

🚧 Under Development

See [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) for full requirements.

## References

- [Stop Chatting With AI, Start Loops: RALPH-Driven Development](https://lukeparker.dev/stop-chatting-with-ai-start-loops-ralph-driven-development)

## License

MIT
