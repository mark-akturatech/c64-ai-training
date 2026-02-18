# Builder: Standalone KickAssembler Code Generator from blocks.json

## Context

The static analysis pipeline produces `blocks.json` — a complete classified representation of a C64 binary. The reverse-engineering pipeline (planned) will optionally enrich those blocks with AI-generated comments, variable names, module assignments, etc. Currently, there is no code generation step.

**Goal:** Create a standalone `builder/` project that reads `blocks.json` and produces compilable KickAssembler `.asm` files. The RE pipeline becomes optional — the builder works with raw static-analysis output or enriched blocks.

**Round-trip goal:** `game.prg → static-analysis → blocks.json → builder → output.asm → kickass → output.prg` should produce byte-identical output to the original (for non-junk blocks).

```
Static Analysis → blocks.json → [Optional: RE Pipeline] → blocks.json → Builder → .asm files
                                                                              ↓
                                                          Verify tool ← compiled .prg vs original
```

**Verification is a separate tool** — see [verify.md](plans/verify.md). Anyone reverse-engineering a C64 binary by hand can use verify to check their KickAssembler source against the original.

---

## 1. Shared Types Package (`shared/`)

Extract the interchange types into `shared/` so both `static-analysis/` and `builder/` import from the same definitions.

### Structure
```
shared/
  package.json          # name: "@c64/shared", type: "module"
  tsconfig.json         # ES2022, ESNext, bundler resolution
  src/
    index.ts            # re-exports everything
    block.ts            # Block, BlockInstruction, BasicBlock, BlockType, Reachability
    analysis.ts         # AnalysisOutput, CoverageReport (the blocks.json schema)
    data.ts             # DataCandidate
    enrichment.ts       # Enrichment sub-interface (optional fields added by RE pipeline)
```

### What moves out of `static-analysis/src/types.ts`
- `BlockType`, `Reachability`, `AddressingMode` (string unions)
- `Block`, `BlockInstruction`, `BasicBlock` (core block types)
- `DataCandidate` (data classification)
- `AnalysisOutput`, `CoverageReport`, `LoadedRegion` (blocks.json schema)

Everything else stays private to static-analysis (MemoryImage, TreeNode, TreeEdge, OpcodeInfo, DecodedInstruction, BankingState, etc).

### `static-analysis` changes
- Add `"@c64/shared": "file:../shared"` to `package.json`
- `types.ts` re-exports shared types + keeps private types — existing imports unchanged

---

## 2. Block Type Expansion

Add optional enrichment under a single `enrichment` namespace, plus a `raw` field for binary data.

```typescript
// shared/src/block.ts — additions to Block interface

export interface Block {
  // ... all existing fields unchanged ...

  /** Base64-encoded raw bytes for this block's address range */
  raw?: string;

  /** Mark block as junk — builder skips, verify ignores.
   *  Set by static analysis (padding detector) or RE pipeline enrichment. */
  junk?: boolean;

  /** Optional enrichment from RE pipeline */
  enrichment?: BlockEnrichment;
}

// shared/src/enrichment.ts
export interface BlockEnrichment {
  // Purpose & classification
  purpose?: string;             // "Initialize all 8 sprite positions from lookup table"
  category?: string;            // "graphics" | "sound" | "init" | "input" | etc.
  module?: string;              // Module assignment: "sprites" | "game" | "entry" | etc.
  certainty?: "HIGH" | "MEDIUM" | "LOW";

  // Documentation
  headerComment?: string;       // Multi-line block/subroutine header comment
  inlineComments?: Record<string, string>;  // address (hex) → comment

  // Naming
  semanticLabels?: Record<string, string>;  // address (hex) → label name
  variableNames?: Record<string, string>;   // address (hex) → variable name

  // Data format (richer than DataCandidate for enriched data blocks)
  dataFormat?: {
    type: string;
    subtype?: string;
    elementSize?: number;
    count?: number;
    decodedValue?: string;      // e.g. decoded string content
  };

  // Structured enrichment annotations from deterministic plugins
  annotations?: Array<{
    source: string;
    type: string;
    annotation: string;
    data?: Record<string, unknown>;
  }>;
}
```

