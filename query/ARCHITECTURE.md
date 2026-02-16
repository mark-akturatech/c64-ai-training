# Query System Architecture

## Overview

The query system is a TypeScript hybrid search tool for the C64/6502 Qdrant knowledge base. It replaced a monolithic Python script (`query/scripts/query_qdrant.py`, ~568 lines) with a modular architecture built around a pluggable enrichment pipeline. The core insight: C64 queries are full of numbers (addresses, register values, color codes) that need domain-specific interpretation before they become useful search terms.

**Runner:** `tsx` (TypeScript executed directly, no compile step)
**Invocation:** `npx tsx query/src/index.ts "query"`

---

## Architecture

```
Query string ("SID voice 1 ADSR $D418")
    │
    ▼
[1. numbers.ts] ────────────── extractNumbers(query) → ParsedNumber[]
    │                           scans for $hex, %binary, decimal tokens
    │                           converts each to all bases (read-only)
    ▼
[2. enrichment/index.ts] ───── auto-discovers *_enrichment.ts, sorts by priority
    │                           passes { query, numbers } to each plugin
    │
    │   Enrichment plugins (each returns { additionalContext[], filterTags[] }):
    │
    │   ┌─ number_enrichment ──────── multi-base context ("54296 = $D418")
    │   ├─ mirror_enrichment ──────── VIC-II/SID/CIA mirror → canonical addr
    │   ├─ memory_map_enrichment ──── address → chip/region lookup
    │   ├─ color_enrichment ───────── value 0-15 → C64 color name
    │   ├─ opcode_enrichment ──────── 6502 mnemonic detection (no-addr queries only)
    │   ├─ register_enrichment ────── VIC/SID/CIA mnemonic detection
    │   └─ tag_enrichment ─────────── KERNAL label detection
    │
    ▼
[3. pipeline.ts] ──────────────  concatenate all additionalContext → enriched query
                                 collect all filterTags → tag set
    │
    ▼
[4. search/strategy.ts] ──────  hasNaturalLanguage(query) → boolean
    │                             determine strategy from (hasTags, hasNL):
    │                             → hybrid:   tags + NL → filtered + unfiltered, merged
    │                             → filtered: tags only → filtered vector search
    │                             → semantic: NL only   → unfiltered vector search
    ▼
[5. search/qdrant.ts] ─────────  enriched query → OpenAI embedding → vector
    + search/embedding.ts         vector + filterTags → Qdrant REST API
                                  mergeResults() + trimByScore()
    │
    ▼
[6. format/markdown.ts] ───────  SearchHit[] → formatted markdown → stdout
```

Enriched query format: `query\n[all additionalContext joined with "; "]`

---

## Design Decisions

### Numbers Extracted Once, Plugins Are Generic

Number extraction (`numbers.ts`) is a pre-processing step, not a plugin. It scans the query for numeric tokens (`$hex`, `%binary`, bare decimals, post-comma POKE values) and converts each to all bases. The resulting `ParsedNumber[]` is read-only and shared with every plugin.

```typescript
interface ParsedNumber {
  sourceToken: string;    // original text: "$D020", "53280", "%00001111"
  value: number;          // numeric value
  decimal: string;        // "53280"
  hex: string;            // "$D020"
  binary?: string;        // "%11010000_00100000" (if ≤ 255)
}
```

### Plugin Interface

Plugins are deliberately generic — they return search data, not plugin-specific fields. The orchestrator doesn't need to know what each plugin does.

```typescript
interface EnrichmentInput {
  readonly query: string;
  readonly numbers: readonly ParsedNumber[];
}

interface EnrichmentResult {
  additionalContext: string[];  // appended to search query
  filterTags: string[];         // for Qdrant keyword filtering on `tags` field
}

interface EnrichmentPlugin {
  name: string;
  enrich(input: EnrichmentInput): EnrichmentResult;
}
```

Each plugin gets the same read-only input and returns its own result. No shared mutable state. The orchestrator concatenates all `additionalContext` and collects all `filterTags`.

### Auto-Discovery

`enrichment/index.ts` scans its own directory for `*_enrichment.ts` files, dynamically imports each, finds the exported class with an `enrich()` method, and caches the instances. Adding a new enrichment plugin = drop a file in the directory. No registry to edit.

---

## Enrichment Plugins

| Plugin | What it does | additionalContext | filterTags |
|--------|-------------|-------------------|------------|
| `number_enrichment.ts` | Multi-base conversion for all detected numbers | `"53280 = $D020"`, `"14 = $0E / %00001110"` | 4-digit hex addresses (`$D020`) |
| `mirror_enrichment.ts` | Resolves VIC-II/SID/CIA mirror addresses to canonical | `"$D040 is mirror of $D000 (VIC-II SP0X)"` | Canonical address (`$D000`) |
| `memory_map_enrichment.ts` | Looks up addresses > 255 in the C64 memory map | `"$D020 → VIC-II Border Color (border color, bits 0-3)"` | — |
| `color_enrichment.ts` | Maps values 0-15 to C64 color names | `"14 = Light Blue"` | Color name (`LIGHT BLUE`) |
| `opcode_enrichment.ts` | Detects 6502 instruction mnemonics in query text | — | Mnemonic (`LDA`, `STA`, `JSR`) |
| `register_enrichment.ts` | Detects VIC-II/SID/CIA register mnemonic names | — | Register name (`SP0X`, `FRELO1`, `SIGVOL`) |
| `tag_enrichment.ts` | Detects KERNAL API labels in query text | — | Label (`CHROUT`, `SETLFS`, `LOAD`) |

