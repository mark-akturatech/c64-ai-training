# C64 Builder — Architecture

## Overview

A code generator that reads `blocks.json` (output from static-analysis) and produces compilable KickAssembler `.asm` files. Priority-sorted emitter plugins handle each block type. All data is embedded in `blocks.json` — the original binary is optional.

**Language:** TypeScript/Node.js
**Input:** `blocks.json` + optional `.prg` binary
**Output:** `main.asm` + optional `assets/` directory

```
npx tsx src/index.ts blocks.json
npx tsx src/index.ts blocks.json -o output/
npx tsx src/index.ts blocks.json --binary game.prg
npx tsx src/index.ts blocks.json --include-junk -o output/
```

**Round-trip goal:** `game.prg → static-analysis → blocks.json → builder → main.asm → kickass → compiled.prg` produces byte-identical output to the original.

---

## Pipeline Flow

```
blocks.json
    |
    v
[1. Load & filter] ────────── parse JSON, filter junk blocks
    |
    v
[2. Sort & dedup] ─────────── sort by address, remove overlapping blocks
    |
    v
[3. Label resolution] ──────── build global label map from all blocks
    |
    v
[4. Build context] ─────────── assemble BuilderContext (labels, memory, helpers)
    |
    v
[5. Emitter dispatch] ──────── priority-sorted first-match plugin dispatch
    |
    v
[6. Assembly] ──────────────── concatenate emitted blocks into main.asm
    |
    v
main.asm + assets/
```

---

## CLI

Hand-rolled argument parser (no third-party CLI lib). First non-flag argument is the `blocks.json` path.

| Flag | Description |
|------|-------------|
| `-b, --binary <file>` | Original `.prg` file. Loaded into 64K memory image, takes precedence over block-embedded `raw` data for byte resolution. |
| `-o, --output <dir>` | Output directory (default: `.`) |
| `--include-junk` | Emit junk-flagged blocks instead of skipping them |
| `-h, --help` | Show usage |

Prints stats on completion: total/emitted/skipped-junk/unmatched block counts, output files, and asset count.

---

## Step 1–2: Load, Filter, Sort

`build()` in `builder.ts` orchestrates the full pipeline:

