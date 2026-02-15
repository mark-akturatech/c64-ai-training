/**
 * Pipeline orchestrator.
 *
 * Connects number extraction → enrichment plugins → search → formatting.
 * The orchestrator is generic — it doesn't know what any plugin does,
 * just concatenates additionalContext and collects filterTags.
 */

import OpenAI from "openai";
import type { QueryConfig, SearchHit } from "./types.js";
import { extractNumbers } from "./numbers.js";
import { runEnrichment } from "./enrichment/index.js";
import { determineStrategy, executeStrategy } from "./search/strategy.js";
import { formatResults } from "./format/markdown.js";

export interface PipelineResult {
  enrichedQuery: string;
  filterTags: string[];
  searchMode: string;
  results: SearchHit[];
  formatted: string;
}

/** Build the enriched query string from original query + plugin context */
function buildEnrichedString(query: string, additionalContext: string[]): string {
  if (additionalContext.length === 0) return query;
  return query + "\n[" + additionalContext.join("; ") + "]";
}

/** Run the full pipeline: enrich → classify → search → format */
export async function runPipeline(
  config: QueryConfig,
  query: string,
  options: { raw?: boolean; enrichOnly?: boolean } = {},
): Promise<PipelineResult> {
  // Step 1: Extract numbers from query
  const numbers = options.raw ? [] : extractNumbers(query);

  // Step 2: Run enrichment plugins
  const enrichment = options.raw
    ? { additionalContext: [], filterTags: [] }
    : await runEnrichment({ query, numbers });

  // Step 3: Build enriched query string
  const enrichedQuery = options.raw
    ? query
    : buildEnrichedString(query, enrichment.additionalContext);

  const filterTags = enrichment.filterTags;

  // If enrich-only mode, return early
  if (options.enrichOnly) {
    return {
      enrichedQuery,
      filterTags,
      searchMode: "",
      results: [],
      formatted: enrichedQuery,
    };
  }

  // Step 4: Determine search strategy from enrichment output
  const strategy = determineStrategy(query, filterTags);

  // Step 5: Execute search
  const client = new OpenAI({ apiKey: config.openaiApiKey });
  const { results, mode } = await executeStrategy(
    config,
    client,
    enrichedQuery,
    filterTags,
    strategy,
  );

  // Step 6: Format results
  const formatted = formatResults(results, mode);

  return {
    enrichedQuery,
    filterTags,
    searchMode: mode,
    results,
    formatted,
  };
}
