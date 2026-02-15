# C64 Qdrant Query System

Hybrid search tool for the C64/6502 knowledge base. Combines semantic vector search with keyword filtering, enriched by a plugin architecture that converts numbers between bases, resolves mirror addresses, maps memory regions, and detects known C64 terms.

## Setup

```bash
cd query
npm install
```

Requires:

- **Node.js 18+** (for built-in `fetch()`)
- **OPENAI_API_KEY** environment variable (for embeddings)
- **Qdrant** running at `http://localhost:6333` with a `c64_training` collection

## Usage

```bash
# Basic query
npx tsx src/index.ts "What does setting 53280, 13 do?"

# Limit results
npx tsx src/index.ts --limit 5 "SID voice 1 ADSR"

# Skip enrichment (pass query as-is)
npx tsx src/index.ts --raw "already enriched query"

# Show enrichment only (no search)
npx tsx src/index.ts --enrich-only "53280 and 13"
```

## How It Works

### Pipeline

```
query string
    ↓
numbers.ts: extractNumbers() → ParsedNumber[]
    ↓
enrichment plugins: each returns { additionalContext[], filterTags[] }
    ↓
pipeline.ts: build enriched query + collect tags
    ↓
search: hybrid (text and filter) | filtered | semantic → Qdrant vector search
    ↓
format: markdown output
```

### Search Strategies

| Tags? | Natural Language? | Strategy                                                 |
| ----- | ----------------- | -------------------------------------------------------- |
| Yes   | Yes               | **Hybrid** — filtered + unfiltered vector search, merged |
| Yes   | No                | **Filtered** — keyword-filtered vector search only       |
| No    | —                 | **Semantic** — pure vector search                        |

### Enrichment

Numbers are extracted once and passed to all plugins. Each plugin independently returns context strings and filter tags. The orchestrator doesn't need to know what any plugin does.

Example: query `"What does POKE 53280, 14 do?"`

- **Number plugin**: `53280 = $D020`, `14 = $0E / %00001110`
- **Color plugin**: `14 = Light Blue`
- **Memory map plugin**: `$D020 → VIC-II Border Color (border color, bits 0-3)`
- **Filter tags**: `$D020`

Enriched query: `What does POKE 53280, 14 do?\n[53280 = $D020; 14 = $0E / %00001110; 14 = Light Blue; $D020 → VIC-II Border Color (border color, bits 0-3)]`

## Adding Enrichment Plugins

1. Create `src/enrichment/my_enrichment.ts`
2. Export a class implementing `EnrichmentPlugin`:

```typescript
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
} from "./types.js";

export class MyEnrichment implements EnrichmentPlugin {
  name = "my_plugin";

  enrich(input: EnrichmentInput): EnrichmentResult {
    // input.query — original query text
    // input.numbers — pre-extracted ParsedNumber[]
    return {
      additionalContext: ["extra search context"],
      filterTags: ["SOME_TAG"],
    };
  }
}
```

3. Done — auto-discovery picks it up. No registry to edit.

## File Structure

```
src/
  index.ts              CLI entry point
  types.ts              Shared interfaces (QueryConfig, SearchHit, ParsedNumber)
  numbers.ts            Number extraction + base conversion
  pipeline.ts           Orchestrator
  classify.ts           Natural language detection
  enrichment/
    types.ts            EnrichmentPlugin interface
    index.ts            Auto-discovery + runner
    number_enrichment.ts    Multi-base conversion
    mirror_enrichment.ts    VIC-II/SID/CIA mirror resolution
    memory_map_enrichment.ts Address-to-region lookup
    opcode_enrichment.ts    6502 opcode recognition (only added if query does not contain an memory address)
    color_enrichment.ts     C64 color names
    register_enrichment.ts  Register mnemonic detection
    tag_enrichment.ts       KERNAL label detection
  search/
    qdrant.ts           Qdrant REST API
    embedding.ts        OpenAI embeddings
    strategy.ts         Search strategy selection
  format/
    markdown.ts         Result formatting
  data/
    memory_map.ts       C64 memory map table
    kernal_labels.ts    KERNAL API labels
    register_mnemonics.ts VIC-II/SID/CIA register names
    color_names.ts      C64 color palette
    mirror_ranges.ts    I/O chip mirror definitions
```