1. **Filter junk** — blocks with `junk: true` are dropped unless `--include-junk` is set. Skipped count tracked for stats.
2. **Sort by address** — ascending.
3. **Remove overlaps** — iterates sorted blocks; any block whose `address < lastEnd` (previous block's `endAddress`) is skipped. First occurrence wins.

---

## Step 3: Label Resolution

**File:** `label_resolver.ts`

`buildLabelMap(blocks)` returns `Map<number, string>` — a global address-to-label mapping. Two-pass algorithm:

**Pass 1** — iterates every block, layering labels in priority order (later overwrites earlier):

1. **Auto-generated label** (lowest priority): `sub_XXXX` / `irq_XXXX` / `frag_XXXX` / `dat_XXXX` / `unk_XXXX` based on block type
2. **`block.labels[]`** — static-analysis labels, overwrite auto label at block address
3. **`block.entryPoints[]`** — if address not already in map, set to `block.id`
4. **`block.instructions[].label`** — per-instruction labels for non-block-start addresses
5. **`block.enrichment.semanticLabels`** (highest priority) — hex-keyed address→name map, overwrites everything

**Pass 2** — builds a set of all instruction start addresses across all code blocks. For every instruction operand containing `$XXXX` patterns, adds `addr_XXXX` labels for targets that are known instruction addresses but have no label yet.

**Zero-page exclusion:** addresses `< $0100` are intentionally excluded from operand rewriting. KickAssembler automatically optimizes absolute-mode instructions to zero-page mode when it sees a ZP address, which changes instruction size and breaks byte-identical output.

---

## Step 4: Builder Context

The `BuilderContext` provides shared state and utilities to all emitters:

| Field | Description |
|-------|-------------|
| `allBlocks` | All non-overlapping blocks (readonly) |
| `labelMap` | Global address→label map (readonly) |
| `metadata` | Source file metadata from `blocks.json` |
| `memory` | Optional 64K `Uint8Array` from `.prg` |
| `loadAddress` | First loaded byte address |
| `endAddress` | Last loaded byte address |
| `includeJunk` | Whether junk blocks are included |
| `resolveLabel(addr)` | Look up label for address, returns `null` if not found |
| `getBytes(start, length)` | Returns bytes from memory image if available, otherwise reconstructs from block `raw` fields (base64) across multiple blocks |
| `formatHex(value, width?)` | `$XXXX` format, uppercase, zero-padded |

---

## Step 5: Emitter Dispatch

**Files:** `emitters/index.ts`, `emitters/types.ts`

### Auto-Discovery

`loadEmitters()` reads the `emitters/` directory, filters for `*_emitter.ts` files, dynamic-imports each via `pathToFileURL` (ESM requirement), finds the exported class by checking for a `.prototype.emit` method, instantiates with `new`, and sorts by `priority` ascending.

### Dispatch Loop

For each block in address order:
1. Skip if block falls within a previously consumed range (`consumedEndAddress`)
2. Find the **first** emitter where `handles(block, context)` returns `true`
3. Call `emit(block, context)` → `EmittedBlock`
4. If `emitted.consumedEndAddress` is set, skip all subsequent blocks up to that address

Unmatched blocks produce a stderr warning and increment the unmatched counter.

### Plugin Interface

```typescript
interface EmitterPlugin {
  name: string;
  description: string;
  priority: number;
  handles(block: Block, context: BuilderContext): boolean;
  emit(block: Block, context: BuilderContext): EmittedBlock;
}

interface EmittedBlock {
  lines: string[];              // KickAssembler source lines
  skipOrigin?: boolean;         // Suppress *=$XXXX origin directive
  consumedEndAddress?: number;  // Skip subsequent blocks up to this address
  assets?: BinaryAsset[];       // Files to write to assets/
  module?: string;              // Stub for multi-file (not implemented)
  segment?: string;             // Stub (not implemented)
  imports?: string[];           // Stub (not implemented)
}
```

### Emitters

| Emitter | Priority | Handles | Description |
|---------|----------|---------|-------------|
| `basic_stub` | 5 | `address === 0x0801` + SYS token `$9E` in bytes | Decodes BASIC SYS stub. If bytes match `BasicUpstart2(label)` pattern, emits that macro with `skipOrigin` and `consumedEndAddress` set to SYS target (skips BASIC padding). Otherwise falls back to raw `.byte`. |
| `code` | 10 | `type === "subroutine" \| "irq_handler" \| "fragment"` | Full instruction emitter with label rewriting, enrichment comments, gap-fill for missing byte ranges. Uses `.abs` suffix for absolute-mode ZP refs. Falls back to `.byte` for undocumented opcodes, size mismatches, undocumented NOP variants, and `$EB` SBC alias. Emits raw bytes for branches with large offsets (>100) or unresolved targets. |
| `sprite` | 20 | `type === "data"` + `bestCandidate.type === "sprite_data"` | 64-byte sprite blocks (63 data + 1 pad). 21 rows of 3 bytes as `.byte %binary` with ASCII art comments. Hires (24px): `.`/`X`. Multicolor (12px): `.`/`A`/`B`/`C`. Color mode from enrichment, candidate metadata, or defaults to hires. |
| `string` | 22 | `type === "data"` + `bestCandidate.type === "string" \| "text"` | Encoding-aware `.text` directives. Screen code subtypes use `.encoding "screencode_mixed"`. PETSCII uses `.encoding "petscii_upper"`. Non-representable bytes (quotes, graphics chars) fall back to `.byte`. Resets encoding after each block. |
| `lookup_table` | 25 | `type === "data"` + `bestCandidate.type === "lookup_table" \| "byte_table" \| "word_table"` | Word tables: `.word` in groups of 8, with label resolution for values matching known addresses. Byte tables: `.byte` rows of 16. Falls back to `.fill` if no bytes available. |
| `padding` | 28 | `type === "data"` + `bestCandidate.type === "padding" \| "fill"` | Uniform fill → `.fill N, $XX`. Non-uniform → warning + `smartByteDirective`. |
| `raw_data` | 90 | `type === "data"` (catch-all) | Label + optional best-candidate comment + `smartByteDirective`. Catch-all for data blocks not claimed by specialized emitters. |
| `unknown` | 95 | `type === "unknown"` | Label + "Unknown region" comment + `smartByteDirective`. |

---

## Step 6: Assembly

`assembleMainFile()` concatenates all emitted blocks into a single `main.asm`:

1. **Header** — comment block with source file, load address, and total block count
2. **Per block** — origin directive `*=$XXXX "blockId"` (unless `skipOrigin` or contiguous with previous block), then the emitted lines
3. **Duplicate label dedup** — tracks emitted label names in a `Set`; strips duplicate labels to prevent KickAssembler errors
4. **Gap detection** — inserts origin directives when `block.address !== lastEnd`

Output is always a single `main.asm` file. Multi-file output is stubbed in the `EmittedBlock` interface (`module`, `segment`, `imports` fields) but not implemented.

---

## Utilities

### Address Formatter (`address_formatter.ts`)

- `formatHex(value, width=4)` — `$XXXX` format, uppercase, zero-padded
- `rewriteOperand(operand, context)` — regex-replaces `$XXXX` (4+ hex digits, i.e. addresses >= `$0100`) with resolved labels. Zero-page addresses left as-is to preserve instruction sizes.

### KickAssembler Helpers (`kickass.ts`)

Formatting primitives used by all emitters:

| Function | Output |
|----------|--------|
| `INDENT` | 8 spaces |
| `comment(text)` | `// text` |
| `sectionHeader(title)` | `=`-bordered 60-char comment block |
| `origin(addr, name?)` | `*=$XXXX` or `*=$XXXX "name"` |
| `label(name)` | `name:` |
| `instruction(mnem, op, cmt?)` | Indented, padded to column 40 before comment |
| `byteDirective(bytes, perLine=16)` | `.byte $XX, $XX, ...` rows |
| `fillDirective(count, value)` | `.fill N, $XX` |
| `wordDirective(words)` | `.word $XXXX, ...` |
| `textDirective(text)` | `.text "..."` |
| `importBinary(path)` | `.import binary "path"` |
| `importSource(path)` | `#import "path"` |
| `smartByteDirective(bytes, perLine=16)` | Mixed `.fill`/`.byte`: runs of 5+ identical bytes → `.fill`, shorter runs → `.byte` rows |

### Raw Data (`raw_data.ts`)

- `loadPrg(path)` — reads `.prg`, parses 2-byte LE load address, places payload into 64K `Uint8Array`
- `decodeRaw(raw)` — decodes base64 string from `block.raw` to `Uint8Array`

---

## Shared Types (`@c64/shared`)

The `shared/` package provides interchange types used by both `static-analysis/` and `builder/`. Linked via `"@c64/shared": "file:../shared"` in `package.json`.

### Key Types

**`Block`** — core output unit from static analysis:
- `id`, `address`, `endAddress` (exclusive), `type: BlockType`, `reachability`
- `instructions?: BlockInstruction[]` — decoded instructions for code blocks
- `candidates?: DataCandidate[]`, `bestCandidate?: number` — data classification
- `raw?: string` — base64-encoded bytes (eliminates need for original binary)
- `junk?: boolean` — skip flag set by padding detector or enrichment
- `labels?: string[]`, `entryPoints?: number[]` — label sources
- `enrichment?: BlockEnrichment` — optional RE pipeline annotations

**`BlockInstruction`** — single decoded 6502 instruction:
- `address`, `rawBytes` (hex, e.g. `"A9 00"`), `mnemonic`, `operand`, `addressingMode`, `label`

**`BlockEnrichment`** — optional annotations from RE pipeline:
- `headerComment`, `inlineComments` (addr→comment), `semanticLabels` (addr→label)
- `dataFormat.subtype` (used by sprite/string emitters)
- `module`, `category`, `purpose`, `certainty`, `annotations`

**`DataCandidate`** — classification result from data detectors:
- `type`, `subtype`, `confidence`, `comment`, `metadata` (arbitrary KV)

---

## Conventions

- **Priority:** Lower = runs first (emitters sorted ascending)
- **First match wins:** Dispatch stops at the first emitter whose `handles()` returns `true`
- **Byte-identical output:** Zero-page operands left as-is, `.abs` suffix for absolute-mode ZP refs, raw `.byte` fallback for undocumented opcodes
- **Junk blocks:** Skipped by default, `--include-junk` to emit them
- **No AI dependency:** Entire pipeline is deterministic. Enrichment data is consumed when present but never required.
- **Single-file output:** All blocks concatenated into one `main.asm` sorted by address

---

## File Inventory

### Core (6 files)
- `index.ts` — CLI entry point, argument parsing, stats output
- `builder.ts` — core orchestrator: load, filter, sort, dispatch, assemble
- `label_resolver.ts` — two-pass global label map builder
- `address_formatter.ts` — hex formatting, operand label rewriting
- `kickass.ts` — KickAssembler formatting primitives
- `raw_data.ts` — PRG loader, base64 decoder

### Emitters (10 files)
`emitters/`: types.ts, index.ts, basic_stub_emitter.ts, code_emitter.ts, sprite_emitter.ts, string_emitter.ts, lookup_table_emitter.ts, padding_emitter.ts, raw_data_emitter.ts, unknown_emitter.ts