---

## 3. Static Analysis: Add `raw` field

Thread `memory` into `assembleBlocks()` and base64-encode raw bytes on data/unknown blocks.

**Files to modify:**
- [block_assembler.ts](static-analysis/src/block_assembler.ts) — add `memory: Uint8Array` param, encode `raw` on data/unknown blocks
- [index.ts](static-analysis/src/index.ts) — pass `image.bytes` to `assembleBlocks()`

```typescript
// block_assembler.ts signature change:
export function assembleBlocks(
  tree: DependencyTree,
  dataCandidates: DataCandidate[],
  loadedRegions: LoadedRegion[],
  memory: Uint8Array              // NEW
): Block[]

// In buildDataBlock() and makeGapBlock():
raw: Buffer.from(memory.slice(start, end)).toString("base64"),
```

---

## 4. Builder Project (`builder/`)

### Structure
```
builder/
  package.json          # name: "c64-builder", deps: @c64/shared, tsx, vitest
  tsconfig.json
  src/
    index.ts            # CLI entry point
    types.ts            # Builder-specific types (EmitterPlugin, BuilderContext, EmittedBlock)
    builder.ts          # Core orchestrator: load blocks → run emitters → assemble output
    label_resolver.ts   # Build global label map from all blocks (enrichment labels > auto labels)
    address_formatter.ts  # Operand rewriting: replace addresses with labels, $XXXX formatting
    kickass.ts          # KickAssembler formatting conventions (indentation, directives, comments)
    raw_data.ts         # Base64 decode block.raw, optional --binary file loading
    emitters/
      types.ts          # EmitterPlugin interface
      index.ts          # Auto-discovery (same pattern as static-analysis enrichers)
      main_emitter.ts       # Pri 5  — main.asm scaffold: BasicUpstart2, *=, #imports
      basic_stub_emitter.ts # Pri 8  — BASIC SYS stub → BasicUpstart2(label)
      code_emitter.ts       # Pri 10 — code blocks → labelled instructions with comments
      sprite_emitter.ts     # Pri 20 — sprite data → .import binary or .byte tables
      charset_emitter.ts    # Pri 21 — charset data → .import binary
      string_emitter.ts     # Pri 22 — strings → .text / .byte with decoded comment
      screen_map_emitter.ts # Pri 23 — screen/color maps → .import binary or .byte
      music_emitter.ts      # Pri 24 — SID music → .import binary
      lookup_table_emitter.ts   # Pri 25 — byte/word tables → .byte/.word with annotations
      pointer_table_emitter.ts  # Pri 26 — address tables → .word with label refs
      bitmap_emitter.ts     # Pri 27 — bitmap data → .import binary
      padding_emitter.ts    # Pri 28 — fill regions → .fill N, $XX
      raw_data_emitter.ts   # Pri 90 — fallback: unclaimed data → .byte hex rows
      unknown_emitter.ts    # Pri 95 — unknown blocks → .byte with warning comment
```

### CLI
```
npx tsx src/index.ts blocks.json                        # single-file output
npx tsx src/index.ts blocks.json --binary game.prg      # with raw binary for data blocks
npx tsx src/index.ts blocks.json -o output/             # output directory
npx tsx src/index.ts blocks.json --include-junk          # emit junk blocks too (default: skip)
```

### Core types

```typescript
// builder/src/emitters/types.ts
export interface EmitterPlugin {
  name: string;
  description: string;
  priority: number;
  handles(block: Block, context: BuilderContext): boolean;
  emit(block: Block, context: BuilderContext): EmittedBlock;
}

export interface EmittedBlock {
  lines: string[];              // KickAssembler source lines
  module?: string;              // For multi-file: which module file
  segment?: string;             // Segment directive
  assets?: BinaryAsset[];       // Files to extract to assets/
  imports?: string[];           // #import directives needed
}

export interface BuilderContext {
  allBlocks: readonly Block[];
  labelMap: ReadonlyMap<number, string>;
  metadata: AnalysisOutput["metadata"];
  memory?: Uint8Array;
  resolveLabel(address: number): string | null;
  getBytes(start: number, length: number): Uint8Array | null;
  formatHex(value: number, width?: number): string;
}
```

