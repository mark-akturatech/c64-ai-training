/**
 * Search strategy selection and execution.
 *
 * Three strategies:
 * - hybrid: tags + natural language → filtered + unfiltered, merged
 * - filtered: tags only → filtered vector search
 * - semantic: no tags → unfiltered vector search
 *
 * Classification is derived from enrichment output — no need to
 * re-detect tags separately.
 */

import OpenAI from "openai";
import type { QueryConfig, SearchHit } from "../types.js";
import { getEmbedding } from "./embedding.js";
import { qdrantSearch, mergeResults, trimByScore } from "./qdrant.js";

export type SearchStrategy = "hybrid" | "filtered" | "semantic";

/**
 * Check if query has meaningful natural language beyond addresses/numbers/tags.
 *
 * Strips everything the enrichment plugins already identified (hex addresses,
 * opcodes, mnemonics, KERNAL labels) via filterTags, plus remaining numeric
 * tokens and punctuation. If 2+ words remain, there's natural language.
 */
function hasNaturalLanguage(query: string, filterTags: string[]): boolean {
  let stripped = query;

  // Strip hex addresses and binary/decimal number tokens
  stripped = stripped.replace(/(?<!\w)\$[0-9A-Fa-f]{1,4}(?!\w)/g, "");
  stripped = stripped.replace(/(?<!\w)%[01]{4,8}(?!\w)/g, "");

  // Strip all filter tags (opcodes, mnemonics, KERNAL labels, etc.)
  for (const tag of filterTags) {
    stripped = stripped.replace(new RegExp(`(?<!\\w)${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\w)`, "gi"), "");
  }

  // Strip remaining numbers and punctuation
  stripped = stripped.replace(/[0-9$%,#()\s]+/g, " ");

  const words = stripped.split(/\s+/).filter((w) => w.length > 1);
  return words.length >= 2;
}

/** Determine which search strategy to use */
export function determineStrategy(
  query: string,
  filterTags: string[],
): SearchStrategy {
  const hasTags = filterTags.length > 0;
  if (hasTags && hasNaturalLanguage(query, filterTags)) return "hybrid";
  if (hasTags) return "filtered";
  return "semantic";
}

export interface SearchResult {
  results: SearchHit[];
  mode: string;
}

/** Execute the determined search strategy */
export async function executeStrategy(
  config: QueryConfig,
  client: OpenAI,
  enrichedQuery: string,
  tags: string[],
  strategy: SearchStrategy,
): Promise<SearchResult> {
  const fetchLimit = Math.max(config.fetchLimit, config.limit);
  const vector = await getEmbedding(client, enrichedQuery, config.embeddingModel);

  switch (strategy) {
    case "hybrid": {
      const [filtered, unfiltered] = await Promise.all([
        qdrantSearch(config, { vector, limit: fetchLimit, filterTags: tags }),
        qdrantSearch(config, { vector, limit: fetchLimit }),
      ]);
      const merged = mergeResults(filtered, unfiltered, fetchLimit);
      const trimmed = trimByScore(merged, config.limit, config.minScoreRatio);
      return {
        results: trimmed,
        mode: `hybrid (filtered on ${tags.join(", ")} + semantic)`,
      };
    }

    case "filtered": {
      const results = await qdrantSearch(config, {
        vector,
        limit: fetchLimit,
        filterTags: tags,
      });
      const trimmed = trimByScore(results, config.limit, config.minScoreRatio);
      return {
        results: trimmed,
        mode: `filtered (${tags.join(", ")})`,
      };
    }

    case "semantic": {
      const results = await qdrantSearch(config, { vector, limit: fetchLimit });
      const trimmed = trimByScore(results, config.limit, config.minScoreRatio);
      return { results: trimmed, mode: "semantic" };
    }
  }
}
