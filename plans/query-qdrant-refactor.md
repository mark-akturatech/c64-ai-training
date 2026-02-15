# Refactor query_qdrant.py → TypeScript with Plugin Architecture

## Context

The query system (`query/scripts/query_qdrant.py`, ~568 lines) is a single Python file that enriches queries with number conversions and memory map context, extracts filter tags, runs hybrid Qdrant searches, and formats results. It works well but is monolithic — all enrichment logic is interleaved and hard to extend.

Rewriting as modular TypeScript with a **plugin architecture for enrichment**, following the same auto-discovery pattern as the static analysis plan. Adding new enrichment = drop a file in a directory. This is a workbench project — will eventually become a dedicated MCP server using the TypeScript SDK.

**Runner:** `tsx` (run `.ts` directly, no compile step). Invocation: `npx tsx query/src/index.ts "query"`

---

## File Structure

```
query/
  README.md                         # Setup, usage, how to add plugins
  package.json
  tsconfig.json
  src/
    index.ts                        # CLI entry point (arg parsing, orchestration)
    types.ts                        # Shared interfaces (QueryConfig, SearchHit)
    pipeline.ts                     # Orchestrator: extract numbers → run plugins → build query → search
    numbers.ts                      # Number extraction + base conversion (utility, not a plugin)
    classify.ts                     # Query classification (natural language detection)
    enrichment/
      types.ts                      # EnrichmentPlugin interface, EnrichmentResult
      index.ts                      # Auto-discovers *_enrichment.ts, loads by priority
      number_enrichment.ts          # Builds multi-base context strings (priority 10)
      mirror_enrichment.ts          # VIC-II/SID/CIA mirror resolution (priority 20)
      memory_map_enrichment.ts      # Address-to-region lookup (priority 30)
      color_enrichment.ts           # C64 color name for values 0-15 (priority 30)
      register_enrichment.ts        # Register mnemonic detection (priority 40)
      tag_enrichment.ts             # KERNAL label detection (priority 40)
    search/
      qdrant.ts                     # Qdrant REST API wrapper (uses fetch())
      embedding.ts                  # OpenAI embedding generation
      strategy.ts                   # Search strategy selection + execution
    format/
      markdown.ts                   # Result formatting for Claude
    data/
      memory_map.ts                 # C64_MEMORY_MAP table
      kernal_labels.ts              # KERNAL_LABELS set
      register_mnemonics.ts         # REGISTER_MNEMONICS set
      color_names.ts                # COLOR_NAMES set (indexed by value 0-15)
      mirror_ranges.ts              # Mirror address range definitions
```

---

## Core Design: Numbers Extracted Once, Plugins Are Generic

### Number Extraction (`numbers.ts`) — NOT a plugin

Pre-processing step. Scans query for numeric tokens, converts each to all bases. Returns read-only `ParsedNumber[]` that every plugin receives.

```typescript
interface ParsedNumber {
  sourceToken: string;    // original text: "$D020", "53280", "%00001111"
  value: number;          // numeric value
  decimal: string;        // "53280"
  hex: string;            // "$D020"
  binary?: string;        // "%11010000_00100000" (if ≤ 255)
}

function extractNumbers(query: string): ParsedNumber[];
```

Handles: `$hex`, `%binary`, bare decimals, post-comma single digits (POKE addr,val heuristic). Same regex logic as Python `_NUM_PATTERN` + `_is_likely_value()`.

### Plugin Interface (`enrichment/types.ts`)

Plugins are generic — they return search data, not plugin-specific fields. The orchestrator doesn't need to know what each plugin does.

```typescript
interface EnrichmentInput {
  readonly query: string;                    // original query text
  readonly numbers: readonly ParsedNumber[]; // pre-extracted numbers
}

interface EnrichmentResult {
  /** Text appended to the search query for semantic matching */
  additionalContext: string[];
  /** Tags for Qdrant keyword filtering on the `tags` metadata field */
  filterTags: string[];
}

interface EnrichmentPlugin {
  name: string;
  priority: number;   // lower runs first
  enrich(input: EnrichmentInput): EnrichmentResult;
}
```

Each plugin gets the same read-only input, returns its own result. No shared mutable state. The orchestrator just concatenates all `additionalContext` and collects all `filterTags`.

### Auto-Discovery (`enrichment/index.ts`)

Scans directory for `*_enrichment.ts` files, imports each, finds exported class with `enrich()` method, sorts by priority. Same pattern as static analysis plan's `loadParsers()` and `loadDetectors()`.

---

## Plugin Specifications

