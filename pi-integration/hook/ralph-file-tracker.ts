import type { HookAPI } from "@mariozechner/pi-coding-agent/hooks";
import * as fs from "node:fs";
import * as path from "node:path";

type TrackingContext = {
  root: string;
  manifest: string;
};

const TRACKED_TOOLS = new Set(["edit", "write"]);

export default function (pi: HookAPI) {
  pi.on("tool_result", (event, ctx) => {
    if (!TRACKED_TOOLS.has(event.toolName)) return;
    if (!isTrackingEnabled()) return;

    const tracking = getTrackingContext();
    if (!tracking) return;

    const rawPath = extractPathFromEvent(event);
    if (!rawPath) return;

    const relPath = normalizeToRepoRelative(tracking.root, rawPath, ctx.cwd);
    if (!relPath) return;

    ensureManifestDir(tracking.manifest);
    fs.appendFileSync(tracking.manifest, relPath + "\n");
  });
}

function isTrackingEnabled(): boolean {
  return process.env.RALPH_TRACKING === "1";
}

function getTrackingContext(): TrackingContext | null {
  const root = process.env.RALPH_ROOT;
  const manifest = process.env.RALPH_MANIFEST;
  const plan = process.env.RALPH_PLAN;
  const taskNum = process.env.RALPH_TASK_NUM;
  const session = process.env.RALPH_SESSION;
  if (!root || !manifest || !plan || !taskNum || !session) return null;
  return { root, manifest };
}

function extractPathFromEvent(event: { input?: unknown }): string | null {
  if (!event?.input || typeof event.input !== "object") return null;
  const input = event.input as { path?: unknown };
  return typeof input.path === "string" ? input.path : null;
}

function normalizeToRepoRelative(repoRoot: string, rawPath: string, cwd: string): string | null {
  const absPath = path.isAbsolute(rawPath) ? rawPath : path.resolve(cwd, rawPath);
  const normalizedRoot = path.resolve(repoRoot);
  const normalizedPath = path.resolve(absPath);
  if (!normalizedPath.startsWith(normalizedRoot + path.sep)) return null;
  return path.relative(normalizedRoot, normalizedPath);
}

function ensureManifestDir(manifestPath: string): void {
  const dir = path.dirname(manifestPath);
  fs.mkdirSync(dir, { recursive: true });
}
