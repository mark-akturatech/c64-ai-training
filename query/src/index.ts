#!/usr/bin/env tsx
/**
 * CLI entry point for the C64 Qdrant query system.
 *
 * Usage:
 *   npx tsx query/src/index.ts "What does setting 53280, 13 do?"
 *   npx tsx query/src/index.ts --limit 5 "SID voice 1 ADSR"
 *   npx tsx query/src/index.ts --raw "already enriched query"
 *   npx tsx query/src/index.ts --enrich-only "53280 and 13"
 */

import type { QueryConfig } from "./types.js";
import { DEFAULTS } from "./types.js";
import { runPipeline } from "./pipeline.js";
import { checkQdrantConnection } from "./search/qdrant.js";

function parseArgs(argv: string[]): {
  limit: number;
  raw: boolean;
  enrichOnly: boolean;
  query: string;
} {
  let limit = DEFAULTS.limit;
  let raw = false;
  let enrichOnly = false;
  const queryParts: string[] = [];

  let i = 0;
  while (i < argv.length) {
    if (argv[i] === "--limit" && i + 1 < argv.length) {
      limit = parseInt(argv[i + 1], 10);
      i += 2;
    } else if (argv[i] === "--raw") {
      raw = true;
      i += 1;
    } else if (argv[i] === "--enrich-only") {
      enrichOnly = true;
      i += 1;
    } else {
      queryParts.push(argv[i]);
      i += 1;
    }
  }

  return { limit, raw, enrichOnly, query: queryParts.join(" ") };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!args.query) {
    console.log(
      'Usage: npx tsx query/src/index.ts [--limit N] [--raw] [--enrich-only] "query"',
    );
    process.exit(1);
  }

  // Build config
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey && !args.enrichOnly) {
    console.error("Error: OPENAI_API_KEY not set");
    process.exit(1);
  }

  if (!args.enrichOnly) {
    const connected = await checkQdrantConnection(DEFAULTS.qdrantUrl);
    if (!connected) {
      console.error(`Error: Cannot connect to Qdrant at ${DEFAULTS.qdrantUrl}`);
      process.exit(1);
    }
  }

  const config: QueryConfig = {
    ...DEFAULTS,
    openaiApiKey: apiKey || "",
    limit: args.limit,
  };

  // Run pipeline
  const result = await runPipeline(config, args.query, {
    raw: args.raw,
    enrichOnly: args.enrichOnly,
  });

  // Diagnostics to stderr
  if (result.enrichedQuery !== args.query) {
    console.error(`Enriched query:\n  ${result.enrichedQuery}`);
  }
  if (result.filterTags.length > 0) {
    console.error(`Filter tags: ${result.filterTags.join(", ")}`);
  }
  if (!args.enrichOnly) {
    console.error(`Search mode: ${result.searchMode}`);
    console.error();
  }

  // Output to stdout
  console.log(result.formatted);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