### Junk handling

Blocks with `junk: true` are **skipped by default** — the builder emits nothing for them, leaving a gap. This is correct because junk is padding/fill that doesn't affect program behavior.

With `--include-junk`, junk blocks are emitted like any other block (`.fill`, `.byte`, etc.). Useful when junk isn't really junk, or when you need byte-perfect output for the full address range.

Static analysis sets `junk: true` on blocks whose best candidate is `padding` type. The RE pipeline enrichment can also mark blocks as junk.

### Emitter dispatch
First emitter whose `handles()` returns true wins (priority order). Specialized emitters (sprite, string, etc.) take precedence over generic fallbacks. Junk blocks are filtered out before dispatch (unless `--include-junk`).

### KickAssembler reference

When implementing emitters, **query the Qdrant knowledge base** for KickAssembler syntax if unsure about the correct directives, encoding, or methodology for a specific data type (sprites, text, character sets, SID music, etc.). The knowledge base contains the full KickAssembler manual with detailed directive reference, encoding tables, and working examples.

### Key emitter behavior

**`code_emitter.ts`** — the most important emitter:
- For each instruction: emit label (if any), rewrite operand addresses to labels, add inline comment
- Without enrichment: uses auto-generated labels (`sub_XXXX`), static-analysis comments
- With enrichment: uses semantic labels, AI inline comments, header comment block

**`string_emitter.ts`** — encoding-aware:
- KickAssembler's `.text` directive uses the *active encoding* (default: `screencode_mixed`)
- Must emit `.encoding` directive before `.text` to match the string's actual encoding
- Supported encodings: `ascii`, `petscii_mixed`, `petscii_upper`, `screencode_mixed`, `screencode_upper`
- Detect encoding from data candidate classification or enrichment `dataFormat.subtype`

**Data emitters** — classification-driven:
- Check `block.candidates[block.bestCandidate].type` to determine format
- If enrichment has `dataFormat`, prefer that
- If multiple candidates with low confidence, `raw_data_emitter` claims it → just `.byte` rows
- If specific type matched: use appropriate KickAssembler directives (`.text`, `.import binary`, `.word`, `.fill`)

### Data Representation Reference

| Data Type | KickAssembler Output |
|-----------|---------------------|
| Sprites (standard 64b) | `.import binary "assets/sprites_XXXX.bin"` |
| Sprites (non-standard) | `.byte $00, $00, $18...` with `// 54-byte sprite format` comment |
| Character sets | `.import binary "assets/charset_XXXX.bin"` |
| PETSCII strings | `.encoding "petscii_mixed"` then `.text "PRESS FIRE TO START"` |
| Screen code strings | `.encoding "screencode_upper"` then `.text "PRESS FIRE"` |
| Address tables (.word) | `.word handler_1, handler_2, handler_3` (resolved labels) |
| Byte lookup tables | `.byte` arrays with value meaning in comments |
| Music data | `.import binary "assets/music_XXXX.bin"` |
| Bitmap data | `.import binary "assets/bitmap_XXXX.bin"` |
| Padding/fill | `.fill 64, $00` |
| RAM variables (enriched) | `counter: .byte $00` in virtual segment |
| Unknown/ambiguous | `.byte` hex rows with warning comment |

### Output modes

**Single-file (default, no enrichment):** All blocks sorted by address into one `main.asm` + `assets/` dir.

**Multi-file (with enrichment module assignments):** Split into module `.asm` files based on `block.enrichment.module`, with `main.asm` as entry point with `#import` directives.

Module dictionary (controlled vocabulary for multi-file mode):

| Module | Description |
|--------|-------------|
| `entry` | Program entry, init, main loop |
| `intro` | Title screen, attract mode |
| `game` | Core gameplay loop, turn logic |
| `graphics` | Screen setup, drawing, rendering |
| `sprites` | Sprite management, multiplexing |
| `sound` | SID music player, sound effects |
| `input` | Joystick/keyboard handling |
| `ai` | Computer player logic |
| `common` | Shared utilities |
| `resources` | Binary data references |
| `io` | C64 hardware constants |
| `const` | Program-specific constants |
| `data` | Runtime variables, state storage |

