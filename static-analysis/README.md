# C64 Static Analysis Pipeline

Deterministic pipeline that analyzes C64/6502 binaries and produces `blocks.json` + `dependency_tree.json` — a structured decomposition of every code block, data region, and unknown area in the program, plus a full dependency graph. No AI, no API calls. All pattern recognition lives in pluggable plugins.

## Scope — What This Tool Does and Does NOT Do

Static analysis answers **"what bytes are here and how are they structured?"** It performs structural decomposition only:

- **Code discovery** — traces control flow from entry points, builds a dependency tree of code and data nodes
- **Data classification** — identifies data types by byte patterns (sprite alignment, string encoding ranges, table structures, BASIC line-link chains, etc.)
- **Block assembly** — converts tree nodes + candidates into blocks with full byte coverage
- **Structural enrichment** — promotes/splits/merges blocks, generates labels from type+address, validates coverage

Static analysis deliberately does NOT answer **"what does this mean?"** The following belong in the **reverse engineering (RE) pipeline**, not here:

| Concern | Why it's RE, not static analysis |
|---------|----------------------------------|
| Naming KERNAL routines (`JSR $FFD2` → "CHROUT") | Requires a human-curated symbol database |
| Naming hardware registers (`$D020` → "VIC_BORDER_COLOR") | Same — symbol lookup, not structural |
| Describing purpose ("initialize sprites", "main game loop") | Requires semantic understanding |
| Module grouping ("graphics", "sound", "input") | Requires understanding what code *does* |
| Inline comments, header comments, variable names | Documentation, not structure |
| Comparison hints (`CMP #$28` → "screen width") | Domain knowledge, not byte patterns |
| ROM shadow identification | Requires external ROM files for comparison |

The `block.enrichment` field (`BlockEnrichment` in shared types) is reserved for the RE pipeline. Static analysis never writes to it.

> **NOTE:** `symbol_enricher.ts` and parts of `comment_generator_enricher.ts` currently perform interpretive work (KERNAL/hardware symbol lookup, comparison hints). These are scheduled for removal — the logic will be reimplemented as RE pipeline Stage 1 plugins (deterministic, no AI). See [docs/re-extraction-plan.md](../docs/re-extraction-plan.md).

## Setup

```bash
cd static-analysis
npm install
```

Requires:

- **Node.js 18+**
- **tsx** (installed as dev dependency)

No external services needed.

## Usage

```bash
# Analyze a PRG file (auto-detects BASIC SYS entry point)
npx tsx src/index.ts game.prg

# Specify entry point
npx tsx src/index.ts game.prg --entry 0xC000

# Multiple entry points
npx tsx src/index.ts game.prg -e 0xC000 -e 0xC200

# VICE snapshot (extracts PC, IRQ/NMI vectors, banking state)
npx tsx src/index.ts snapshot.vsf

# Disassembly dump (Regenerator, VICE monitor, C64 Debugger)
npx tsx src/index.ts disasm.asm --format regenerator --entry 0x0810

# Custom output path
npx tsx src/index.ts game.prg -o analysis.json

# Force input format
npx tsx src/index.ts raw.bin --format generic --load-address 0xC000 --entry 0xC000
```

## Output

`blocks.json` + `dependency_tree.json` in the current working directory.

**blocks.json** contains:

- **metadata** — source file, load address, entry points, block counts
- **coverage** — byte classification breakdown (code/data/unknown percentages)
- **blocks** — array of classified blocks with instructions, edges, candidates

Every loaded byte belongs to exactly one block. No gaps.

**dependency_tree.json** contains:

- **metadata** — source, total nodes/edges, category counts
- **entryPoints** / **irqHandlers** — root node IDs
- **nodes** — code and data nodes with addresses, types, cross-references to blocks
- **edges** — typed, categorized edges (control_flow: call/branch/fallthrough/jump; data: data_read/data_write/hardware_read/hardware_write/pointer_ref)

### Block Types

| Type | Meaning |
|------|---------|
| `subroutine` | Code block ending with RTS/RTI/JMP (proven or promoted from unreached code) |
| `irq_handler` | Interrupt handler |
| `fragment` | Code without clean terminator |
| `data` | Classified data with detector candidates (sprites, strings, tables, etc.) |
| `unknown` | Not classified as code or data |

### Reachability

| Value | Meaning |
|-------|---------|
| `proven` | Reachable from entry point via resolved control flow |
| `indirect` | Target of unresolved indirect jump or speculative analysis |
| `unproven` | Valid code/data but no proven path from entry points |

## How It Works

```
Input (.prg, .sid, .vsf, .asm)
    |
[1] binary_loader ──────── 64KB memory image (pluggable input parsers)
    |
[2] entry_point_detector ─ entry points + banking state
    |
[3] tree_walker ─────────── queue-based code/data discovery (pluggable discovery plugins)
    |
[4] data_classifier ────── classify data regions (pluggable data detectors)
    |
[5] block_assembler ────── tree nodes + candidates → blocks
    |
[6] block_enrichers ────── promote, label, split, annotate, validate (pluggable enrichers)
    |
blocks.json + dependency_tree.json
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for full details on every plugin, type, and data structure.

## Adding Plugins

All plugins are auto-discovered by filename convention. No registry to edit.

### Input Parser

Create `src/input_parsers/my_parser.ts`:

```typescript
import type { InputParser } from "./types.js";

