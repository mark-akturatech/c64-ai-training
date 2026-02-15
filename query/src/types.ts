/**
 * Shared types for the C64 query system.
 */

/** Configuration loaded from environment / CLI args */
export interface QueryConfig {
  qdrantUrl: string;
  collectionName: string;
  embeddingModel: string;
  openaiApiKey: string;
  limit: number;
  fetchLimit: number;
  minScoreRatio: number;
}

/** Default configuration values */
export const DEFAULTS: Omit<QueryConfig, "openaiApiKey"> = {
  qdrantUrl: "http://localhost:6333",
  collectionName: "c64_training",
  embeddingModel: "text-embedding-3-large",
  limit: 15,
  fetchLimit: 20,
  minScoreRatio: 0.6,
};

/** A single search result from Qdrant */
export interface SearchHit {
  id: string | number;
  score: number;
  payload: {
    title?: string;
    filename?: string;
    type?: string;
    document?: string;
    references?: Array<{ chunk: string; description: string }>;
    tags?: string[];
    [key: string]: unknown;
  };
}

/** A parsed numeric token extracted from the query */
export interface ParsedNumber {
  /** Original text from the query: "$D020", "53280", "%00001111" */
  sourceToken: string;
  /** Numeric value */
  value: number;
  /** Decimal string representation */
  decimal: string;
  /** Hex string with $ prefix: "$D020" */
  hex: string;
  /** Binary string with % prefix, only if value <= 255 */
  binary?: string;
}
