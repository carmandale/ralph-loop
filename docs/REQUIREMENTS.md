# Ralph Loop - Requirements

## Core Concept

Create a great plan, turn it into a checklist, and have an agent work in a loop:
1. Pick one task
2. Execute it
3. Re-read the plan 
4. Build to verify
5. Repeat

**Goals:**
- A. Code always builds
- B. Agent doesn't get off track

## Key Philosophy Integration

### North Star
"Working Code Over Perfect Code" - The best code is no code, the second best is working code.

### THINK. ALIGN. ACT Protocol
Prevent agents from rushing ahead with quick fixes. Force them to:
- **THINK** - Actually understand before acting
- **ALIGN** - Get approval on significant work
- **ACT** - Execute only after thinking and aligning

**Key insight**: Agents often rush ahead. The loop should encourage getting help over quick fixes.

## Technical Requirements

### Tool Type
CLI tool that runs in terminal and orchestrates AI loops

### Supported Agents
- **Pi** (pi-coding-agent) - primary/favorite
- **OpenCode** 
- **Codex**
- **Claude** (Claude Code / API)

### Automation Level
Configurable per-loop:
- Fully automatic
- Semi-automatic (pause at phases)
- Interactive (user guides each step)

### RALPH Phases (All Required)
- **R**esearch - codebase analysis, doc reading
- **A**nalyze - problem decomposition
- **L**ist - task/plan generation (checklist)
- **P**roduce - code generation
- **H**armonize - review, test, refine

### Integrations
- Git (commits, branches, history)
- Beads (issue tracker)

### Language
TypeScript/Node.js (recommended for ecosystem alignment with pi-coding-agent)

## Priority Features

### 1. Loop-Based Execution
- Create plan → checklist → loop through tasks
- Re-read plan each iteration
- Build verification each iteration

### 2. Multi-Agent Collaboration
- Ask the Oracle (GPT-5 Pro) for help
- Have one agent (Codex) review another's (Claude) code
- "Get another agent's eyes" when stuck

### 3. Guard Rails
- Prevent rushing ahead
- Force alignment checks
- Encourage asking for help over quick fixes

## Current Workflow (to improve upon)
Pi is the primary tool currently in use.

## Open Questions
- How to coordinate multiple agents?
- What triggers "ask for help" vs "proceed"?
- How to track loop state/progress?
- Plan storage format (markdown? beads? structured JSON?)
