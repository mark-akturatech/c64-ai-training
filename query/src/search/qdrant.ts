/**
 * Qdrant REST API wrapper.
 *
 * Uses Node's built-in fetch() — no external HTTP dependency needed.
 */

import type { QueryConfig, SearchHit } from "../types.js";

export interface QdrantSearchOptions {
  vector: number[];
  limit: number;
  filterTags?: string[];
}

/** Vector search, optionally filtered to points with matching tags metadata */
export async function qdrantSearch(
  config: QueryConfig,
  options: QdrantSearchOptions,
): Promise<SearchHit[]> {
  const body: Record<string, unknown> = {
    vector: options.vector,
    limit: options.limit,
    with_payload: true,
  };

  if (options.filterTags && options.filterTags.length > 0) {
    body.filter = {
      should: options.filterTags.map((tag) => ({
        key: "tags",
        match: { value: tag },
      })),
    };
  }

  const response = await fetch(
    `${config.qdrantUrl}/collections/${config.collectionName}/points/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(`Qdrant search failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as { result?: SearchHit[] };
  return data.result || [];
}

/** Merge two result sets, deduplicating by point id. Primary results come first. */
export function mergeResults(
  primary: SearchHit[],
  secondary: SearchHit[],
  limit: number,
): SearchHit[] {
  const seen = new Set<string | number>();
  const merged: SearchHit[] = [];

  for (const hit of primary) {
    if (!seen.has(hit.id)) {
      seen.add(hit.id);
      merged.push(hit);
    }
  }
  for (const hit of secondary) {
    if (!seen.has(hit.id)) {
      seen.add(hit.id);
      merged.push(hit);
    }
  }

  return merged.slice(0, limit);
}

/**
 * Adaptively trim results based on score quality.
 *
 * Keeps results scoring >= minScoreRatio of the best hit's score,
 * capped at limit. Narrow queries with few great matches return fewer
 * results; broad queries with many good matches return more.
 */
export function trimByScore(
  results: SearchHit[],
  limit: number,
  minScoreRatio: number,
): SearchHit[] {
  if (results.length === 0) return results;

  const bestScore = results[0].score;
  if (bestScore <= 0) return results.slice(0, limit);

  const cutoff = bestScore * minScoreRatio;
  return results.filter((r) => r.score >= cutoff).slice(0, limit);
}

/** Check that Qdrant is reachable */
export async function checkQdrantConnection(qdrantUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${qdrantUrl}/collections`, {
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
