# C64 Reverse Engineering Automation Pipeline

## Context

We have a comprehensive C64/6502 knowledge base in Qdrant (4000+ chunks), an MCP tools plan ([ai-disassembler-mcp.md](plans/ai-disassembler-mcp.md)) that defines interactive MCP tools, and a static analysis plan ([static-analysis.md](plans/static-analysis.md)) that defines the deterministic code/data classification layer.

**This plan defines the reverse engineering enrichment pipeline.** It takes `blocks.json` from static analysis and produces **enriched blocks.json** with AI-generated annotations, variable names, documentation, and module assignments. The pipeline is:

1. **Pluggable deterministic enrichment** — resolve indirect addressing, classify data formats, detect patterns (no AI, fast, repeatable)
2. **5-pass AI analysis** — annotate, analyze, name, document, integrate (OpenAI gpt-5-mini, cheap)

Code generation (KickAssembler output) is handled by the standalone **builder** project — see [builder.md](plans/builder.md). The builder reads blocks.json (with or without RE pipeline enrichment) and produces compilable `.asm` files.

All code is TypeScript/Node.js. The pipeline is pluggable at every layer — adding new analysis capabilities means dropping a file into the right directory.

### AI Knowledge Strategy

The AI **will** hallucinate C64 facts if left unchecked. It confidently states wrong register meanings, incorrect KERNAL calling conventions, and fabricated VIC-II modes. But checking every register against Qdrant is too slow and expensive. Our strategy is **three-layered**: give the AI authoritative knowledge upfront, let deterministic annotations handle the easy 80%, and cross-validate AI output to catch lies.

#### Layer 1: Deterministic Knowledge (Handles ~80% — Free, Fast)

Most C64 hardware knowledge is already captured deterministically:
- **`symbol_db.ts`** — complete hardware register names, KERNAL routines, ZP system locations
- **Enrichment plugins** — `register_semantics`, `kernal_api`, `vic_annotation`, `sid_annotation` produce human-readable annotations for every hardware access
- **Query enrichment** — `query/` pipeline auto-converts numbers, resolves mirrors, maps addresses to chips

These produce annotations like `STA $D020 = Set border color` with ZERO AI calls. The AI gets these in its prompt as established facts.

#### Layer 2: AI Concept Extraction + Qdrant Pre-Feed (NEW — Handles Unknowns)

Rather than relying on the AI to ask for information (it won't — it'll guess), we **proactively extract key concepts and pre-feed authoritative documentation**.

**How it works** (runs as enrichment plugin `ai_concept_extraction_enrichment.ts`, priority 100):

1. For each code block, send a cheap AI call with a focused prompt:
   ```
   List the key C64/6502 concepts in this code that a reverse engineer would
   need expert knowledge about. NOT registers (those are handled). Focus on:
   - Unusual techniques (self-modifying code patterns, timing tricks)
   - Data format interpretations (what does this data structure represent?)
   - Algorithm patterns (what is this loop/dispatch/table doing?)
   - C64-specific conventions (interrupt setup sequences, banking patterns)
   Return: ["concept1", "concept2", ...] (max 5)
   ```
2. For each extracted concept, query Qdrant via `query/src/pipeline.ts`
3. Take top 3 results per concept, **strip source code sections** (already done in our chunks)
4. Deduplicate across concepts (same chunk returned for multiple topics)
5. Store results as `qdrant_knowledge` enrichment annotations on the block

**Token budget management** (addresses the 80K concern):
- Average Qdrant chunk (before `## Source Code`) ≈ 200-500 tokens
- 5 concepts × 3 results = 15 max results, but deduplication typically yields ~8-10 unique chunks
- ~10 × 400 tokens = **~4,000 tokens** of Qdrant context — very manageable
- Hard cap: `--qdrant-context-budget` (default 8192 tokens). Context provider drops lowest-scoring results if over budget
- Skip concepts where `symbol_db` + `register_semantics` already provide full coverage

**The result:** When the AI analyzes a block in Pass 2, it already has authoritative Qdrant documentation for the non-obvious concepts — without having to ask. It can't hallucinate about raster interrupt timing if the actual documentation is right there in the prompt.

#### Layer 3: Cross-Validation (Catches Remaining Lies)

For the claims the AI does make, we cross-validate against deterministic annotations:

1. **`certainty_processor.ts`** compares AI hardware claims against `symbol_db` + enrichment annotations
2. If AI says `$D011` controls "sprite colour" but `register_semantics` says "VIC-II control register (screen height, bitmap mode, raster compare)" → **conflict detected**
3. Conflicts trigger a targeted Qdrant lookup for the specific register → result is added to context → block is re-submitted to AI
4. If no deterministic annotation exists for a claim (novel/unusual usage), the claim is accepted but marked `needs_qdrant_verification: true`
5. Blocks with unverified claims get `certainty` capped at MEDIUM

This is cheap because conflicts are rare (~5-10% of blocks) and each conflict triggers only 1-2 Qdrant lookups.

#### Cost Impact

| Component | AI Calls | Tokens | Cost |
|-----------|----------|--------|------|
| Layer 1 (deterministic) | 0 | 0 | $0.00 |
| Layer 2 (concept extraction) | ~47 (one per block) | ~47K | ~$0.007 |
| Layer 2 (Qdrant lookups) | 0 (local) | 0 | $0.00 |
| Layer 3 (conflict re-submissions) | ~5 | ~10K | ~$0.002 |
| **Total overhead** | **~52** | **~57K** | **~$0.009** |

Negligible compared to the base pipeline cost (~$0.09). But the accuracy improvement is significant — eliminates the biggest class of AI errors (wrong hardware register assumptions) without slowing down the pipeline.

**Related plans:**
- [static-analysis.md](plans/static-analysis.md) — produces `blocks.json` (input to this pipeline)
- [builder.md](plans/builder.md) — consumes enriched `blocks.json` (output of this pipeline) and produces KickAssembler source
- [verify.md](plans/verify.md) — standalone byte-comparison tool for checking rebuilt output against original
- [ai-disassembler-mcp.md](plans/ai-disassembler-mcp.md) — defines MCP tools and output format

---

## Target Output

The RE pipeline enriches `blocks.json` with annotations, variable names, documentation, and module assignments. The downstream **builder** project (see [builder.md](plans/builder.md)) consumes this enriched `blocks.json` and produces KickAssembler source files.

### Module Dictionary (controlled vocabulary)

Pass 5 (integration) assigns blocks to modules from this dictionary — prevents explosion into hundreds of files. The builder uses these assignments for multi-file output:

| Module | Description | Example (Archon) |
|--------|-------------|-------------------|
| `entry` | Program entry, init, main loop | `main.asm` entry/init |
| `intro` | Title screen, attract mode | `intro.asm` |
| `game` | Core gameplay loop, turn logic | `game.asm` |
| `graphics` | Screen setup, drawing, rendering | VIC-II config, charset setup |
| `sprites` | Sprite management, multiplexing | Sprite position/animation |
| `sound` | SID music player, sound effects | Music player, SFX |
| `input` | Joystick/keyboard handling | Input polling |
| `ai` | Computer player logic | `ai.asm` |
| `common` | Shared utilities (clear screen, delays) | `common.asm` |
| `resources` | Binary data assets | `resources.asm` |
| `io` | C64 hardware constants | `io.asm` (standard) |
| `const` | Game-specific constants | `const.asm` |
| `data` | Runtime variables, state storage | Variables segment |

Additional modules can be added per-game (e.g. `board`, `challenge`, `magic` for Archon), but the AI must justify any module not in the base dictionary.

---

## Pipeline Overview

```
.prg + entry address
    |
    v
[Static Analysis Pipeline] ──────────────── blocks.json
    (See static-analysis.md)                 (code + data + unknown blocks)
    |
    v
[Deterministic Enrichment] ────────────── enriched blocks (in-memory)
    Pluggable *_enrichment.ts plugins        Mutable BlockStore
    Multi-pass with reclassification         (can split/merge/reclassify)
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
    |       AI feedback (tool calls)         │  c64_re_patterns        │
    v                                        │                         │
[Pass 3: name_variables.ts] ─────────────── variable_dict.json
    |       OpenAI proposes names            │  ◄── search by variable │
    |       Variable propagation ◄───────────┤  ◄── update embeddings  │
    |       naming.ts conventions            │       after pass 3      │
    v                                        └─────────────────────────┘
[Pass 4: document_blocks.ts] ──────────────── documented_blocks.json
    |       OpenAI writes full routine docs
    |       Per-block comments (pass 1)
    v
[Pass 5: integrate_analysis.ts] ───────────── integration.json
    |       OpenAI determines program structure
    |       File splitting, architecture docs
    |       Overview comments (pass 2 - whole program)
    v
enriched blocks.json ─────────────────── Output of this pipeline
    |                                        Promote HIGH blocks
    v                                        to c64_re_patterns
[Human review via Claude + MCP tools]
    Review flagged items, iterate
    |
    v
[Builder (separate project)] ──────────── KickAssembler output
    See builder.md                           + verification
```

Each pass reads JSON from the previous pass and writes its own JSON. Any pass can be re-run independently. The enrichment layer operates in-memory and feeds directly into Pass 1.

