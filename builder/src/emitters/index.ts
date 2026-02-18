// ============================================================================
// Emitter auto-discovery — loads all *_emitter.ts files, sorted by priority
// ============================================================================

import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { EmitterPlugin } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadEmitters(): Promise<EmitterPlugin[]> {
  const files = readdirSync(__dirname).filter(
    (f) =>
      (f.endsWith("_emitter.ts") || f.endsWith("_emitter.js")) &&
      f !== "types.ts" &&
      f !== "index.ts"
  );

  const emitters: EmitterPlugin[] = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(join(__dirname, file)).href);
    const EmitterClass = Object.values(mod).find(
      (v): v is new () => EmitterPlugin =>
        typeof v === "function" && "prototype" in v && v.prototype?.emit
    );
    if (EmitterClass) emitters.push(new EmitterClass());
  }

  return emitters.sort((a, b) => a.priority - b.priority);
}
