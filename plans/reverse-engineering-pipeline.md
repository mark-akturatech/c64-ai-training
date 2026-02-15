# C64 Reverse Engineering Automation Pipeline

## Context

We have a comprehensive C64/6502 knowledge base in Qdrant (4000+ chunks), an MCP tools plan ([ai-disassembler-mcp.md](plans/ai-disassembler-mcp.md)) that defines interactive MCP tools, and a static analysis plan ([static-analysis.md](plans/static-analysis.md)) that defines the deterministic code/data classification layer. What's missing is the **automated reverse engineering workflow** — how the AI pipeline processes the static analysis output (`blocks.json`) through multiple passes, using OpenAI (gpt-5-mini, cheap) for bulk AI work and Qdrant for domain knowledge. Claude is reserved for interactive refinement of hard cases only.

**This plan defines the batch AI pipeline.** It takes `blocks.json` from static analysis and runs 5 AI passes to annotate, analyze, name, document, and integrate the code into a fully documented KickAssembler project. All code is TypeScript/Node.js.

**Related plans:**
- [static-analysis.md](plans/static-analysis.md) — produces `blocks.json` (input to this pipeline)
- [ai-disassembler-mcp.md](plans/ai-disassembler-mcp.md) — defines MCP tools and output format

---

## Pipeline Overview

```
.prg + entry address
    |
    v
[Static Analysis Pipeline] ──────────────── blocks.json
    (See static-analysis.md)                 (code + data + unknown blocks)
    |
    v                                        ┌─────────────────────────┐
[Pass 1: annotate_instructions.ts] ──────── annotated_blocks.json
    |       symbol_db lookups (deterministic) │  Project Qdrant         │
    |       + OpenAI for unknowns            │  Collection             │
    v                                        │  (re_<project>)         │
[Pass 2: analyze_blocks.ts] ─────────────── block_analysis.json
    |       OpenAI determines purpose        │                         │
    |       Search similar blocks ◄──────────┤  ◄── embed after each   │
    |       Research loop: Qdrant KB         │       block analysis    │
    |       Data discovery loop              │                         │
    v                                        │  c64_re_patterns        │
[Pass 3: name_variables.ts] ─────────────── variable_dict.json
    |       OpenAI proposes names            │  ◄── search by variable │
    |       Variable propagation ◄───────────┤  ◄── update embeddings  │
    |       naming.ts conventions            │       after pass 3      │
    v                                        └─────────────────────────┘
[Pass 4: document_blocks.ts] ──────────────── documented_blocks.json
    |       OpenAI writes full routine docs
    |       Flags LOW certainty for human review
    v
[Pass 5: integrate_analysis.ts] ───────────── integration.json
    |       OpenAI determines program structure
    |       File splitting, architecture docs
    v
[kickass_emitter.ts + verify.ts] ──────────── KickAssembler output + verification
    |                                          ▼
    v                                        Promote HIGH blocks
[Human review via Claude + MCP tools]        to c64_re_patterns
    Review flagged items, iterate
```

Each pass reads JSON from the previous pass and writes its own JSON. Any pass can be re-run independently.

---

## Pre-requisite: Static Analysis

Before the AI pipeline runs, the static analysis pipeline must produce `blocks.json`. See [static-analysis.md](plans/static-analysis.md) for the full design.

**Input:** `.prg` file + entry address (or `.asm` disassembly dump — auto-detected format)

**What it does (6-step deterministic pipeline, no AI):**
1. Load binary into 64KB memory image
2. Decode opcodes via custom 256-entry TypeScript lookup table
3. Detect entry points (BASIC SYS stub, IRQ/NMI vector setup patterns)
4. Discover code via recursive descent + Spedi-inspired speculative discovery
5. Build cross-reference database (calls, reads, writes, hardware refs, data refs, SMC)
6. Assemble blocks with metadata, classify data regions, sub-split large blocks, apply known symbols

**Output:** `blocks.json` — one entry per subroutine/data region/unknown region, with full instruction data, basic blocks, xrefs, hardware refs, reachability classification, and sub-block sibling references for blocks exceeding 120 instructions.

**Implementation:** TypeScript/Node.js (`src/static-analysis/`). Invoked as:
```
npx tsx src/static-analysis/index.ts input.prg --entry 0x0810
npx tsx src/static-analysis/index.ts input.prg              # auto-detect entry from BASIC stub
npx tsx src/static-analysis/index.ts disasm.asm --format regenerator
```

The pipeline also needs the original binary bytes for AI data requests during Pass 2. The static analysis stores these in `blocks.json` as a `raw_binary` field (base64-encoded loaded regions).

---

## Block Structure (blocks.json)

