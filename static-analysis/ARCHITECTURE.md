# C64 Static Analysis Pipeline — Architecture

## Overview

A 6-step deterministic pipeline that analyzes C64 binaries and produces `blocks.json` — a structured representation of every code block, data region, and unknown area in the program. No AI, no API calls. All intelligence lives in pluggable plugins.

**Language:** TypeScript/Node.js
**Input:** Binary files (`.prg`, `.sid`, `.vsf`, `.asm` disassembly dumps) + optional entry points
**Output:** `blocks.json` — classified blocks with full coverage of all loaded bytes

```
npx tsx src/index.ts game.prg
npx tsx src/index.ts game.prg --entry 0xC000
npx tsx src/index.ts snapshot.vsf -o analysis.json
npx tsx src/index.ts disasm.asm --format regenerator --entry 0x0810
```

---

## Pipeline Flow

```
Input (.prg, .sid, .vsf, .asm)
    |
    v
[1. binary_loader] ──────────── 64KB memory image + loaded regions
    |                            pluggable input parsers (auto-detected)
    v
[2. entry_point_detector] ───── entry points + banking state
    |                            BASIC SYS, IRQ/NMI vectors, snapshot PC
    v
[3. tree_walker] ────────────── queue-based code/data discovery
    |                            pluggable discovery plugins (instruction/node/tree phases)
    v
[4. data_classifier] ────────── pluggable data detector plugins
    |                            classify data nodes + orphan regions
    v
[5. block_assembler] ────────── tree nodes + candidates → blocks
    |                            code blocks, data blocks, gap filling
    v
[6. block_enrichers] ────────── pluggable enricher plugins
    |                            promote, label, split, annotate, validate
    v
blocks.json
```

No iterative fixpoint loop. The tree walker uses a queue — when any plugin discovers new code targets, they go into the queue and get processed in the same pass. The tree grows until the queue drains.

---

## Output Format

```json
{
  "metadata": {
    "source": "game.prg",
    "loadAddress": "0x0801",
    "endAddress": "0xcfff",
    "entryPoints": ["0x0810", "0xc200"],
    "totalBytesLoaded": 26622,
    "totalBlocks": 62,
    "blockCounts": { "subroutine": 42, "irq_handler": 2, "fragment": 3, "data": 12, "unknown": 3 }
  },
  "coverage": {
    "loadedRegions": [{ "start": "0x0801", "end": "0xcfff" }],
    "classified": {
      "code": { "bytes": 18200, "pct": 68.4 },
      "data": { "bytes": 6400, "pct": 24.0 },
      "unknown": { "bytes": 2022, "pct": 7.6 }
    },
    "gaps": []
  },
  "blocks": [...]
}
```

**Coverage guarantee:** Every byte in every loaded region belongs to exactly one block. Gaps are bugs.

### Block Types

| Type | Meaning |
|------|---------|
| `subroutine` | Normal code block (JSR target or promoted unreached code ending with RTS/RTI/JMP) |
| `irq_handler` | Interrupt handler (IRQ/NMI/BRK) |
| `fragment` | Code without clean terminator (fall-through, shared tail) |
| `data` | Classified data region with detector candidates |
| `unknown` | Not classified as code or data |

### Reachability

| Value | Meaning |
|-------|---------|
| `proven` | Reachable from an entry point via resolved control flow |
| `indirect` | Target of unresolved JMP ($xxxx) or speculative analysis |
| `unproven` | Valid code/data but no proven path from entry points |

---

## Step 1: Binary Loader

**File:** `binary_loader.ts`

Reads input via pluggable parsers, builds a 64KB memory image, tracks which regions contain loaded data. Detects overlapping regions. Passes through parser-provided entry point hints and banking configuration.

### Input Parsers

Auto-discovered from `input_parsers/` directory. Each implements:

```typescript
interface InputParser {
  name: string;
  extensions: string[];
  priority: number;              // lower = preferred
  detect(data: Uint8Array, filename: string): number;  // score 0-100
  parse(data: Uint8Array, filename: string): ParsedRegion[];
}
```