| Plugin | Priority | What it does |
|--------|----------|-------------|
| `number_enrichment.ts` | 10 | Builds multi-base context strings from `input.numbers`. Returns `additionalContext: ["53280 = $D020", "$0D = 13 / %00001101"]`. Adds 4-digit hex as `filterTags: ["$D020"]` |
| `mirror_enrichment.ts` | 20 | Checks each number against mirror ranges. Returns `additionalContext: ["$D040 is mirror of $D000 (VIC-II SP0X)"]` and `filterTags: ["$D000"]` (the canonical address, so Qdrant finds the right docs) |
| `memory_map_enrichment.ts` | 30 | Looks up each number > 255 in `C64_MEMORY_MAP`. Returns `additionalContext: ["$D020 → VIC-II Border Color (border color, bits 0-3)"]` |
| `color_enrichment.ts` | 30 | Checks if any number's value is 0-15. Returns `additionalContext: ["14 = Light Blue"]` and `filterTags: ["LIGHT BLUE"]` |
| `register_enrichment.ts` | 40 | Scans query text for VIC-II/SID/CIA mnemonic words. Returns `filterTags: ["EXTCOL", "BGCOL0"]` |
| `tag_enrichment.ts` | 40 | Scans query text for KERNAL API labels. Returns `filterTags: ["CHROUT", "SETLFS"]` |

### Mirror Ranges (NEW data)

```typescript
// data/mirror_ranges.ts
const MIRROR_RANGES = [
  { regionStart: 0xD000, regionEnd: 0xD3FF, registerCount: 47, period: 64, chipName: "VIC-II" },
  { regionStart: 0xD400, regionEnd: 0xD7FF, registerCount: 29, period: 32, chipName: "SID" },
  { regionStart: 0xDC00, regionEnd: 0xDCFF, registerCount: 16, period: 16, chipName: "CIA1" },
  { regionStart: 0xDD00, regionEnd: 0xDDFF, registerCount: 16, period: 16, chipName: "CIA2" },
];
```

Resolution: `canonical = regionStart + ((addr - regionStart) % period)`

Mirror plugin doesn't need to mutate numbers — it independently adds the canonical address as a `filterTag` so Qdrant finds docs tagged with the real register address.

---

## Pipeline Flow

```
query string
    ↓
numbers.ts: extractNumbers(query) → ParsedNumber[]  (read-only)
    ↓
enrichment/index.ts: loadPlugins() → run each with { query, numbers }
    ↓
each plugin returns { additionalContext[], filterTags[] }
    ↓
pipeline.ts: concatenate all additionalContext → enriched query string
             collect all filterTags → tag set
    ↓
classify.ts: hasNaturalLanguage(query) → boolean
    ↓
strategy.ts: determine strategy from (hasTags, hasNL)
    → hybrid (tags + NL): filtered + unfiltered vector search, merged
    → filtered (tags only): filtered vector search
    → semantic (no tags): unfiltered vector search
    ↓
qdrant.ts + embedding.ts: execute search, trim by score
    ↓
markdown.ts: format results → stdout
```

Enriched query format: `query\n[all additionalContext joined with "; "]`

---

## Search Module

- **`search/qdrant.ts`** — REST API via `fetch()` (Node 18+ built-in). Vector search with optional tag filtering on `tags` keyword field. `mergeResults()` and `trimByScore()`.
- **`search/embedding.ts`** — OpenAI `text-embedding-3-large` via `openai` npm package.
- **`search/strategy.ts`** — Three strategies matching current Python behavior.

---

## Implementation Sequence

1. `package.json` + `tsconfig.json`
2. `src/types.ts` — shared interfaces
3. `src/numbers.ts` — number extraction + base conversion
4. `src/data/*.ts` — all data tables (memory_map, kernal_labels, register_mnemonics, color_names, mirror_ranges)
5. `src/enrichment/types.ts` — plugin interface
6. `src/enrichment/*_enrichment.ts` — all 6 plugins
7. `src/enrichment/index.ts` — auto-discovery loader
8. `src/classify.ts` — natural language detection
9. `src/search/embedding.ts` + `src/search/qdrant.ts` + `src/search/strategy.ts`
10. `src/format/markdown.ts`
11. `src/pipeline.ts` — orchestrator
12. `src/index.ts` — CLI entry point
13. `query/README.md` — setup, usage, how to add plugins
14. Update slash command (`query/commands/query-qdrant.md` + `.claude/commands/query/query-qdrant.md`)
15. Install deps: `cd query && npm install`
16. Test enrichment: `npx tsx query/src/index.ts --enrich-only "53280, 13"` — compare to Python
17. Test mirror: `npx tsx query/src/index.ts --enrich-only "$D040"` — verify mirror annotation
18. Test full search: `npx tsx query/src/index.ts "SID voice 1 ADSR"` — compare to Python

---

## Files Modified/Created

**Created (new):**
- `query/README.md`
- `query/package.json`
- `query/tsconfig.json`
- `query/src/` — all TypeScript files listed in structure above

**Modified:**
- `query/commands/query-qdrant.md` — update invocation command
- `.claude/commands/query/query-qdrant.md` — update invocation command

**Updated:**
- `README.md` — note TS migration, workbench → future MCP server

**Kept (not deleted):**
- `query/scripts/query_qdrant.py` — keep for comparison during testing, remove later