The opcode enrichment plugin only fires when the query contains no hex addresses — this prevents noise when the user is asking about specific memory locations.

### Mirror Ranges

```typescript
const MIRROR_RANGES = [
  { regionStart: 0xD000, regionEnd: 0xD3FF, registerCount: 47, period: 64, chipName: "VIC-II" },
  { regionStart: 0xD400, regionEnd: 0xD7FF, registerCount: 29, period: 32, chipName: "SID" },
  { regionStart: 0xDC00, regionEnd: 0xDCFF, registerCount: 16, period: 16, chipName: "CIA1" },
  { regionStart: 0xDD00, regionEnd: 0xDDFF, registerCount: 16, period: 16, chipName: "CIA2" },
];
```

Resolution: `canonical = regionStart + ((addr - regionStart) % period)`

The mirror plugin adds the canonical address as a `filterTag` so Qdrant finds docs tagged with the real register address, even when the user queries a mirror.

---

## Search Module

- **`search/qdrant.ts`** — Qdrant REST API via built-in `fetch()`. Vector search with optional tag filtering on the `tags` keyword field. Includes `mergeResults()` (dedup by point ID, primaries first) and `trimByScore()` (adaptive threshold relative to best score).
- **`search/embedding.ts`** — OpenAI `text-embedding-3-large` via the `openai` npm package.
- **`search/strategy.ts`** — Three strategies matching the original Python behavior. Also handles natural language detection (strips addresses, numbers, and tags from the query; if 2+ words remain, natural language is present).

---

## File Structure

```
query/
  package.json
  tsconfig.json
  README.md                         Setup, usage, how to add plugins
  ARCHITECTURE.md                   This file
  commands/
    qdrant.md                       Slash command definition for /query-qdrant
  src/
    index.ts                        CLI entry point (arg parsing, validation)
    types.ts                        Shared interfaces (QueryConfig, SearchHit, ParsedNumber)
    numbers.ts                      Number extraction + base conversion
    pipeline.ts                     Orchestrator
    enrichment/
      types.ts                      EnrichmentPlugin interface
      index.ts                      Auto-discovery + aggregation runner
      number_enrichment.ts          Multi-base conversion
      mirror_enrichment.ts          VIC-II/SID/CIA mirror resolution
      memory_map_enrichment.ts      Address-to-region lookup
      color_enrichment.ts           C64 color names (0-15)
      opcode_enrichment.ts          6502 mnemonic detection
      register_enrichment.ts        Register mnemonic detection
      tag_enrichment.ts             KERNAL label detection
    search/
      qdrant.ts                     Qdrant REST API wrapper
      embedding.ts                  OpenAI embedding generation
      strategy.ts                   Search strategy selection + NL detection
    format/
      markdown.ts                   Result formatting for Claude
```

---

## Configuration

| Setting | Default | Source |
|---------|---------|--------|
| Qdrant URL | `http://localhost:6333` | `types.ts` defaults |
| Collection | `c64_training` | `types.ts` defaults |
| Embedding model | `text-embedding-3-large` | `types.ts` defaults |
| Result limit | 15 | `types.ts` defaults |
| Fetch limit | 20 | `types.ts` defaults |
| Min score ratio | 0.6 | `types.ts` defaults |
| OpenAI API key | — | `OPENAI_API_KEY` env var |

---

## CLI Flags

| Flag | Effect |
|------|--------|
| `--limit N` | Override result limit |
| `--raw` | Skip enrichment, pass query as-is |
| `--enrich-only` | Show enrichment output without searching |

---

## Example

Query: `"What does POKE 53280, 14 do?"`

1. **extractNumbers()** → `[{ value: 53280, hex: "$D020" }, { value: 14, hex: "$0E", binary: "%00001110" }]`
2. **number_enrichment** → context: `"53280 = $D020"`, `"14 = $0E / %00001110"` — tags: `["$D020"]`
3. **memory_map_enrichment** → context: `"$D020 → VIC-II Border Color"` — tags: none
4. **color_enrichment** → context: `"14 = Light Blue"` — tags: `["LIGHT BLUE"]`
5. **Enriched query**: `"What does POKE 53280, 14 do?\n[53280 = $D020; 14 = $0E / %00001110; $D020 → VIC-II Border Color; 14 = Light Blue]"`
6. **Strategy**: Hybrid (tags `$D020` + natural language detected)
7. **Search**: Filtered vector search on `$D020` + unfiltered semantic, merged and trimmed

---

## Dependencies

- `openai` — embedding generation
- `tsx` — TypeScript execution without compile step
- `typescript` — type checking
- `@types/node` — Node.js type definitions