| Parser | Priority | Extensions | Description |
|--------|----------|------------|-------------|
| `prg` | 10 | `.prg` | Standard C64 PRG (2-byte load address header) |
| `sid` | 10 | `.sid` | PSID/RSID music files with init/play entry points |
| `vice` | 20 | `.asm`, `.dump` | VICE monitor disassembly (`>C:XXXX XX ...`) |
| `regenerator` | 20 | `.asm` | Regenerator disassembler (auto-labels, `*=` directives) |
| `c64_debugger` | 20 | `.asm` | C64 Debugger format (`.C:XXXX XX ...`) |
| `vsf` | — | `.vsf` | VICE snapshots: full 64KB RAM, CPU state, banking config |
| `generic` | 100 | `*` | Fallback: raw binary at $0801 or user-specified address |

---

## Step 2: Entry Point Detection

**File:** `entry_point_detector.ts`

Detects entry points from multiple sources:

- **BASIC stub** — parses `SYS xxxxx` at $0801, handles arithmetic expressions
- **IRQ/NMI installation** — scans for `LDA #imm / STA $0314` patterns for IRQ ($0314), BRK ($0316), NMI ($0318), and hardware vectors ($FFFE, $FFFA)
- **Parser hints** — VSF snapshots provide PC, IRQ/NMI vector values
- **User-specified** — `--entry` CLI flag

Also infers **banking state** from:
- CPU port ($01) writes → ROM/RAM visibility
- CIA2 ($DD00) writes → VIC bank selection
- VIC ($D018) writes → screen/charset base addresses

---

## Step 3: Tree Walker

**File:** `tree_walker.ts`

Queue-based engine that decodes 6502 instructions and builds a dependency tree of code and data nodes. The `walkTarget()` function processes one address from the queue: decodes instructions sequentially, marks byte roles (opcode/operand/data/unknown), runs plugins at each phase, and adds the resulting node to the tree.

Three plugin phases, run in priority order:

### Discovery Plugins

Auto-discovered from `discovery_plugins/` directory. Each implements:

```typescript
interface DiscoveryPlugin {
  name: string;
  phase: "instruction" | "node" | "tree";
  priority: number;
  onInstruction?(inst, ctx): PluginResult | null;
  onNodeComplete?(node, ctx): PluginResult | null;
  onTreeComplete?(tree, ctx): PluginResult | null;
}
```

Plugins return `PluginResult` which can: queue new targets, create new nodes, add edges, update existing nodes, or signal end-of-node.

#### Instruction Phase (every decoded instruction)

| Plugin | Priority | Description |
|--------|----------|-------------|
| `branch_resolver` | 10 | BNE/BEQ/BCC/BCS/BPL/BMI/BVC/BVS → branch + fallthrough edges, ends node |
| `jump_resolver` | 10 | JMP absolute → jump edge; JSR → call edge + queue target |
| `flow_terminator` | 15 | RTS/RTI/BRK/JAM → end node with 100% confidence |
| `data_ref_resolver` | 20 | LDA/STA absolute → data_read/data_write edges; hardware refs for $D000-$DFFF |
| `indirect_resolver` | 30 | JMP ($xxxx) → reads pointer, queues resolved target; (zp),Y and (zp,X) → data edges |
| `smc_resolver` | 30 | STA/STX/STY into known code regions → smc_write edges |
| `xref_enricher` | 45 | Hardware register names, CMP/CPX/CPY context for AI |

#### Node Phase (after code node completes)

| Plugin | Priority | Description |
|--------|----------|-------------|
| `inline_data_detector` | 40 | Detects inline data between JMP forward and its target |
| `pointer_pair` | 40 | LDA #lo / STA zp / LDA #hi / STA zp+1 → pointer_ref edges |
| `rts_dispatch_detector` | 50 | PHA/PHA/RTS computed jump pattern → call edges |

#### Tree Phase (after queue drains)

| Plugin | Priority | Description |
|--------|----------|-------------|
| `speculative_refiner` | 55 | Sharpens uncertain node boundaries, increases confidence |
| `subroutine_grouper` | 60 | Groups code nodes into subroutines via call edge analysis, sets subroutineId |
| `jump_table_resolver` | 90 | Cross-references LDA #imm / STA writes with JMP ($xxxx) pointer addresses to discover all dispatch targets. Scans unclaimed memory for unwalked JMP ($xxxx) patterns. Expands adjacent table entries from confirmed pointers. |

Tree-phase plugins can queue new targets. After tree plugins run, the queue is re-processed with the same `walkTarget()` logic, so discoveries from tree plugins get fully walked.

---

## Step 4: Data Classifier

**File:** `data_classifier.ts`

