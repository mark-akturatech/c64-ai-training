import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { BlockEnricher } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadEnrichers(): Promise<BlockEnricher[]> {
  const files = readdirSync(__dirname).filter(
    (f) =>
      (f.endsWith("_enricher.ts") || f.endsWith("_enricher.js")) &&
      f !== "types.ts" &&
      f !== "index.ts"
  );

  const enrichers: BlockEnricher[] = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(join(__dirname, file)).href);
    const EnricherClass = Object.values(mod).find(
      (v): v is new () => BlockEnricher =>
        typeof v === "function" && "prototype" in v && v.prototype?.enrich
    );
    if (EnricherClass) enrichers.push(new EnricherClass());
  }

  return enrichers.sort((a, b) => a.priority - b.priority);
}
