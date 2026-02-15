/**
 * Enrichment plugin interface.
 *
 * Plugins are auto-discovered by scanning this directory for *_enrichment.ts files.
 * Each plugin receives the same read-only input and returns generic search data.
 * The orchestrator concatenates all results without needing plugin-specific knowledge.
 */

import type { ParsedNumber } from "../types.js";

/** Read-only input passed to every enrichment plugin */
export interface EnrichmentInput {
  /** Original query text */
  readonly query: string;
  /** Pre-extracted numeric tokens with all base conversions */
  readonly numbers: readonly ParsedNumber[];
}

/** Generic result returned by each plugin */
export interface EnrichmentResult {
  /** Text appended to the search query for semantic matching */
  additionalContext: string[];
  /** Tags for Qdrant keyword filtering on the `tags` metadata field */
  filterTags: string[];
}

/** Plugin interface — implement this and export the class */
export interface EnrichmentPlugin {
  /** Unique identifier (e.g., "number", "mirror", "memory_map") */
  name: string;
  /** Process the query and return enrichment data */
  enrich(input: EnrichmentInput): EnrichmentResult;
}