Runs data detector plugins on two sources:
1. **Tree data nodes** — regions the tree walker identified as data references
2. **Orphan regions** — loaded bytes not claimed by any tree node (orphan candidates get -20 confidence penalty)

Filters out candidates that overlap proven code bytes.

### Data Detectors

Auto-discovered from `data_detectors/` directory. Each implements:

```typescript
interface DataDetector {
  name: string;
  detect(memory: Uint8Array, region: {start, end}, context: DetectorContext): DataCandidate[];
}
```

| Detector | Description |
|----------|-------------|
| `basic` | Tokenized BASIC programs (linked list at $0801) |
| `bitmap` | 8000-byte hi-res/multicolor bitmap data |
| `charset` | 1024/2048-byte character sets (checks VIC $D018) |
| `code` | Unreached code islands: valid 6502 instruction sequences with flow control, terminators, ZP access patterns. Scores based on instruction count, JSR/branch presence, known target references. |
| `compressed` | Shannon entropy analysis + packer signatures (Exomizer, ByteBoozer, PuCrunch) |
| `jump_table` | Address dispatch tables (2+ valid code addresses, handles RTS dispatch offset) |
| `lookup_table` | Byte tables: sine curves, screen line offsets, bit masks, indexed data |
| `padding` | Zero fill ($00), NOP sleds ($EA), repeated byte patterns |
| `rom_shadow` | RAM copying BASIC/KERNAL/CHARGEN ROM content |
| `screen_map` | 1000-byte screen maps (40x25) and color RAM |
| `sid_music` | SID frequency tables (PAL 16-bit values) |
| `sprite` | 63-byte sprite data blocks (64-byte aligned) |
| `string` | PETSCII/screen-code strings: null-terminated, high-bit terminated, length-prefixed |

Each candidate includes: start/end, type/subtype, confidence (0-100), evidence strings, suggested label.

---

## Step 5: Block Assembler

**File:** `block_assembler.ts`

Converts the dependency tree + data candidates into output blocks:

1. **Code blocks** — groups subroutine nodes into contiguous runs, builds instruction lists and basic block CFGs
2. **Data blocks** — attaches detector candidates to tree data nodes, sorted by confidence
3. **Gap filling** — any loaded bytes not owned by code or data blocks become data blocks (if candidates overlap) or unknown blocks

---

## Step 6: Block Enrichers

**File:** `block_enrichers/`

Auto-discovered enrichers transform the block list in priority order. Each receives the full block array and returns a (possibly modified) block array.

```typescript
interface BlockEnricher {
  name: string;
  priority: number;
  enrich(blocks: Block[], context: EnricherContext): Block[];
}
```

| Enricher | Priority | Description |
|----------|----------|-------------|
| `code_promotion` | 5 | Promotes data/unknown blocks to code when the code detector found unreached code islands inside them. Splits the block: code island becomes a subroutine/fragment with decoded instructions, remaining gaps stay as data. |
| `symbol_enricher` | 10 | Applies known C64 symbols: KERNAL routine labels ($FFD2=CHROUT), hardware register names, zero-page hints |
| `sub_splitter` | 20 | Breaks oversized code blocks (>120 instructions) into sub-blocks at natural boundaries (loop headers, branch targets) |
| `label_generator` | 30 | Auto-generates labels: `sub_XXXX`, `irq_XXXX`, `dat_XXXX`, `frag_XXXX` |
| `comment_generator` | 40 | Adds structural comments: loop detection, data type hints, KERNAL function descriptions |
| `coverage_validator` | 99 | Final validation: ensures every loaded byte is owned by exactly one block. Reports gaps and conflicts. |

---

## Key Types

### Core Data Flow

```
MemoryImage → EntryPoint[] + BankingState → DependencyTree → DataCandidate[] → Block[]
```

### TreeNode
```typescript
{
  id: string;               // "code_C000" or "data_2000"
  type: "code" | "data";
  start: number;
  end: number;              // exclusive
  endConfidence: number;    // 0-100
  discoveredBy: string;     // plugin name
  instructions?: DecodedInstruction[];
  edges: TreeEdge[];
  subroutineId?: string;    // set by subroutine_grouper
}
```

### TreeEdge
```typescript
{
  target: number;
  type: EdgeType;           // branch | fallthrough | jump | indirect_jump | call |
                            // data_read | data_write | pointer_ref |
                            // hardware_read | hardware_write | smc_write
  sourceInstruction: number;
  confidence: number;       // 0-100
  discoveredBy: string;
}
```

