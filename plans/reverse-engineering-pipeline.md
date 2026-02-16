# C64 Reverse Engineering Automation Pipeline

## Context

We have a comprehensive C64/6502 knowledge base in Qdrant (4000+ chunks), an MCP tools plan ([ai-disassembler-mcp.md](plans/ai-disassembler-mcp.md)) that defines interactive MCP tools, and a static analysis plan ([static-analysis.md](plans/static-analysis.md)) that defines the deterministic code/data classification layer.

**This plan defines the full reverse engineering pipeline.** It takes `blocks.json` from static analysis and produces **reassemblable KickAssembler source** — like the hand-crafted `archon-c64/` project. The pipeline is:

1. **Pluggable deterministic enrichment** — resolve indirect addressing, classify data formats, detect patterns (no AI, fast, repeatable)
2. **5-pass AI analysis** — annotate, analyze, name, document, integrate (OpenAI gpt-5-mini, cheap)
3. **Pluggable code generation** — emit KickAssembler source split into logical module files

All code is TypeScript/Node.js. The pipeline is pluggable at every layer — adding new analysis capabilities means dropping a file into the right directory.

**Related plans:**
- [static-analysis.md](plans/static-analysis.md) — produces `blocks.json` (input to this pipeline)
- [ai-disassembler-mcp.md](plans/ai-disassembler-mcp.md) — defines MCP tools and output format

---

## Target Output (modelled on archon-c64/)

The pipeline produces a KickAssembler project:

```
output/
  main.asm                    # Entry point, memory map, segment defs, #imports
  src/
    io.asm                    # C64 memory/IO constants (standard, reusable)
    const.asm                 # Game-specific constants discovered during analysis
    resources.asm             # Binary resources (sprites, charsets, music, strings)
    <module>.asm              # One file per logical module (see Module Dictionary)
  assets/                     # Extracted binary assets (.bin files)
  README.md                   # Program description, memory map, build instructions
```

Each file uses KickAssembler conventions: `.filenamespace`, segments, `//` comments, labels with semantic names, `.namespace private {}` for internal routines.

### Module Dictionary (controlled vocabulary)

AI must assign blocks to modules from this dictionary — prevents explosion into hundreds of files:

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
[Code Generation] ──────────────────────── KickAssembler output
    Pluggable *_generator.ts plugins         Split into module files
    |                                        Data representation
    v
[verify.ts] ────────────────────────────── verification report
    |       Selective byte comparison
    v                                        Promote HIGH blocks
[Human review via Claude + MCP tools]        to c64_re_patterns
    Review flagged items, iterate
```

Each pass reads JSON from the previous pass and writes its own JSON. Any pass can be re-run independently. The enrichment layer operates in-memory and feeds directly into Pass 1.

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

  /** Get current snapshot (read-only view for plugins) */
  getSnapshot(): readonly Block[] { ... }

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

### Directory Layout

```
reverse-engineering/
  src/
    enrichment/
      types.ts                         # Plugin interface
      index.ts                         # Auto-discovery + priority runner
      # --- Foundation (priority 10-19) ---
      constant_propagation_enrichment.ts
      zero_page_tracker_enrichment.ts
      kernal_api_enrichment.ts
      # --- Resolution (priority 20-39) ---
      pointer_pair_enrichment.ts
      indirect_jmp_enrichment.ts
      vector_write_enrichment.ts
      rts_dispatch_enrichment.ts
      smc_target_enrichment.ts
      address_table_enrichment.ts
      # --- Semantics (priority 40-59) ---
      register_semantics_enrichment.ts
      interrupt_chain_enrichment.ts
      state_machine_enrichment.ts
      copy_loop_enrichment.ts
      data_table_semantics_enrichment.ts
      data_format_enrichment.ts
      embedded_command_enrichment.ts
      # --- Cross-Reference (priority 60-79) ---
      call_graph_enrichment.ts
      data_flow_enrichment.ts
      data_boundary_enrichment.ts
      shared_data_enrichment.ts
      # --- C64-Specific (priority 80-99) ---
      banking_state_enrichment.ts
      vic_annotation_enrichment.ts
      sid_annotation_enrichment.ts
      screen_ops_enrichment.ts