export class MyParser implements InputParser {
  name = "my_format";
  extensions = [".xyz"];
  priority = 20;
  detect(data: Uint8Array, filename: string): number { /* return 0-100 */ }
  parse(data: Uint8Array, filename: string): ParsedRegion[] { /* ... */ }
}
```

### Discovery Plugin

Create `src/discovery_plugins/my_plugin.ts`:

```typescript
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";

export class MyPlugin implements DiscoveryPlugin {
  name = "my_plugin";
  description = "Does something useful";
  priority = 50;
  phase = "instruction" as const; // or "node" or "tree"

  onInstruction(inst, ctx: WalkContext): PluginResult | null {
    // return { newTargets, newEdges, endNode, ... } or null
  }
}
```

### Data Detector

Create `src/data_detectors/my_detector.ts`:

```typescript
import type { DataDetector, DetectorContext } from "./types.js";

export class MyDetector implements DataDetector {
  name = "my_detector";
  description = "Detects something";

  detect(memory: Uint8Array, region: {start, end}, ctx: DetectorContext): DataCandidate[] {
    // return candidates with type, confidence, evidence
  }
}
```

### Block Enricher

Create `src/block_enrichers/my_enricher.ts`:

```typescript
import type { BlockEnricher, EnricherContext } from "./types.js";

export class MyEnricher implements BlockEnricher {
  name = "my_enricher";
  description = "Enriches blocks";
  priority = 25;

  enrich(blocks: Block[], ctx: EnricherContext): Block[] {
    // transform and return blocks
  }
}
```

## File Structure

```
src/
  index.ts                 CLI entry point, orchestration
  types.ts                 All shared type definitions
  binary_loader.ts         Step 1: load + parse binary
  opcode_decoder.ts        Decode single 6502 instruction
  opcode_table.ts          Complete 256-entry opcode table
  entry_point_detector.ts  Step 2: entry points + banking
  dependency_tree.ts       Tree data structure (first-class artifact)
  tree_walker.ts           Step 3: queue-based code walker
  data_classifier.ts       Step 4: run detectors on data regions
  block_assembler.ts       Step 5: tree → blocks (with treeNodeIds cross-refs)
  symbol_db.ts             C64 symbol reference (⚠ scheduled for RE extraction)
  input_parsers/
    prg_parser.ts          Standard .prg files
    sid_parser.ts          PSID/RSID music files
    vsf_parser.ts          VICE snapshots
    vice_parser.ts         VICE monitor disassembly
    regenerator_parser.ts  Regenerator disassembler output
    c64_debugger_parser.ts C64 Debugger format
    generic_parser.ts      Fallback raw binary
  discovery_plugins/
    branch_resolver_plugin.ts    Conditional branches
    jump_resolver_plugin.ts      JMP/JSR
    flow_terminator_plugin.ts    RTS/RTI/BRK/JAM
    data_ref_resolver_plugin.ts  Data read/write edges
    indirect_resolver_plugin.ts  JMP ($xxxx), (zp),Y, (zp,X)
    smc_resolver_plugin.ts       Self-modifying code
    xref_enricher_plugin.ts      Hardware register context
    inline_data_plugin.ts        Inline data between jumps
    pointer_pair_plugin.ts       16-bit pointer construction
    rts_dispatch_plugin.ts       PHA/PHA/RTS computed jumps
    speculative_refiner_plugin.ts  Sharpen node boundaries
    subroutine_grouper_plugin.ts   Group nodes into subroutines
    jump_table_resolver_plugin.ts  Resolve indirect jump targets
  data_detectors/
    basic_detector.ts      Tokenized BASIC programs
    bitmap_detector.ts     Hi-res/multicolor bitmaps
    charset_detector.ts    Character sets
    code_detector.ts       Unreached code islands
    compressed_detector.ts Packed/compressed data (entropy analysis)
    jump_table_detector.ts Address dispatch tables
    lookup_table_detector.ts Byte tables (sine, masks, etc.)
    padding_detector.ts    Zero fill, NOP sleds
    rom_shadow_detector.ts ROM shadow copies (⚠ scheduled for RE extraction)
    screen_map_detector.ts Screen maps + color RAM
    sid_music_detector.ts  SID frequency tables
    sprite_detector.ts     Sprite data blocks (64-byte alignment)
    string_detector.ts     PETSCII/screen-code strings
    color_data_detector.ts Color RAM data ($00-$0F range)
  block_enrichers/
    code_promotion_enricher.ts    Promote unreached code to code blocks
    string_discovery_enricher.ts  Promote unknown blocks to strings
    string_merge_enricher.ts      Merge adjacent string blocks
    symbol_enricher.ts            KERNAL/hardware labels (⚠ scheduled for RE extraction)
    sub_splitter_enricher.ts      Break oversized blocks at back-edges
    label_generator_enricher.ts   Auto-generate labels from type+address
    comment_generator_enricher.ts Structural comments (⚠ partially scheduled for RE extraction)
    coverage_validator_enricher.ts Final coverage validation
```