The `blocks.json` format is fully defined in [static-analysis.md — Output](plans/static-analysis.md#output). The static analysis pipeline is self-contained and owns the schema.

**Key points for the AI pipeline:**
- Every loaded byte belongs to exactly one block (coverage guarantee — no gaps)
- Block types: `subroutine`, `irq_handler`, `fragment`, `data`, `unknown`
- Reachability: `proven`, `indirect`, `unreachable` — `unreachable` blocks are prime candidates for data reclassification in Pass 2
- Data blocks carry a `candidates` array with ALL detector proposals (not just the winner)
- Large subroutines (>120 instructions) are sub-split with sibling summaries
- `raw_binary` field contains base64-encoded loaded regions for AI data requests
- `coverage` section shows code/data/unknown byte counts and percentages

---

## Data Detection Strategy

Data detection is the hardest problem in disassembly. On the 6502, there's no metadata separating code from data — the same bytes can be valid instructions AND meaningful data. Our approach is **two-phase**: static heuristics first (cheap, deterministic), then AI refinement (smart, iterative).

### Phase A: Static Detection (before pipeline)

Deterministic heuristics applied during static analysis. No AI. See [static-analysis.md](plans/static-analysis.md) Step 5 (xref_builder.ts) and Step 6 (block_builder.ts) for full implementation.

**Summary of what static analysis detects** (see [static-analysis.md](plans/static-analysis.md) `data_detectors.ts` for full details):
- **Sprite data** — trace sprite pointer writes ($07F8+) back to `LDA #N` → data at N*64+VIC_bank (HIGH confidence)
- **Character sets** — trace `$D018` writes to compute charset address, 2048 bytes (HIGH confidence)
- **Screen/color maps** — trace `$D018` writes, 1000 bytes each (MEDIUM confidence)
- **Bitmap data** — detect `$D011` bit 5 set + `$D018` bit 3, 8000 bytes (MEDIUM confidence)
- **Strings** — multiple encodings: PETSCII null-terminated, high-bit terminated, length-prefixed, screen codes. Cross-referenced with CHROUT print loops (HIGH confidence when code-referenced)
- **SID music data** — frequency table detection (known PAL note values), player routine tracing, known player signatures (MEDIUM confidence)
- **Jump/RTS dispatch tables** — detect `LDA lo,X / PHA / LDA hi,X / PHA / RTS` pattern, entries are code addresses (HIGH confidence)
- **Lookup tables** — screen line offsets (25 entries, +40 each), bit masks ($01,$02,...,$80), sine tables (periodicity check), multiplication tables, color tables (all ≤$0F) (MEDIUM confidence)
- **Pointer patterns** — A/Y register pairs, zero page pointer pairs pointing into program space (MEDIUM confidence)
- **Boundary detection** — format-specific sizes, null-termination, next code address, copy loop lengths

Everything not reachable by recursive descent AND not matched by format heuristics → `unknown`. Could be dead code, unlinked data, or code reachable only via indirect jumps.

### Phase B: AI-Driven Data Discovery (during Pass 2)

The AI doesn't just analyze code blocks — it also **discovers and classifies data** as a side-effect of understanding code. This is the key insight: code tells you what data means.

**How it works:**

1. AI analyzes a code block and sees data references (e.g., `LDA $C800,X / CMP #$00 / BEQ done`)
2. AI can **request raw bytes** at any address range via `data_request` in its response:
   ```json
   {
     "purpose": "...",
     "data_requests": [
       {"start": "0xC800", "end": "0xC8FF", "reason": "Code reads bytes until null found"}
     ]
   }
   ```
3. Script fetches raw bytes from the binary and re-submits to AI with context:
   ```
   You requested data at $C800-$C8FF. Here are the raw bytes:
   C800: 57 52 49 54 54 45 4E 20  WRITTEN
   C808: 42 59 20 4A 2E 53 4D 49  BY J.SMI
   C810: 54 48 00 FF FF FF FF FF  TH......

   The code at sub_C000 reads this data sequentially until $00 is found.
   Classify this data region.
   ```
4. AI returns data classification:
   ```json
   {
     "data_discoveries": [
       {
         "start": "0xC800",
         "end": "0xC812",
         "type": "string",
         "subtype": "petscii_null_terminated",
         "label": "txt__author",
         "value": "WRITTEN BY J.SMITH",
         "confidence": "HIGH",
         "evidence": "Null-terminated, read byte-by-byte in print loop"
       }
     ]
   }
   ```
5. Discovery gets merged into `blocks.json` — the `unknown` block at $C800 becomes a `data` block
6. Other blocks referencing $C800 now get this context in their analysis

**This is iterative.** As more code blocks are analyzed, more data blocks are discovered, which provides more context for analyzing remaining code blocks. The topological ordering (leaf subroutines first) means we discover data from the simplest code first.

**Data requests are capped** at `--data-request-max` (default 3) per block to prevent runaway chains.

### Inter-Procedural Data Tracing

The hardest case: data addressed via pointers passed between subroutines.

```
caller:
    LDA #<bitmap_data    ; $FB = low byte of bitmap address
    STA $FB
    LDA #>bitmap_data    ; $FC = high byte
    STA $FC
    JSR process_bitmap   ; process_bitmap uses LDA ($FB),Y

bitmap_data:
    .byte $01,$02,...    ; this is data, but only process_bitmap knows why
```

**Static analysis** can detect this:
1. `process_bitmap` uses indirect addressing via `($FB),Y`
2. All callers of `process_bitmap` store values in `$FB/$FC` before the JSR
3. If those stored values are immediate (not computed), they form addresses
4. Those addresses → data candidates

**AI analysis** refines this:
1. When analyzing `process_bitmap`, AI sees it uses `($FB),Y` and can infer it processes sequential data
2. When analyzing `caller`, AI sees the `LDA #<addr / STA $FB` pattern and connects it to the callee's data usage
3. AI requests the bytes at `bitmap_data` to classify them

This is handled naturally by the topological ordering + context passing. By the time we analyze `caller`, we already know what `process_bitmap` does (it was analyzed first as a leaf). The AI sees: "Calls process_bitmap (purpose: 'Process bitmap data row by row') and passes address $4000 as pointer in $FB/$FC" → requests data at $4000.

---

## Pass 1: Instruction Annotation

### `annotate_instructions.ts` — Hybrid Deterministic + AI

```
npx tsx src/pipeline/annotate_instructions.ts blocks.json
npx tsx src/pipeline/annotate_instructions.ts blocks.json --workers 4 --block sub_C000
```

**Two-tier approach:**

**Tier 1 — Deterministic (no AI, from symbol_db):**
- `sta $D020` → "Set border color (VIC_BORDER_COLOR)"
- `jsr $FFD2` → "CHROUT: print character in A"
- `lda $DC00` → "Read CIA1 data port A (keyboard/joystick)"
- `sta $01` → "Set processor port (memory banking)"
- `cmp #$28` → "Compare with 40 (screen width)"
- `and #$0F` → "Mask to lower nybble (color value 0-15)"
- All KERNAL entry points, hardware registers, zero page system vars

**Tier 2 — AI (OpenAI, for unknowns):**
Instructions that Tier 1 can't annotate are batched by subroutine and sent to OpenAI. The AI sees the full subroutine for context.

```
System: You are annotating 6502 assembly for the Commodore 64.
For each instruction, provide a brief annotation explaining what it does IN CONTEXT.

This subroutine:
- Is called from $0810 (1 call site)
- Accesses VIC-II sprite registers $D000-$D00F
- Has a loop with back-edge $C01F → $C000

[Full subroutine with Tier 1 annotations already applied]

Return JSON array for the un-annotated instructions only:
[{"address": "$C005", "annotation": "Store current sprite index"}]
```

**Cost optimisation:** Subroutines where 100% of instructions were annotated deterministically skip the AI call entirely. Typically 30-60% of instructions in C64 code hit Tier 1 (hardware registers, KERNAL calls, comparison constants).

**Output:** `annotated_blocks.json` — same structure as blocks.json with `annotation` and `annotation_source` ("symbol_db" or "ai") added to each instruction.

---

## Pass 2: Block Purpose Analysis + Context + Research

### `analyze_blocks.ts` — OpenAI + Qdrant + Cross-Block Context

```
npx tsx src/pipeline/analyze_blocks.ts annotated_blocks.json
npx tsx src/pipeline/analyze_blocks.ts annotated_blocks.json --research-max 2 --context-max 2 --data-request-max 3 --workers 4
```

### Analysis Ordering (Topological)

Blocks are NOT analysed in address order. Instead, use the call graph to process **leaf subroutines first** (those that only call KERNAL/hardware, not other user subroutines), then work upward:

1. Topological sort of the call graph (reverse post-order)
2. Leaf subroutines first — these are easiest (no unknown callees)
3. Then subroutines that call only already-analysed blocks
4. Continue until all processed
5. For cycles (mutual recursion): analyse together with whatever context is available, flag as needing review

This means when we analyse block X, all of X's callees already have purposes/names (or are KERNAL/hardware with known semantics). This dramatically improves analysis quality.

**Parallelization within topological levels:** The `--workers` flag parallelizes API calls within each topological level. Blocks at the same level have no dependencies on each other (they don't call each other), so they can be analyzed concurrently. Blocks at the next level wait until all blocks at the current level complete. Example: if leaves are {A, B, C, D} and the next level is {E calls A+B, F calls C+D}, then A/B/C/D run in parallel, then E/F run in parallel. This preserves correctness while maximizing throughput.

### Cross-Block Context Passing

**A block cannot be understood in isolation.** Each block's analysis prompt includes context about its relationships:

```
System: You are analyzing a 6502 subroutine from a Commodore 64 program.

This subroutine's context:
- Called by:
  * init_game @ $0810 (purpose: "Initialize game state and hardware") [HIGH]
  * unknown @ $0900 [NOT YET ANALYSED]
- Calls:
  * CHROUT @ $FFD2 (KERNAL: print character in A) [KNOWN]
  * init_sid @ $C100 (purpose: "Initialize SID chip for game music") [HIGH]
  * unknown @ $C200 [NOT YET ANALYSED]
- Hardware: $D000-$D00F (write), $D015 (write)
- Comparisons: CPX #$08, CMP #$28
- Loop: back-edge $C01F → $C000

Known C64 code patterns matching this block:
- "Sprite position initializer" [PATTERN] — Loop sets sprite X/Y from table
  (seen in: archon, chess)

Similar blocks already analyzed in this program:
- init_sprites @ $C000 [HIGH] — "Initialize all 8 sprite positions and colors"
  Similarity: same VIC-II sprite registers, similar loop structure

These patterns/similar blocks are hints only. Verify against the actual code.

If you need to see the full code of a related block for better understanding,
add it to "context_needed" in your response.

If this code references data addresses, you can request the raw bytes at those
addresses via "data_requests" to classify what the data is.

If this block looks like it was misidentified as code (nonsensical instruction
sequences, unreachable, or referenced as data by other blocks), say so in
"reclassify".

Return JSON:
{
  "purpose": "1-2 sentence description",
  "purpose_short": "verb_first_name (e.g. init_sprites)",
  "category": "init|main_loop|graphics|sound|input|ai|math|irq|data|io|util",
  "certainty": "HIGH|MEDIUM|LOW",
  "research_needed": ["topic to look up in knowledge base", ...],
  "context_needed": ["sub_C200"],
  "data_requests": [
    {"start": "$C800", "end": "$C8FF", "reason": "Code reads sequentially until $00"}
  ],
  "data_discoveries": [],
  "reclassify": null,
  "algorithm_summary": "Brief algorithm description",
  "hardware_interaction": [{"register": "$D020", "usage": "write", "purpose": "Set border color"}],
  "side_effects": ["Enables all 8 sprites"]
}
```

**Context format for callers/callees:**
- Analysed blocks: `name @ $addr (purpose: "...") [confidence]`
- KERNAL/hardware: `LABEL @ $addr (description) [KNOWN]`
- Not yet analysed: `unknown @ $addr [NOT YET ANALYSED]`

This gives the AI crucial context. If a block is called by `init_game` and calls `init_sid`, the AI can infer it's probably part of the init sequence.

### Context Request Loop

When `context_needed` is non-empty — the AI wants to see the full code of a related block:

1. Fetch the requested blocks from annotated_blocks.json
2. Include their analysis if available (purpose, category)
3. Re-submit the current block with the additional context:
   ```
   You requested context for these related blocks:

   --- sub_C200 (annotated code) ---
   [Full annotated subroutine]
   [Analysis if available: purpose, category]
   ---

   Re-analyse the original block with this context.
   ```
4. Cap at `--context-max` iterations (default 2) to prevent runaway chains

### Research Loop (Qdrant)

Separate from context requests. When `research_needed` is non-empty:

1. For each topic (e.g. "VIC-II bitmap mode data layout"):
   - Query Qdrant via `qdrant_search.ts` module (hybrid search with enrichment)
   - Collect top 3-5 results per topic
2. Re-submit block + Qdrant context to OpenAI:
   ```
   You previously analysed this block and requested research.
   Here is relevant documentation from the knowledge base:

   --- Topic: "VIC-II bitmap mode data layout" ---
   [Result 1: title + key content]
   [Result 2: ...]
   ---

   Re-analyse with this context. Return the same JSON schema.
   ```
3. If still `research_needed` and iterations < `--research-max` (default 2): repeat
4. If still LOW after max iterations: flag `needs_review: true` for human attention

### Data Request Loop

When `data_requests` is non-empty — the AI wants to examine raw bytes at specific addresses:

1. Fetch raw bytes from the original binary at the requested address range
2. Format as hex dump with ASCII sidebar
3. Include any existing data classifications for those addresses
4. Re-submit to AI with the data:
   ```
   You requested data at $C800-$C8FF. Here are the raw bytes:
   C800: 57 52 49 54 54 45 4E 20  WRITTEN
   C808: 42 59 20 4A 2E 53 4D 49  BY J.SMI
   C810: 54 48 00 FF FF FF FF FF  TH......

   Classify this data and update your analysis.
   ```
5. AI returns `data_discoveries`:
   ```json
   {
     "data_discoveries": [
       {
         "start": "0xC800", "end": "0xC812",
         "type": "string", "subtype": "petscii_null_terminated",
         "label": "txt__author", "value": "WRITTEN BY J.SMITH",
         "confidence": "HIGH",
         "evidence": "Null-terminated, read byte-by-byte in print loop"
       }
     ]
   }
   ```
6. Discoveries get merged into `blocks.json` — `unknown` blocks become `data` blocks
7. Subsequent block analyses see these data classifications in their context
8. Cap at `--data-request-max` iterations (default 3) per block

### Reclassification

When `reclassify` is non-null — the AI thinks this block was misidentified:
```json
{
  "reclassify": {
    "from": "subroutine",
    "to": "data",
    "reason": "Instructions decode but make no logical sense. Bytes match sprite data pattern (63+1 alignment). Referenced as data by sub_C100.",
    "confidence": "HIGH"
  }
}
```
Reclassified blocks get removed from the code analysis queue and added to the data block list. If reclassified as data, the AI's classification (type, label) is recorded.

**All three loops can trigger in the same analysis.** A single block might need context from related blocks, Qdrant research, AND data requests. The script handles all three, in order: context first (may resolve other needs), then data requests (may clarify purpose), then research (domain knowledge for remaining unknowns).

**After each block is analyzed**, it's immediately embedded into the project Qdrant collection (see [Project Qdrant Collection](#project-qdrant-collection)). This means the next block in topological order can find it via similarity search. Before analyzing each block, the script searches both the `c64_re_patterns` collection (cross-program patterns) and the `re_<project>` collection (already-analyzed blocks in this program) for similar blocks and includes top matches as hints in the prompt.

### Qdrant Integration

Extract core search functions from [query_qdrant.py](scripts/query_qdrant.py) into a shared `qdrant_search.ts` module:
- `enrichQuery()` — number enrichment, memory map enrichment
- `extractHexAddresses()` — find hex addresses in query
- `qdrantSearch()` — hybrid filtered + semantic search
- `searchQdrant(query, limit)` — convenience wrapper

Both the existing `query_qdrant.py` CLI (Python, stays as-is for training pipeline) and `analyze_blocks.ts` use the same Qdrant search logic. The TypeScript module reimplements the search algorithm from `query_qdrant.py`.

**Output:** `block_analysis.json` with per-block analysis including certainty, research history, and context request history.

### block_analysis.json Schema

```json
{
  "metadata": {
    "source": "annotated_blocks.json",
    "timestamp": "2025-01-15T14:30:00Z",
    "model": "gpt-5-mini",
    "total_blocks": 47,
    "certainty_summary": {"HIGH": 38, "MEDIUM": 6, "LOW": 3},
    "total_ai_calls": 80,
    "total_research_queries": 15,
    "total_data_requests": 12,
    "total_reclassifications": 2
  },
  "blocks": {
    "sub_C000": {
      "id": "sub_C000",
      "address": "0xC000",
      "end_address": "0xC03F",
      "type": "subroutine",
      "reachability": "proven",
      "purpose": "Initialize all 8 sprite positions and colors from lookup tables in preparation for game start",
      "purpose_short": "init_sprites",
      "category": "graphics",
      "certainty": "HIGH",
      "algorithm_summary": "Loop from 0 to 7. For each sprite: load X position from pos_table_lo/hi, store to VIC-II X/Y registers. Load color from color_table, store to sprite color register. Finally enable all 8 sprites via $D015.",
      "hardware_interaction": [
        {"register": "$D000", "usage": "write", "purpose": "Set sprite 0 X position low byte"},
        {"register": "$D001", "usage": "write", "purpose": "Set sprite 0 Y position"},
        {"register": "$D010", "usage": "write", "purpose": "Set sprite X position MSB (bit per sprite)"},
        {"register": "$D015", "usage": "write", "purpose": "Enable all 8 sprites (write #$FF)"},
        {"register": "$D027", "usage": "write", "purpose": "Set sprite 0 color"}
      ],
      "side_effects": [
        "Enables all 8 sprites",
        "Overwrites zero page $FB (loop counter)",
        "Assumes sprite data pointers already configured"
      ],
      "data_discoveries": [
        {
          "start": "0xC800",
          "end": "0xC810",
          "type": "table",
          "subtype": "byte_lookup",
          "label": "tbl__sprite_pos_x_lo",
          "confidence": "HIGH",
          "evidence": "8 entries indexed by sprite number, used as X position low bytes"
        }
      ],
      "reclassify": null,
      "needs_review": false,
      "review_reason": null,
      "similar_blocks_found": [
        {"id": "sub_C100", "similarity": "Same VIC-II sprite registers, similar loop"}
      ],
      "patterns_matched": [
        {"pattern": "Sprite position initializer", "confidence": 0.87}
      ],
      "analysis_history": {
        "context_requests": 0,
        "context_blocks_fetched": [],
        "research_queries": [],
        "research_results_used": 0,
        "data_requests": 1,
        "data_bytes_fetched": 256,
        "iterations": 1,
        "initial_certainty": "HIGH",
        "certainty_progression": ["HIGH"]
      }
    },
    "sub_C300": {
      "id": "sub_C300",
      "address": "0xC300",
      "end_address": "0xC35F",
      "type": "subroutine",
      "reachability": "unreachable",
      "purpose": "Purpose unclear. Complex bit manipulation on sequential bytes. Possibly bitmap decoding or decompression.",
      "purpose_short": "unknown_bitops",
      "category": "util",
      "certainty": "LOW",
      "algorithm_summary": "Reads bytes from ($FB),Y sequentially. For each byte, rotates bits left, masks with AND #$03, stores to output buffer. Pattern suggests 2-bit-per-pixel unpacking but target format is unclear.",
      "hardware_interaction": [],
      "side_effects": ["Writes to buffer at $0400-$07E7 (screen RAM?)"],
      "data_discoveries": [],
      "reclassify": null,
      "needs_review": true,
      "review_reason": "LOW certainty after 2 research iterations. Unreachable by static analysis — may be dead code or called via indirect jump. Bit manipulation pattern not matched by any known C64 technique in knowledge base.",
      "similar_blocks_found": [],
      "patterns_matched": [],
      "analysis_history": {
        "context_requests": 1,
        "context_blocks_fetched": ["sub_C200"],
        "research_queries": ["VIC-II bitmap decoding bit rotation", "C64 2bpp sprite unpacking"],
        "research_results_used": 3,
        "data_requests": 2,
        "data_bytes_fetched": 512,
        "iterations": 4,
        "initial_certainty": "LOW",
        "certainty_progression": ["LOW", "LOW", "LOW", "LOW"]
      }
    }
  },
  "data_blocks_discovered": [
    {
      "start": "0xC800",
      "end": "0xC810",
      "type": "table",
      "subtype": "byte_lookup",
      "label": "tbl__sprite_pos_x_lo",
      "discovered_by": "sub_C000",
      "confidence": "HIGH"
    }
  ],
  "reclassified_blocks": [
    {
      "id": "sub_C400",
      "from": "subroutine",
      "to": "data",
      "data_type": "sprite",
      "reason": "Instructions decode but form nonsensical sequence. 64-byte aligned. Referenced as sprite data by sub_C000.",
      "reclassified_by": "sub_C000",
      "confidence": "HIGH"
    }
  ]
}
```

**Key design notes:**
- `blocks` is keyed by block ID for O(1) lookup by downstream passes
- `data_blocks_discovered` and `reclassified_blocks` are top-level arrays for easy pipeline consumption — the orchestrator uses these to update blocks.json before subsequent passes
- `analysis_history` enables debugging and cost tracking — if a block took 4 iterations, we can see why
- `similar_blocks_found` and `patterns_matched` record what the project collection contributed (useful for evaluating whether the collection is helping)
- Two example entries shown: one HIGH certainty (clean analysis) and one LOW certainty (flagged for review) to illustrate the range

---

## Pass 3: Variable Naming

### `name_variables.ts` — OpenAI + Dictionary Management

```
npx tsx src/pipeline/name_variables.ts block_analysis.json
npx tsx src/pipeline/name_variables.ts block_analysis.json --dict variable_dict.json  # update existing
npx tsx src/pipeline/name_variables.ts block_analysis.json --address 0x00FB           # single address
```

**Variable Dictionary Rules:**

1. **Load existing dictionary first.** AI sees existing names before proposing new ones
2. **Hardware registers = KNOWN.** Never renamed. From symbol_db
3. **KERNAL entries = KNOWN.** Never renamed
4. **Scoped naming.** Same address, different subroutines → different scoped names:
   - `$FB` in init_sprites → `idx__sprite` (loop counter 0-7)
   - `$FB` in draw_explosion → `idx__frame` (frame counter 0-3)
5. **Conflict resolution:**
   - KNOWN always wins
   - HIGH vs HIGH → flag conflict, keep existing, record alternative
   - MEDIUM/LOW vs HIGH → upgrade to higher confidence
   - Both MEDIUM/LOW → keep the one with more signals
6. **Usage detection from xrefs:**
   - Read-before-write → parameter (`param__`)
   - Write-then-read in one scope → local (`temp__`)
   - Accessed across subroutines → global
7. **Generic fallback:** If address is used for many different things across many scopes, AI can name it `temp_zp_1` etc.

**Prompt:**
```
System: Name memory variables in a C64 6502 program based on usage patterns.

For each address, provide:
- raw_name: semantic description (e.g. "sprite loop counter")
- type: index|counter|data|flag|pointer|vector|table|buffer|text|sound|parameter|temp
- description: one sentence
- confidence: HIGH|MEDIUM|LOW
- signals: evidence list

I will apply prefix/suffix conventions (idx__, cnt__, data__, etc.) automatically.

Clue values:
- CMP #$08 → 8 sprites / 8 bits
- CMP #$28 (40) → screen width
- CMP #$19 (25) → screen height
- AND #$0F → color value (0-15)
- AND #$07 → bit position or direction
```

**Batching:** Group all addresses used within one subroutine into a single API call. AI sees the full subroutine context + the block analysis (purpose, category) for best naming.

**Variable propagation via project collection:** Before naming variables in each subroutine, search the project Qdrant collection for other blocks using the same addresses (see [Project Qdrant Collection](#project-qdrant-collection)). This adds cross-block context to the naming prompt:
```
Address $FB usage in other analyzed blocks:
- init_sprites @ $C000: "idx__sprite" (loop index, counts 0-7) [HIGH]
- update_positions @ $C100: "idx__sprite" (same loop pattern) [HIGH]
- draw_explosion @ $C200: "idx__frame" (frame counter, counts 0-3) [MEDIUM]

Use consistent names where usage patterns match.
```

This catches variable reuse patterns that call graph analysis misses — two independent routines using `$FB` as a loop counter get consistent naming even if they share no callers or callees.

**Post-processing:** Pass AI's raw names through `naming.ts` (from MCP plan) to enforce prefix/suffix conventions.

**Embedding update:** After Pass 3 completes, re-embed all blocks in the project collection with variable names included. This enriches similarity search for Pass 4 (documentation) and the human review loop.

**variable_dict.json schema:**
```json
{
  "variables": {
    "0x00FB": {
      "entries": [
        {
          "scope": "sub_C000",
          "name": "idx__sprite",
          "raw_name": "sprite loop counter",
          "type": "index",
          "description": "Loop counter iterating over all 8 hardware sprites",
          "confidence": "HIGH",
          "signals": ["loop_counter", "compared_with_8", "indexes_D000"]
        },
        {
          "scope": "sub_C100",
          "name": "idx__frame",
          "raw_name": "animation frame counter",
          "type": "index",
          "description": "Current frame in 4-frame explosion sequence",
          "confidence": "MEDIUM",
          "signals": ["loop_counter", "compared_with_4"]
        }
      ],
      "is_zero_page": true,
      "is_hardware_register": false
    }
  },
  "conflicts": [
    {
      "address": "0x0080",
      "scopes": ["sub_C000", "sub_C200"],
      "resolution": "scoped",
      "note": "Same ZP used as sprite counter in init and temp in main loop"
    }
  ]
}
```

---

## Pass 4: Block Documentation

### `document_blocks.ts` — OpenAI

```
npx tsx src/pipeline/document_blocks.ts
npx tsx src/pipeline/document_blocks.ts --block sub_C000
npx tsx src/pipeline/document_blocks.ts --certainty-min MEDIUM  # skip LOW blocks
```

**For each subroutine, generate:**
- Subroutine name (verb-first snake_case)
- Header comment: what it does + WHY
- `Requires:` section (input registers/memory)
- `Sets:` section (output registers/memory)
- `Notes:` section (caveats)
- Inline comments for non-obvious instructions (WHY not WHAT)

**Input to AI per call:**
- Full annotated subroutine (from annotated_blocks.json)
- Block analysis: purpose, category, algorithm (from block_analysis.json)
- Variable names for all addresses used (from variable_dict.json)
- Cross-block context: caller/callee purposes and names (from block_analysis.json)
  * e.g. "Called by: init_game [HIGH] — initializes all game subsystems"
  * e.g. "Calls: init_sid [HIGH] — sets up SID chip for music playback"

**LOW certainty blocks** get a modified prompt that explicitly says: "This block's purpose is uncertain. Flag what a human reviewer should examine. Be explicit about what you're unsure of."

**Output:** `documented_blocks.json` with per-block documentation including `needs_review` flag.

### documented_blocks.json Schema

```json
{
  "metadata": {
    "source": "block_analysis.json",
    "timestamp": "2025-01-15T14:45:00Z",
    "model": "gpt-5-mini",
    "total_documented": 44,
    "skipped_low_certainty": 3,
    "needs_review": 3
  },
  "blocks": {
    "sub_C000": {
      "id": "sub_C000",
      "name": "init_sprites",
      "header_comment": "Initialize all 8 hardware sprites with positions and colors from lookup tables.\nCalled once during game initialization before the main loop starts.\nSprite data pointers must already be configured before calling this routine.",
      "requires": [
        {"register": null, "address": "$C800", "description": "Sprite X position table (8 bytes)"},
        {"register": null, "address": "$C808", "description": "Sprite Y position table (8 bytes)"},
        {"register": null, "address": "$C810", "description": "Sprite color table (8 bytes)"},
        {"register": null, "address": null, "description": "Sprite data pointers already set in $07F8-$07FF"}
      ],
      "sets": [
        {"register": null, "address": "$D000-$D00F", "description": "VIC-II sprite X/Y position registers"},
        {"register": null, "address": "$D010", "description": "Sprite X MSB register"},
        {"register": null, "address": "$D015", "description": "Sprite enable register (all 8 enabled)"},
        {"register": null, "address": "$D027-$D02E", "description": "Sprite color registers"},
        {"register": "A", "address": null, "description": "Undefined on exit"},
        {"register": "X", "address": null, "description": "Undefined on exit"},
        {"register": "Y", "address": null, "description": "Preserved"}
      ],
      "notes": [
        "Trashes zero page $FB (used as loop counter)",
        "All 8 sprites are enabled regardless of game state — caller should disable unused sprites after if needed"
      ],
      "inline_comments": [
        {"address": "0xC005", "comment": "Skip high-byte X position for sprites 0-3 (always < 256)"},
        {"address": "0xC01A", "comment": "Set MSB for sprites 4-7 whose X > 255"},
        {"address": "0xC025", "comment": "Enable all sprites at once rather than individually"}
      ],
      "needs_review": false,
      "review_notes": null
    },
    "sub_C300": {
      "id": "sub_C300",
      "name": "unknown_bitops",
      "header_comment": "PURPOSE UNCERTAIN: Complex bit manipulation on sequential bytes.\nPossibly bitmap decoding or 2bpp unpacking, but target format unclear.\nWrites output to screen RAM ($0400) which suggests character-mode display.",
      "requires": [
        {"register": null, "address": "$FB-$FC", "description": "Pointer to source data (must be set by caller)"}
      ],
      "sets": [
        {"register": null, "address": "$0400-$07E7", "description": "Screen RAM (filled with decoded output)"},
        {"register": "A", "address": null, "description": "Undefined"},
        {"register": "X", "address": null, "description": "Undefined"},
        {"register": "Y", "address": null, "description": "Undefined"}
      ],
      "notes": [
        "NEEDS REVIEW: No callers found — may be dead code or called via indirect jump",
        "NEEDS REVIEW: Bit rotation pattern (ROL + AND #$03) suggests 2bpp unpacking but no matching C64 technique found",
        "NEEDS REVIEW: If this IS bitmap decoding, the source data format needs identification"
      ],
      "inline_comments": [
        {"address": "0xC310", "comment": "UNCERTAIN: Extract 2 bits — pixel value or palette index?"},
        {"address": "0xC320", "comment": "UNCERTAIN: Output stride suggests 40-column screen layout"}
      ],
      "needs_review": true,
      "review_notes": "Unreachable block with uncertain purpose. Bit manipulation pattern not recognized. Suggest examining bytes at pointer source to determine data format. Check if any jump tables target $C300."
    }
  }
}
```

**Key design notes:**
- `requires` / `sets` capture the subroutine's contract — what it needs and what it changes. This is critical for the emitter to generate proper header comments
- `inline_comments` are keyed by address, not line — the emitter maps these to the correct output lines
- LOW certainty blocks get `NEEDS REVIEW:` prefixed notes and `review_notes` explaining what a human should investigate
- `name` is the final subroutine name (verb-first snake_case) that the emitter uses as the label

---

## Pass 5: Integration Analysis

### `integrate_analysis.ts` — OpenAI

```
npx tsx src/pipeline/integrate_analysis.ts
npx tsx src/pipeline/integrate_analysis.ts --skip-docs  # skip documentation generation
```

**This is the only pass that sees the ENTIRE program.** Previous passes operate per-block.

**Three-part analysis:**

**Part 1 — Program structure:**
- Program type (game, demo, utility)
- Main loop identification
- Init chain
- IRQ/NMI handler mapping
- State machine detection

**Part 2 — File splitting:**
- Group related subroutines into logical files
- File names (verb-noun: `init.asm`, `game_loop.asm`, `sprites.asm`)
- Import dependency order
- Namespace assignments
- Move LOW certainty regions to `unprocessed/`

**Part 3 — Documentation generation:**
- `README.md` — purpose, entry point, memory map, build instructions
- `INTERESTING.md` — clever tricks, modifiable addresses, game mechanics
- `How it works.md` — high-level architecture, module descriptions
- `TERMINOLOGY.md` — domain-specific terms used in labels/comments

**Token management:** For large programs (100+ subroutines), compress the summary to: name, purpose_short, category, immediate callers/callees only.

**Output:** `integration.json` with file assignments, program structure, and generated documentation content.

### integration.json Schema

```json
{
  "metadata": {
    "source": "documented_blocks.json",
    "timestamp": "2025-01-15T15:00:00Z",
    "model": "gpt-5-mini",
    "total_blocks": 47,
    "total_files": 8,
    "coverage_pct": 78
  },
  "program": {
    "type": "game",
    "subtype": "board_game",
    "name": "Chess Master",
    "description": "Two-player chess game with basic AI opponent. Supports human vs human and human vs computer modes.",
    "entry_point": "0x0810",
    "load_address": "0x0801",
    "end_address": "0xCFFF",
    "main_loop": {
      "block": "sub_0900",
      "description": "Game main loop: read input → validate move → update board → check win → draw",
      "frame_driver": "irq",
      "notes": "Main loop runs in IRQ handler, not busy-wait"
    },
    "init_chain": [
      {"block": "sub_0810", "purpose": "Set up VIC-II, clear screen, init variables"},
      {"block": "sub_0830", "purpose": "Initialize sprite graphics for chess pieces"},
      {"block": "sub_0860", "purpose": "Set up initial board state"},
      {"block": "sub_0890", "purpose": "Install IRQ handler, start game"}
    ],
    "irq_handlers": [
      {
        "address": "0xC200",
        "vector_source": "hardware",
        "purpose": "Raster split — status bar at top, game board below",
        "raster_lines": [0, 50],
        "installs_at": "sub_0890"
      }
    ],
    "nmi_handlers": [],
    "state_machines": [
      {
        "block": "sub_0900",
        "state_variable": "$02",
        "states": {
          "0": "title_screen",
          "1": "player_input",
          "2": "ai_thinking",
          "3": "animating_move",
          "4": "game_over"
        }
      }
    ],
    "banking": {
      "uses_banking": false,
      "configurations": []
    }
  },
  "files": [
    {
      "filename": "main.asm",
      "description": "Entry point, BASIC stub, includes",
      "blocks": ["basic_stub"],
      "imports_from": ["init.asm", "game_loop.asm"],
      "exports": []
    },
    {
      "filename": "init.asm",
      "description": "All initialization routines — hardware setup, board state, IRQ installation",
      "blocks": ["sub_0810", "sub_0830", "sub_0860", "sub_0890"],
      "imports_from": ["sprites.asm", "board.asm"],
      "exports": ["init_game"]
    },
    {
      "filename": "game_loop.asm",
      "description": "Main game loop state machine and input handling",
      "blocks": ["sub_0900", "sub_0940", "sub_0980"],
      "imports_from": ["board.asm", "ai.asm", "sprites.asm"],
      "exports": ["game_main_loop"]
    },
    {
      "filename": "sprites.asm",
      "description": "Sprite initialization, positioning, and animation",
      "blocks": ["sub_C000", "sub_C040", "sub_C080", "sub_C100"],
      "imports_from": ["data.asm"],
      "exports": ["init_sprites", "update_sprite_pos", "animate_piece"]
    },
    {
      "filename": "data.asm",
      "description": "Lookup tables, sprite data, string constants",
      "blocks": ["data_C800", "data_C900", "data_CA00"],
      "imports_from": [],
      "exports": ["tbl__sprite_pos_x_lo", "tbl__piece_sprites", "txt__title"]
    },
    {
      "filename": "unprocessed/unknown_C300.asm",
      "description": "Unidentified bit manipulation routine — needs human review",
      "blocks": ["sub_C300"],
      "imports_from": [],
      "exports": [],
      "reason_unprocessed": "LOW certainty, unreachable, purpose unknown"
    }
  ],
  "file_build_order": ["data.asm", "sprites.asm", "board.asm", "ai.asm", "game_loop.asm", "init.asm", "main.asm"],
  "unprocessed_regions": [
    {
      "start": "0x4000",
      "end": "0x5FFF",
      "size_bytes": 8192,
      "reason": "No code references found. Possibly bitmap screen data loaded from disk at runtime.",
      "emit_as": "raw_bytes"
    }
  ],
  "documentation": {
    "readme": "# Chess Master\n\nA two-player chess game for the Commodore 64...",
    "interesting": "## Interesting Techniques\n\n### Raster Split\nUses IRQ-driven raster split...",
    "how_it_works": "## Architecture\n\nThe game uses a state machine driven by...",
    "terminology": "## Terminology\n\n- **piece_id**: 0-5 mapping to pawn/rook/knight/bishop/queen/king..."
  },
  "block_to_file_map": {
    "sub_C000": "sprites.asm",
    "sub_C300": "unprocessed/unknown_C300.asm",
    "data_C800": "data.asm"
  },
  "address_to_block_map": {
    "0xC000": "sub_C000",
    "0xC300": "sub_C300",
    "0xC800": "data_C800"
  }
}
```

**Key design notes:**
- `program` captures the high-level architecture that emerges from seeing ALL blocks together — program type, main loop, state machines, init chain. This is what Pass 5 uniquely contributes
- `files` defines the output file structure. The emitter uses this directly — each file entry lists which blocks go in it and what symbols it exports/imports
- `file_build_order` is the dependency-sorted compilation order for KickAssembler `#import` directives
- `unprocessed_regions` are emitted as raw `.byte` directives — the emitter doesn't try to disassemble them
- `block_to_file_map` and `address_to_block_map` are reverse-lookup tables for the verify feedback loop (Lesson #5) — when verification fails at address X, look up which block and file produced it
- `documentation` contains the generated markdown as strings — the emitter writes these to files alongside the `.asm` output

---

## Project Qdrant Collection

Each RE project gets its own Qdrant collection that stores analyzed blocks as embeddings. This enables **similarity search within the project** (find blocks with similar behavior) and **variable propagation** (connect blocks that share the same memory addresses). A separate cross-program **patterns collection** accumulates knowledge across projects.

### Why This Matters

The pipeline processes blocks in topological order — leaves first, callers last. By the time we analyze block #30, blocks #1-29 are already analyzed. Without the project collection, block #30 only gets context from its immediate callers/callees (via the JSON state files). With the collection, block #30 also discovers that it's structurally similar to block #7 (which does the same thing for a different sprite group) — even if they share no call graph relationship.

GenNm showed that call graph context propagation improves variable naming by 168%. Adding semantic similarity on top catches the cases call graphs miss: independent subsystems that reuse the same patterns.

### Collection Architecture

**Two collections:**

| Collection | Scope | Contents | Lifetime |
|------------|-------|----------|----------|
| `re_<project>` | Per-project (e.g., `re_chess`) | Analyzed blocks from this project | Deleted when project is cleaned up |
| `c64_re_patterns` | Cross-program, shared | HIGH-confidence normalized patterns | Persistent, grows over time |

**Embedding model:** Same as the knowledge base (OpenAI `text-embedding-3-small`). Cheap, fast, consistent with existing Qdrant infrastructure.

### What Gets Embedded

The embedding text is the **analysis**, not the raw assembly. Raw opcodes aren't useful for vector similarity — "LDA $D000" means nothing semantically. But "Read sprite 0 X position from VIC-II" is searchable.

**Embedding text construction (per block):**
```
Purpose: Initialize all 8 sprite positions and colors
Category: graphics/init
Algorithm: Loop 0-7, load X/Y from position table, store to VIC-II sprite registers.
           Load color from color table, store to sprite color registers.
Hardware: VIC-II sprite position registers $D000-$D00F (write),
          sprite color registers $D027-$D02E (write),
          sprite enable register $D015 (write)
Variables: $FB (loop index), $FC-$FD (table pointer)
Calls: none (leaf subroutine)
```

This is generated from the block_analysis.json fields: `purpose`, `category`, `algorithm_summary`, `hardware_interaction`, variable names (if available from Pass 3), and call graph summary.

### Qdrant Point Schema

```json
{
  "id": "sub_C000",
  "vector": [0.012, -0.034, ...],
  "payload": {
    "block_id": "sub_C000",
    "project": "chess",
    "address": "0xC000",
    "end_address": "0xC03F",
    "type": "subroutine",
    "category": "graphics",
    "purpose": "Initialize all 8 sprite positions and colors",
    "purpose_short": "init_sprites",
    "algorithm_summary": "Loop 0-7, set X/Y from table, set color from table",
    "certainty": "HIGH",
    "instruction_count": 35,
    "hardware_refs": ["$D000", "$D001", "$D002", "$D015", "$D027"],
    "variables_used": ["$FB", "$FC", "$FD"],
    "variable_names": {"$FB": "idx__sprite", "$FC": "ptr__pos_table_lo", "$FD": "ptr__pos_table_hi"},
    "calls_out": [],
    "called_by": ["$0810"],
    "embedding_text": "Purpose: Initialize all 8 sprite positions..."
  }
}
```

**Indexed fields (filterable):**
- `hardware_refs` — keyword array, for filtered searches like "blocks that touch $D400-$D418"
- `variables_used` — keyword array, for finding blocks sharing the same addresses
- `category` — keyword, for "show me all graphics blocks"
- `certainty` — keyword, for filtering by confidence
- `type` — keyword, for filtering subroutines vs data vs fragments

### Pipeline Integration

#### Pass 2: Similar Block Hints

After each block is analyzed in Pass 2, it gets embedded into the project collection immediately. Before the NEXT block is analyzed, the script searches for similar already-embedded blocks.

**Workflow:**
1. Generate a pre-analysis query from what we know BEFORE analysis:
   - Hardware refs from the block (already in blocks.json)
   - Annotated instruction summary from Pass 1 (key operations, not full code)
   - E.g., "VIC-II sprite registers $D000-$D00F, loop, 8 iterations, table indexed reads"
2. Search project collection: semantic search + filter by overlapping hardware_refs
3. Top 3 results included in the Pass 2 prompt as additional context:
   ```
   Similar blocks already analyzed in this program:
   - init_sprites @ $C000 [HIGH] — "Initialize all 8 sprite positions and colors"
     Similarity: same VIC-II sprite registers, similar loop structure
   - update_sprite_pos @ $C100 [HIGH] — "Update sprite positions from game state"
     Similarity: same VIC-II position registers

   These may or may not be related to the current block. Use them as hints only.
   ```
4. After analysis, embed the current block into the collection
5. Continue to next block

**Important:** The similar-block hints are presented as suggestions, not constraints. The prompt explicitly says "hints only" to avoid biasing the AI (Lesson #1).

#### Pass 3: Variable Propagation

When naming variables in Pass 3, search the project collection for blocks using the same memory addresses.

**Workflow:**
1. For each address being named in a subroutine, search: `filter: variables_used contains "$FB"`
2. Results show how the same address is used (and named) in other blocks:
   ```
   Address $FB usage in other blocks:
   - init_sprites @ $C000: "idx__sprite" (loop index, counts 0-7) [HIGH]
   - update_positions @ $C100: "idx__sprite" (same loop pattern) [HIGH]
   - draw_explosion @ $C200: "idx__frame" (frame counter, counts 0-3) [MEDIUM]
   ```
3. AI sees this cross-block context and can:
   - Reuse the name if usage pattern matches ("idx__sprite" again → consistent naming)
   - Propose a different scoped name if different usage ("idx__frame" in explosion context)
   - Propagate type information (if $FB is always used as an index in this program, new occurrences are likely indices too)

This catches variable reuse patterns that call graph analysis misses. Two completely independent sprite routines that both use $FB as a loop counter get consistent naming — without needing to be in the same call chain.

#### After Pass 3: Embedding Update

After Pass 3 completes, update the project collection embeddings to include variable names. This enriches similarity search for Pass 4 and the human review loop.

```
npx tsx src/pipeline/project_collection.ts update block_analysis.json variable_dict.json
```

Re-embeds each block with variable names included in the embedding text. This is cheap (~$0.001) and makes the collection more useful for later queries.

### Cross-Program Patterns Collection

The `c64_re_patterns` collection stores normalized, high-confidence code patterns that transfer across programs. This is the long-term value accumulator.

#### Promotion Criteria

A block is promoted to the patterns collection when:
1. **Certainty = HIGH** (confirmed by AI)
2. **Human reviewed** (confirmed or not flagged during review)
3. **Verification PASS** (output bytes match original)
4. **Category is recognizable** (not "unknown" or "misc")

Promotion happens after the full pipeline completes and human review is done — never during batch processing.

#### Normalization

Before embedding into the patterns collection, block analyses are normalized to remove project-specific details:

**Original (project-specific):**
```
Purpose: Initialize all 8 sprite positions from table at $C800
Hardware: $D000-$D00F (write), $D015 (write), $D027-$D02E (write)
Variables: $FB (idx__sprite), $FC-$FD (ptr__pos_table at $C800)
```

**Normalized (portable):**
```
Purpose: Initialize all 8 sprite positions from lookup table
Category: graphics/sprites/init
Hardware: VIC-II sprite position registers (write), sprite enable (write), sprite colors (write)
Pattern: Loop 0-7, indexed table read → sequential VIC register write
Structure: Single loop, table-driven, no branching
Signature: LDX #0 / loop: LDA table,X / STA $D0xx,X / INX / CPX #count / BNE loop
```

- Absolute addresses ($C800) → relative descriptions ("lookup table")
- Variable names → types ("loop index", "table pointer")
- Hardware registers → semantic names ("VIC-II sprite position registers")
- Instruction sequence patterns preserved as signatures (generic form)

#### Pattern Matching in Pass 2

Before querying the project collection, Pass 2 also searches the patterns collection:

1. Same pre-analysis query (hardware refs + instruction summary)
2. Pattern results get a different prompt format:
   ```
   Known C64 code patterns matching this block:
   - "Sprite position initializer" [PATTERN] — Loop sets sprite X/Y from table
     First seen in: archon (3 occurrences), chess (2 occurrences)
   - "Sprite multiplexer setup" [PATTERN] — IRQ-driven sprite reuse
     First seen in: commando (1 occurrence)
   ```
3. Pattern matches give the AI a strong starting hypothesis: "this is probably a sprite initializer" — but the analysis must still be grounded in the actual code

**Search order:** patterns collection first (stronger signal, cross-validated), then project collection (same-project similarity).

#### Seeding the Patterns Collection

Initial seeding from known sources:
1. **Our documented examples** (in `examples/`): Already analyzed and documented. Convert their documentation into pattern format and embed.
2. **Well-known C64 routines**: Standard SID player init, sprite multiplexer, raster split, scroll routines — well-documented patterns that appear across hundreds of C64 programs.
3. **First RE projects**: After successfully reverse-engineering 2-3 C64 programs, the patterns collection will have enough data to meaningfully accelerate subsequent projects.

The collection doesn't need to be large to be useful. Even 20-30 common patterns cover a significant fraction of C64 code.

### `project_collection.ts` — Shared Module

Handles all project Qdrant collection operations. Used by `analyze_blocks.ts`, `name_variables.ts`, and `re_pipeline.ts`.

```typescript
// Core API:
initCollection(projectName: string): Promise<void>
embedBlock(blockAnalysis: BlockAnalysis, varDict?: VariableDict): Promise<void>
searchSimilar(query: string, hardwareRefs: string[], limit?: number): Promise<SimilarBlock[]>
searchByVariable(address: string, limit?: number): Promise<VariableUsage[]>
updateEmbeddings(blockAnalysis: BlockAnalysis, varDict: VariableDict): Promise<void>

// Cross-program:
promoteToPatterns(block: BlockAnalysis, normalized: NormalizedPattern): Promise<void>
searchPatterns(query: string, hardwareRefs: string[], limit?: number): Promise<PatternMatch[]>
seedPatterns(examplesDir: string): Promise<void>
```

### Cost

| Operation | Per block | Per project (47 blocks) | Notes |
|-----------|-----------|------------------------|-------|
| Embed block | ~200 tokens | ~9,400 tokens | ~$0.0001 |
| Search (Pass 2) | ~200 tokens + ~100ms | ~9,400 tokens + ~5s | ~$0.0001 |
| Search (Pass 3) | ~100 tokens + ~50ms | ~4,700 tokens + ~2.5s | ~$0.00005 |
| Update after Pass 3 | ~200 tokens | ~9,400 tokens | ~$0.0001 |
| **Total** | | **~33K tokens, ~8s** | **~$0.0004** |

Negligible compared to the ~610K tokens for the analysis passes. The Qdrant project collection adds <0.1% overhead for potentially significant quality improvements.

---

## Master Orchestrator

### `re_pipeline.ts` — No AI (orchestrates other scripts)

```
npx tsx src/pipeline/index.ts blocks.json                  # full pipeline (blocks.json from static analysis)
npx tsx src/pipeline/index.ts blocks.json --from pass2      # resume from pass 2
npx tsx src/pipeline/index.ts blocks.json --to pass3        # stop after pass 3
npx tsx src/pipeline/index.ts blocks.json --verify          # include verification
npx tsx src/pipeline/index.ts blocks.json --status          # show pipeline state
npx tsx src/pipeline/index.ts blocks.json --output-dir out/ # output directory
npx tsx src/pipeline/index.ts blocks.json --model gpt-5-mini --workers 4
npx tsx src/pipeline/index.ts input.prg --entry 0x0810      # run static analysis first, then pipeline
```

**Invokes each pass as a module import** (not subprocess — all TypeScript, same process). Each pass is also independently runnable from CLI for debugging.

**When given a `.prg` or `.asm` file** instead of `blocks.json`, the orchestrator runs the static analysis pipeline first (`src/static-analysis/index.ts`) to produce `blocks.json`, then continues with the AI passes.

**Tracks state in `pipeline_state.json`:**
```json
{
  "input_file": "blocks.json",
  "source_binary": "input.prg",
  "passes": {
    "pass1_annotate": {"status": "completed", "duration_s": 45, "ai_calls": 32},
    "pass2_analyze": {"status": "completed", "duration_s": 120, "research_queries": 15},
    "pass3_variables": {"status": "completed", "duration_s": 60, "variables": 89},
    "pass4_document": {"status": "running", "progress": "23/47"},
    "pass5_integrate": {"status": "pending"},
    "emit": {"status": "pending"},
    "verify": {"status": "pending"}
  },
  "cost": {
    "total_api_calls": 234,
    "total_tokens": 556000,
    "estimated_cost_usd": 0.08
  }
}
```

---

## Selective Verification

The MCP plan's `verify.ts` does full binary comparison. The pipeline needs **selective mode** — only check address ranges that were reverse-engineered.

```
npx tsx src/pipeline/verify.ts output/ --selective integration.json
```

**How it works:**
1. Pipeline knows which ranges were processed (from integration.json)
2. Emitter writes processed blocks as KickAssembler code + unprocessed regions as raw `.byte` directives
3. Compile output: `kickass output/main.asm`
4. Compare bytes ONLY in processed ranges
5. Report per-range PASS/FAIL + overall coverage percentage

```json
{
  "verified_ranges": [
    {"start": "0x0801", "end": "0x080D", "status": "PASS", "label": "basic_stub"},
    {"start": "0x0810", "end": "0x0900", "status": "PASS", "label": "init"}
  ],
  "unverified_ranges": [
    {"start": "0x4000", "end": "0x4FFF", "reason": "unprocessed"}
  ],
  "overall": "PASS",
  "coverage": "78%"
}
```

---

## Claude Skill: `/disasm-auto` — Full Orchestration

The pipeline is designed to be orchestrated by a Claude skill, not just run standalone. The skill drives the entire disassembly process including human interaction.

### Skill Workflow

```
User: /disasm-auto chess.prg

Claude:
1. Run static analysis → blocks.json
   "Loaded chess.prg (32KB at $0801). Found 47 subroutines, 12 data regions.
    Entry points detected: $0810 (BASIC SYS), $C200 (IRQ handler).
    Confirm entry points? [Y/n]"

2. User confirms → Run AI pipeline on blocks.json
   "Running batch analysis pipeline...
    Pass 1: Annotated 47 blocks (32 needed AI, 15 fully deterministic)
    Pass 2: Analysed 47 blocks (38 HIGH, 6 MEDIUM, 3 LOW)
           Research loop: 15 Qdrant queries, 4 context requests
    Pass 3: Named 89 variables (45 KNOWN, 28 HIGH, 12 MEDIUM, 4 LOW)
    Pass 4: Documented 47 blocks (3 flagged for review)
    Pass 5: Split into 8 files, generated docs
    Cost: $0.08 (191 API calls)"

3. Present review items to human:
   "3 blocks need review:
    - sub_C100 @ $C100 [LOW] — Complex bit manipulation, possibly bitmap decoding
    - sub_C300 @ $C300 [LOW] — Unknown purpose, no callers found (dead code?)
    - sub_C500 @ $C500 [MEDIUM/CONFLICT] — Input named 'doSound' but writes VIC regs

    Which would you like to examine first?"

4. Human picks sub_C100 → Claude uses MCP tools + Qdrant + Zen for deep analysis:
   - Query Qdrant: "VIC-II multicolor bitmap encoding bit manipulation"
   - Use zen/thinkdeep for complex reasoning about the algorithm
   - Show human the analysis with full context
   - Human confirms/corrects → update project state

5. Re-run affected passes: pipeline --from pass3
   "Re-processed 3 blocks with updated analysis. All now HIGH certainty."

6. Emit + Verify:
   /disasm-emit → KickAssembler output
   /disasm-verify → "PASS — 78% coverage, all verified ranges match"
```

### Why Skill Orchestration Matters

A human can't effectively review a single block out of context. The skill provides context by:

1. **Showing related blocks.** When reviewing sub_C100, also show what calls it, what it calls, and their purposes
2. **Providing Qdrant context.** Automatically search the knowledge base for relevant hardware/technique docs
3. **Using Zen for hard cases.** Complex algorithms that gpt-5-mini couldn't figure out get escalated to Claude + Zen for deep analysis
4. **Iterating efficiently.** After human corrections, only re-run affected passes (not the whole pipeline)

### Skill Design

The `/disasm-auto` skill:
- Takes a `.prg` file, `.asm` disassembly dump, or existing `blocks.json` as input
- Runs static analysis if starting from .prg/.asm
- Invokes the AI pipeline for the batch analysis passes
- Reads the pipeline output (all JSON state files)
- Presents a review summary sorted by priority (CONFLICT > LOW > MEDIUM)
- For each review item, provides full context (code, callers, callees, Qdrant results)
- After human corrections, triggers selective re-runs (`--from passN`)
- Finally emits output and runs verification

The skill is **interactive** — it pauses for human input at review points. The batch pipeline is the "first pass" that does 80% of the work cheaply. Claude handles the remaining 20% that needs human judgement.

**Two entry paths:**
- **Fresh binary:** `/disasm-auto chess.prg` — runs static analysis → AI pipeline → review
- **Existing disassembly:** `/disasm-auto chess_disasm.asm --format regenerator` — parses ASM back to bytes, then same flow

---

## Integration with MCP Tools

```
/disasm-auto (Claude skill — drives everything)
    |
    +── Static analysis pipeline ──→ blocks.json
    |       (src/static-analysis/)
    |
    +── AI pipeline ──→ all JSON state files (batch AI, cheap)
    |       (src/pipeline/)
    |       |── annotate_instructions.ts (OpenAI)
    |       |── analyze_blocks.ts (OpenAI + Qdrant)
    |       |── name_variables.ts (OpenAI)
    |       |── document_blocks.ts (OpenAI)
    |       └── integrate_analysis.ts (OpenAI)
    |
    +── Human review loop (Claude interactive)
    |       |── Present flagged items with context
    |       |── Deep analysis via MCP tools + Qdrant + Zen
    |       |── User corrects → pipeline --from passN
    |       └── Repeat until satisfied
    |
    +── /disasm-emit ──→ KickAssembler output
    |
    └── /disasm-verify ──→ byte-for-byte verification
```

- All code is TypeScript/Node.js (`src/static-analysis/` and `src/pipeline/`)
- Pipeline and MCP tools share the same JSON state files
- User overrides via MCP tools trigger selective re-runs
- Qdrant is queried by both: pipeline uses `qdrant_search.ts` module directly, MCP tools use `qdrant-local` MCP server
- Batch pipeline uses gpt-5-mini (~$0.08/game). Claude is only used for the interactive review loop

---

## Cost Estimate (gpt-5-mini)

For a typical C64 game (32KB, ~47 subroutines):

| Pass | AI Calls | Est. Tokens | Est. Cost |
|------|----------|-------------|-----------|
| Pass 1: Annotate | ~32 | ~64K | ~$0.01 |
| Pass 2: Analyse + research + data + similarity | ~80 | ~240K | ~$0.04 |
| Pass 3: Variables + propagation | ~47 | ~94K | ~$0.01 |
| Pass 4: Document | ~47 | ~188K | ~$0.03 |
| Pass 5: Integrate | ~3 | ~24K | ~$0.004 |
| Project Qdrant (embed + search) | ~94 | ~33K | ~$0.0004 |
| **Total** | **~303** | **~643K** | **~$0.09** |

Even large programs (200+ subroutines) would cost under $0.50. The project Qdrant collection adds <0.1% token overhead.

---

## Scripts & File Structure

### Static Analysis (`src/static-analysis/`)

See [static-analysis.md](plans/static-analysis.md) for full design. Produces `blocks.json` from `.prg` input.

### AI Pipeline (`src/pipeline/`)

| Module | Purpose | AI? |
|--------|---------|-----|
| `index.ts` | Master orchestrator — runs passes sequentially, tracks state | No |
| `annotate_instructions.ts` | Pass 1: instruction-level annotation | Hybrid (deterministic + OpenAI) |
| `analyze_blocks.ts` | Pass 2: block purpose + context + research + data discovery + similarity | OpenAI + Qdrant |
| `name_variables.ts` | Pass 3: variable naming + dictionary + variable propagation | OpenAI + Qdrant |
| `document_blocks.ts` | Pass 4: full routine documentation | OpenAI |
| `integrate_analysis.ts` | Pass 5: program structure + file splitting | OpenAI |
| `kickass_emitter.ts` | Emit KickAssembler .asm output from documented blocks | No |
| `verify.ts` | Byte-for-byte verification of emitted output vs original binary | No |

### Shared Modules (`src/shared/`)

| Module | Purpose | AI? |
|--------|---------|-----|
| `qdrant_search.ts` | Qdrant hybrid search with number/memory map enrichment (TypeScript port of query_qdrant.py logic) | Embeddings only |
| `project_collection.ts` | Project Qdrant collection: embed blocks, similarity search, variable propagation, cross-program patterns | Embeddings only |
| `naming.ts` | Enforce naming conventions (prefix/suffix rules for variables, labels) | No |
| `symbol_db.ts` | Known C64 symbols (KERNAL, hardware registers, ZP system vars, comparison hints) | No |

### Skills

| Skill | Purpose |
|-------|---------|
| `/disasm-auto` | Full orchestration: static analysis → batch pipeline → human review → emit → verify |

---

## Verification

To test the pipeline end-to-end:
1. Take a known C64 game `.prg` file
2. Run `npx tsx src/pipeline/index.ts game.prg --entry 0x0810 --verify`
3. Check: static analysis + all AI passes complete, verification PASS, documentation generated
4. Review output quality: are subroutine names sensible? Are comments accurate? Are variable names meaningful?
5. Run `/disasm-auto` on flagged items to test the interactive review loop

---

## Research References

Tools, papers, and projects that informed this pipeline design.

### Static Analysis References

| Reference | Relevance | Link |
|-----------|-----------|------|
| **6502bench SourceGen** | Primary reference for our static analysis. Same platform (6502), same approach (recursive descent + speculative). 5 instruction classifications, status flag tracking, extension scripts for inline data patterns. C# but algorithm is transferable. | [Docs](https://6502bench.com/sgmanual/analysis.html), [GitHub](https://github.com/fadden/6502bench) |
| **Spedi** (Speculative Disassembly) | Inspires our Step 2 speculative code discovery. Recover all possible basic blocks, group into Maximal Blocks, prune via overlap + CFG conflict analysis. Originally for ARM Thumb, simpler on 6502. | [GitHub](https://github.com/abenkhadra/spedi), [Paper](https://dl.acm.org/doi/10.1145/2968455.2968505) |
| **ddisasm** (Datalog Disassembly) | Superset disassembly with Datalog rules for heuristic fusion. Key insight: "no individual analysis provides perfect information but combining several maximizes chances." Uses def-use chains, register value analysis, data access pattern inference. | [GitHub](https://github.com/GrammaTech/ddisasm), [Paper](https://www.usenix.org/conference/usenixsecurity20/presentation/flores-montoya) |
| **Ghidra Auto-Analysis** | 7-phase analysis pipeline (Format → Block → Disassembly → Code → Function → Reference → Data). Aggressive Instruction Finder checks undefined bytes for valid subroutines. Conservative: "only change the program if the Analyzer can be certain." | [Source](https://github.com/NationalSecurityAgency/ghidra/blob/master/Ghidra/Features/Base/src/main/help/help/topics/AutoAnalysisPlugin/AutoAnalysis.htm) |

### AI-Assisted RE References

| Reference | Relevance | Link |
|-----------|-----------|------|
| **SK2Decompile** | Two-phase decompilation: structure recovery then identifier naming. Phase separation improves results by ~9% over single-pass. Validates our Pass 1-2 (structure) → Pass 3 (naming) ordering. | [Paper](https://arxiv.org/html/2403.05286v3) |
| **GenNm** | Call graph context propagation improves variable naming by 168%. Validates our topological ordering + cross-block context passing in Pass 2-3. | Paper (2024) |
| **ReVa** (Reverse Engineering Assistant) | Ghidra MCP tool. Key design: "smaller, critical fragments with reinforcement and links to other relevant information." Fights context rot via incremental delivery + navigation hints. Validates our sub-block splitting + sibling references. | [GitHub](https://github.com/cyberkaida/reverse-engineering-assistant) |
| **ChatCPS / Trim My View** | Two-pass LLM analysis: summarize individual functions, then combine summaries for module-level understanding. Binary Component Decomposition clusters functions by code locality + shared data refs + call graph. Validates our Pass 5 integration approach. | [Paper](https://arxiv.org/html/2503.03969) (NDSS BAR 2025) |
| **Talos Intelligence** | Practical LLM RE workflow. Key lessons: don't bias AI with assumptions; use explicit "DO NOT STOP" in batch prompts; compact summaries beat full code dumps. | Blog posts (2024) |
| **LLM4Decompile** | Open-source LLM for decompilation. 4B token training dataset of C/assembly pairs. Shows fine-tuned models can outperform Ghidra + GPT-4o by 100%+. Future consideration for our pipeline. | [GitHub](https://github.com/albertan017/LLM4Decompile) |

---

## Lessons Learned from Research

Concrete adjustments to our pipeline based on research findings.

### 1. Don't Bias the AI with Assumptions (Talos)

**Problem:** Telling the AI "this is a game" before it analyzes the code biases its naming and classification. It might force game-related names onto utility code.

**Adjustment:** Pass 2 prompt should NOT include assumptions about program type. The AI determines the category independently. Only Pass 5 (integration) makes program-level judgements after seeing all block analyses.

### 2. Explicit "DO NOT STOP" Instructions (Talos)

**Problem:** LLMs in batch mode tend to give up early on complex or ambiguous blocks, returning LOW confidence without fully analyzing.

**Adjustment:** All batch prompts include: "Analyze the ENTIRE block. Do not skip instructions or give up early. If uncertain, explain what you're uncertain about rather than returning LOW confidence." This is especially important for Pass 1 (annotation) and Pass 4 (documentation).

### 3. Compact Summaries Beat Full Code Dumps (Talos, ReVa, ChatCPS)

**Problem:** Sending full code of related blocks as context wastes tokens and can confuse the AI.

**Adjustment:** Cross-block context uses compact summaries by default:
- `init_sprites @ $C000 (purpose: "Initialize all 8 sprite positions and colors") [HIGH]`
- NOT the full 50-line subroutine

Full code is only sent when the AI explicitly requests it via `context_needed`. This is already in our design but worth emphasizing — **summaries first, full code on demand.**

### 4. Iterative Refinement for Variable Naming (GenNm)

**Problem:** Single-pass variable naming misses context that only emerges after multiple blocks are analyzed. GenNm showed 168% improvement with call graph context propagation.

**Adjustment:** Pass 3 (name_variables) should be re-runnable after Pass 4 (documentation). Once we have full documentation of what each block does, variable names can be refined with better context. The pipeline orchestrator should support: `npx tsx src/pipeline/index.ts blocks.json --from pass3 --to pass3` to re-run naming with updated block analysis.

### 5. Verification as Feedback Loop (practical)

**Problem:** Verification (byte comparison) happens at the end, disconnected from analysis.

**Adjustment:** If verification FAILS on specific address ranges, those ranges should be flagged for re-analysis. The emitter should track which blocks produced which output bytes, so a verification failure at $C100-$C110 maps back to `sub_C0F0` for re-examination. This makes verification results actionable, not just pass/fail.

### 6. Separate Structure from Semantics (SK2Decompile)

**Problem:** Trying to understand structure and meaning simultaneously is harder than doing them sequentially.

**Adjustment:** Our pipeline already does this naturally — Pass 1 (annotation) and block splitting handle structure, while Pass 2 (purpose) and Pass 3 (naming) handle semantics. This is validated by SK2Decompile's finding that two-phase outperforms single-phase by ~9%. Don't collapse these passes.

### 7. AI-Driven Data Discovery (original, validated by Ghidra's multi-phase approach)

**Problem:** Static analysis can't find all data blocks. Some data is only identifiable by understanding the code that uses it.

**Adjustment:** Pass 2 now includes `data_requests` and `data_discoveries` — the AI can request raw bytes at addresses referenced by code, classify them, and feed classifications back into the block map. This mirrors Ghidra's approach where later analysis phases discover things earlier phases missed. See [Data Detection Strategy](#data-detection-strategy) section.

### 8. Project-Specific Qdrant Collection for Similarity (GenNm-inspired)

**Problem:** Call graph context only connects blocks that directly call each other. Independent subsystems with similar patterns (e.g., two sprite routines in different game modules) never share context.

**Adjustment:** Each project gets its own Qdrant collection that stores analyzed block embeddings. Pass 2 searches for similar already-analyzed blocks before analyzing each new block. Pass 3 searches by variable address to propagate naming across unrelated call chains. A cross-program `c64_re_patterns` collection accumulates HIGH-confidence patterns for reuse across projects. Overhead is negligible (<0.1% of total tokens). See [Project Qdrant Collection](#project-qdrant-collection) section for full design including schema, pipeline integration, normalization, and pattern library seeding.

### 9. Function Decomposition for AI (ReVa, ChatCPS)

**Problem:** Large subroutines exceed what AI can reason about effectively in a single prompt.

**Adjustment:** Block splitter Pass 2 sub-splits large blocks (>120 instructions) at natural boundaries (loop headers, branch points). Each sub-block gets sibling summaries and can request sibling code via `context_needed`. This mirrors ReVa's "compact fragments with cross-references" philosophy. See [Block Splitting](#block-splitting) section.
