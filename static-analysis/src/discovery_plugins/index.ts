import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { DiscoveryPlugin } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadDiscoveryPlugins(): Promise<DiscoveryPlugin[]> {
  const files = readdirSync(__dirname).filter(
    (f) =>
      (f.endsWith("_plugin.ts") || f.endsWith("_plugin.js")) &&
      f !== "types.ts" &&
      f !== "index.ts"
  );

  const plugins: DiscoveryPlugin[] = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(join(__dirname, file)).href);
    const PluginClass = Object.values(mod).find(
      (v): v is new () => DiscoveryPlugin =>
        typeof v === "function" &&
        "prototype" in v &&
        (v.prototype?.onInstruction || v.prototype?.onNodeComplete || v.prototype?.onTreeComplete)
    );
    if (PluginClass) plugins.push(new PluginClass());
  }

  return plugins.sort((a, b) => a.priority - b.priority);
}