**Every layer is pluggable.** Adding new capabilities at any stage means dropping a file into the right directory — no orchestrator code changes required. See [Pluggable AI Pass Architecture](#pluggable-ai-pass-architecture) for how the AI passes themselves are decomposed into plugins.

---

## Pre-requisite: Static Analysis

Before the pipeline runs, the static analysis pipeline must produce `blocks.json`. See [static-analysis.md](plans/static-analysis.md) for the full design.

**Input:** `.prg` file + entry address (or `.asm` disassembly dump — auto-detected format)

**What it does (6-step deterministic pipeline, no AI):**
1. Load binary into 64KB memory image
2. Decode opcodes via custom 256-entry TypeScript lookup table
3. Detect entry points (BASIC SYS stub, IRQ/NMI vector setup patterns)
4. Discover code via recursive descent + Spedi-inspired speculative discovery
5. Build cross-reference database (calls, reads, writes, hardware refs, data refs, SMC)
6. Assemble blocks with metadata, classify data regions, sub-split large blocks, apply known symbols

**Output:** `blocks.json` — one entry per subroutine/data region/unknown region, with full instruction data, basic blocks, xrefs, hardware refs, reachability classification, and sub-block sibling references for blocks exceeding 120 instructions.

The pipeline also needs the original binary bytes for AI data requests during Pass 2. The static analysis stores these in `blocks.json` as a `raw_binary` field (base64-encoded loaded regions).

## Block Structure (blocks.json)

The `blocks.json` format is fully defined in [static-analysis.md — Output](plans/static-analysis.md#output). The static analysis pipeline is self-contained and owns the schema.

**Key points for the RE pipeline:**
- Every loaded byte belongs to exactly one block (coverage guarantee — no gaps)
- Block types: `subroutine`, `irq_handler`, `fragment`, `data`, `unknown`
- Reachability: `proven`, `indirect`, `unreachable` — `unreachable` blocks are prime candidates for data reclassification
- Data blocks carry a `candidates` array with ALL detector proposals (not just the winner)
- Large subroutines (>120 instructions) are sub-split with sibling summaries
- `raw_binary` field contains base64-encoded loaded regions for AI data requests
- `coverage` section shows code/data/unknown byte counts and percentages

---

## Mutable Block Store

Blocks are **mutable in memory** throughout the pipeline. Both enrichment plugins and AI can reclassify, split, or merge blocks — triggering re-analysis of affected phases.

```typescript
// block_store.ts
class BlockStore {
  private blocks: Block[];
  private version: number = 0;
  private changeLog: BlockChange[] = [];

  /** Get current version number (monotonically increasing) */
  getVersion(): number { ... }

  /** Get current snapshot (read-only view for plugins) */
  getSnapshot(): readonly Block[] { ... }

  /** Get a single block by address (null if not found) */
  getBlock(address: number): Block | null { ... }

  /** Find the block containing a given address */
  findBlockContaining(address: number): Block | null { ... }

  /** Reclassify a block (e.g. data→code, code→data) */
  reclassify(address: number, newType: BlockType, reason: string): void { ... }

  /** Split a block into two at a given address */
  split(address: number, splitAt: number, reason: string): void { ... }

  /** Merge two adjacent blocks */
  merge(addr1: number, addr2: number, reason: string): void { ... }

  /** Check if any changes since last enrichment pass */
  hasChangedSince(version: number): boolean { ... }

  /** Get change log for audit trail */
  getChanges(): readonly BlockChange[] { ... }
}
```

When a plugin or AI reclassifies a block, the orchestrator detects the change and re-runs affected enrichment phases (capped at `--max-passes`, default 5).

---

## Phase 0: Deterministic Enrichment (Pluggable)

Before any AI calls, a pluggable enrichment layer runs deterministic analysis to resolve indirect addressing, classify data formats, and detect patterns. This maximises context for the AI passes that follow.

All enrichment plugins live in `src/enrichment/` and are auto-discovered by filename pattern `*_enrichment.ts`. See [Complete Directory Layout](#complete-directory-layout) for the full file listing.

### Plugin Interface

```typescript
interface EnrichmentInput {
  readonly blocks: readonly Block[];         // Current snapshot from BlockStore
  readonly memory: Readonly<Uint8Array>;     // 64KB image
  readonly loadedRegions: readonly LoadedRegion[];
  readonly priorEnrichments: ReadonlyMap<string, BlockEnrichment[]>;
}

interface EnrichmentResult {
  enrichments: BlockEnrichment[];
  /** Plugins can request block reclassification */
  reclassifications?: BlockReclassification[];
}

interface BlockEnrichment {
  blockAddress: number;
  source: string;              // Plugin name
  type: EnrichmentType;
  annotation: string;          // Human-readable (goes to AI prompt)
  data: Record<string, unknown>; // Structured (for downstream plugins)
}

type EnrichmentType =
  | "resolved_target"      // Indirect target resolved to concrete address
  | "pointer_pair"         // Low/high byte table pairing detected
  | "vector_write"         // Code writes to a known vector location
  | "call_relationship"    // Calling relationship between blocks
  | "data_semantic"        // What a data value means in context
  | "data_format"          // Data block format classification
  | "register_semantic"    // What a register write does (VIC/SID/CIA)
  | "pattern"              // Higher-level pattern (interrupt chain, state machine, etc.)
  | "api_call"             // Known API/KERNAL call identified
  | "banking"              // Banking state change
  | "qdrant_knowledge"     // Authoritative Qdrant docs for AI concepts (from ai_concept_extraction)
  | "annotation";          // General annotation

interface BlockReclassification {
  blockAddress: number;
  newType: BlockType;
  reason: string;
  splitAt?: number[];       // Optional: split block at these addresses
}

interface EnrichmentPlugin {
  name: string;
  description: string;
  priority: number;         // Lower = runs first
  enrich(input: EnrichmentInput): EnrichmentResult;
}
```

### Auto-Discovery (`enrichment/index.ts`)

Same pattern as existing systems (query/, static-analysis/):
- Scan for `*_enrichment.ts` files via `readdirSync()`
- Dynamic `import()` each, find exported class with `enrich()` method
- Sort by `priority` ascending
- Run sequentially; each plugin's output is added to `priorEnrichments` before the next runs

### Multi-Pass Reclassification Loop

```typescript
let pass = 0;
do {
  pass++;
  const lastVersion = store.getVersion();
  for (const plugin of plugins) {
    const result = plugin.enrich({
      blocks: store.getSnapshot(), memory, loadedRegions, priorEnrichments
    });
    enrichments.set(plugin.name, result.enrichments);
    for (const r of result.reclassifications ?? []) {
      store.reclassify(r.blockAddress, r.newType, r.reason);
    }
  }
} while (store.hasChangedSince(lastVersion) && pass < maxPasses);
```

### Plugin Catalogue

#### Foundation (priority 10-19) — No dependencies

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `constant_propagation` | 10 | Trace immediate values through LDA/LDX/LDY → STA/STX/STY chains within a block. Build a map of "at instruction X, register A/X/Y holds value V". Essential for all later resolution. |
| `zero_page_tracker` | 12 | Track zero-page writes/reads across blocks. Identify ZP locations used as pointers (consecutive byte pairs like $FA/$FB). Map which blocks set vs read each ZP location. |
| `kernal_api` | 15 | Identify JSR targets that hit known KERNAL ROM entry points ($FFD2=CHROUT, $FFE4=GETIN, etc.). Annotate with API name, parameters, and calling convention. |

#### Resolution (priority 20-39) — Core indirect addressing

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `pointer_pair` | 20 | **Critical.** Detect paired low/high byte tables. Pattern: two data blocks at nearby addresses where entry N of table A = `<addr_N` and entry N of table B = `>addr_N`. Also detect `.word` tables (consecutive 16-bit address entries). Reconstruct full 16-bit addresses. |
| `indirect_jmp` | 25 | Resolve `JMP ($xxxx)` instructions. Use constant propagation + pointer pair results to determine what address(es) the indirect jump could target. Annotate with resolved targets or "dynamic — set by block $XXXX". |
| `vector_write` | 27 | Detect writes to known vector locations ($0314/$0315 = IRQ, $0316/$0317 = BRK, $0318/$0319 = NMI, $FFFE/$FFFF). Use constant propagation to resolve what address is being written. Annotate: "Sets IRQ vector to $XXXX (label: irq_handler)". |
| `rts_dispatch` | 30 | Detect RTS-as-jump pattern: push high byte, push low byte, RTS. Resolve the target address (pushed value + 1). Also detect PHA/PHA/RTS with values loaded from tables. |
| `smc_target` | 32 | Detect self-modifying code that changes instruction operands. Pattern: STA into the operand bytes of a later instruction. Resolve what values get written and what the modified instruction becomes. |
| `address_table` | 35 | For data blocks identified as address/jump tables by static analysis, resolve each entry to the block it points to. Annotate: "Entry 0 → $XXXX (sub_XXXX), Entry 1 → $YYYY (irq_handler)". |

#### Semantics (priority 40-59) — Pattern recognition

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `register_semantics` | 40 | Annotate writes to VIC-II ($D000-$D3FF), SID ($D400-$D7FF), CIA1/2 ($DC00-$DDFF) with human-readable meanings. Use constant propagation to include actual values: "Sets border to colour 0 (black)". |
| `data_format` | 42 | Classify data blocks by content. Not just "it's data" but "it's a half charset" or "it's 54-byte sprites" (like Archon's non-standard sprite size). Heuristics: sprite alignment, charset boundaries, PETSCII text, known music formats, bitmap sizes. |
| `embedded_command` | 44 | Detect embedded bytecode/command languages in data — like Archon's music player where `$FE` is a command byte. Strategy: find interpreter loop (LDA (ptr),Y / CMP / BEQ), map command byte → handler, determine parameter count per command, annotate data with command dictionary. |
| `interrupt_chain` | 45 | Detect linked interrupt patterns. Look for blocks that write to IRQ/NMI vectors where targets form a chain/cycle. Annotate: "IRQ chain: handler_1 → handler_2 → handler_3 → handler_1 (raster multiplexer, 3 splits)". |
| `state_machine` | 48 | Detect state machine patterns. Look for: state variable read (LDA state), followed by dispatch (indexed table jump, comparison chains, or computed branch). Annotate states and transitions. |
| `copy_loop` | 50 | Detect memory copy/fill loops. Pattern: LDA source,X / STA dest,X / INX/DEX / BNE/BPL loop. Or indirect: LDA ($ZP),Y / STA ($ZP),Y. Annotate source, destination, size, direction. |
| `data_table_semantics` | 55 | For data blocks read by code, determine what values mean. Cross-reference with register_semantics: if table values are written to $D027, they're "sprite colours". Uses constant propagation + register_semantics. |

#### Cross-Reference (priority 60-79)

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `call_graph` | 60 | Build complete call graph including indirect calls resolved by earlier plugins. For each code block, list callers/callees with call mechanism (JSR direct, JMP indirect, vector write, RTS dispatch). Annotate entry points and leaf functions. |
| `data_boundary` | 62 | Determine data block sizes. Approaches: terminator scan ($00, $FF), counter-based (loop count × element size), pointer math, cross-reference (next referenced address). |
| `data_flow` | 65 | Track data flow between blocks. For each data block: which blocks write to it, which read. Identify "write-once" tables vs "read-write" state. Build data usage map with access patterns (sequential, random, indexed, indirect, command_stream). |
| `shared_data` | 70 | Identify data blocks referenced by multiple code blocks. Annotate as shared state / communication channels. Flag potential race conditions (data modified by both mainline and IRQ handler without SEI protection). |

#### C64-Specific (priority 80-99)

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `banking_state` | 80 | Track C64 memory banking via $01 (CPU port) and $DD00 (CIA2). Annotate: "Switches to RAM under KERNAL", "Maps VIC bank 2 ($8000-$BFFF)". Flag blocks that execute with non-default banking. |
| `vic_annotation` | 85 | Higher-level VIC-II annotations. Detect: screen mode setup sequences (bitmap vs text vs multicolour), sprite enable/position sequences, scroll register manipulation, VIC bank selection. Annotate: "Configures multicolour bitmap mode at $6000". |
| `sid_annotation` | 88 | Higher-level SID annotations. Detect: voice setup sequences (waveform + frequency + ADSR), filter configuration, music player init/play patterns. Annotate: "Initialises SID voice 1: triangle wave, A=8 D=0 S=15 R=0". |
| `screen_ops` | 90 | Detect screen/colour RAM operations. Writes to $0400-$07FF (screen) or $D800-$DBFF (colour RAM), often in loops. Annotate: "Fills screen RAM with character $20 (space)". |

#### AI-Assisted (priority 100+) — Uses OpenAI

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `ai_concept_extraction` | 100 | **Key to AI accuracy.** For each code block, sends a cheap AI call asking: "What non-obvious C64 concepts does this code use?" (NOT registers — those are handled deterministically). Takes the extracted concepts, queries Qdrant knowledge base for each, deduplicates results, and stores as `qdrant_knowledge` enrichment annotations. These annotations flow into all AI passes via `qdrant_knowledge_context.ts`, giving the AI authoritative documentation *before* it starts guessing. See [AI Knowledge Strategy](#ai-knowledge-strategy) for full design. Token budget capped at `--qdrant-context-budget` (default 8192). |

### Data Usage Tracking

The `data_flow` plugin (priority 65) builds a data usage map that is critical for AI analysis:

```typescript
interface DataAccess {
  blockAddress: number;        // Which code block accesses this data
  instructionAddress: number;  // Specific instruction address
  accessType: "read" | "write";
  indexRegister?: "X" | "Y";  // If indexed access
  indirect?: boolean;          // If via pointer ($ZP),Y
}

type AccessPattern = "sequential" | "random" | "indexed" | "indirect" | "command_stream" | "constant";

interface DataUsageRecord {
  dataAddress: number;
  dataSize: number;
  sizeEvidence: SizeEvidence;
  readers: DataAccess[];
  writers: DataAccess[];
  accessPattern: AccessPattern;
  terminatorByte?: number;
  elementSize?: number;
}

type SizeEvidence =
  | { type: "counter"; counterSource: number; value: number }
  | { type: "terminator"; byte: number; offset: number }
  | { type: "boundary"; nextReference: number }
  | { type: "format"; formatName: string; expectedSize: number }
  | { type: "unknown" };
```

---

## Data Detection Strategy

Data detection is the hardest problem in disassembly. On the 6502, there's no metadata separating code from data. Our approach is **three-phase**: static heuristics first (cheap, deterministic in static analysis), enrichment plugins second (cross-block deterministic reasoning), then AI refinement (smart, iterative).

### Phase A: Static Detection (static analysis pipeline)

Deterministic heuristics applied during static analysis. No AI. See [static-analysis.md](plans/static-analysis.md) for full details.

**Summary of what static analysis detects:**
- **Sprite data** — trace sprite pointer writes ($07F8+) back to `LDA #N` → data at N*64+VIC_bank (HIGH confidence)
- **Character sets** — trace `$D018` writes to compute charset address, 2048 bytes (HIGH confidence)
- **Screen/color maps** — trace `$D018` writes, 1000 bytes each (MEDIUM confidence)
- **Bitmap data** — detect `$D011` bit 5 set + `$D018` bit 3, 8000 bytes (MEDIUM confidence)
- **Strings** — PETSCII null-terminated, high-bit terminated, length-prefixed, screen codes (HIGH when code-referenced)
- **SID music data** — frequency table detection, player routine tracing, known player signatures (MEDIUM confidence)
- **Jump/RTS dispatch tables** — detect `LDA lo,X / PHA / LDA hi,X / PHA / RTS` pattern (HIGH confidence)
- **Lookup tables** — screen line offsets, bit masks, sine tables, color tables (MEDIUM confidence)
- **Pointer patterns** — A/Y register pairs, zero page pointer pairs (MEDIUM confidence)
- **Boundary detection** — format-specific sizes, null-termination, next code address, copy loop lengths

### Phase B: Enrichment Plugin Detection (Phase 0)

The enrichment plugins add cross-block deterministic reasoning:
- `data_format` — classifies data blocks by content (sprite/charset/music/string/table/bitmap)
- `data_boundary` — determines data block sizes using multiple heuristics
- `data_table_semantics` — determines what values mean by tracing how code uses them
- `embedded_command` — detects bytecode/command languages in data streams
- `data_flow` — tracks which code reads/writes each data block

### Phase C: AI-Driven Data Discovery (Pass 2)

The AI discovers and classifies data as a side-effect of understanding code. This is the key insight: code tells you what data means.

**How it works:**

1. AI analyzes a code block and sees data references (e.g., `LDA $C800,X / CMP #$00 / BEQ done`)
2. AI can **request raw bytes** at any address range via tool call:
   ```json
   { "name": "read_memory", "arguments": { "address": 51200, "length": 256 } }
   ```
3. Script fetches raw bytes from the binary and returns them with context
4. AI returns data classification:
   ```json
   {
     "data_discoveries": [{
       "start": "0xC800", "end": "0xC812",
       "type": "string", "subtype": "petscii_null_terminated",
       "label": "txt__author", "value": "WRITTEN BY J.SMITH",
       "confidence": "HIGH"
     }]
   }
   ```
5. Discovery gets merged into BlockStore — the `unknown` block at $C800 becomes a `data` block
6. Other blocks referencing $C800 now get this context in their analysis

**This is iterative.** As more code blocks are analyzed, more data blocks are discovered, which provides more context for analyzing remaining code blocks.

### Inter-Procedural Data Tracing

The hardest case: data addressed via pointers passed between subroutines.

```
caller:
    LDA #<bitmap_data    ; $FB = low byte of bitmap address
    STA $FB
    LDA #>bitmap_data    ; $FC = high byte
    STA $FC
    JSR process_bitmap   ; process_bitmap uses LDA ($FB),Y
```

**Enrichment plugins** detect this: `zero_page_tracker` identifies $FB/$FC as a pointer pair, `constant_propagation` traces the immediate values, and `data_flow` connects the caller's writes to the callee's reads.

**AI analysis** refines this: when analyzing `process_bitmap`, AI sees it uses `($FB),Y` and can infer it processes sequential data. When analyzing `caller`, AI sees the pointer setup and can request the bytes at the target address.

The topological ordering (leaf subroutines first) means we understand `process_bitmap` before `caller`.

---

## Pass 1: Instruction Annotation

### `annotate_instructions.ts` — Hybrid Deterministic + AI

```
npx tsx src/pipeline/annotate_instructions.ts blocks.json
npx tsx src/pipeline/annotate_instructions.ts blocks.json --workers 4 --block sub_C000
```

**Two-tier approach:**

**Tier 1 — Deterministic (no AI, from symbol_db + enrichment):**
- `sta $D020` → "Set border color (VIC_BORDER_COLOR)" (from symbol_db)
- `jsr $FFD2` → "CHROUT: print character in A" (from kernal_api enrichment)
- `lda $DC00` → "Read CIA1 data port A (keyboard/joystick)" (from symbol_db)
- `sta $01` → "Set processor port (memory banking)" (from symbol_db)
- `cmp #$28` → "Compare with 40 (screen width)" (from symbol_db)
- `and #$0F` → "Mask to lower nybble (color value 0-15)" (from symbol_db)
- Enrichment annotations from Phase 0 are also included as instruction-level context

**Tier 2 — AI (OpenAI, for unknowns):**
Instructions that Tier 1 can't annotate are batched by subroutine and sent to OpenAI. The AI sees the full subroutine + enrichment annotations for context.

```
System: You are annotating 6502 assembly for the Commodore 64.

This subroutine:
- Is called from $0810 (1 call site)
- Accesses VIC-II sprite registers $D000-$D00F
- Has a loop with back-edge $C01F → $C000

Enrichment context:
- Sets IRQ vector ($0314/$0315) to $0950 (spritesplit)
- Part of 3-stage raster interrupt chain

[Full subroutine with Tier 1 annotations already applied]

Return JSON array for the un-annotated instructions only:
[{"address": "$C005", "annotation": "Store current sprite index"}]
```

**Cost optimisation:** Subroutines where 100% of instructions were annotated deterministically skip the AI call entirely. Typically 30-60% of instructions in C64 code hit Tier 1.

**Output:** `annotated_blocks.json` — same structure as blocks.json with `annotation` and `annotation_source` ("symbol_db", "enrichment", or "ai") added to each instruction.

---

## Pass 2: Block Purpose Analysis + Context + Research

### `analyze_blocks.ts` — OpenAI + Qdrant + Cross-Block Context + AI Tool Calls

```
npx tsx src/pipeline/analyze_blocks.ts annotated_blocks.json
npx tsx src/pipeline/analyze_blocks.ts annotated_blocks.json --research-max 5 --context-max 3 --data-request-max 3 --workers 4
```

### Analysis Ordering (Topological)

Blocks are NOT analysed in address order. Instead, use the call graph (enhanced by enrichment plugins) to process **leaf subroutines first**:

1. Topological sort of the call graph (reverse post-order)
2. Leaf subroutines first — these are easiest (no unknown callees)
3. Then subroutines that call only already-analysed blocks
4. Continue until all processed
5. For cycles (mutual recursion): analyse together with whatever context is available, flag as needing review

**Parallelization within topological levels:** The `--workers` flag parallelizes API calls within each topological level. Blocks at the same level have no dependencies on each other, so they can be analyzed concurrently.

### Cross-Block Context Passing

**A block cannot be understood in isolation.** Each block's analysis prompt includes context about its relationships AND enrichment annotations:

```
System: You are analyzing a 6502 subroutine from a Commodore 64 program.

This subroutine's context:
- Called by:
  * init_game @ $0810 (purpose: "Initialize game state and hardware") [HIGH]
- Calls:
  * CHROUT @ $FFD2 (KERNAL: print character in A) [KNOWN]
  * init_sid @ $C100 (purpose: "Initialize SID chip for game music") [HIGH]
- Hardware: $D000-$D00F (write), $D015 (write)

Enrichment annotations:
- [pointer_pair] Paired low/high tables at $C800/$C810 resolve to: $0900, $0950, $0A00
- [vector_write] Sets IRQ vector ($0314/$0315) to $0950
- [register_semantics] STA $D015 = enable all 8 sprites (#$FF)
- [interrupt_chain] Part of 3-stage raster chain: $0900 → $0950 → $0A00 → $0900

Known C64 code patterns matching this block:
- "Sprite position initializer" [PATTERN] — Loop sets sprite X/Y from table

Return JSON:
{
  "purpose": "1-2 sentence description",
  "purpose_short": "verb_first_name (e.g. init_sprites)",
  "category": "init|main_loop|graphics|sound|input|ai|math|irq|data|io|util",
  "module": "Module from dictionary (entry|intro|game|graphics|sprites|sound|...)",
  "certainty": "HIGH|MEDIUM|LOW",
  "research_needed": ["topic to look up in knowledge base", ...],
  "context_needed": ["sub_C200"],
  "data_requests": [{"start": "$C800", "end": "$C8FF", "reason": "..."}],
  "data_discoveries": [],
  "reclassify": null,
  "algorithm_summary": "Brief algorithm description",
  "hardware_interaction": [{"register": "$D020", "usage": "write", "purpose": "Set border color"}],
  "side_effects": ["Enables all 8 sprites"]
}
```

### AI Feedback Loop (Tool Calls)

Pass 2 uses OpenAI function calling. The AI can call these tools:

| Tool | Purpose |
|------|---------|
| `read_memory(address, length)` | Read raw bytes from the binary at a specific address |
| `read_block(address)` | Get full disassembly and enrichments for a specific block |
| `find_references(address)` | Find all code that reads/writes a specific address |
| `reclassify_block(address, newType, reason, splitAt?)` | Change block type (code→data, data→code, split block) |
| `trace_data_usage(address)` | Trace how a data address is used across all blocks |
| `decode_data_format(address, format, elementSize?)` | Attempt to decode data as a specific format |

When the AI calls `reclassify_block`:
1. Update BlockStore
2. Re-run affected enrichment phases
3. Re-submit affected blocks to AI with updated enrichments

**Data requests are capped** at `--data-request-max` (default 3) per block. Context requests capped at `--context-max` (default 3). Research queries capped at `--research-max` (default 5) — generous to encourage Qdrant lookups for uncertain topics.

### Context Request Loop

When the AI requests full code of a related block:
1. Fetch the requested block from annotated_blocks.json + enrichment annotations
2. Include its analysis if available
3. Re-submit the current block with additional context
4. Cap iterations to prevent runaway chains

### Research Loop (Qdrant)

When `research_needed` is non-empty:
1. Query Qdrant via `qdrant_search.ts` module (hybrid search with enrichment)
2. Collect top 3-5 results per topic
3. Re-submit block + Qdrant context to AI
4. If still LOW after max iterations: flag `needs_review: true`

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
      "purpose": "Initialize all 8 sprite positions and colors from lookup tables",
      "purpose_short": "init_sprites",
      "category": "graphics",
      "module": "sprites",
      "certainty": "HIGH",
      "algorithm_summary": "Loop from 0 to 7...",
      "hardware_interaction": [
        {"register": "$D000", "usage": "write", "purpose": "Set sprite 0 X position"}
      ],
      "side_effects": ["Enables all 8 sprites"],
      "enrichment_annotations_used": [
        "pointer_pair: Paired tables at $C800/$C810",
        "register_semantics: STA $D015 = enable sprites"
      ],
      "data_discoveries": [],
      "reclassify": null,
      "needs_review": false,
      "analysis_history": {
        "context_requests": 0,
        "research_queries": [],
        "data_requests": 1,
        "iterations": 1,
        "certainty_progression": ["HIGH"]
      }
    }
  },
  "data_blocks_discovered": [],
  "reclassified_blocks": []
}
```

---

## Pass 3: Variable Naming

### `name_variables.ts` — OpenAI + Dictionary Management

```
npx tsx src/pipeline/name_variables.ts block_analysis.json
npx tsx src/pipeline/name_variables.ts block_analysis.json --dict variable_dict.json
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
6. **Usage detection from xrefs:**
   - Read-before-write → parameter (`param__`)
   - Write-then-read in one scope → local (`temp__`)
   - Accessed across subroutines → global
7. **Generic fallback:** `temp_zp_1` etc. if many different uses

**Batching:** Group all addresses used within one subroutine into a single API call.

**Variable propagation via project collection:** Before naming, search Qdrant for blocks using the same addresses to ensure consistent naming across unrelated call chains.

**Post-processing:** Pass AI's raw names through `naming.ts` to enforce prefix/suffix conventions.

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
        }
      ],
      "is_zero_page": true,
      "is_hardware_register": false
    }
  },
  "conflicts": []
}
```

---

## Pass 4: Block Documentation

### `document_blocks.ts` — OpenAI (Per-Block Comments — Pass 1 of 2)

```
npx tsx src/pipeline/document_blocks.ts
npx tsx src/pipeline/document_blocks.ts --block sub_C000
```

**For each subroutine, generate:**
- Subroutine name (verb-first snake_case)
- Header comment: what it does + WHY
- `Requires:` section (input registers/memory)
- `Sets:` section (output registers/memory)
- `Notes:` section (caveats)
- Inline comments for non-obvious instructions (WHY not WHAT)

**Input to AI per call:**
- Full annotated subroutine
- Block analysis: purpose, category, algorithm
- Variable names for all addresses used
- Enrichment annotations from Phase 0
- Cross-block context: caller/callee purposes and names

**LOW certainty blocks** get a modified prompt: "This block's purpose is uncertain. Flag what a human reviewer should examine."

**documented_blocks.json schema:**
```json
{
  "blocks": {
    "sub_C000": {
      "id": "sub_C000",
      "name": "init_sprites",
      "header_comment": "Initialize all 8 hardware sprites with positions and colors...",
      "requires": [
        {"register": null, "address": "$C800", "description": "Sprite X position table (8 bytes)"}
      ],
      "sets": [
        {"register": null, "address": "$D000-$D00F", "description": "VIC-II sprite X/Y position registers"}
      ],
      "notes": ["Trashes zero page $FB (used as loop counter)"],
      "inline_comments": [
        {"address": "0xC005", "comment": "Skip high-byte X position for sprites 0-3 (always < 256)"}
      ],
      "needs_review": false
    }
  }
}
```

---

## Pass 5: Integration Analysis

### `integrate_analysis.ts` — OpenAI (Overview Comments — Pass 2 of 2)

```
npx tsx src/pipeline/integrate_analysis.ts
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
- Group blocks into modules using the Module Dictionary
- Assign blocks to files
- Import dependency order
- Namespace assignments
- Move LOW certainty regions to `unprocessed/`

