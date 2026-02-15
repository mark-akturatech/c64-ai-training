/**
 * Enrichment plugin auto-discovery and runner.
 *
 * Scans this directory for *_enrichment.ts files, imports each,
 * and finds the exported class implementing EnrichmentPlugin.
 */

import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { EnrichmentPlugin, EnrichmentInput, EnrichmentResult } from "./types.js";

/** Cached plugins — loaded once */
let pluginCache: EnrichmentPlugin[] | null = null;

/** Auto-discover all enrichment plugins in this directory */
export async function loadEnrichmentPlugins(): Promise<EnrichmentPlugin[]> {
  if (pluginCache) return pluginCache;

  const dir = path.dirname(fileURLToPath(import.meta.url));
  const files = readdirSync(dir).filter(
    (f) =>
      f.endsWith("_enrichment.ts") ||
      f.endsWith("_enrichment.js"), // support compiled builds too
  );

  const plugins: EnrichmentPlugin[] = [];
  for (const file of files) {
    const mod = await import(path.join(dir, file));
    // Find the exported class that has an `enrich` method
    const PluginClass = Object.values(mod).find(
      (v) => typeof v === "function" && (v as any).prototype?.enrich,
    ) as (new () => EnrichmentPlugin) | undefined;
    if (PluginClass) plugins.push(new PluginClass());
  }

  pluginCache = plugins;
  return pluginCache;
}

/** Merged result from all plugins */
export interface AggregatedEnrichment {
  additionalContext: string[];
  filterTags: string[];
}

/** Run all plugins and aggregate results */
export async function runEnrichment(
  input: EnrichmentInput,
): Promise<AggregatedEnrichment> {
  const plugins = await loadEnrichmentPlugins();

  const allContext: string[] = [];
  const allTags = new Set<string>();

  for (const plugin of plugins) {
    const result: EnrichmentResult = plugin.enrich(input);
    allContext.push(...result.additionalContext);
    for (const tag of result.filterTags) {
      allTags.add(tag);
    }
  }

  return {
    additionalContext: allContext,
    filterTags: [...allTags].sort(),
  };
}