```

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

### Data Usage Tracking

The `data_flow` plugin (priority 65) builds a data usage map that is critical for AI analysis:

```typescript
interface DataUsageRecord {
  dataAddress: number;
  dataSize: number;
  sizeEvidence: SizeEvidence;
  readers: DataAccess[];
  writers: DataAccess[];
  accessPattern: AccessPattern;     // sequential, random, indexed, indirect, command_stream, constant
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
npx tsx src/pipeline/analyze_blocks.ts annotated_blocks.json --research-max 2 --context-max 2 --data-request-max 3 --workers 4
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

**Data requests are capped** at `--data-request-max` (default 3) per block. Context requests capped at `--context-max` (default 2). Research queries capped at `--research-max` (default 2).

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

## Phase 4: Code Generation (Pluggable)

### Directory Layout

```
reverse-engineering/
  src/
    codegen/
      types.ts                       # Output plugin interface
      index.ts                       # Auto-discovery + orchestrator
      main_generator.ts              # main.asm with segments, memory map, imports
      module_splitter_generator.ts   # Split blocks into module .asm files
      sprite_data_generator.ts       # Sprite blocks → .import binary or .byte tables
      charset_data_generator.ts      # Charset blocks → .import binary
      music_data_generator.ts        # Music data → .import binary or structured
      string_data_generator.ts       # String blocks → .text/.petscii directives
      lookup_table_generator.ts      # Lookup tables → labelled .byte/.word arrays
      pointer_table_generator.ts     # Address tables → .word label references
      variable_generator.ts          # RAM variables → .byte $00 declarations
      comment_generator.ts           # Inline + block comments from AI review
```

### Code Generator Plugin Interface

```typescript
interface CodeGenPlugin {
  name: string;
  description: string;
  priority: number;
  handles(block: EnrichedBlock): boolean;
  generate(block: EnrichedBlock, context: CodeGenContext): GeneratedCode;
}

interface GeneratedCode {
  lines: string[];              // KickAssembler source lines
  imports?: string[];           // .import directives needed
  segment?: string;             // Segment this block belongs in
}

interface CodeGenContext {
  allBlocks: readonly EnrichedBlock[];
  labelMap: Map<number, string>;          // address → label name
  moduleAssignments: Map<number, string>; // address → module name
  memory: Uint8Array;
}
```

### Data Representation Examples

| Data Type | KickAssembler Output |
|-----------|---------------------|
| Sprites (standard 64b) | `.import binary "/assets/sprites.bin"` |
| Sprites (non-standard) | `.byte $00, $00, $18...` with `// 54-byte sprite format` comment |
| Character sets | `.import binary "/assets/charset-intro.bin"` |
| PETSCII strings | `.text "PRESS FIRE TO START"` |
| Screen code strings | `.byte $10, $12, $05...` with decoded text in comment |
| Address tables (.word) | `.word handler_1, handler_2, handler_3` (using resolved labels) |
| Byte lookup tables | Labelled `.byte` arrays with value meaning in comments |
| Music data | `.import binary "/assets/music.bin"` or structured if format decoded |
| Variables (RAM) | `counter: .byte $00` in virtual segment |

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
embedBlock(blockAnalysis: BlockAnalysis, varDict?: VariableDict): Promise<void>
searchSimilar(query: string, hardwareRefs: string[], limit?: number): Promise<SimilarBlock[]>
searchByVariable(address: string, limit?: number): Promise<VariableUsage[]>
promoteToPatterns(block: BlockAnalysis, normalized: NormalizedPattern): Promise<void>
searchPatterns(query: string, hardwareRefs: string[], limit?: number): Promise<PatternMatch[]>
```

---

## Selective Verification

```
npx tsx src/pipeline/verify.ts output/ --selective integration.json
```

1. Pipeline knows which ranges were processed (from integration.json)
2. Emitter writes processed blocks as KickAssembler code + unprocessed regions as raw `.byte` directives
3. Compile output: `kickass output/main.asm`
4. Compare bytes ONLY in processed ranges
5. Report per-range PASS/FAIL + overall coverage percentage
6. If verification FAILS, map the failure address back to the block that produced it → flag for re-analysis

```json
{
  "verified_ranges": [
    {"start": "0x0801", "end": "0x080D", "status": "PASS", "label": "basic_stub"}
  ],
  "unverified_ranges": [
    {"start": "0x4000", "end": "0x4FFF", "reason": "unprocessed"}
  ],
  "overall": "PASS",
  "coverage": "78%"
}
```

---

## Master Orchestrator

### `re_pipeline.ts`

```
npx tsx src/pipeline/index.ts blocks.json                  # full pipeline
npx tsx src/pipeline/index.ts blocks.json --from pass2      # resume from pass 2
npx tsx src/pipeline/index.ts blocks.json --to pass3        # stop after pass 3
npx tsx src/pipeline/index.ts blocks.json --verify          # include verification
npx tsx src/pipeline/index.ts blocks.json --skip-codegen    # enrichment + AI only
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
    "pass5_integrate": {"status": "pending"},
    "codegen": {"status": "pending"},
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

7. Emit + Verify:
   /disasm-emit → KickAssembler output
   /disasm-verify → "PASS — 78% coverage"
```

---

## Scripts & File Structure

### Static Analysis (`static-analysis/src/`)
See [static-analysis.md](plans/static-analysis.md). Produces `blocks.json` from `.prg` input.

### RE Pipeline (`reverse-engineering/src/`)

| Module | Purpose | AI? |
|--------|---------|-----|
| `index.ts` | Master orchestrator | No |
| `block_store.ts` | Mutable block store with versioning | No |
| `enrichment/index.ts` | Auto-discover + run enrichment plugins | No |
| `enrichment/*_enrichment.ts` | 22+ enrichment plugins (see catalogue) | No |
| `pipeline/annotate_instructions.ts` | Pass 1: instruction annotation | Hybrid |
| `pipeline/analyze_blocks.ts` | Pass 2: block purpose + feedback loop | OpenAI + Qdrant |
| `pipeline/name_variables.ts` | Pass 3: variable naming + propagation | OpenAI + Qdrant |
| `pipeline/document_blocks.ts` | Pass 4: per-block documentation | OpenAI |
| `pipeline/integrate_analysis.ts` | Pass 5: program structure + overview | OpenAI |
| `codegen/index.ts` | Auto-discover + run code generation plugins | No |
| `codegen/*_generator.ts` | 10+ code generation plugins (see catalogue) | No |
| `pipeline/verify.ts` | Selective byte verification | No |

### Shared Modules

| Module | Purpose |
|--------|---------|
| `shared/qdrant_search.ts` | Qdrant hybrid search (TypeScript port of query pipeline logic) |
| `shared/project_collection.ts` | Project Qdrant collection: embed, search, propagate |
| `shared/naming.ts` | Naming conventions (prefix/suffix rules) |
| `shared/symbol_db.ts` | Known C64 symbols (KERNAL, hardware, ZP system vars) |

---

## Cost Estimate (gpt-5-mini)

For a typical C64 game (32KB, ~47 subroutines):

| Phase | AI Calls | Est. Tokens | Est. Cost |
|-------|----------|-------------|-----------|
| Enrichment (Phase 0) | 0 | 0 | $0.00 |
| Pass 1: Annotate | ~32 | ~64K | ~$0.01 |
| Pass 2: Analyse + tools | ~80 | ~240K | ~$0.04 |
| Pass 3: Variables | ~47 | ~94K | ~$0.01 |
| Pass 4: Document | ~47 | ~188K | ~$0.03 |
| Pass 5: Integrate | ~3 | ~24K | ~$0.004 |
| Qdrant (embed + search) | ~94 | ~33K | ~$0.0004 |
| Code Generation | 0 | 0 | $0.00 |
| **Total** | **~303** | **~643K** | **~$0.09** |

Even large programs (200+ subroutines) would cost under $0.50.

---

## Verification

To test the pipeline end-to-end:
1. Compile `spriteintro.asm` → `.prg`, run static analysis → `blocks.json`
2. Run enrichment → verify interrupt chain detection, pointer pair resolution, data classification
3. Run full AI pipeline → check annotation quality, naming, documentation
4. Run code generation → verify KickAssembler output compiles
5. Run verification → byte-for-byte comparison of processed ranges
6. Repeat with archon `main.asm` → verify:
   - JMP indirect dispatch resolved
   - Function pointer table correctly identified
   - 54-byte sprite format detected
   - Music data with embedded commands detected
   - File split into logical modules matching archon structure
7. **Round-trip test**: diff generated output against hand-crafted archon source

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