**Part 3 — Overview documentation:**
- File-level header comments (like archon's `main.asm` header)
- Section divider comments (`//---...`)
- Memory map documentation
- Architecture overview (state machine, event loop, interrupt structure)
- README.md, INTERESTING.md, How it works.md

**Token management:** For large programs (100+ subroutines), compress to: name, purpose_short, category, module, immediate callers/callees only.

**integration.json schema:**
```json
{
  "program": {
    "type": "game",
    "name": "Chess Master",
    "description": "Two-player chess game with basic AI...",
    "entry_point": "0x0810",
    "main_loop": { "block": "sub_0900", "description": "..." },
    "init_chain": [{"block": "sub_0810", "purpose": "..."}],
    "irq_handlers": [{"address": "0xC200", "purpose": "Raster split"}],
    "state_machines": [{"block": "sub_0900", "state_variable": "$02", "states": {...}}]
  },
  "files": [
    {
      "filename": "main.asm",
      "module": "entry",
      "description": "Entry point, BASIC stub, includes",
      "blocks": ["basic_stub"],
      "imports_from": ["init.asm", "game_loop.asm"]
    }
  ],
  "file_build_order": ["data.asm", "sprites.asm", "game_loop.asm", "init.asm", "main.asm"],
  "overview_comments": {
    "file_headers": {"main.asm": "// Chess Master...", "sprites.asm": "// Sprite management..."},
    "memory_map": "// Memory map:\n// $0801-$080D: BASIC stub\n// ..."
  },
  "documentation": {
    "readme": "# Chess Master\n...",
    "interesting": "## Interesting Techniques\n...",
    "how_it_works": "## Architecture\n..."
  },
  "block_to_file_map": {"sub_C000": "sprites.asm"},
  "unprocessed_regions": [{"start": "0x4000", "end": "0x5FFF", "reason": "..."}]
}
```

---

## Pluggable AI Pass Architecture

The 5 AI passes are **not monolithic scripts**. Each pass is a thin orchestrator (~100-150 lines) that loads and runs pluggable components. This means adding new context sources, AI tools, or response processing logic is the same as adding any other plugin — drop a file in the right directory.

### Three Plugin Types for AI Passes

#### 1. Context Providers (`pipeline/context/*_context.ts`)

Context providers contribute sections to the AI prompt. Each provider adds relevant information about the block being analyzed. The orchestrator collects all contributions and assembles the full prompt.

```typescript
interface ContextProviderInput {
  readonly block: Block;
  readonly blockStore: BlockStore;
  readonly enrichments: EnrichmentMap;
  readonly priorAnalyses: ReadonlyMap<string, BlockAnalysis>;
  readonly variableDict?: VariableDictJson;
  readonly symbolDb: SymbolDB;
}

interface ContextContribution {
  section: string;           // Section heading in prompt (e.g. "Enrichment annotations")
  content: string;           // Text content for this section
  priority: number;          // Lower = appears earlier in prompt
  tokenEstimate: number;     // For token budget management
}

interface ContextProvider {
  name: string;
  priority: number;
  appliesTo: PassNumber[];   // Which passes use this provider
  provide(input: ContextProviderInput): ContextContribution | null;
}
```

**Plugin catalogue** (all in `pipeline/context/`, auto-discovered by `*_context.ts`):

| Plugin | Pri | Passes | Purpose |
|--------|-----|--------|---------|
| `call_graph_context` | 10 | 2,3,4 | Caller/callee info with purposes |
| `enrichment_context` | 15 | 1,2,3,4 | Deterministic enrichment annotations |
| `qdrant_knowledge_context` | 18 | 2,3,4 | Authoritative Qdrant docs from AI concept extraction enrichment |
| `pattern_match_context` | 20 | 2 | Cross-program Qdrant pattern matches |
| `sibling_context` | 25 | 2,4 | Sub-block sibling summaries |
| `prior_analysis_context` | 30 | 2,3,4 | Already-analyzed block purposes |
| `variable_context` | 35 | 4 | Known variable names from Pass 3 |
| `hardware_context` | 40 | 2,4 | Hardware register usage summary |
| `data_usage_context` | 45 | 2,3 | Data flow / access pattern info |
| `cross_reference_context` | 50 | 2,3 | Xref summary (who reads/writes) |

**`qdrant_knowledge_context.ts`** is the key context provider for AI accuracy. It takes the `qdrant_knowledge` enrichment annotations produced by `ai_concept_extraction_enrichment.ts` (see [AI Knowledge Strategy](#ai-knowledge-strategy)) and formats them into the prompt. This means the AI gets authoritative Qdrant documentation for non-obvious concepts *before* it starts analyzing — without having to ask for it.

The orchestrator assembles contributions sorted by priority, respects a token budget (drops low-priority sections if over budget), and passes the assembled prompt to OpenAI.

#### 2. AI Tool Handlers (`pipeline/tools/*_tool.ts`)

Tool handlers implement the OpenAI function-calling tools that AI can invoke during Pass 2. Each handler defines the tool schema and the execution logic.

```typescript
interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;  // JSON Schema
}

interface ToolResult {
  content: string;               // Text returned to AI
  sideEffects?: ToolSideEffect[];  // BlockStore mutations, etc.
}

interface ToolSideEffect {
  type: "reclassify" | "split" | "merge" | "data_discovery";
  details: Record<string, unknown>;
}

interface AIToolHandler {
  name: string;
  definition: ToolDefinition;
  handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult>;
}

interface ToolContext {
  blockStore: BlockStore;
  memory: Uint8Array;
  enrichments: EnrichmentMap;
  priorAnalyses: ReadonlyMap<string, BlockAnalysis>;
  symbolDb: SymbolDB;
  projectCollection: ProjectCollection;
  /** Run a Qdrant knowledge base search (wraps query/src/pipeline.ts) */
  searchKnowledgeBase(query: string, limit?: number): Promise<SearchHit[]>;
}
```

**Plugin catalogue** (all in `pipeline/tools/`, auto-discovered by `*_tool.ts`):

| Plugin | Purpose |
|--------|---------|
| `read_memory_tool` | Read raw bytes from binary at a specific address |
| `read_block_tool` | Get full disassembly + enrichments for a block |
| `find_references_tool` | Find all code that reads/writes an address |
| `reclassify_block_tool` | Change block type (triggers re-enrichment) |
| `trace_data_usage_tool` | Trace how a data address is used across blocks |
| `decode_data_format_tool` | Attempt to decode data as a specific format |
| `search_knowledge_base_tool` | Query Qdrant knowledge base (for AI-requested lookups) |
| `search_similar_blocks_tool` | Search project collection for similar analyzed blocks |

The orchestrator auto-discovers tool handlers, builds the `tools` array for the OpenAI API call, and dispatches tool calls to the matching handler. Side effects (reclassification, data discovery) are collected and applied after the AI turn completes.

#### 3. Response Processors (`pipeline/processors/*_processor.ts`)

Response processors handle specific parts of the AI's response. Each processor extracts and acts on a particular aspect of the AI output.

```typescript
interface ProcessorInput {
  readonly block: Block;
  readonly aiResponse: Record<string, unknown>;  // Parsed JSON from AI
  readonly blockStore: BlockStore;
  readonly enrichments: EnrichmentMap;
  readonly projectCollection: ProjectCollection;
  readonly pass: PassNumber;
}

interface BlockMutation {
  type: "reclassify" | "split" | "merge";
  blockAddress: number;
  newType?: BlockType;         // For reclassify
  splitAt?: number;            // For split
  mergeWith?: number;          // For merge
  reason: string;
}

interface EmbeddingRequest {
  blockId: string;
  text: string;                // Analysis text to embed
  collection: "project" | "patterns";
}

interface ReviewFlag {
  blockId: string;
  severity: "info" | "warning" | "error";
  reason: string;
  details: Record<string, unknown>;
}

interface ProcessorResult {
  mutations?: BlockMutation[];
  embeddings?: EmbeddingRequest[];
  reviewFlags?: ReviewFlag[];
  discoveries?: DataDiscovery[];
}

interface ResponseProcessor {
  name: string;
  priority: number;
  appliesTo: PassNumber[];
  process(input: ProcessorInput): Promise<ProcessorResult>;
}
```

**Plugin catalogue** (all in `pipeline/processors/`, auto-discovered by `*_processor.ts`):

| Plugin | Passes | Purpose |
|--------|--------|---------|
| `data_discovery_processor` | 2 | Merge AI-discovered data blocks into BlockStore |
| `reclassification_processor` | 2 | Apply AI-requested block reclassifications |
| `research_request_processor` | 2 | Queue Qdrant lookups for `research_needed`, re-submit block |
| `context_request_processor` | 2 | Queue block context requests for `context_needed` |
| `embedding_processor` | 2,3 | Embed analysis into project Qdrant collection |
| `certainty_processor` | 2 | Cross-validate AI claims vs deterministic annotations, flag conflicts |
| `variable_merge_processor` | 3 | Merge proposed names into variable dictionary |
| `conflict_processor` | 3 | Detect and flag naming conflicts across scopes |
| `review_flag_processor` | 2,3,4 | Collect LOW/conflicting items needing human review |

### Pass Orchestrator Pattern

Each pass script follows the same pattern (~100-150 lines each). The `PassConfig` is shared across all passes:

```typescript
interface PassConfig {
  blockStore: BlockStore;
  enrichments: EnrichmentMap;
  memory: Uint8Array;
  model: string;               // OpenAI model name (default "gpt-5-mini")
  workers: number;             // Parallel API calls per topological level
  tokenBudget: number;         // Max tokens for assembled context prompt
  researchMax: number;         // Max Qdrant lookups per block (Pass 2)
  contextMax: number;          // Max block context requests per block (Pass 2)
  dataRequestMax: number;      // Max raw memory reads per block (Pass 2)
  priorAnalyses?: ReadonlyMap<string, BlockAnalysis>;
  variableDict?: VariableDictJson;
  documentedBlocks?: DocumentedBlocksJson;
  projectCollection: ProjectCollection;
}
```

```typescript
// pipeline/analyze_blocks.ts (Pass 2 — thin orchestrator)
import { loadPlugins } from "./plugin_loader";
import type { ContextProvider, AIToolHandler, ResponseProcessor } from "./types";

export async function runPass2(config: PassConfig): Promise<BlockAnalysisJson> {
  const contexts = await loadPlugins<ContextProvider>("pipeline/context", 2);
  const tools = await loadPlugins<AIToolHandler>("pipeline/tools");
  const processors = await loadPlugins<ResponseProcessor>("pipeline/processors", 2);

  // Topological order from call graph
  const order = topologicalSort(config.blockStore, config.enrichments);

  for (const level of order) {
    // Parallelize within each topological level
    await Promise.all(level.map(block => analyzeBlock(block, {
      contexts, tools, processors, config
    })));
  }
}

async function analyzeBlock(block, { contexts, tools, processors, config }) {
  // 1. Collect context from all providers
  const prompt = assemblePrompt(block, contexts, config.tokenBudget);

  // 2. Build tool definitions from all handlers
  const toolDefs = tools.map(t => t.definition);

  // 3. Call OpenAI with tools (feedback loop, capped)
  const response = await callWithTools(prompt, toolDefs, tools, config);

  // 4. Run all response processors
  for (const proc of processors) {
    await proc.process({ block, aiResponse: response, ...config });
  }
}
```

### Pass-Specific Plugin Usage

| Pass | Context Providers | Tool Handlers | Response Processors |
|------|------------------|---------------|-------------------|
| **Pass 1: Annotate** | enrichment, hardware | — (deterministic + batch AI) | — |
| **Pass 2: Analyze** | call_graph, enrichment, qdrant_knowledge, pattern_match, sibling, prior_analysis, hardware, data_usage, cross_reference | ALL tools | data_discovery, reclassification, research_request, context_request, embedding, certainty, review_flag |
| **Pass 3: Variables** | call_graph, enrichment, qdrant_knowledge, prior_analysis, data_usage, cross_reference | search_similar_blocks, search_knowledge_base | variable_merge, conflict, embedding |
| **Pass 4: Document** | call_graph, enrichment, qdrant_knowledge, prior_analysis, variable, hardware, sibling | — | review_flag |
| **Pass 5: Integrate** | (sees all blocks — special case, not per-block) | — | — |

Pass 1 and Pass 5 are slightly different — Pass 1 uses annotation sources (a simpler variant of context providers), and Pass 5 is a single AI call over the whole program rather than per-block. But they still use the same auto-discovery and plugin loading infrastructure.

### Annotation Sources (Pass 1 specialization)

Pass 1 has a simpler plugin type for instruction-level annotation:

```typescript
interface AnnotationSourceInput {
  instruction: Instruction;
  block: Block;
  enrichments: BlockEnrichment[];  // All enrichments for this block
  symbolDb: SymbolDB;             // Known C64 symbols database
}

interface AnnotationSource {
  name: string;
  priority: number;       // Lower = checked first
  /** Return annotation string if this source can annotate, null otherwise */
  annotate(input: AnnotationSourceInput): string | null;
}
```

**Plugin catalogue** (all in `pipeline/annotations/`, auto-discovered by `*_annotation.ts`):

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `symbol_db_annotation` | 10 | Known C64 symbols (hardware registers, KERNAL, ZP system vars) |
| `enrichment_annotation` | 20 | Annotations from Phase 0 enrichment plugins |
| `constant_annotation` | 30 | Well-known constants (40=screen width, $0F=color mask, etc.) |
| `kernal_api_annotation` | 40 | KERNAL JSR targets with calling conventions |

If ALL annotation sources return null for an instruction, it goes to the AI batch. Subroutines where every instruction is annotated deterministically skip the AI call entirely.

### Integration Analyzers (Pass 5 specialization)

Pass 5 operates on the whole program, not per-block. It uses integration analyzers:

```typescript
interface IntegrationAnalyzerInput {
  allBlocks: BlockAnalysis[];
  variableDict: VariableDictJson;
  documentedBlocks: DocumentedBlocksJson;
  enrichments: EnrichmentMap;
  blockStore: BlockStore;
}

type IntegrationSection =
  | "program_structure"    // Program type, main loop, init chain, IRQ mapping
  | "module_assignments"   // Which blocks go in which modules
  | "file_dependencies"    // Import ordering between output files
  | "state_machines"       // State machine detection and documentation
  | "memory_map"           // Memory layout documentation
  | "irq_chain";           // Interrupt handler chain mapping

interface IntegrationContribution {
  section: IntegrationSection;
  content: Record<string, unknown>;  // Section-specific structured data
  /** Suggested block-to-module assignments (module_assignments section) */
  moduleAssignments?: Record<string, string>;  // block ID → module name
  /** Suggested file ordering (file_dependencies section) */
  fileOrder?: string[];
}

interface IntegrationAnalyzer {
  name: string;
  priority: number;
  analyze(input: IntegrationAnalyzerInput): IntegrationContribution;
}
```

**Plugin catalogue** (all in `pipeline/integration/`, auto-discovered by `*_analyzer.ts`):

| Plugin | Pri | Purpose |
|--------|-----|---------|
| `program_structure_analyzer` | 10 | Detect program type, main loop, init chain |
| `module_assignment_analyzer` | 20 | Assign blocks to modules from dictionary |
| `irq_chain_analyzer` | 30 | Map interrupt handler chains and raster splits |
| `state_machine_analyzer` | 40 | Detect and document state machines |
| `memory_map_analyzer` | 50 | Generate memory map documentation |
| `file_dependency_analyzer` | 60 | Compute import order between output files |

The orchestrator collects all contributions and sends them as structured context to the AI for final integration and documentation generation.

---

## Phase 4: Code Generation

**Code generation has been extracted to a standalone project.** See [builder.md](plans/builder.md) for the full design.

The builder reads the enriched `blocks.json` output from this pipeline and produces compilable KickAssembler `.asm` files. It uses a pluggable emitter architecture to handle different block types (code, sprites, strings, lookup tables, etc.) and supports both single-file and multi-file output modes.

The builder works with or without RE pipeline enrichment — raw `blocks.json` from static analysis produces valid (but unannotated) KickAssembler output.

---

## Project Qdrant Collection

Each RE project gets its own Qdrant collection for similarity search within the project + variable propagation. A separate cross-program patterns collection accumulates knowledge.

### Collection Architecture

| Collection | Scope | Contents | Lifetime |
|------------|-------|----------|----------|
| `re_<project>` | Per-project | Analyzed blocks from this project | Deleted on cleanup |
| `c64_re_patterns` | Cross-program | HIGH-confidence normalized patterns | Persistent, grows |

**Embedding model:** OpenAI `text-embedding-3-small` (consistent with knowledge base).

### What Gets Embedded

The embedding text is the **analysis**, not the raw assembly:
```
Purpose: Initialize all 8 sprite positions and colors
Category: graphics/init
Algorithm: Loop 0-7, load X/Y from position table, store to VIC-II sprite registers
Hardware: VIC-II sprite position registers $D000-$D00F (write)
Variables: $FB (loop index), $FC-$FD (table pointer)
Calls: none (leaf subroutine)
```

### Pipeline Integration

**Pass 2:** After each block is analyzed, embed immediately. Before the NEXT block, search for similar already-embedded blocks + search `c64_re_patterns` for known patterns. Include top matches as hints.

**Pass 3:** Search by variable address to propagate naming across unrelated call chains.

**After Pass 3:** Re-embed all blocks with variable names included.

### Cross-Program Pattern Normalization

Before embedding into `c64_re_patterns`, normalize to remove project-specific details:
- Absolute addresses → relative descriptions
- Variable names → types
- Hardware registers → semantic names
- Instruction sequences → generic signatures

### Promotion Criteria

A block is promoted to patterns when: certainty = HIGH, human reviewed, verification PASS, category is recognizable.

### `project_collection.ts` — Shared Module

```typescript
initCollection(projectName: string): Promise<void>
embedBlock(blockAnalysis: BlockAnalysis, varDict?: VariableDictJson): Promise<void>
searchSimilar(query: string, hardwareRefs: string[], limit?: number): Promise<SimilarBlock[]>
searchByVariable(address: string, limit?: number): Promise<VariableUsage[]>
promoteToPatterns(block: BlockAnalysis, normalized: NormalizedPattern): Promise<void>
searchPatterns(query: string, hardwareRefs: string[], limit?: number): Promise<PatternMatch[]>
```

---

## Verification

Verification is handled by the standalone **verify** tool (see [verify.md](plans/verify.md)). It compiles the generated KickAssembler output and byte-compares against the original binary, skipping blocks marked as junk. The builder (see [builder.md](plans/builder.md)) produces the `.asm` files that verify checks.

---

## Master Orchestrator

### `re_pipeline.ts`

```
npx tsx src/pipeline/index.ts blocks.json                  # full pipeline
npx tsx src/pipeline/index.ts blocks.json --from pass2      # resume from pass 2
npx tsx src/pipeline/index.ts blocks.json --to pass3        # stop after pass 3
npx tsx src/pipeline/index.ts blocks.json --output-dir out/
npx tsx src/pipeline/index.ts blocks.json --model gpt-5-mini --workers 4 --max-passes 5
npx tsx src/pipeline/index.ts input.prg --entry 0x0810      # run static analysis first
```

**When given a `.prg` or `.asm` file**, runs static analysis first to produce `blocks.json`.

**Tracks state in `pipeline_state.json`:**
```json
{
  "passes": {
    "enrichment": {"status": "completed", "passes": 2, "reclassifications": 3},
    "pass1_annotate": {"status": "completed", "duration_s": 45, "ai_calls": 32},
    "pass2_analyze": {"status": "completed", "duration_s": 120, "tool_calls": 15},
    "pass3_variables": {"status": "completed", "duration_s": 60, "variables": 89},
    "pass4_document": {"status": "running", "progress": "23/47"},
    "pass5_integrate": {"status": "pending"}
  },
  "cost": {
    "total_api_calls": 234,
    "total_tokens": 556000,
    "estimated_cost_usd": 0.08
  }
}
```

---

## Claude Skill: `/disasm-auto`

The pipeline is designed to be orchestrated by a Claude skill. The skill drives the entire disassembly process including human interaction.

### Skill Workflow

```
User: /disasm-auto chess.prg

Claude:
1. Run static analysis → blocks.json
   "Loaded chess.prg (32KB at $0801). Found 47 subroutines, 12 data regions."

2. Run deterministic enrichment
   "Enrichment: 156 annotations across 47 blocks. 3 reclassifications.
    Resolved 8 indirect JMPs, 4 pointer pair tables, 2 interrupt chains."

3. Run AI pipeline
   "Pass 1: Annotated 47 blocks (15 fully deterministic)
    Pass 2: Analysed 47 blocks (38 HIGH, 6 MEDIUM, 3 LOW)
    Pass 3: Named 89 variables
    Pass 4: Documented 47 blocks (3 flagged for review)
    Pass 5: Split into 8 files
    Cost: $0.08 (191 API calls)"

4. Present review items to human:
   "3 blocks need review:
    - sub_C100 @ $C100 [LOW] — Complex bit manipulation
    - sub_C300 @ $C300 [LOW] — No callers found
    - sub_C500 @ $C500 [MEDIUM/CONFLICT] — Writes VIC regs but named 'doSound'"

5. Human picks sub_C100 → Claude uses MCP tools + Qdrant + Zen for deep analysis

6. Re-run affected passes: pipeline --from pass3

7. Build + verify (see builder.md, verify.md):
   builder blocks.json → KickAssembler output
   verify output/main.asm --original chess.prg → "PASS — 78% coverage"
```

---

## Complete Directory Layout

Every file in the RE pipeline. Pluggable directories use auto-discovery — drop a file matching the naming convention and it's automatically loaded. Static analysis is a separate project (see [static-analysis.md](plans/static-analysis.md)).

```
reverse-engineering/
  package.json                                    # Node.js project config
  tsconfig.json                                   # TypeScript config (ESM, strict)
  src/
    # ──────────────────────────────────────────────────────────────
    # CORE (not pluggable — pipeline infrastructure)
    # ──────────────────────────────────────────────────────────────
    index.ts                                      # Master orchestrator (CLI entry point)
    block_store.ts                                # Mutable block store with versioning + change log
    plugin_loader.ts                              # Generic auto-discovery for all plugin types
    types.ts                                      # All shared type definitions (see Core Types)

    # ──────────────────────────────────────────────────────────────
    # SHARED MODULES (imported by multiple pipeline stages)
    # ──────────────────────────────────────────────────────────────
    shared/
      symbol_db.ts                                # Known C64 symbols (KERNAL, hardware, ZP system)
      naming.ts                                   # Naming conventions (prefix/suffix rules)
      project_collection.ts                       # Project Qdrant collection management
      prompt_builder.ts                           # Assemble prompt sections with token budgeting

    # ──────────────────────────────────────────────────────────────
    # ENRICHMENT PLUGINS — Phase 0 (auto-discovered: *_enrichment.ts)
    # ──────────────────────────────────────────────────────────────
    enrichment/
      types.ts                                    # EnrichmentPlugin interface + related types
      index.ts                                    # Auto-discovery + multi-pass runner
      # --- Foundation (priority 10-19) ---
      constant_propagation_enrichment.ts          # Pri 10 — Trace immediate values through load/store chains
      zero_page_tracker_enrichment.ts             # Pri 12 — Track ZP writes/reads, identify pointer pairs
      kernal_api_enrichment.ts                    # Pri 15 — Identify JSR to known KERNAL entry points
      # --- Resolution (priority 20-39) ---
      pointer_pair_enrichment.ts                  # Pri 20 — Detect paired low/high byte tables
      indirect_jmp_enrichment.ts                  # Pri 25 — Resolve JMP ($xxxx) targets
      vector_write_enrichment.ts                  # Pri 27 — Detect writes to IRQ/NMI/BRK vectors
      rts_dispatch_enrichment.ts                  # Pri 30 — Detect RTS-as-jump pattern
      smc_target_enrichment.ts                    # Pri 32 — Detect self-modifying code targets
      address_table_enrichment.ts                 # Pri 35 — Resolve entries in address/jump tables
      # --- Semantics (priority 40-59) ---
      register_semantics_enrichment.ts            # Pri 40 — Annotate VIC/SID/CIA register writes
      data_format_enrichment.ts                   # Pri 42 — Classify data blocks by content format
      embedded_command_enrichment.ts              # Pri 44 — Detect bytecode/command languages in data
      interrupt_chain_enrichment.ts               # Pri 45 — Detect linked interrupt handler chains
      state_machine_enrichment.ts                 # Pri 48 — Detect state variable + dispatch patterns
      copy_loop_enrichment.ts                     # Pri 50 — Detect memory copy/fill loops
      data_table_semantics_enrichment.ts          # Pri 55 — Determine what data table values mean
      # --- Cross-Reference (priority 60-79) ---
      call_graph_enrichment.ts                    # Pri 60 — Build complete call graph (direct + indirect)
      data_boundary_enrichment.ts                 # Pri 62 — Determine data block sizes
      data_flow_enrichment.ts                     # Pri 65 — Track data read/write across blocks
      shared_data_enrichment.ts                   # Pri 70 — Identify shared state, flag race conditions
      # --- C64-Specific (priority 80-99) ---
      banking_state_enrichment.ts                 # Pri 80 — Track memory banking via $01 and $DD00
      vic_annotation_enrichment.ts                # Pri 85 — Higher-level VIC-II mode annotations
      sid_annotation_enrichment.ts                # Pri 88 — Higher-level SID voice/filter annotations
      screen_ops_enrichment.ts                    # Pri 90 — Detect screen/colour RAM operations
      # --- AI-Assisted (priority 100+) ---
      ai_concept_extraction_enrichment.ts         # Pri 100 — AI extracts key concepts → Qdrant lookups

    # ──────────────────────────────────────────────────────────────
    # AI PASS ORCHESTRATORS (thin ~100-150 line scripts)
    # ──────────────────────────────────────────────────────────────
    pipeline/
      annotate_instructions.ts                    # Pass 1 — Hybrid deterministic + AI annotation
      analyze_blocks.ts                           # Pass 2 — Block purpose analysis + tool calls
      name_variables.ts                           # Pass 3 — Variable naming + dictionary management
      document_blocks.ts                          # Pass 4 — Per-block documentation generation
      integrate_analysis.ts                       # Pass 5 — Whole-program integration + file splitting

      # ──────────────────────────────────────────────────────────
      # CONTEXT PROVIDERS (auto-discovered: *_context.ts)
      # ──────────────────────────────────────────────────────────
      context/
        types.ts                                  # ContextProvider interface
        index.ts                                  # Auto-discovery + priority assembly
        call_graph_context.ts                     # Pri 10 — Caller/callee purposes [Pass 2,3,4]
        enrichment_context.ts                     # Pri 15 — Deterministic enrichment annotations [Pass 1,2,3,4]
        qdrant_knowledge_context.ts               # Pri 18 — Qdrant docs from concept extraction [Pass 2,3,4]
        pattern_match_context.ts                  # Pri 20 — Cross-program Qdrant patterns [Pass 2]
        sibling_context.ts                        # Pri 25 — Sub-block sibling summaries [Pass 2,4]
        prior_analysis_context.ts                 # Pri 30 — Already-analyzed block purposes [Pass 2,3,4]
        variable_context.ts                       # Pri 35 — Known variable names [Pass 4]
        hardware_context.ts                       # Pri 40 — Hardware register summary [Pass 2,4]
        data_usage_context.ts                     # Pri 45 — Data flow / access patterns [Pass 2,3]
        cross_reference_context.ts                # Pri 50 — Xref summary [Pass 2,3]

      # ──────────────────────────────────────────────────────────
      # AI TOOL HANDLERS (auto-discovered: *_tool.ts) — Pass 2
      # ──────────────────────────────────────────────────────────
      tools/
        types.ts                                  # AIToolHandler interface
        index.ts                                  # Auto-discovery + dispatch
        read_memory_tool.ts                       # Read raw bytes from binary
        read_block_tool.ts                        # Get disassembly + enrichments for a block
        find_references_tool.ts                   # Find all code that reads/writes an address
        reclassify_block_tool.ts                  # Change block type (triggers re-enrichment)
        trace_data_usage_tool.ts                  # Trace data address usage across blocks
        decode_data_format_tool.ts                # Decode data as a specific format
        search_knowledge_base_tool.ts             # Query Qdrant knowledge base
        search_similar_blocks_tool.ts             # Search project collection for similar blocks

      # ──────────────────────────────────────────────────────────
      # RESPONSE PROCESSORS (auto-discovered: *_processor.ts)
      # ──────────────────────────────────────────────────────────
      processors/
        types.ts                                  # ResponseProcessor interface
        index.ts                                  # Auto-discovery + sequential runner
        data_discovery_processor.ts               # Merge discovered data into BlockStore [Pass 2]
        reclassification_processor.ts             # Apply AI-requested reclassifications [Pass 2]
        research_request_processor.ts             # Queue Qdrant lookups, re-submit [Pass 2]
        context_request_processor.ts              # Queue block context requests [Pass 2]
        embedding_processor.ts                    # Embed analysis into project collection [Pass 2,3]
        certainty_processor.ts                    # Cross-validate AI claims vs deterministic [Pass 2]
        variable_merge_processor.ts               # Merge names into variable dict [Pass 3]
        conflict_processor.ts                     # Detect and flag naming conflicts [Pass 3]
        review_flag_processor.ts                  # Collect items needing human review [Pass 2,3,4]

      # ──────────────────────────────────────────────────────────
      # ANNOTATION SOURCES (auto-discovered: *_annotation.ts) — Pass 1
      # ──────────────────────────────────────────────────────────
      annotations/
        types.ts                                  # AnnotationSource interface
        index.ts                                  # Auto-discovery + priority check
        symbol_db_annotation.ts                   # Pri 10 — Known C64 symbols
        enrichment_annotation.ts                  # Pri 20 — Phase 0 enrichment annotations
        constant_annotation.ts                    # Pri 30 — Well-known constants
        kernal_api_annotation.ts                  # Pri 40 — KERNAL JSR calling conventions

      # ──────────────────────────────────────────────────────────
      # INTEGRATION ANALYZERS (auto-discovered: *_analyzer.ts) — Pass 5
      # ──────────────────────────────────────────────────────────
      integration/
        types.ts                                  # IntegrationAnalyzer interface
        index.ts                                  # Auto-discovery + contribution collector
        program_structure_analyzer.ts             # Pri 10 — Program type, main loop, init chain
        module_assignment_analyzer.ts             # Pri 20 — Assign blocks to module dictionary
        irq_chain_analyzer.ts                     # Pri 30 — Map interrupt handler chains
        state_machine_analyzer.ts                 # Pri 40 — Detect and document state machines
        memory_map_analyzer.ts                    # Pri 50 — Generate memory map documentation
        file_dependency_analyzer.ts               # Pri 60 — Compute import order between files

    # ──────────────────────────────────────────────────────────────
    # CODE GENERATION — separate project, see builder.md
    # ──────────────────────────────────────────────────────────────
```

**File count:** 4 core + 4 shared + 27 enrichment plugins + 6 pass orchestrators + 12 context providers + 10 tool handlers + 11 response processors + 6 annotation sources + 8 integration analyzers = **88 files total** (of which 74 are drop-in plugins). Code generation is handled by the separate builder project (see [builder.md](plans/builder.md)).

### Reused from `query/` (imported directly, not copied)

The existing `query/` pipeline is full TypeScript with the same auto-discovery plugin architecture. The RE pipeline imports it as a local dependency rather than duplicating code.

| Module | Import Path | What We Use |
|--------|------------|-------------|
| Qdrant search | `query/src/search/qdrant.ts` | `qdrantSearch()`, `mergeResults()`, `trimByScore()` |
| Embeddings | `query/src/search/embedding.ts` | `getEmbedding()` — OpenAI embedding wrapper |
| Search strategy | `query/src/search/strategy.ts` | `determineStrategy()`, `executeStrategy()` — hybrid/filtered/semantic |
| Number extraction | `query/src/numbers.ts` | `extractNumbers()`, `toHex()`, `toBinary()` |
| Query enrichment | `query/src/enrichment/index.ts` | `runEnrichment()` — full enrichment pipeline (numbers, mirrors, memory map, registers, opcodes, colors, tags) |
| Types | `query/src/types.ts` | `QueryConfig`, `SearchHit`, `ParsedNumber` |
| Pipeline | `query/src/pipeline.ts` | `runPipeline()` — full query→enrich→search→format pipeline |

This means every Qdrant lookup from the RE pipeline automatically gets the full enrichment treatment — number base conversion, VIC-II/SID/CIA mirror resolution, memory map region context, register mnemonics, etc.

---

## Pipeline Stage Contracts

Each pipeline stage has a well-defined input and output. Stages communicate via JSON files on disk — any stage can be re-run independently by providing its input file.

```
blocks.json ──→ [Enrichment] ──→ EnrichedBlockStore (in-memory)
                                        │
                                        ▼
                              [Pass 1: Annotate] ──→ annotated_blocks.json
                                        │
                                        ▼
                              [Pass 2: Analyze] ──→ block_analysis.json
                                        │
                                        ▼
                              [Pass 3: Variables] ──→ variable_dict.json
                                        │
                                        ▼
                              [Pass 4: Document] ──→ documented_blocks.json
                                        │
                                        ▼
                              [Pass 5: Integrate] ──→ integration.json
                                        │
                                        ▼
                              enriched blocks.json (output)
                                        │
                                        ▼
                              [Builder (separate project)] ──→ .asm + verification
                              See builder.md
```

### Core Types (defined in `src/types.ts`)

These types are shared across all stages:

```typescript
// ── Block Types ─────────────────────────────────────────────────

type BlockType = "subroutine" | "irq_handler" | "fragment" | "data" | "unknown";
type Reachability = "proven" | "indirect" | "unreachable";
type Certainty = "HIGH" | "MEDIUM" | "LOW";
type PassNumber = 1 | 2 | 3 | 4 | 5;

interface LoadedRegion {
  start: number;               // Start address in 64KB space
  end: number;                 // End address (exclusive)
  data: Uint8Array;            // Raw bytes
}

interface Instruction {
  address: number;             // Absolute address
  opcode: number;              // Raw opcode byte
  mnemonic: string;            // e.g. "LDA", "STA", "JSR"
  operand: string;             // e.g. "$D020", "($FB),Y", "#$00"
  bytes: number[];             // Raw instruction bytes
  size: number;                // 1, 2, or 3
  addressingMode: string;      // e.g. "absolute", "zeropage_x", "indirect_y"
  annotation?: string;         // Human-readable annotation (added by Pass 1)
  annotationSource?: "symbol_db" | "enrichment" | "ai";
}

interface BasicBlock {
  start: number;               // First instruction address
  end: number;                 // Last instruction address (inclusive)
  exitType: "fall_through" | "branch" | "jump" | "return" | "halt";
  successors: number[];        // Addresses of successor basic blocks
}

interface CrossReference {
  from: number;                // Source address
  to: number;                  // Target address
  type: "call" | "jump" | "read" | "write" | "vector_write" | "smc";
  instruction?: string;        // e.g. "JSR $C000"
}

interface HardwareReference {
  address: number;             // Hardware register address
  access: "read" | "write" | "read_write";
  instructionAddress: number;  // Which instruction accesses it
  value?: number;              // Constant value if known (from constant propagation)
}

interface Block {
  id: string;                  // e.g. "sub_C000", "data_C800", "unk_D000"
  address: number;             // Start address
  endAddress: number;          // End address (exclusive)
  type: BlockType;
  reachability: Reachability;
  instructions: Instruction[]; // Empty for data/unknown blocks
  basicBlocks: BasicBlock[];
  xrefsIn: CrossReference[];   // References TO this block
  xrefsOut: CrossReference[];  // References FROM this block
  hardwareRefs: HardwareReference[];
  siblings?: string[];         // Sub-block sibling IDs (for split large blocks)
  dataFormat?: DataFormat;     // Only for data blocks
  raw?: string;                // Base64-encoded raw bytes (for data/unknown blocks)
}

interface DataFormat {
  type: string;                // "sprite" | "charset" | "string" | "music" | "table" | etc.
  subtype?: string;            // "petscii_null_terminated" | "screen_codes" | etc.
  confidence: Certainty;
  candidates?: DataFormat[];   // All detector proposals (not just winner)
  elementSize?: number;        // For structured data
  count?: number;              // Number of elements
}

// ── Block Store Types ───────────────────────────────────────────

interface BlockChange {
  timestamp: number;
  action: "reclassify" | "split" | "merge";
  blockAddress: number;
  details: Record<string, unknown>;
  reason: string;
  source: string;              // Plugin or pass that made the change
}

// ── Enrichment Types ────────────────────────────────────────────

type EnrichmentType =
  | "resolved_target" | "pointer_pair" | "vector_write" | "call_relationship"
  | "data_semantic" | "data_format" | "register_semantic" | "pattern"
  | "api_call" | "banking" | "qdrant_knowledge" | "annotation";

interface BlockEnrichment {
  blockAddress: number;
  source: string;              // Plugin name
  type: EnrichmentType;
  annotation: string;          // Human-readable (goes to AI prompt)
  data: Record<string, unknown>; // Structured (for downstream plugins)
}

type EnrichmentMap = ReadonlyMap<string, BlockEnrichment[]>;  // plugin name → enrichments

// ── Shared Service Types ────────────────────────────────────────

interface SymbolDB {
  /** Look up a known symbol by address. Returns null if unknown. */
  lookup(address: number): SymbolEntry | null;
  /** Check if an address is a hardware register */
  isHardwareRegister(address: number): boolean;
  /** Check if an address is a KERNAL entry point */
  isKernalEntry(address: number): boolean;
}

interface SymbolEntry {
  address: number;
  name: string;                // e.g. "VIC_BORDER_COLOR", "CHROUT"
  category: "hardware" | "kernal" | "zeropage" | "basic" | "other";
  description: string;         // e.g. "Border color register"
  chip?: string;               // e.g. "VIC-II", "SID", "CIA1"
}

interface ProjectCollection {
  /** Embed a block's analysis into the project Qdrant collection */
  embedBlock(analysis: BlockAnalysis, varDict?: VariableDictJson): Promise<void>;
  /** Search for similar blocks in the project collection */
  searchSimilar(query: string, hardwareRefs: string[], limit?: number): Promise<SimilarBlock[]>;
  /** Search for blocks using the same variable address */
  searchByVariable(address: string, limit?: number): Promise<VariableUsage[]>;
  /** Promote a high-confidence block to the cross-program patterns collection */
  promoteToPatterns(block: BlockAnalysis, normalized: NormalizedPattern): Promise<void>;
  /** Search the cross-program patterns collection */
  searchPatterns(query: string, hardwareRefs: string[], limit?: number): Promise<PatternMatch[]>;
}

interface SimilarBlock {
  blockId: string;
  purpose: string;
  category: string;
  score: number;
}

interface VariableUsage {
  blockId: string;
  variableName: string;
  scope: string;
  confidence: Certainty;
}

interface NormalizedPattern {
  pattern: string;             // Generic description (no project-specific addresses)
  category: string;
  hardwareSemantics: string[]; // e.g. ["VIC-II sprite position", "interrupt chain"]
}

interface PatternMatch {
  pattern: string;
  category: string;
  score: number;
  source: string;              // Which project it came from
}
```

### Stage Input/Output Contracts

#### Static Analysis → `blocks.json`

```typescript
// Input: .prg file + entry address
// Output: blocks.json
interface BlocksJson {
  metadata: {
    source: string;            // Input filename
    loadAddress: number;
    entryPoints: number[];
    totalBytes: number;
    coverage: { code: number; data: number; unknown: number };
  };
  blocks: Block[];             // Every loaded byte belongs to exactly one block
  rawBinary: string;           // Base64-encoded full 64KB memory image (loaded regions)
}
```

#### Enrichment (Phase 0) — In-Memory Only

```typescript
// Input: BlocksJson (parsed)
// Output: enriched BlockStore + EnrichmentMap (in-memory, not serialized)
interface EnrichmentStageInput {
  blocks: Block[];
  memory: Uint8Array;          // 64KB image reconstructed from rawBinary
  loadedRegions: LoadedRegion[];
  maxPasses: number;           // --max-passes flag (default 5)
  qdrantContextBudget: number; // --qdrant-context-budget (default 8192 tokens)
}

interface EnrichmentStageOutput {
  blockStore: BlockStore;      // Mutable, versioned (blocks may have been reclassified/split)
  enrichments: EnrichmentMap;  // All enrichment annotations indexed by plugin name
  changeLog: BlockChange[];    // All reclassifications/splits that occurred
  stats: {
    totalEnrichments: number;
    reclassifications: number;
    passes: number;
    aiConceptExtractionCalls: number;  // From ai_concept_extraction plugin
    qdrantLookups: number;
  };
}
```

#### Pass 1: Annotate → `annotated_blocks.json`

```typescript
// Input: EnrichmentStageOutput
// Output: annotated_blocks.json
interface AnnotatedBlocksJson {
  metadata: {
    source: string;            // "blocks.json"
    timestamp: string;
    model: string;
    totalBlocks: number;
    fullyDeterministic: number; // Blocks where 100% of instructions were annotated without AI
    aiAnnotated: number;
    totalAiCalls: number;
  };
  blocks: Block[];             // Same as input but with annotation + annotationSource on each instruction
}
```

#### Pass 2: Analyze → `block_analysis.json`

```typescript
// Input: AnnotatedBlocksJson + EnrichmentMap
// Output: block_analysis.json
interface BlockAnalysis {
  id: string;
  address: string;             // Hex string "0xC000"
  endAddress: string;
  type: BlockType;
  reachability: Reachability;
  purpose: string;             // 1-2 sentence description
  purposeShort: string;        // verb_first_name e.g. "init_sprites"
  category: string;            // init|main_loop|graphics|sound|input|ai|math|irq|data|io|util
  module: string;              // Module from dictionary
  certainty: Certainty;
  algorithmSummary: string;
  hardwareInteraction: { register: string; usage: "read" | "write"; purpose: string }[];
  sideEffects: string[];
  enrichmentAnnotationsUsed: string[];
  dataDiscoveries: DataDiscovery[];
  reclassify: BlockReclassification | null;
  needsReview: boolean;
  needsQdrantVerification: boolean;
  analysisHistory: {
    contextRequests: number;
    researchQueries: string[];
    dataRequests: number;
    iterations: number;
    certaintyProgression: Certainty[];
    crossValidationConflicts: string[];  // Any conflicts caught by certainty_processor
  };
}

interface DataDiscovery {
  start: string;               // Hex address
  end: string;
  type: string;
  subtype?: string;
  label: string;
  value?: string;              // Decoded value for strings
  confidence: Certainty;
}

interface BlockAnalysisJson {
  metadata: {
    source: string;
    timestamp: string;
    model: string;
    totalBlocks: number;
    certaintySummary: Record<Certainty, number>;
    totalAiCalls: number;
    totalResearchQueries: number;
    totalDataRequests: number;
    totalReclassifications: number;
    totalCrossValidationConflicts: number;
  };
  blocks: Record<string, BlockAnalysis>;  // keyed by block ID
  dataBlocksDiscovered: DataDiscovery[];
  reclassifiedBlocks: BlockReclassification[];
}
```

#### Pass 3: Variables → `variable_dict.json`

```typescript
// Input: BlockAnalysisJson
// Output: variable_dict.json
interface VariableEntry {
  scope: string;               // Block ID e.g. "sub_C000", or "global"
  name: string;                // Processed name e.g. "idx__sprite"
  rawName: string;             // AI's original proposal e.g. "sprite loop counter"
  type: "index" | "pointer" | "counter" | "flag" | "buffer" | "temp" | "param" | "state" | "other";
  description: string;
  confidence: Certainty;
  signals: string[];           // Evidence e.g. ["loop_counter", "compared_with_8"]
}

interface VariableRecord {
  entries: VariableEntry[];    // Multiple scoped entries for same address
  isZeroPage: boolean;
  isHardwareRegister: boolean;
}

interface VariableConflict {
  address: string;
  existingName: string;
  proposedName: string;
  existingScope: string;
  proposedScope: string;
  resolution: "kept_existing" | "upgraded" | "flagged";
}

interface VariableDictJson {
  metadata: {
    source: string;
    timestamp: string;
    model: string;
    totalVariables: number;
    totalConflicts: number;
  };
  variables: Record<string, VariableRecord>;  // keyed by hex address e.g. "0x00FB"
  conflicts: VariableConflict[];
}
```

#### Pass 4: Document → `documented_blocks.json`

```typescript
// Input: BlockAnalysisJson + VariableDictJson
// Output: documented_blocks.json
interface BlockDocumentation {
  id: string;
  name: string;                // Subroutine name e.g. "init_sprites"
  headerComment: string;       // Multi-line header comment
  requires: { register: string | null; address: string | null; description: string }[];
  sets: { register: string | null; address: string | null; description: string }[];
  notes: string[];
  inlineComments: { address: string; comment: string }[];
  needsReview: boolean;
}

interface DocumentedBlocksJson {
  metadata: {
    source: string;
    timestamp: string;
    model: string;
    totalDocumented: number;
    flaggedForReview: number;
  };
  blocks: Record<string, BlockDocumentation>;  // keyed by block ID
}
```

#### Pass 5: Integrate → `integration.json`

```typescript
// Input: BlockAnalysisJson + VariableDictJson + DocumentedBlocksJson
// Output: integration.json
interface IntegrationJson {
  program: {
    type: string;              // "game" | "demo" | "utility" | "unknown"
    name: string;
    description: string;
    entryPoint: string;        // Hex address
    mainLoop: { block: string; description: string } | null;
    initChain: { block: string; purpose: string }[];
    irqHandlers: { address: string; purpose: string }[];
    stateMachines: { block: string; stateVariable: string; states: Record<string, string> }[];
  };
  files: {
    filename: string;
    module: string;
    description: string;
    blocks: string[];          // Block IDs
    importsFrom: string[];     // Other filenames
  }[];
  fileBuildOrder: string[];
  overviewComments: {
    fileHeaders: Record<string, string>;  // filename → header comment
    memoryMap: string;
  };
  documentation: {
    readme: string;
    interesting: string;
    howItWorks: string;
  };
  blockToFileMap: Record<string, string>;  // block ID → filename
  unprocessedRegions: { start: string; end: string; reason: string }[];
}
```

#### Code Generation & Verification

Code generation and verification are handled by the standalone **builder** project. See [builder.md](plans/builder.md).

The RE pipeline's output (`enriched blocks.json` + `integration.json`) is the builder's input. The builder produces KickAssembler `.asm` files and handles compilation verification.

---

## Cost Estimate (gpt-5-mini)

For a typical C64 game (32KB, ~47 subroutines):

| Phase | AI Calls | Est. Tokens | Est. Cost |
|-------|----------|-------------|-----------|
| Enrichment (deterministic) | 0 | 0 | $0.00 |
| Enrichment (AI concept extraction) | ~47 | ~47K | ~$0.007 |
| Pass 1: Annotate | ~32 | ~64K | ~$0.01 |
| Pass 2: Analyse + tools | ~80 | ~240K | ~$0.04 |
| Pass 2: Cross-validation re-submits | ~5 | ~10K | ~$0.002 |
| Pass 3: Variables | ~47 | ~94K | ~$0.01 |
| Pass 4: Document | ~47 | ~188K | ~$0.03 |
| Pass 5: Integrate | ~3 | ~24K | ~$0.004 |
| Qdrant (embed + search) | ~94 | ~33K | ~$0.0004 |
| **Total** | **~355** | **~700K** | **~$0.10** |

Even large programs (200+ subroutines) would cost under $0.50. The AI concept extraction + cross-validation adds <$0.01 but significantly improves accuracy.

---

## Verification

To test the RE pipeline end-to-end:
1. Compile `spriteintro.asm` → `.prg`, run static analysis → `blocks.json`
2. Run enrichment → verify interrupt chain detection, pointer pair resolution, data classification
3. Run full AI pipeline → check annotation quality, naming, documentation
4. Run builder on enriched blocks.json (see [builder.md](plans/builder.md)), then verify output byte-matches original (see [verify.md](plans/verify.md))
5. Repeat with archon snapshot → verify:
   - JMP indirect dispatch resolved
   - Function pointer table correctly identified
   - 54-byte sprite format detected
   - Music data with embedded commands detected
   - File split into logical modules matching archon structure

---

## Research References

### Static Analysis References

| Reference | Relevance |
|-----------|-----------|
| **6502bench SourceGen** | Primary reference. Same platform (6502), same approach (recursive descent + speculative). |
| **Spedi** | Inspires speculative code discovery. Recover all possible basic blocks, prune via overlap analysis. |
| **ddisasm** | Datalog-based heuristic fusion. Key: "no individual analysis is perfect but combining several maximizes chances." |
| **Ghidra Auto-Analysis** | 7-phase analysis pipeline. Aggressive Instruction Finder for undefined bytes. |

### AI-Assisted RE References

| Reference | Relevance |
|-----------|-----------|
| **SK2Decompile** | Two-phase decompilation: structure then naming. Validates our pass ordering. |
| **GenNm** | Call graph context propagation improves naming by 168%. Validates topological ordering. |
| **ReVa** | Ghidra MCP tool. "Smaller, critical fragments with reinforcement and links." Validates sub-block splitting. |
| **ChatCPS / Trim My View** | Two-pass LLM analysis: per-function then module-level. Validates Pass 4/5 split. |
| **Talos Intelligence** | Practical LLM RE. Don't bias AI; use explicit instructions; compact summaries beat full dumps. |
| **LLM4Decompile** | Open-source LLM for decompilation. Future consideration. |

### Lessons Applied

1. **Don't bias AI** (Talos) — Pass 2 doesn't assume program type; AI determines category independently
2. **"DO NOT STOP" instructions** (Talos) — All batch prompts require full analysis, not early LOW returns
3. **Compact summaries** (Talos, ReVa, ChatCPS) — Cross-block context uses one-line summaries; full code only on AI request
4. **Iterative variable naming** (GenNm) — Pass 3 re-runnable after Pass 4 for refinement
5. **Verification as feedback** — Failures map back to blocks for re-analysis
6. **Separate structure from semantics** (SK2Decompile) — Enrichment+Pass1 = structure, Pass2+3 = semantics
7. **AI data discovery** (Ghidra multi-phase) — Pass 2 discovers data via tool calls, iteratively
8. **Project Qdrant collection** (GenNm) — Similarity search catches patterns call graphs miss
9. **Function decomposition** (ReVa, ChatCPS) — Large blocks sub-split with sibling summaries
