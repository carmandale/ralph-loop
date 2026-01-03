# YOLO Mode

Full auto. No prompts. Run all tasks.

## Usage

```bash
ralph yolo
# Type "yolo" to confirm
```

## What Happens

```
YOLO Task 1/14: Create UserModel
├─ Pi runs (non-interactive)
├─ Build verification
├─ Commit: "ralph: Task 1/14 - Create UserModel"
└─ Next task...

YOLO Task 2/14: Add password hashing
...

🎉 YOLO COMPLETE
└─ Codex review runs on all changes
```

## How It Works

- Pi runs with `-p` flag (print mode, exits when done)
- Build must pass to continue
- Auto-commits each task
- Stops on any failure
- Codex review at end

## When to Use

- Well-defined tasks
- Low-risk changes
- You trust the plan
- You want speed

## When NOT to Use

- Exploratory work
- Complex decisions needed
- New codebase
- Critical systems

## If It Fails

```bash
# Fix the issue, then either:
ralph yolo      # Continue from where it stopped
ralph next      # Switch to interactive mode
```
