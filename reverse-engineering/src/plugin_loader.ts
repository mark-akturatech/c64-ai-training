// ============================================================================
// Plugin Loader — generic auto-discovery for all plugin types
//
// Follows the static-analysis pattern: scan a directory for files matching
// a naming convention, dynamically import them, find the exported class
// with the required method, instantiate, and sort by priority.
// ============================================================================

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Auto-discover and load plugins from a directory.
 *
 * @param dir - Absolute path to the directory to scan
 * @param pattern - Filename suffix pattern (e.g. "_enrichment.ts", "_context.ts")
 * @param methodName - Required method name on the plugin class (e.g. "enrich", "provide")
 * @returns Sorted array of plugin instances (by priority, ascending)
 */
export async function loadPlugins<T extends { priority: number }>(
  dir: string,
  pattern: string,
  methodName: string,
): Promise<T[]> {
  let files: string[];
  try {
    files = readdirSync(dir).filter(
      (f) =>
        (f.endsWith(pattern) || f.endsWith(pattern.replace(".ts", ".js"))) &&
        f !== "types.ts" &&
        f !== "index.ts",
    );
  } catch {
    // Directory doesn't exist or can't be read — no plugins
    return [];
  }

  const plugins: T[] = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(join(dir, file)).href);
    const PluginClass = Object.values(mod).find(
      (v): v is new () => T =>
        typeof v === "function" &&
        "prototype" in v &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (v as any).prototype?.[methodName] === "function",
    );
    if (PluginClass) {
      plugins.push(new PluginClass());
    }
  }

  return plugins.sort((a, b) => a.priority - b.priority);
}
