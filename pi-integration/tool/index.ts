import { Type } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";
import { Text } from "@mariozechner/pi-tui";
import type { CustomToolFactory, ToolSessionEvent } from "@mariozechner/pi-coding-agent";

/**
 * Ralph Loop Tool
 * 
 * Provides functions for creating and managing ralph development loops.
 * Works with the ralph CLI (must be installed at /usr/local/bin/ralph).
 */

interface RalphDetails {
  action: string;
  success: boolean;
  planFile?: string;
  taskCount?: number;
  doneCount?: number;
  currentTask?: string;
  error?: string;
}

const factory: CustomToolFactory = (pi) => {
  
  // Helper to run ralph commands
  const runRalph = async (args: string[], signal?: AbortSignal): Promise<{ stdout: string; stderr: string; code: number }> => {
    return pi.exec("ralph", args, { signal, timeout: 30000 });
  };

  // Check if ralph is initialized in current directory
  const isInitialized = async (): Promise<boolean> => {
    const result = await pi.exec("test", ["-d", ".ralph"]);
    return result.code === 0;
  };

  // Parse status output for structured data
  const parseStatus = (output: string): { total: number; done: number; pending: number; currentTask?: string } => {
    const totalMatch = output.match(/(\d+)\s*tasks?/i);
    const doneMatch = output.match(/(\d+)\s*(?:complete|done)/i);
    const pendingMatch = output.match(/(\d+)\s*(?:pending|remaining)/i);
    
    return {
      total: totalMatch ? parseInt(totalMatch[1]) : 0,
      done: doneMatch ? parseInt(doneMatch[1]) : 0,
      pending: pendingMatch ? parseInt(pendingMatch[1]) : 0,
    };
  };

  return [
    // ralph_status - Get current plan status
    {
      name: "ralph_status",
      label: "Ralph Status",
      description: "Get the current ralph loop status: active plan, task progress, and current task. Use before starting work to understand where we are.",
      parameters: Type.Object({}),

      async execute(toolCallId, params, signal) {
        const initialized = await isInitialized();
        if (!initialized) {
          return {
            content: [{ type: "text", text: "No ralph project. Run 'ralph init \"description\"' to create one." }],
            details: { action: "status", success: false, error: "not initialized" } as RalphDetails,
          };
        }

        const result = await runRalph(["status"], signal);
        if (result.code !== 0) {
          return {
            content: [{ type: "text", text: `Error: ${result.stderr || result.stdout}` }],
            details: { action: "status", success: false, error: result.stderr } as RalphDetails,
          };
        }

        const status = parseStatus(result.stdout);
        return {
          content: [{ type: "text", text: result.stdout }],
          details: {
            action: "status",
            success: true,
            taskCount: status.total,
            doneCount: status.done,
          } as RalphDetails,
        };
      },

      renderResult(result, { expanded }, theme) {
        const details = result.details as RalphDetails | undefined;
        if (!details?.success) {
          return new Text(theme.fg("error", details?.error || "Error"), 0, 0);
        }
        const text = theme.fg("success", "✓ ") + 
          theme.fg("muted", `${details.doneCount}/${details.taskCount} tasks complete`);
        return new Text(text, 0, 0);
      },
    },

    // ralph_init - Initialize a new ralph project/plan
    {
      name: "ralph_init",
      label: "Ralph Init",
      description: "Initialize a new ralph loop with a plan description. Creates .ralph/ directory and plan template. Use at the start of a new feature.",
      parameters: Type.Object({
        description: Type.String({ description: "Short description of what we're building (e.g., 'Add cloud sync UI')" }),
      }),

      async execute(toolCallId, params, signal) {
        const { description } = params as { description: string };
        
        const result = await runRalph(["init", description], signal);
        if (result.code !== 0) {
          return {
            content: [{ type: "text", text: `Error: ${result.stderr || result.stdout}` }],
            details: { action: "init", success: false, error: result.stderr } as RalphDetails,
          };
        }

        // Extract plan file path from output
        const planMatch = result.stdout.match(/Created plan: (.+\.md)/);
        const planFile = planMatch ? planMatch[1] : undefined;

        return {
          content: [{ type: "text", text: result.stdout }],
          details: {
            action: "init",
            success: true,
            planFile,
          } as RalphDetails,
        };
      },

      renderResult(result, { expanded }, theme) {
        const details = result.details as RalphDetails | undefined;
        if (!details?.success) {
          return new Text(theme.fg("error", details?.error || "Error"), 0, 0);
        }
        let text = theme.fg("success", "✓ ") + theme.fg("muted", "Plan created");
        if (details.planFile) {
          text += "\n" + theme.fg("dim", `  ${details.planFile}`);
        }
        return new Text(text, 0, 0);
      },
    },

    // ralph_create_plan - Write a complete plan file
    {
      name: "ralph_create_plan",
      label: "Ralph Create Plan",
      description: "Create a complete ralph plan file with tasks. Use after interviewing user to write the full plan. Provide the plan content in markdown format with - [ ] task items.",
      parameters: Type.Object({
        title: Type.String({ description: "Plan title (e.g., 'Phase 4 - UI Integration')" }),
        content: Type.String({ description: "Full plan content in markdown format with ## sections and - [ ] task items" }),
        setAsCurrent: Type.Optional(Type.Boolean({ description: "Set this as the current active plan (default: true)" })),
      }),

      async execute(toolCallId, params, signal) {
        const { title, content, setAsCurrent = true } = params as { title: string; content: string; setAsCurrent?: boolean };

        // Ensure ralph is initialized
        const initialized = await isInitialized();
        if (!initialized) {
          await runRalph(["init", title], signal);
        }

        // Generate filename
        const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 15).replace(/(\d{8})(\d{6})/, "$1-$2");
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
        const filename = `.ralph/plans/${timestamp}-${slug}.md`;

        // Write plan file
        const fs = await import("node:fs/promises");
        const planContent = `# Plan: ${title}\n\n${content}`;
        await fs.writeFile(filename, planContent, "utf8");

        // Set as current if requested
        if (setAsCurrent) {
          await fs.writeFile(".ralph/current", filename, "utf8");
        }

        // Count tasks
        const taskCount = (content.match(/^- \[ \]/gm) || []).length;

        return {
          content: [{ type: "text", text: `Created plan: ${filename} with ${taskCount} tasks` }],
          details: {
            action: "create_plan",
            success: true,
            planFile: filename,
            taskCount,
          } as RalphDetails,
        };
      },

      renderResult(result, { expanded }, theme) {
        const details = result.details as RalphDetails | undefined;
        if (!details?.success) {
          return new Text(theme.fg("error", details?.error || "Error"), 0, 0);
        }
        let text = theme.fg("success", "✓ ") + 
          theme.fg("muted", `Plan created: ${details.taskCount} tasks`);
        if (expanded && details.planFile) {
          text += "\n" + theme.fg("dim", `  ${details.planFile}`);
        }
        return new Text(text, 0, 0);
      },
    },

    // ralph_set_config - Configure ralph settings
    {
      name: "ralph_set_config",
      label: "Ralph Config",
      description: "Set ralph configuration: build command and project reminders. Reminders are injected into every task context.",
      parameters: Type.Object({
        buildCommand: Type.Optional(Type.String({ description: "Build command (e.g., 'gj build ms', 'npm run build')" })),
        reminders: Type.Optional(Type.String({ description: "Multi-line project reminders/rules to include in every task" })),
      }),

      async execute(toolCallId, params, signal) {
        const { buildCommand, reminders } = params as { buildCommand?: string; reminders?: string };

        const fs = await import("node:fs/promises");
        
        // Ensure .ralph exists
        try {
          await fs.mkdir(".ralph", { recursive: true });
        } catch {}

        // Build config content
        let config = "# Ralph configuration\n";
        if (buildCommand) {
          config += `build=${buildCommand}\n`;
        }
        if (reminders) {
          config += `\n[reminders]\n${reminders}\n`;
        }

        await fs.writeFile(".ralph/config", config, "utf8");

        return {
          content: [{ type: "text", text: `Config updated: build=${buildCommand || "(not set)"}, reminders=${reminders ? "set" : "(not set)"}` }],
          details: { action: "config", success: true } as RalphDetails,
        };
      },

      renderResult(result, { expanded }, theme) {
        const details = result.details as RalphDetails | undefined;
        if (!details?.success) {
          return new Text(theme.fg("error", details?.error || "Error"), 0, 0);
        }
        return new Text(theme.fg("success", "✓ ") + theme.fg("muted", "Config updated"), 0, 0);
      },
    },

    // ralph_launch - Launch interactive or YOLO mode
    {
      name: "ralph_launch",
      label: "Ralph Launch",
      description: "Launch ralph execution. Use 'interactive' for task-by-task with user, or 'yolo' for autonomous execution. Call this after plan is ready.",
      parameters: Type.Object({
        mode: StringEnum(["interactive", "yolo", "status"] as const),
      }),

      async execute(toolCallId, params, signal) {
        const { mode } = params as { mode: "interactive" | "yolo" | "status" };

        if (mode === "status") {
          const result = await runRalph(["status"], signal);
          return {
            content: [{ type: "text", text: result.stdout }],
            details: { action: "status", success: result.code === 0 } as RalphDetails,
          };
        }

        // For interactive or yolo, we just inform the user what command to run
        // We can't actually run `ralph next` or `ralph yolo` from within Pi
        // because those commands launch Pi themselves (recursive)
        
        const command = mode === "yolo" ? "ralph yolo" : "ralph next";
        const description = mode === "yolo" 
          ? "Run all tasks autonomously (type 'yolo' to confirm)"
          : "Work on tasks one at a time with user interaction";

        return {
          content: [{ 
            type: "text", 
            text: `Ready to launch in ${mode} mode.\n\nRun this command in your terminal:\n\n    ${command}\n\n${description}` 
          }],
          details: { action: "launch", success: true } as RalphDetails,
        };
      },

      renderResult(result, { expanded }, theme) {
        const details = result.details as RalphDetails | undefined;
        return new Text(
          theme.fg("accent", "→ ") + theme.fg("muted", "Ready to launch"), 
          0, 0
        );
      },
    },
  ];
};

export default factory;