Multi-file output structure:
```
output/
  main.asm              # Entry point, segments, #imports, BasicUpstart2
  src/
    io.asm              # C64 hardware constants (standard)
    const.asm           # Program-specific constants
    <module>.asm        # One file per logical module
    resources.asm       # Binary data references
  assets/               # Extracted binary files
    sprites_2000.bin
    charset_3000.bin
    music_1000.bin
```

### Integration with RE pipeline

When the RE pipeline runs, it produces `integration.json` containing:
- Program metadata (type, name, entry point, main loop, init chain)
- Module assignments (`blockToFileMap`: block ID → filename)
- File build order and import dependencies
- Overview comments and file headers
- Unprocessed regions (emitted as raw `.byte` by builder)

The builder consumes `integration.json` via `--integration` flag for multi-file output.

---

## 5. Implementation Order

### Phase 1: Shared types + static-analysis update
1. Create `shared/` package with extracted types + enrichment interface
2. Update `static-analysis` to depend on `@c64/shared`, re-export in `types.ts`
3. Add `raw` field: thread `memory` into `assembleBlocks()`, encode on data/unknown blocks
4. Verify static-analysis tests pass, re-run on `test/spriteintro.prg`

### Phase 2: Builder scaffold
1. Create `builder/` with `package.json`, `tsconfig.json`
2. Implement CLI (`index.ts`), core orchestrator (`builder.ts`)
3. Implement `label_resolver.ts`, `address_formatter.ts`, `kickass.ts`, `raw_data.ts`
4. Implement emitter auto-discovery (`emitters/index.ts`)

### Phase 3: Core emitters (minimum viable output)
1. `unknown_emitter.ts` + `raw_data_emitter.ts` (fallbacks — everything has an emitter)
2. `code_emitter.ts` (subroutine/fragment/irq → labelled instructions)
3. `main_emitter.ts` (scaffold with `BasicUpstart2`, origin directives)
4. `basic_stub_emitter.ts` (BASIC stub → `BasicUpstart2(label)`)
5. Test: `spriteintro.prg → analyze → build → kickass` should compile

### Phase 4: Data emitters
1. `string_emitter.ts`, `sprite_emitter.ts`, `charset_emitter.ts`
2. `lookup_table_emitter.ts`, `pointer_table_emitter.ts`
3. `padding_emitter.ts`, `music_emitter.ts`, `bitmap_emitter.ts`, `screen_map_emitter.ts`

### Phase 5: Enrichment support
1. Enhance emitters to use enrichment data when present
2. Multi-file output mode
3. Junk block marking in static analysis (padding detector)

---

## 6. End-to-End Test

```bash
# Analyze a PRG
cd static-analysis && npx tsx src/index.ts ../test/spriteintro.prg -o ../test/spriteintro-blocks.json

# Build KickAssembler source
cd ../builder && npx tsx src/index.ts ../test/spriteintro-blocks.json --binary ../test/spriteintro.prg -o ../test/spriteintro-output/

# Verify against original (see verify.md)
cd ../verify && npx tsx src/index.ts ../test/spriteintro-output/main.asm --original ../test/spriteintro.prg --blocks ../test/spriteintro-blocks.json
```

## Key Files
- [static-analysis/src/types.ts](static-analysis/src/types.ts) — types to extract
- [static-analysis/src/block_assembler.ts](static-analysis/src/block_assembler.ts) — add raw field + memory param
- [static-analysis/src/index.ts](static-analysis/src/index.ts) — pass memory to assembleBlocks
- [static-analysis/src/block_enrichers/index.ts](static-analysis/src/block_enrichers/index.ts) — plugin auto-discovery pattern to replicate
- [static-analysis/package.json](static-analysis/package.json) — add shared dep
- [training/examples/0xc64_demo_effects/sprite/spriteintro.asm](training/examples/0xc64_demo_effects/sprite/spriteintro.asm) — KickAssembler convention reference
- [test/smooth_scroller.asm](test/smooth_scroller.asm) — simpler KickAssembler reference
