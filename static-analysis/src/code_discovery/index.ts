import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { CodeDiscoveryPlugin } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCodeDiscoveryPlugins(): Promise<CodeDiscoveryPlugin[]> {
  const files = readdirSync(__dirname).filter(
    (f) =>
      (f.endsWith("_discoverer.ts") || f.endsWith("_discoverer.js")) &&
      f !== "types.ts" &&
      f !== "index.ts"
  );

  const plugins: CodeDiscoveryPlugin[] = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(join(__dirname, file)).href);
    const PluginClass = Object.values(mod).find(
      (v): v is new () => CodeDiscoveryPlugin =>
        typeof v === "function" && "prototype" in v && v.prototype?.discover
    );
    if (PluginClass) plugins.push(new PluginClass());
  }

  return plugins;
}