### Block (output)
```typescript
{
  id: string;
  address: number;
  endAddress: number;
  type: BlockType;          // subroutine | irq_handler | fragment | data | unknown
  reachability: Reachability; // proven | indirect | unproven

  // Code blocks:
  instructions?: BlockInstruction[];
  basicBlocks?: BasicBlock[];
  callsOut?: number[];
  calledBy?: number[];
  loopBackEdges?: Array<{from, to}>;
  hardwareRefs?: number[];
  dataRefs?: number[];
  smcTargets?: number[];
  entryPoints?: number[];

  // Data blocks:
  candidates?: DataCandidate[];
  bestCandidate?: number;   // index into candidates

  // Sub-split blocks:
  parentBlock?: string;
  subBlockIndex?: number;
  siblings?: string[];

  // Enrichment:
  annotations?: Record<string, string>;
  labels?: string[];
  comments?: string[];
}
```

### BankingState
```typescript
{
  cpuPort: number;            // $01 value
  basicRomVisible: boolean;   // $A000-$BFFF
  kernalRomVisible: boolean;  // $E000-$FFFF
  ioVisible: boolean;         // $D000-$DFFF
  charRomVisible: boolean;
  vicBank: number;            // 0-3
  vicBankBase: number;        // $0000/$4000/$8000/$C000
  screenBase: number;         // from $D018
  charsetBase: number;        // from $D018
}
```

---

## Conventions

- **Confidence:** 0-100 scale throughout (100 = certain)
- **Priority:** Lower = runs first (plugins and enrichers sorted ascending)
- **ByteRole:** `Uint8Array[65536]` with 0=unknown, 1=code_opcode, 2=code_operand, 3=data
- **Plugin discovery:** Auto-loaded by filename pattern (`*_parser.ts`, `*_plugin.ts`, `*_detector.ts`, `*_enricher.ts`)
- **Addresses:** Stored as numbers internally, formatted as hex strings in JSON output
- **No AI dependency:** Entire pipeline is deterministic. The downstream AI pipeline consumes `blocks.json` but is not required.

---

## File Inventory

### Core (9 files)
- `index.ts` — CLI entry point, 6-step orchestration
- `types.ts` — all shared type definitions
- `binary_loader.ts` — step 1: load + parse binary
- `opcode_decoder.ts` — decode single 6502 instruction
- `opcode_table.ts` — complete 256-entry opcode table
- `entry_point_detector.ts` — step 2: entry points + banking
- `dependency_tree.ts` — tree data structure (nodes, edges, lookups)
- `tree_walker.ts` — step 3: queue-based code walker
- `data_classifier.ts` — step 4: run detectors on data regions
- `block_assembler.ts` — step 5: tree → blocks
- `symbol_db.ts` — C64 symbol reference (KERNAL, hardware, ZP)

### Input Parsers (9 files)
`input_parsers/`: types.ts, index.ts, prg_parser.ts, sid_parser.ts, vice_parser.ts, regenerator_parser.ts, c64_debugger_parser.ts, vsf_parser.ts, generic_parser.ts

### Discovery Plugins (13 files)
`discovery_plugins/`: types.ts, index.ts, branch_resolver_plugin.ts, jump_resolver_plugin.ts, flow_terminator_plugin.ts, data_ref_resolver_plugin.ts, indirect_resolver_plugin.ts, smc_resolver_plugin.ts, xref_enricher_plugin.ts, inline_data_plugin.ts, pointer_pair_plugin.ts, rts_dispatch_plugin.ts, speculative_refiner_plugin.ts, subroutine_grouper_plugin.ts, jump_table_resolver_plugin.ts

### Data Detectors (16 files)
`data_detectors/`: types.ts, index.ts, basic_detector.ts, bitmap_detector.ts, charset_detector.ts, code_detector.ts, compressed_detector.ts, jump_table_detector.ts, lookup_table_detector.ts, padding_detector.ts, rom_shadow_detector.ts, screen_map_detector.ts, sid_music_detector.ts, sprite_detector.ts, string_detector.ts

### Block Enrichers (8 files)
`block_enrichers/`: types.ts, index.ts, code_promotion_enricher.ts, symbol_enricher.ts, sub_splitter_enricher.ts, label_generator_enricher.ts, comment_generator_enricher.ts, coverage_validator_enricher.ts
