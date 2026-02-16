# C64 Static Analysis Pipeline

Deterministic 6-step pipeline that analyzes C64/6502 binaries and produces `blocks.json` — a structured decomposition of every code block, data region, and unknown area in the program. No AI, no API calls. All pattern recognition lives in pluggable plugins.

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

`blocks.json` (or `--output path`) containing:

- **metadata** — source file, load address, entry points, block counts
- **coverage** — byte classification breakdown (code/data/unknown percentages)
- **blocks** — array of classified blocks with instructions, edges, candidates

Every loaded byte belongs to exactly one block. No gaps.

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
blocks.json
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
  index.ts                 CLI entry point, 6-step orchestration
  types.ts                 All shared type definitions
  binary_loader.ts         Step 1: load + parse binary
  opcode_decoder.ts        Decode single 6502 instruction
  opcode_table.ts          Complete 256-entry opcode table
  entry_point_detector.ts  Step 2: entry points + banking
  dependency_tree.ts       Tree data structure
  tree_walker.ts           Step 3: queue-based code walker
  data_classifier.ts       Step 4: run detectors on data regions
  block_assembler.ts       Step 5: tree → blocks
  symbol_db.ts             C64 symbol reference
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
    compressed_detector.ts Packed/compressed data
    jump_table_detector.ts Address dispatch tables
    lookup_table_detector.ts Byte tables (sine, masks, etc.)
    padding_detector.ts    Zero fill, NOP sleds
    rom_shadow_detector.ts ROM shadow copies
    screen_map_detector.ts Screen maps + color RAM
    sid_music_detector.ts  SID frequency tables
    sprite_detector.ts     Sprite data blocks
    string_detector.ts     PETSCII/screen-code strings
  block_enrichers/
    code_promotion_enricher.ts   Promote unreached code to code blocks
    symbol_enricher.ts           KERNAL/hardware labels
    sub_splitter_enricher.ts     Break oversized blocks
    label_generator_enricher.ts  Auto-generate labels
    comment_generator_enricher.ts Structural comments
    coverage_validator_enricher.ts Final coverage validation
```
