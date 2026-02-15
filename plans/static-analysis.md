# C64 Static Analysis & Block Decomposition

## Context

This plan covers the **foundational deterministic layer** of the C64 reverse engineering pipeline. It takes raw binary input (`.prg` file + entry address) and produces `blocks.json` — the structured representation of the program that the AI pipeline consumes.

**This is the hardest deterministic code in the project.** If subroutine boundaries are wrong, all 5 AI passes downstream analyze garbage. Everything here is deterministic — no AI, no API calls.

**Relationship to other plans:**
- [ai-disassembler-mcp.md](plans/ai-disassembler-mcp.md) — defines MCP tools, naming conventions, output format. This plan's scripts are Layer 1 tools in that plan.
- [reverse-engineering-pipeline.md](plans/reverse-engineering-pipeline.md) — defines the AI pipeline (passes 1-5) that consumes `blocks.json`.

**This plan is self-contained.** It fully defines its own output format (`blocks.json`), can run independently without the AI pipeline, and produces useful output on its own. The AI pipeline is a downstream consumer, not a dependency.

**Implementation language:** TypeScript/Node.js — matches MCP SDK (TypeScript-first), provides type safety for complex schemas via interfaces, excellent async support for future parallelization.

---

## Input & Output

### Input

Simple. Two things:

1. **Binary data** — either:
   - A `.prg` file (C64 format: first 2 bytes = load address little-endian, rest = code/data)
   - Raw binary + explicit load address
   - A `.asm` disassembly dump (from Regenerator, VICE monitor, C64 Debugger, etc.) — parsed back to bytes

2. **Entry point(s)** — at minimum one address where execution starts. Detected automatically from BASIC stub (`SYS xxxx`) or provided by user. Additional entry points (IRQ/NMI handlers) detected or user-specified.

That's it. No `project.json`, no complex intermediate format.

### Output

`blocks.json` — a single JSON file containing every classified block in the program plus a coverage map guaranteeing all loaded bytes are accounted for.

**Top-level structure:**

```json
{
  "metadata": {
    "source": "game.prg",
    "load_address": "0x0801",
    "end_address": "0xCFFF",
    "entry_points": ["0x0810", "0xC200"],
    "total_bytes_loaded": 26622,
    "total_blocks": 62,
    "block_counts": {
      "subroutine": 42,
      "irq_handler": 2,
      "fragment": 3,
      "data": 12,
      "unknown": 3
    }
  },
  "coverage": {
    "loaded_regions": [
      { "start": "0x0801", "end": "0xCFFF" }
    ],
    "classified": {
      "code": { "bytes": 18200, "pct": 68.4 },
      "data": { "bytes": 6400, "pct": 24.0 },
      "unknown": { "bytes": 2022, "pct": 7.6 }
    },
    "gaps": []
  },
  "raw_binary": "base64-encoded loaded regions for AI data requests",
  "blocks": [ ... ]
}
```

**Coverage guarantee:** Every byte in every loaded region belongs to exactly one block. The `coverage` section summarizes this and `gaps` must always be empty — any gap is a bug in the block builder. See [Address Coverage Tracking](#address-coverage-tracking).

**Block types:**

| Type | Meaning |
|------|---------|
| `subroutine` | Normal JSR target, ends with RTS/RTI |
| `irq_handler` | Interrupt handler (IRQ/NMI/BRK) |
| `fragment` | Code without clean entry/exit (fall-through, shared tail, multi-entry) |
| `data` | Classified data region (sprite, charset, string, table, etc.) |
| `unknown` | Unreachable by static analysis, not yet classified as code or data |

**Edge cases:**
- **Fall-through routines** (no RTS, flows into next routine): marked as `fragment`, linked to successor
- **Multiple entry points** (two JSR targets in same routine body): one block, multiple labels in `entry_points` array
- **Shared tails** (two routines converge to common cleanup): shared code marked as `fragment` with `shared_by` array
- **Orphan regions** (between subroutines, unreached by flow): marked as `unknown`

**Reachability classification:**

| Reachability | Meaning |
|-------------|---------|
| `proven` | Reachable from an entry point via resolved control flow |
| `indirect` | Target of unresolved `JMP ($xxxx)`, jump table, or SMC — reachable but path unknown |
| `unreachable` | Not reachable by any static analysis path — could be dead code, data, or dynamically-dispatched code |

**Subroutine block schema:**

```json
{
  "id": "sub_C000",
  "address": "0xC000",
  "end_address": "0xC03F",
  "type": "subroutine",
  "reachability": "proven",
  "instructions": [
    {
      "address": "0xC000",
      "raw_bytes": "A9 00",
      "mnemonic": "lda",
      "operand": "#$00",
      "addressing_mode": "immediate",
      "label": null
    }
  ],
  "basic_blocks": [
    { "start": "0xC000", "end": "0xC010", "successors": ["0xC011", "0xC020"] }
  ],
  "calls_out": ["0xFFD2", "0xC100"],
  "called_by": ["0x0810"],
  "loop_back_edges": [{ "from": "0xC01F", "to": "0xC000" }],
  "hardware_refs": ["0xD020", "0xD021"],
  "data_refs": ["0xC800", "0xC900"],
  "smc_targets": [],
  "is_irq_handler": false,
  "entry_points": ["0xC000"],
  "input_name_hint": "sub_C000",
  "parent_block": null,
  "sub_block_index": null,
  "sub_block_count": null,
  "siblings": null
}
```

Large subroutines (>120 instructions) get sub-split — see [Sub-Splitting Large Blocks](#sub-splitting-large-blocks). Sub-blocks have `parent_block`, `sub_block_index`, and `siblings` populated with one-line summaries.

**Data block schema:**

```json
{
  "id": "data_2000",
  "address": "0x2000",
  "end_address": "0x203F",
  "type": "data",
  "reachability": "proven",
  "candidates": [
    {
      "detector": "sprite",
      "type": "sprite",
      "confidence": 95,
      "evidence": ["LDA #$80 / STA $07F8 at $C010 → sprite pointer = 128 → data at $2000"],
      "comment": "64-byte sprite data at $2000, sprite 0 pointer set at $C010",
      "label": "spr_data_0"
    },
    {
      "detector": "lookup_table",
      "type": "lookup_table",
      "subtype": "byte_table",
      "confidence": 30,
      "evidence": ["64 bytes, referenced by LDA $2000,X at $C050"],
      "comment": "Possible byte lookup table (64 entries), indexed read at $C050",
      "label": "tbl_2000"
    }
  ],
  "best_candidate": 0
}
```

ALL detector proposals kept, sorted by confidence. `best_candidate` is the index of the highest-confidence proposal. See [Overlapping Candidates](#overlapping-candidates).

**Unknown block schema:**

```json
{
  "id": "unknown_4000",
  "address": "0x4000",
  "end_address": "0x4FFF",
  "type": "unknown",
  "reachability": "unreachable"
}
```

Regions neither reachable as code nor matched by any data detector.

---

## Architecture Overview

```
Input (.prg or .asm)
    |
    v
[1. binary_loader] ──────────── 64KB memory image + load regions
    |
    v
[2. opcode_decoder] ─────────── (shared module, not a pipeline step)
    |
    v
[3. entry_point_detector] ───── entry points (BASIC SYS, IRQ/NMI patterns)
    |                            + banking detection
    |                            + user confirmation
    v
┌──────────────────────────────── ITERATIVE FIXPOINT LOOP ──┐
│                                                            │
│ [4. code_discovery] ─────────── instruction map            │
│     |   Recursive descent       + inline data detection    │
│     |   + speculative discovery                            │
│     v                                                      │
│ [5. xref_builder] ───────────── cross-reference database   │
│     |                            (calls, reads, writes,    │
│     v                             hardware, data refs)     │
│ [6. block_builder] ─────────── blocks + data candidates    │
│     |   Assemble blocks          + jump table discovery    │
│     |   Run data detectors                                 │
│     |                                                      │
│     └── New entry points found? ──YES──→ feed back to [4]  │
│                   |                                        │
│                   NO                                       │
└───────────────────|────────────────────────────────────────┘
                    v
              blocks.json
                Coverage validation
                Sub-split large blocks
                Apply known symbols (KERNAL, hardware, ZP)
```

**Iterative fixpoint:** Steps 4-6 repeat when jump table detectors or RTS dispatch detectors discover new code entry points. Each iteration adds the new entry points to the queue and re-runs code discovery from those points only (not from scratch). Typically converges in 1-2 iterations. Caps at `--max-iterations` (default 5) to prevent infinite loops in pathological cases.

Each step is a function/module, not a standalone script. The whole pipeline runs as a single invocation:

```
npx tsx src/static-analysis.ts input.prg --entry 0x0810
npx tsx src/static-analysis.ts input.prg                    # auto-detect entry from BASIC stub
npx tsx src/static-analysis.ts disasm.asm --format regenerator --entry 0x0810
```

Output: `blocks.json` in the current directory (or `--output path`).

---

## Step 1: Binary Loader

### `binary_loader.ts`

Reads input and produces a 64KB memory image. Uses a **pluggable parser architecture** — each input format is a separate plugin that implements a common interface.

### Output Interface

```typescript
interface MemoryImage {
  bytes: Uint8Array;        // 65536 bytes, initialized to 0
  loaded: LoadedRegion[];   // which ranges contain actual data
  loadAddress: number;      // from PRG header or user
  endAddress: number;       // last loaded byte + 1
}

interface LoadedRegion {
  start: number;            // start address in C64 memory
  end: number;              // end address (exclusive)
  source: string;           // plugin name or filename
}
```

### Parser Plugin Interface

Each input format is a separate module implementing `InputParser`:

```typescript
interface InputParser {
  /** Unique identifier for this parser (e.g. "prg", "regenerator", "vice") */
  name: string;

  /** File extensions this parser handles (e.g. [".prg"], [".asm", ".s"]) */
  extensions: string[];

  /**
   * Score how well this parser can handle the given data.
   * Returns 0 (can't parse) to 100 (definitely this format).
   * Called with the first ~4KB of the file for quick detection.
   */
  detect(data: Uint8Array, filename: string): number;

  /**
   * Parse the full file into memory regions.
   * Returns parsed regions to be placed into the 64KB memory image.
   */
  parse(data: Uint8Array): ParsedRegion[];
}

interface ParsedRegion {
  address: number;          // where to place in C64 memory
  bytes: Uint8Array;        // the data
  metadata?: {              // optional parser-specific info
    labels?: Map<number, string>;      // existing labels (from .asm)
    comments?: Map<number, string>;    // existing comments (from .asm)
    directives?: Map<number, string>;  // assembler directives (e.g. *=$0810)
  };
}
```

### Built-in Parsers

| Parser | File | Detection | Notes |
|--------|------|-----------|-------|
| `prg_parser.ts` | `.prg` | Extension match + valid 2-byte header | First 2 bytes = little-endian load address, rest = data |
| `regenerator_parser.ts` | `.asm` | `;` comments, `*=` directives, auto-labels (`sub_`, `loc_`) | Preserves labels and comments from Regenerator output |
| `vice_parser.ts` | `.asm`, `.dump` | `>C:xxxx  xx xx` line prefix | VICE monitor memory dump format |
| `c64_debugger_parser.ts` | `.asm` | `.C:xxxx  xx xx` line prefix | C64 Debugger disassembly format |
| `sid_parser.ts` | `.sid` | PSID/RSID magic bytes at offset 0 | Parses SID header (load addr, init addr, play addr, song count). Payload placed in memory at header's load address. Init/play addresses passed to entry_point_detector as HIGH confidence `"sid_header"` type. Music data analysis handled by the SID Music Data detector in step 6 |
| `generic_parser.ts` | `.asm`, `.s` | `$xxxx:` or `xxxx  MNEMONIC` patterns | Fallback for unrecognized formats |

### How It Works

Parsers are **auto-discovered** by scanning the `input_parsers/` directory at startup. Any `.ts` file that exports an `InputParser` implementation is automatically registered. No hardcoded imports — just drop a file in the directory.

```typescript
// src/static-analysis/input_parsers/index.ts

/** Auto-discover all parsers in this directory */
async function loadParsers(): Promise<InputParser[]> {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const files = readdirSync(dir).filter(f =>
    f.endsWith("_parser.ts") && f !== "types.ts" && f !== "index.ts"
  );

  const parsers: InputParser[] = [];
  for (const file of files) {
    const mod = await import(path.join(dir, file));
    // Each parser file exports a single class implementing InputParser
    const ParserClass = Object.values(mod).find(
      v => typeof v === "function" && v.prototype?.detect
    ) as new () => InputParser;
    if (ParserClass) parsers.push(new ParserClass());
  }

  // Sort by priority (lower = higher priority). generic_parser always last.
  return parsers.sort((a, b) => a.priority - b.priority);
}
```

Each parser declares its own `priority` (added to `InputParser` interface):

```typescript
interface InputParser {
  name: string;
  extensions: string[];
  priority: number;        // lower = higher priority (0 = first, 99 = fallback)
  detect(data: Uint8Array, filename: string): number;
  parse(data: Uint8Array): ParsedRegion[];
}
```

**Built-in parser priorities:**
| Parser | Priority | Why |
|--------|----------|-----|
| prg | 10 | Binary format, most definitive detection |
| sid | 10 | Magic bytes, unambiguous |
| regenerator | 20 | Specific ASM format markers |
| vice | 20 | Specific line prefix pattern |
| c64_debugger | 20 | Specific line prefix pattern |
| generic | 99 | Fallback — only wins if nothing else matches |

```typescript
function loadBinary(
  filePath: string,
  options?: { format?: string; loadAddress?: number }
): MemoryImage {
  const parsers = await loadParsers();
  const data = readFile(filePath);

  // Explicit format selection
  if (options?.format) {
    const parser = parsers.find(p => p.name === options.format);
    if (!parser) throw new Error(`Unknown format: ${options.format}`);
    return applyParser(parser, data);
  }

  // Auto-detection: score all parsers, pick highest
  const scores = parsers.map(p => ({ parser: p, score: p.detect(data, filePath) }));
  scores.sort((a, b) => b.score - a.score || a.parser.priority - b.parser.priority);

  if (scores[0].score === 0) throw new Error("No parser recognized this format");
  return applyParser(scores[0].parser, data);
}
```

**Auto-detection strategy:**
1. Scan `input_parsers/` directory for `*_parser.ts` files
2. Each parser scores the input (0-100) based on extension + content patterns
3. Highest score wins. Ties broken by `priority` (lower = preferred)
4. Score 0 = "can't parse this at all"

**Detection heuristics per parser:**

| Parser | Score 90+ | Score 60-80 | Score 0 |
|--------|-----------|-------------|---------|
| prg | `.prg` extension + valid load addr in $0200-$CFFF range | `.prg` extension, any header | Non-`.prg` extension |
| regenerator | Has `*=` directive + `sub_` labels + `;` comments | Has `*=` directive | No assembly-like content |
| vice | >50% lines match `>C:xxxx  xx xx` | >20% lines match | No `>C:` prefix found |
| c64_debugger | >50% lines match `.C:xxxx  xx xx` | >20% lines match | No `.C:` prefix found |
| generic | >50% lines parse as `addr MNEMONIC` | >20% lines parse | <10% lines parse |

### Adding New Parsers

To support a new format (e.g., Ghidra export, IDA Pro listing, raw binary):

1. Create `src/static-analysis/input_parsers/new_format_parser.ts`
2. Implement `InputParser` interface (including `priority`)
3. Export the class

That's it — auto-discovery picks it up. No registry file to edit. The rest of the pipeline sees the same `MemoryImage`.

**Note:** Auto-discovery scans for `*_parser.ts` files, which works when running via `npx tsx` (TypeScript directly). For compiled builds (`tsc`), the scanner checks for both `.ts` and `.js` extensions. If this becomes brittle, fall back to a barrel export (`input_parsers/index.ts` with explicit imports) — but for development, directory scanning is simpler.

### Multi-Part Loading

Support loading multiple files into the same memory image (for multi-load games or split binaries):

```
npx tsx src/static-analysis/index.ts part1.prg part2.prg --entry 0x0810
```

Each file is parsed independently and placed at its declared load address. Overlapping regions = error (unless `--force`).

### Packer Detection (informational only)

After loading, scan for known signatures of common C64 packers:
- Exomizer: known decompressor entry patterns
- ByteBoozer: characteristic init sequence
- PuCrunch: header magic bytes

If detected, warn user: "This binary appears to be packed with [packer]. The analysis will cover the decompressor, not the actual program. Consider unpacking first."

---

## Step 2: Opcode Decoder

### `opcode_decoder.ts`

A pure lookup table. Decodes one instruction at a time from the memory image. Used by all subsequent steps.

**NOT a pipeline step** — it's a shared module called by code_discovery, xref_builder, etc.

### The Opcode Table

```typescript
interface OpcodeInfo {
  mnemonic: string;           // "LDA", "STA", "JMP", etc.
  addressingMode: AddressingMode;
  bytes: number;              // Total instruction length (1, 2, or 3)
  cycles: number;             // Base cycle count (for future use)
  reads: Register[];          // CPU registers read by this instruction
  writes: Register[];         // CPU registers written by this instruction
  affectsFlags: Flag[];       // Which status flags are affected
  flowType: FlowType;         // Control flow classification
  undocumented: boolean;      // True for unofficial opcodes
}

type AddressingMode =
  | "implied"       // CLC, RTS        — 1 byte
  | "accumulator"   // ROL A           — 1 byte
  | "immediate"     // LDA #$FF        — 2 bytes
  | "zeroPage"      // LDA $FB         — 2 bytes
  | "zeroPageX"     // LDA $FB,X       — 2 bytes
  | "zeroPageY"     // LDX $FB,Y       — 2 bytes
  | "absolute"      // LDA $C000       — 3 bytes
  | "absoluteX"     // LDA $C000,X     — 3 bytes
  | "absoluteY"     // LDA $C000,Y     — 3 bytes
  | "indirect"      // JMP ($FFFE)     — 3 bytes
  | "indexedIndX"   // LDA ($FB,X)     — 2 bytes
  | "indirectIndY"  // LDA ($FB),Y     — 2 bytes
  | "relative";     // BNE label       — 2 bytes (signed offset)

type FlowType =
  | "continue"      // Normal instruction, execution continues to next byte
  | "branch"        // Conditional branch (BNE, BEQ, etc.) — two successors
  | "jump"          // Unconditional jump (JMP) — one successor, not next byte
  | "jumpIndirect"  // JMP ($xxxx) — target unknown statically
  | "call"          // JSR — continues after return
  | "return"        // RTS, RTI — return to caller
  | "halt";         // BRK, JAM/KIL — execution stops

type Register = "A" | "X" | "Y" | "SP" | "P";
type Flag = "C" | "Z" | "I" | "D" | "B" | "V" | "N";
```

### Decode Function

```typescript
interface DecodedInstruction {
  address: number;
  opcode: number;            // Raw opcode byte
  info: OpcodeInfo;          // From lookup table
  rawBytes: number[];        // [opcode, ...operand bytes]
  operandValue: number;      // Resolved operand (0-65535)
  operandAddress: number | null;  // Target address for abs/zp/branch/jmp
  formattedOperand: string;  // "$C000" or "#$FF" or "$FB,X" etc.
}

function decode(memory: Uint8Array, address: number): DecodedInstruction | null;
```

`decode()` returns `null` for invalid opcodes (or optionally for undocumented opcodes, configurable). Never throws — invalid bytes are a normal case during speculative discovery.

### Table Population

The table is a static `Map<number, OpcodeInfo>` with all 256 entries. Source data from our Qdrant knowledge base (6502 instruction set documentation) cross-referenced with [masswerk.at/6502](https://www.masswerk.at/6502/6502_instruction_set.html) and the [NESdev undocumented opcodes wiki](https://www.nesdev.org/wiki/CPU_unofficial_opcodes).

**C64-relevant undocumented opcodes to include:**

| Opcode | Mnemonic | Used in C64 software? | Notes |
|--------|----------|----------------------|-------|
| `$A7/$B7/$AF/$BF/$A3/$B3` | LAX | Yes, common | Load A and X simultaneously |
| `$87/$97/$8F/$83` | SAX | Yes, common | Store A AND X |
| `$C7/$D7/$CF/$DF/$C3/$D3` | DCP | Yes, some | Decrement + Compare |
| `$E7/$F7/$EF/$FF/$E3/$F3` | ISC | Yes, some | Increment + Subtract |
| `$07/$17/$0F/$1F/$03/$13` | SLO | Rare | Shift left + OR |
| `$27/$37/$2F/$3F/$23/$33` | RLA | Rare | Rotate left + AND |
| `$47/$57/$4F/$5F/$43/$53` | SRE | Rare | Shift right + EOR |
| `$67/$77/$6F/$7F/$63/$73` | RRA | Rare | Rotate right + ADC |
| `$0B/$2B` | ANC | Rare | AND + set carry |
| `$4B` | ALR | Rare | AND + shift right |
| `$6B` | ARR | Rare | AND + rotate right |
| `$02/$12/$22/$32/$42/$52/$62/$72/$92/$B2/$D2/$F2` | JAM/KIL | No — halts CPU | flowType: "halt" |

The JAM opcodes are important: if speculative discovery hits one, that candidate block is likely garbage (data misinterpreted as code).

### Instruction Length From Addressing Mode

Trivial mapping, no lookup needed:

```typescript
const ADDRESSING_MODE_BYTES: Record<AddressingMode, number> = {
  implied: 1,
  accumulator: 1,
  immediate: 2,
  zeroPage: 2,
  zeroPageX: 2,
  zeroPageY: 2,
  relative: 2,
  indexedIndX: 2,
  indirectIndY: 2,
  absolute: 3,
  absoluteX: 3,
  absoluteY: 3,
  indirect: 3,
};
```

---

## Step 3: Entry Point Detection

### `entry_point_detector.ts`

Finds where execution starts. Returns candidates ranked by confidence for user confirmation.

**Detection methods (in priority order):**

### 1. BASIC Stub Detection (HIGH confidence)

Most C64 programs start with a BASIC stub at `$0801`:
```
0801: 0B 08 0A 00 9E 32 30 36 34 00 00 00
      ↑ ptr  ↑line ↑SYS ↑"2064"    ↑end
```

**Algorithm:**
1. Check if load address is `$0801` (standard BASIC start)
2. Parse BASIC tokenized line: follow link pointer, find line number, look for `$9E` token (SYS)
3. Extract the decimal number following SYS — this is the entry address
4. Validate: is the target address within a loaded region?

**Edge cases:**
- Multi-line BASIC stubs (some programs have multiple SYS calls for different modes)
- BASIC loader that POKEs machine code then SYSes to it
- SYS with arithmetic: `SYS 2*1024+16` — parse the expression

### 2. IRQ/NMI Vector Setup Detection (HIGH confidence)

Scan loaded code for patterns that install interrupt handlers:

```
; Pattern A: KERNAL IRQ vector (LDA/STA)
LDA #<handler    ; $A9 xx
STA $0314        ; $8D $14 $03
LDA #>handler    ; $A9 xx
STA $0315        ; $8D $15 $03

; Pattern A2: KERNAL IRQ vector (LDX/STX or LDY/STY — same semantics)
LDX #<handler    ; $A2 xx
STX $0314        ; $8E $14 $03
LDX #>handler    ; $A2 xx
STX $0315        ; $8E $15 $03

; Pattern B: Hardware IRQ vector (after SEI + banking out KERNAL)
LDA #<handler    ; $A9 xx
STA $FFFE        ; $8D $FE $FF
LDA #>handler    ; $A9 xx
STA $FFFF        ; $8D $FF $FF

; Pattern C: NMI vector
STA $0318/$0319  ; KERNAL NMI
STA $FFFA/$FFFB  ; Hardware NMI

; Pattern D: Raster IRQ setup (strong IRQ handler indicator)
LDA #$line       ; raster line number
STA $D012        ; set raster compare
LDA $D011        ;
AND #$7F         ; clear bit 8 of raster compare (or ORA #$80 to set it)
STA $D011
LDA #$01         ;
STA $D01A        ; enable raster interrupt

; Pattern E: IRQ handler confirmation ($D019 acknowledge)
; Inside an IRQ handler: STA $D019 / LSR $D019 / ASL $D019
; Confirms that the containing subroutine IS a raster IRQ handler

; Pattern F: Default IRQ restoration
LDA #$31         ; $EA31 = default KERNAL IRQ handler
STA $0314
LDA #$EA
STA $0315
; Or: chaining via JMP ($0314) — common in IRQ handlers that chain to the previous handler
```

Extract the handler addresses from the immediate operands. Each is an additional entry point. Match all register variants (LDA/LDX/LDY + STA/STX/STY) since games use whichever register is convenient.

### 3. Init Signature Detection (MEDIUM confidence)

Common C64 init patterns at the start of machine code:

```
SEI              ; Disable interrupts
LDA #$35         ; Bank out BASIC + KERNAL ROM
STA $01
```

or:

```
SEI
LDA #$7F         ; Disable CIA interrupts
STA $DC0D
STA $DD0D
```

If found near a loaded region start → MEDIUM confidence entry point.

### 4. Jump Table Detection (MEDIUM confidence)

Tables of 16-bit addresses used with computed jumps:

```
; RTS dispatch table (address - 1, pushed then RTS)
.word handler_0 - 1
.word handler_1 - 1
.word handler_2 - 1
```

Each target is an additional entry point. Detected when:
- A block of sequential 16-bit values all point to loaded code regions
- Referenced by `LDA table,X / PHA / LDA table,X / PHA / RTS` pattern

### 5. SID File Header (HIGH confidence)

When input is a `.sid` file, the `sid_parser` extracts init and play addresses directly from the PSID/RSID header. These are definitive entry points — no guessing needed.

### 6. Relocation Detection (LOW confidence)

Some C64 programs load at one address but copy themselves to a different address before executing. Common pattern:

```
; Copy loop: move code from load_addr to dest_addr
LDA #<dest       ; destination low
STA $FB
LDA #>dest       ; destination high
STA $FC
LDA #<source     ; source low
STA $FD
LDA #>source     ; source high
STA $FE
LDY #$00
loop:
LDA ($FD),Y
STA ($FB),Y
...              ; increment pointers, check length
BNE loop
JMP dest         ; execute at new location
```

When detected:
- The `JMP dest` target is an additional entry point with type `"relocation_target"`
- Warn user: "Code appears to relocate to $XXXX. Analysis at the load address covers the relocator; the actual program runs at $XXXX."
- The relocated destination can't be analyzed statically (the bytes aren't there yet) — but recording it helps the AI pipeline understand the structure.

### Output

```typescript
interface EntryPointCandidate {
  address: number;
  type: "basic_sys" | "irq" | "nmi" | "init" | "jump_table_target" | "sid_header" | "relocation_target";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  evidence: string;        // Human-readable: "BASIC SYS 2064 found at $0801"
  installedBy?: number;    // Address of the code that installs this handler
}
```

**User confirmation:** The MCP skill (`/disasm-auto`) presents candidates and asks the user to confirm. The static analysis CLI just prints them and takes `--entry` flags.

### Banking Detection

The C64's processor port (`$0001`) controls ROM/RAM banking. The default configuration maps KERNAL ROM at $E000-$FFFF and BASIC ROM at $A000-$BFFF. When these are banked out, those address ranges contain RAM — a JSR to $FFD2 is NOT a KERNAL call if ROM is banked out.

**Pragmatic approach** (not full abstract interpretation — that's overkill for C64):

1. **Scan for early banking writes:** Look for `LDA #$xx / STA $01` patterns in the init sequence (first ~50 instructions from entry point)
2. **Determine banking mode:**

| $0001 value | BASIC ROM | KERNAL ROM | I/O | Meaning |
|-------------|-----------|------------|-----|---------|
| `$37` (default) | Visible | Visible | Visible | Standard config |
| `$36` | Hidden | Visible | Visible | BASIC banked out (common for games) |
| `$35` | Hidden | Hidden | Visible | All RAM except I/O (common for demos/games) |
| `$34` | Hidden | Hidden | Hidden | Pure RAM (rare — no I/O access) |
| `$33` | Hidden | Hidden | Hidden | Pure RAM + no char ROM |

3. **Apply globally:** If init sets `$0001 = $35`, then for the entire analysis:
   - Don't treat $E000-$FFFF as KERNAL ROM
   - Don't treat $A000-$BFFF as BASIC ROM
   - JSR $FFD2 is NOT a KERNAL call — follow into RAM
   - Addresses in those ranges are potential code/data targets

4. **If no banking write found:** Assume default (`$37`) — KERNAL and BASIC visible.

**VIC bank detection** (same approach for `$DD00`):

The VIC-II chip can only see a 16KB window of memory. CIA2 port A (`$DD00`) bits 0-1 select which bank:

| $DD00 bits 0-1 | VIC bank | Address range |
|----------------|----------|---------------|
| `11` (default) | Bank 0 | $0000-$3FFF |
| `10` | Bank 1 | $4000-$7FFF |
| `01` | Bank 2 | $8000-$BFFF |
| `00` | Bank 3 | $C000-$FFFF |

Scan for `LDA #$xx / STA $DD00` in the init sequence. The detected VIC bank is used by sprite, charset, screen map, and bitmap data detectors to compute correct data addresses.

**Output:**

```typescript
interface BankingState {
  processorPort: number;     // $0001 value (default $37)
  kernalVisible: boolean;    // $E000-$FFFF is ROM?
  basicVisible: boolean;     // $A000-$BFFF is ROM?
  ioVisible: boolean;        // $D000-$DFFF is I/O?
  vicBank: number;           // 0-3 (default 0)
  vicBankBase: number;       // $0000, $4000, $8000, or $C000
  evidence: string;          // "LDA #$35 / STA $01 at $0812"
}
```

This is detected once during step 3 and passed to all subsequent steps. It is NOT per-basic-block tracking — if a program switches banking mid-execution (rare), the analysis uses the init-time value and the AI pipeline handles the rest.

---

## Step 4: Code Discovery

### `code_discovery.ts`

The most complex module. Takes the memory image + entry points and classifies every byte as code, data, or unknown. Produces an instruction map and subroutine boundaries.

### Two-Phase Approach

**Phase 1 — Recursive Descent (Proven Code)**

Start from each confirmed entry point. Follow control flow:

```typescript
function recursiveDescent(memory: Uint8Array, entryPoints: number[]): InstructionMap {
  // Per-byte occupancy: tracks what each byte IS, not just "visited"
  // This prevents decoding mid-instruction when another path targets addr+1
  const byteRole = new Uint8Array(65536);  // 0=unvisited, 1=opcode, 2=operand
  const queue: number[] = [...entryPoints];
  const instructions = new Map<number, DecodedInstruction>();
  const subroutineStarts = new Set<number>();
  const unresolvedTargets: UnresolvedTarget[] = [];

  while (queue.length > 0) {
    const addr = queue.shift()!;

    // Skip if already decoded as opcode, OR if this byte is an operand of another instruction
    if (byteRole[addr] !== 0) continue;

    const inst = decode(memory, addr);
    if (!inst) continue; // Invalid opcode — stop this path

    // Check for conflict: would this instruction's bytes overlap existing instructions?
    let conflict = false;
    for (let i = 0; i < inst.info.bytes; i++) {
      if (byteRole[addr + i] !== 0) { conflict = true; break; }
    }
    if (conflict) continue; // Another instruction already occupies these bytes

    // Mark ALL bytes occupied: opcode byte + operand bytes
    byteRole[addr] = 1;  // opcode start
    for (let i = 1; i < inst.info.bytes; i++) {
      byteRole[addr + i] = 2;  // operand byte
    }
    instructions.set(addr, inst);

    switch (inst.info.flowType) {
      case "continue":
        queue.push(addr + inst.info.bytes);
        break;

      case "branch":
        queue.push(addr + inst.info.bytes); // Fall-through
        queue.push(inst.operandAddress!);    // Branch target
        break;

      case "jump":
        if (inst.operandAddress! >= 0 && inst.operandAddress! <= 0xFFFF) {
          queue.push(inst.operandAddress!);
        }
        break;

      case "jumpIndirect":
        unresolvedTargets.push({ fromAddr: addr, type: "indirect_jump" });
        break;

      case "call": {
        const target = inst.operandAddress!;
        subroutineStarts.add(target);
        if (!isROMAddress(target, bankingState)) {
          queue.push(target);               // Callee (skip ROM)
        }
        queue.push(addr + inst.info.bytes);  // Return point
        break;
      }

      case "return":
      case "halt":
        break;
    }
  }

  return { instructions, subroutineStarts, byteRole, unresolvedTargets };
}
```

**Key decisions:**
- **Per-byte occupancy:** Every byte in the memory image is tracked as `unvisited`, `opcode`, or `operand`. This prevents mid-instruction decoding — if path A decodes a 3-byte instruction at $C000, path B cannot start decoding at $C001 or $C002.
- **JSR to KERNAL/ROM:** Don't follow into ROM addresses. Uses `isROMAddress()` which checks the current banking state (see [Banking Detection](#banking-detection)).
- **JMP ($xxxx):** Record as unresolved target. Mark source as "indirect" reachability. The iterative fixpoint may resolve some of these via jump table detection.
- **Targets outside loaded region:** Recorded as unresolved xrefs with reason `"outside_loaded_region"`, not silently ignored. May be multi-load overlays, banked code, or hardware vectors.
- **Self-modifying code targets:** If a `STA` writes to an address that's already decoded as an instruction operand, flag it as SMC but don't stop analysis.

**Phase 1.5 — Inline Data Detection (Skip-Over Patterns)**

Before speculative discovery, detect inline data embedded within code. Common C64 pattern:

```
    JSR skip        ; jump over inline data
    .byte "HELLO",0 ; inline data (would be decoded as garbage instructions)
skip:
    ...             ; code continues here
```

Also:
```
    BNE over_data   ; branch over table
    .byte $01,$02,$04,$08,$10,$20,$40,$80  ; bit mask table
over_data:
```

**Detection:** After recursive descent, scan for gaps between a call/branch instruction and its forward target where both the source and target are proven code:

```typescript
function detectInlineData(instructions: Map<number, DecodedInstruction>, byteRole: Uint8Array) {
  for (const [addr, inst] of instructions) {
    if (inst.info.flowType !== "call" && inst.info.flowType !== "jump" && inst.info.flowType !== "branch") continue;
    const target = inst.operandAddress;
    if (!target || target <= addr) continue;  // only forward jumps/calls/branches

    const gapStart = addr + inst.info.bytes;
    if (gapStart >= target) continue;  // no gap

    // Check: is the gap entirely unvisited AND is the target proven code?
    let gapClean = true;
    for (let i = gapStart; i < target; i++) {
      if (byteRole[i] !== 0) { gapClean = false; break; }
    }

    if (gapClean && byteRole[target] === 1) {
      // Mark gap as inline data — prevent speculative discovery from decoding it
      for (let i = gapStart; i < target; i++) {
        byteRole[i] = 3;  // inline_data
      }
      inlineDataRegions.push({ start: gapStart, end: target, skippedBy: addr });
    }
  }
}
```

These regions are passed to the data detectors in step 6, which can classify them (string, table, etc.). The `byteRole` value `3` (inline_data) prevents speculative discovery from treating them as code candidates.

**Phase 2 — Speculative Discovery (Spedi-inspired)**

For remaining unclassified bytes in loaded regions (`byteRole === 0`):

1. **Generate candidate blocks:**
   Start candidates at **likely boundaries only** (not every unvisited byte):
   - Byte immediately after a proven RTS/RTI/JMP instruction
   - Byte immediately after a data candidate region
   - Byte at a pointer table entry target
   - First unvisited byte after a run of visited bytes

   For each candidate start `addr`:
   - Attempt to decode a basic block starting at `addr`
   - A basic block = sequence of instructions ending at a branch/jump/RTS/halt/invalid opcode
   - Record the candidate: `{ start, end, instructions[], terminationType }`

2. **Score candidates:**

   ```typescript
   function scoreCandidate(candidate: CandidateBlock): number {
     let score = 0;

     // Positive signals — control flow consistency weighted highest
     if (candidate.terminationType === "return") score += 10;  // Ends with RTS
     if (candidate.terminationType === "jump") score += 8;     // Ends with JMP
     if (candidate.terminationType === "branch") score += 5;   // Ends with conditional branch

     // Check branch/jump targets — strongest signal
     for (const inst of candidate.instructions) {
       if (inst.operandAddress && inst.info.flowType === "branch") {
         if (isMiddleOfInstruction(inst.operandAddress)) return -100; // Branch into mid-instruction = garbage
         if (isProvenCode(inst.operandAddress)) score += 8;           // Branch to known code = very strong
         if (byteRole[inst.operandAddress] === 1) score += 5;         // Lands on an opcode start
       }
     }

     for (const inst of candidate.instructions) {
       if (!inst.info.undocumented) score += 1;                // Uses official opcodes
       if (inst.info.flowType === "halt") score -= 20;         // JAM/KIL = almost certainly data
       if (isKernalAddress(inst.operandAddress)) score += 2;   // References KERNAL (reduced — can be coincidental)
       if (isHardwareRegister(inst.operandAddress)) score += 2; // References VIC/SID/CIA (reduced)
     }

     // Negative signals
     if (candidate.terminationType === "invalid") score -= 15;

     // Short-block penalty: only if block ALSO lacks positive flow signals
     // Tiny trampolines (JMP $xxxx) and helpers (LDA #x / RTS) are legitimate
     if (candidate.instructions.length < 3 && score <= 5) score -= 3;

     return score;
   }
   ```

3. **Conflict resolution:**
   - If two candidates overlap (same byte is opcode in one, operand in another): keep higher-scoring one
   - If a candidate conflicts with proven code: discard candidate
   - If a candidate branches to the middle of a proven instruction: discard (CFG conflict)

4. **Classification:**
   - Score >= threshold (default 10): speculative code (MEDIUM confidence, `reachability: "indirect"`)
   - Score < threshold: leave as `unknown`

### Subroutine Boundary Detection

After both phases, identify subroutines:

1. **Every JSR target** from phase 1 = subroutine start
2. **Every address that follows an RTS/RTI** and is also a JSR target = subroutine start
3. **Code after an unconditional JMP** that is a JSR target = subroutine start
4. **Code after an unconditional JMP** that is NOT a JSR target but IS reachable = fragment (fall-through from above or jump table target)

**Subroutine end detection:**
- Simple case: single RTS with no branches past it → subroutine ends at RTS
- Multiple exits: some subroutines have multiple RTS paths → subroutine ends at the last address that can reach any of the RTS instructions
- Fall-through: no RTS, code flows into next subroutine → mark as `fragment`, link to successor
- Tail calls: JMP to another subroutine instead of JSR+RTS → ends at JMP, but NOT an RTS

### Edge Cases

**1. Multi-entry subroutines:**
Two JSR targets within the same contiguous code block (no branching separation). Example: a subroutine with an alternate entry that skips setup.
→ One block with multiple entries in `entry_points` array.

**2. Shared tails:**
Two subroutines' branches converge to common cleanup code that ends with RTS.
→ Shared code is a `fragment` with `shared_by` array listing both subroutines.

**3. Fall-through routines:**
A subroutine ends without RTS — execution falls into the next routine.
→ Marked as `fragment`, `successor` field links to next block.

**4. Orphan code:**
Code between subroutines that isn't reachable from any entry point and isn't a JSR target.
→ Marked as `unknown`. Could be dead code, could be data, could be jump table target.

**5. Self-modifying code:**
Instructions that write to addresses within the code region.
→ Flag as SMC. Record which instruction does the write, what address is modified, and the modification type (operand change, opcode change, NOP sled).

**Detection patterns:**
```
; Operand modification
STA target+1          ; where 'target' is a known instruction address
INC target+1          ; incrementing an operand byte

; Computed jumps via SMC
LDA table,X
STA jump_addr+1       ; modify low byte of a JMP target
LDA table+1,X
STA jump_addr+2       ; modify high byte
jump_addr: JMP $0000  ; target is runtime-determined
```

### Output

The code discovery step produces an internal `InstructionMap` — not yet `blocks.json`. The block builder (step 6) converts this to blocks.

```typescript
interface InstructionMap {
  instructions: Map<number, DecodedInstruction>;  // All decoded instructions
  subroutineStarts: Set<number>;                  // JSR targets
  subroutineEnds: Map<number, number>;            // start → end address
  basicBlocks: BasicBlock[];                      // Basic block graph
  smcSites: SMCSite[];                            // Self-modifying code
  unresolvedIndirects: number[];                  // JMP ($xxxx) addresses
  classification: Map<number, ByteClass>;         // Per-byte: code | data | unknown
}

type ByteClass =
  | "code_opcode"       // Opcode byte of a proven instruction
  | "code_operand"      // Operand byte(s) of a proven instruction
  | "code_speculative"  // Speculative discovery (opcode or operand)
  | "inline_data"       // Data embedded in code (skip-over pattern)
  | "data_classified"   // Classified by a data detector
  | "unknown";          // Unvisited / unclassified

interface BasicBlock {
  start: number;
  end: number;            // Last instruction address (inclusive)
  successors: number[];   // Addresses of successor basic blocks
  predecessors: number[];
  subroutine: number;     // Which subroutine this block belongs to
  isLoopHeader: boolean;  // Target of a back-edge
}

interface SMCSite {
  writeInstruction: number;   // Address of the STA/INC that does the write
  targetAddress: number;      // Address being modified
  modificationType: "operand" | "opcode" | "unknown";
  subroutine: number;         // Which subroutine contains the write
}
```

---

## Step 5: Cross-Reference Builder

### `xref_builder.ts`

Builds the cross-reference database from the instruction map. This is the "backbone of all analysis" — every downstream step uses xrefs.

**Built in a single pass over all decoded instructions:**

```typescript
interface XRefDB {
  // Per-address entries
  entries: Map<number, XRefEntry>;

  // Query methods
  getCallersOf(address: number): XRef[];
  getCalleesOf(address: number): XRef[];
  getReadsOf(address: number): XRef[];
  getWritesOf(address: number): XRef[];
  getHardwareRefsIn(startAddr: number, endAddr: number): XRef[];
  getDataRefsIn(startAddr: number, endAddr: number): XRef[];
}

interface XRefEntry {
  address: number;
  readBy: XRef[];           // LDA/LDX/LDY/CMP/CPX/CPY at this address
  writtenBy: XRef[];        // STA/STX/STY to this address
  modifiedBy: XRef[];       // INC/DEC/ASL/LSR/ROL/ROR on this address (read-modify-write)
  jumpedToBy: XRef[];       // JMP targeting this address (unconditional)
  branchedToBy: XRef[];     // BNE/BEQ/BCC/BCS/BPL/BMI/BVC/BVS targeting this address (conditional)
  calledBy: XRef[];         // JSR targeting this address
  bitTestedBy: XRef[];      // BIT instruction testing this address (tests flags without modifying A)
  dataRefBy: XRef[];        // Referenced as data (pointer patterns)
  modifiedBySMC: XRef[];    // SMC writes targeting this address
  comparisonValues: ComparisonValue[];  // CMP #xx values used with this address
}

interface XRef {
  fromAddress: number;      // Where the reference originates
  toAddress: number;        // Where it points to
  type: "read" | "write" | "modify" | "jump" | "branch" | "call" | "data_ref" | "bit_test" | "smc";
  instruction: string;      // "LDA $C000,X" — for context
  subroutine: number;       // Which subroutine contains this reference
}

interface ComparisonValue {
  value: number;            // The immediate value in CMP #xx
  address: number;          // Where the CMP is
  context: string;          // "CMP #$08" → "8 (sprites/bits)"
}
```

**What gets tracked:**

| Instruction pattern | XRef type | Example |
|---------------------|-----------|---------|
| `LDA $C000` / `LDA $C000,X` | read | Code reads from $C000 |
| `STA $D020` | write | Code writes to VIC border color |
| `INC $C000` / `ASL $C000` / `DEC $C000` | modify | Read-modify-write at $C000 (semantically different from separate read+write) |
| `JMP $C100` | jump | Unconditional control flow to $C100 |
| `BNE $C100` / `BEQ $C100` | branch | Conditional control flow to $C100 (distinguishes "always goes" from "might go") |
| `JSR $FFD2` | call | Subroutine call to KERNAL CHROUT |
| `BIT $C000` | bit_test | Test flags of memory without modifying A (common for I/O polling, flag checks) |
| `LDA #<addr / STA $FB` | data_ref | Pointer to data address |
| `STA instr+1` (SMC) | smc | Self-modifying code target |
| `CMP #$28` | comparison | Compare with 40 (screen width) |

**Pointer pattern detection:**

The xref builder also detects common pointer-passing idioms and records them as data references:

```
; Pattern: A/Y register pair (KERNAL convention)
LDA #<$C800      → data_ref to $C800
LDY #>$C800

; Pattern: Zero page pointer pair
LDA #<$C800      → data_ref to $C800
STA $FB
LDA #>$C800
STA $FC

; Pattern: Absolute address in immediate sequence
LDA #$00         → data_ref to $C800
STA $FB           (if next LDA #$C8 / STA $FC)
LDA #$C8
STA $FC
```

These are MEDIUM confidence data references — the AI in Pass 2 will confirm or reject them.

**Lo/hi byte relationship annotation:**

When a pointer pattern is detected, annotate each `LDA #imm` instruction with which half of the reconstructed address it represents:

```typescript
interface PointerHalf {
  targetAddress: number;    // Reconstructed 16-bit address (e.g. $C800)
  half: "lo" | "hi";       // Which byte this immediate provides
  pairedWith: number;       // Address of the instruction providing the other half
}
```

This is stored on the `DecodedInstruction` (not just in XRefDB) so it survives into `blocks.json`. Critical for the AI pipeline to understand lo/hi byte table patterns like:
```
table_lo: .byte <addr0, <addr1, <addr2   ; low bytes of jump targets
table_hi: .byte >addr0, >addr1, >addr2   ; high bytes
```
Without this annotation, the AI sees two unrelated byte tables. With it, each entry is linked to its partner and the reconstructed 16-bit target.

**Hardware register classification:**

Addresses in known hardware ranges get automatic classification:

```typescript
function classifyAddress(addr: number): string | null {
  if (addr >= 0xD000 && addr <= 0xD02E) return "VIC-II";
  if (addr >= 0xD400 && addr <= 0xD41C) return "SID";
  if (addr >= 0xDC00 && addr <= 0xDC0F) return "CIA1";
  if (addr >= 0xDD00 && addr <= 0xDD0F) return "CIA2";
  if (addr === 0x0000 || addr === 0x0001) return "CPU_PORT";
  if (addr >= 0xE000) return "KERNAL_ROM";
  if (addr >= 0xA000 && addr <= 0xBFFF) return "BASIC_ROM";
  return null;
}
```

---

## Step 6: Block Builder

### `block_builder.ts`

Assembles the instruction map + xrefs into `blocks.json`. This is where subroutines become blocks with full metadata.

### Block Assembly

A subroutine is a **set of basic blocks**, not a contiguous address range. Real 6502 code has non-contiguous tails, shared epilogues, and code islands. The block builder works with block sets:

For each subroutine identified by code_discovery:

1. Collect all basic blocks reachable from the subroutine's entry point via intra-procedural control flow (branches, fall-through — NOT JSR targets, those are separate subroutines)
2. The block's `address` / `end_address` are the min/max of its basic blocks (for display and coverage), but the `basic_blocks` array is the authoritative representation — gaps between basic blocks may contain data or other subroutines' code
3. Collect xrefs:
   - `calls_out`: all JSR targets from within this subroutine
   - `called_by`: all JSR instructions targeting this subroutine's entry
   - `hardware_refs`: all reads/writes to hardware register ranges
   - `data_refs`: all data reference addresses
4. Detect loops: basic blocks with back-edges (successor address < block start)
5. Classify reachability (proven/indirect/unreachable)
6. Apply known symbols from the symbol database

### Data Region Detection

Unclassified regions are analyzed by **pluggable data detectors** — each detector is a separate module in `src/static-analysis/data_detectors/`, following the same plugin pattern as input parsers. Each detector implements a common interface and scores candidate regions.

**All candidates are kept.** When multiple detectors propose overlapping candidates for the same region, ALL candidates are recorded with their respective confidences — the AI pipeline (Pass 2) makes the final determination. Static analysis does not resolve ambiguity; it presents the evidence.

**Hard invariant: data candidates MUST NOT overlap proven code.** A data candidate that covers bytes classified as `code_opcode` or `code_operand` is silently discarded. This prevents detectors from contradicting the CFG. Inline data (detected by the skip-over pattern in phase 1.5) is fine — those bytes are classified as `inline_data`, not code.

**Detector scan regions:** Detectors scan `unknown` regions AND `inline_data` regions. They do NOT scan proven code regions. Inline data is a prime target — the skip-over detection in step 4 identifies the region, but detectors in step 6 classify what's in it (string, table, etc.).

```typescript
interface DataDetector {
  /** Unique identifier for this detector (e.g. "sprite", "string", "sid_music") */
  name: string;

  /** Human-readable description of what this detector finds */
  description: string;

  /**
   * Analyze a region and return candidates with confidence scores.
   * May return multiple candidates for a single region (e.g. a string detector
   * might return both "petscii_null" and "screen_codes" candidates with
   * different confidences).
   */
  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    xrefs: XRefDB,
    codeRefs: Map<number, DecodedInstruction[]>  // instructions referencing this region
  ): DataCandidate[];
}

interface DataCandidate {
  start: number;
  end: number;              // exclusive
  detector: string;         // which detector produced this ("sprite", "string", etc.)
  type: string;             // "sprite" | "charset" | "string" | etc.
  subtype?: string;         // "petscii_null" | "screen_codes" | "high_bit" | etc.
  confidence: number;       // 0-100
  evidence: string[];       // why we think this is this format
  label?: string;           // suggested label (e.g. "spr_data_0", "txt_title")
  comment: string;          // human-readable summary for AI consumption
                            // e.g. "64-byte sprite data at $2000, referenced by sprite pointer write at $C010"
                            // e.g. "Possible PETSCII string 'SCORE:' (6 chars, null-terminated)"
}
```

### Detector Plugin Registry

Detectors are **auto-discovered** by scanning the `data_detectors/` directory, same pattern as parsers. Any `*_detector.ts` file that exports a `DataDetector` implementation is automatically registered.

```typescript
// src/static-analysis/data_detectors/index.ts

/** Auto-discover all detectors in this directory */
async function loadDetectors(): Promise<DataDetector[]> {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const files = readdirSync(dir).filter(f =>
    f.endsWith("_detector.ts") && f !== "types.ts" && f !== "index.ts"
  );

  const detectors: DataDetector[] = [];
  for (const file of files) {
    const mod = await import(path.join(dir, file));
    const DetectorClass = Object.values(mod).find(
      v => typeof v === "function" && v.prototype?.detect
    ) as new () => DataDetector;
    if (DetectorClass) detectors.push(new DetectorClass());
  }

  return detectors;
}

async function detectDataRegions(
  memory: Uint8Array,
  unknownRegions: { start: number; end: number }[],
  xrefs: XRefDB,
  codeRefs: Map<number, DecodedInstruction[]>
): Promise<DataCandidate[]> {
  const detectors = await loadDetectors();
  const allCandidates: DataCandidate[] = [];

  for (const region of unknownRegions) {
    for (const detector of detectors) {
      const candidates = detector.detect(memory, region, xrefs, codeRefs);
      allCandidates.push(...candidates);
    }
  }

  return allCandidates;  // ALL candidates kept — no filtering by confidence
}
```

### Adding New Detectors

To add a new data format detector:

1. Create `src/static-analysis/data_detectors/new_detector.ts`
2. Implement `DataDetector` interface
3. Export the class

That's it — auto-discovery picks it up. The block builder and AI pipeline see the same `DataCandidate[]`.

### Overlapping Candidates

When multiple detectors claim the same address range, `blocks.json` records ALL candidates on the data block:

```json
{
  "id": "data_2000",
  "type": "data",
  "address": "0x2000",
  "end_address": "0x203F",
  "candidates": [
    {
      "detector": "sprite",
      "type": "sprite",
      "confidence": 95,
      "evidence": ["LDA #$80 / STA $07F8 at $C010 → sprite pointer = 128 → data at $2000"],
      "comment": "64-byte sprite data at $2000, sprite 0 pointer set at $C010",
      "label": "spr_data_0"
    },
    {
      "detector": "lookup_table",
      "type": "lookup_table",
      "subtype": "byte_table",
      "confidence": 30,
      "evidence": ["64 bytes, referenced by LDA $2000,X at $C050"],
      "comment": "Possible byte lookup table (64 entries), indexed read at $C050",
      "label": "tbl_2000"
    }
  ],
  "best_candidate": 0
}
```

- `candidates` array: ALL detector proposals, sorted by confidence (highest first)
- `best_candidate`: index of the highest-confidence candidate (convenience for display)
- The AI pipeline reads all candidates and their comments as context when analyzing code that references this region
- High confidence disparity (e.g. 95 vs 30) effectively resolves itself — the AI will almost always agree with the strong candidate
- Close confidences (e.g. 70 vs 65) are the interesting cases where AI judgement adds real value

#### Detector: Sprite Data (HIGH feasibility)

C64 sprites are 63 bytes of pixel data + 1 byte padding = 64 bytes per slot. Their location in memory is determined by **sprite pointers** — single-byte values stored at `screen_base + $03F8-$03FF` (default: `$07F8-$07FF`).

**Detection chain:**
1. Find code that writes to sprite pointer addresses:
   - `STA $07F8` / `STA $07F9` / ... / `STA $07FF` (default screen)
   - Or `STA screen_base+$03F8` if VIC screen is relocated
2. Trace the stored value back. If `LDA #N` → sprite data is at `N * 64 + VIC_bank_base`
   - VIC bank from CIA2 `$DD00` bits 0-1 (inverted): `00=$C000, 01=$8000, 10=$4000, 11=$0000`
   - Default VIC bank = `$0000`, so sprite data = `N * 64`
3. Mark that 64-byte region as sprite data
4. Check for **consecutive sprites** using both strides:
   - **64-byte stride** (padded, most common): N*64, (N+1)*64, (N+2)*64, ... — standard sprite editors pad to 64 bytes
   - **63-byte stride** (packed): base, base+63, base+126, ... — hand-crafted or packed sprite sheets omit the padding byte to save memory. Detect by: if consecutive 63-byte regions are all referenced as sprite data and no code references the padding positions → use 63-byte stride
   - When stride is ambiguous, prefer 64-byte (more common). Flag 63-byte detections with a note for AI review
5. Also check: `LDA table,X / STA $07F8,X` patterns where `table` contains sprite pointer values → each value in the table × 64 = sprite data

**Mono vs multicolor sprite classification:**
The VIC-II register `$D01C` (Sprite Multicolor Enable) controls whether each sprite is monochrome or multicolor. Bit N = sprite N.
- Scan xrefs for writes to `$D01C` (or `ORA $D01C` / `AND $D01C` bit manipulation)
- If a sprite's bit is set → `subtype: "multicolor_sprite"` (2 bits/pixel, 12 pixels wide × 21 rows, 4 colors per sprite)
- If a sprite's bit is clear → `subtype: "monochrome_sprite"` (1 bit/pixel, 24 pixels wide × 21 rows, 2 colors per sprite)
- If `$D01C` write is not traceable → omit subtype (let AI classify from pixel density patterns)

**Confidence scoring:**
- Direct `LDA #N / STA $07F8+i`: 95 (near-certain)
- Indexed store via table: 85
- 64-byte aligned region not referenced by code but adjacent to confirmed sprite: 50
- 64-byte aligned region in unknown area, no code refs: 20

**Example:**
```
LDA #$80            ; sprite pointer value = 128
STA $07F8           ; store to sprite 0 pointer
; → sprite data at 128 * 64 = $2000
; → mark $2000-$203F as sprite data

LDA #$FF
STA $D01C           ; all sprites multicolor
; → all detected sprites get subtype: "multicolor_sprite"
```

#### Detector: Character Set (HIGH feasibility)

Custom character sets are 2048 bytes (256 chars × 8 bytes/char) or 1024 bytes (128 chars × 8 bytes/char). Location is controlled by VIC register `$D018` bits 1-3.

**Detection chain:**
1. Find code that writes to `$D018`:
   - Extract bits 1-3 of the written value
   - Charset address = `(value & 0x0E) * 1024 + VIC_bank_base`
   - E.g., `LDA #$1C / STA $D018` → bits 1-3 = `110` = 6 → charset at `6 * 1024 = $1800 + VIC_bank`
2. **Alignment validation:** Verify the computed charset address is 2KB-aligned within the active VIC bank:
   - `(charset_address - VIC_bank_base) % 2048 === 0`
   - If not aligned → reject candidate (bad decode or computed value)
3. Mark as character set data — check both sizes:
   - **Full charset (2048 bytes):** all 256 characters redefined. This is the default assumption
   - **Partial charset (1024 bytes):** only 128 characters (upper or lower half). Common in games that redefine only custom characters while keeping the default ROM charset for letters. Detect by: if the second 1KB is identical to the corresponding ROM charset half, or if only one 1KB half is referenced by screen codes in use → mark as 1024-byte partial charset with `subtype: "partial_charset"`
4. For partial charsets, score lower since the second half might be unrelated data

**Confidence scoring:**
- Direct `LDA #imm / STA $D018` with traceable value, aligned: 90
- Direct value, aligned, partial charset (1024 bytes): 75
- `$D018` written but value not traceable (computed): 60 (flag for AI)
- Alignment validation failed: reject (do not emit candidate)

#### Detector: Screen Map (MEDIUM feasibility)

Screen maps are 1000 bytes (40×25). Location from `$D018` bits 4-7.

**Detection chain:**
1. Find `$D018` writes, extract bits 4-7:
   - Screen address = `(value >> 4) * 1024 + VIC_bank_base`
   - Default: `$0400` (bits 4-7 = `0001`)
2. If screen is relocated from default $0400 → mark the 1000 bytes as screen map
3. Also detect: code that writes to screen_base + offset in a loop (screen fill/copy patterns)
4. **Color RAM:** When a screen map is detected, also check for a corresponding color RAM block. Color RAM is always at $D800-$DBE7 (1000 bytes, fixed address — not affected by VIC banking). If code writes to both screen_base and $D800 range in the same routine → mark $D800-$DBE7 as color RAM data with `subtype: "color_ram"`. Confidence: 80 when paired with screen map write, 50 standalone.

**Note:** The screen base address depends on BOTH `$D018` bits 4-7 AND the VIC bank (from `$DD00`). The detector uses the `BankingState` from step 3 to compute the correct address. Sprite pointer addresses also depend on screen base: `screen_base + $03F8`.

#### Detector: Bitmap Data (MEDIUM feasibility)

Bitmap mode data is 8000 bytes. Activated via `$D011` bit 5 and `$D018` bit 3.

**Detection chain:**
1. Find code that sets bit 5 of `$D011` (bitmap mode on):
   - `LDA $D011 / ORA #$20 / STA $D011`
   - Or `LDA #$3B / STA $D011` (common: bitmap + extended screen height)
2. Bitmap data address from `$D018` bit 3:
   - Bit 3 = 0 → bitmap at VIC_bank_base + $0000
   - Bit 3 = 1 → bitmap at VIC_bank_base + $2000
3. Mark 8000 bytes as bitmap data
4. **Multicolor mode:** Check `$D016` bit 4. If set (`ORA #$10 / STA $D016` or `LDA #$x8/$x9/... / STA $D016` where bit 4 is set), tag the bitmap as `subtype: "multicolor_bitmap"`. Multicolor bitmaps use twice the color data — the screen map serves as per-cell color pairs. Confidence for multicolor detection: 75 (bit 4 could be set for multicolor text mode instead).

#### Detector: String / Text (HIGH feasibility)

Multiple string encoding conventions exist on C64. Each gets its own subtype.

**String types and detection:**

| Subtype | Encoding | Termination | Detection |
|---------|----------|-------------|-----------|
| `petscii_null` | PETSCII ($20-$5F, $C0-$DF) | `$00` byte | Most common. Scan for runs of printable PETSCII ending in $00 |
| `petscii_highbit` | PETSCII | Last char has bit 7 set | Common for string tables. Detect: printable run where last byte is $80-$FF and byte & $7F is printable |
| `petscii_shifted` | PETSCII with all bytes shifted | Every byte has bit 7 set | All bytes in the run have bit 7 set. `byte & $7F` yields a printable character for every byte (not just the last). JC64dis: `SHIFT_TEXT`. Distinct from `petscii_highbit` where only the final byte is marked |
| `petscii_length` | PETSCII | First byte = length | Less common. First byte < 80, followed by that many printable bytes |
| `petscii_return` | PETSCII | `$0D` (carriage return) | Detect: printable run ending in $0D |
| `screen_codes` | Screen codes ($00-$3F) | `$00` or `$FF` | Different encoding from PETSCII. Byte values are lower. Often used for direct screen writes |

**Detection algorithm:**
1. Scan unknown regions for sequences of N consecutive printable bytes (N >= 4)
2. Check for termination pattern (null, high-bit, length prefix, CR)
3. Cross-reference with xrefs: is this region a target of:
   - `JSR $FFD2` (CHROUT) print loop?
   - `LDA #<addr / LDY #>addr / JSR print_routine`?
   - `LDA ($FB),Y` read loop that compares to $00?
4. Score by length, alpha ratio, and code reference strength

**Confidence scoring:**
- Referenced by CHROUT print loop + clean termination: 90
- Referenced by code + 8+ printable chars + termination: 80
- 8+ printable chars with null/highbit termination, no code ref: 60
- 4-7 printable chars, no code ref: 30 (could be coincidence)

**String table detection:**
Multiple consecutive strings (each with its own terminator) suggest a string table. Detect by: after one string ends, check if the next bytes start another string. If 3+ consecutive strings → mark the whole region as a string table with `subtype: "string_table"`.

#### Detector: SID Music Data (MEDIUM feasibility)

SID music isn't a single block — it's a **player routine + music data**. The player is code (already found by code discovery). The music data is what we're detecting here.

**Detection strategies:**

**Strategy 1 — Frequency table detection:**
The C64 SID uses 16-bit frequency values. The standard PAL note frequency table is well-known:
```
C-0: $0117  C#0: $0127  D-0: $0138  D#0: $014B  E-0: $015F  F-0: $0174
F#0: $018B  G-0: $01A3  G#0: $01BC  A-0: $01D8  A#0: $01F5  B-0: $0214
; ... octave 1 = octave 0 * 2, octave 2 = octave 1 * 2, etc.
```

Frequency tables appear in multiple memory layouts. JC64dis's `SidFreq.java` identifies 12 distinct table formats — we support all of them. Scan for all of these:

| Layout | Structure | Size | Detection |
|--------|-----------|------|-----------|
| **Split lo/hi** | Separate lo-byte and hi-byte arrays (e.g. 96 bytes lo + 96 bytes hi) | 2 × 90 bytes | Two arrays N bytes apart where `lo[i] + hi[i]*256` matches known frequencies. Most common layout. JC64dis: `linearTable` (TABLE=90) |
| **Combined (interleaved)** | Alternating lo/hi pairs (`lo0, hi0, lo1, hi1, ...`) at ×2 spacing | 192 bytes | Every even/odd byte pair reconstructs to known frequency. JC64dis: `combinedTable` |
| **Inverse linear** | Frequency values in **descending** order (B-7 down to C-0) | 96 bytes | Same validation as split lo/hi but entries decrease monotonically. Some players index from highest note down. JC64dis: `inverseLinearTable` |
| **Octave/note indexed** | 8 octaves × 16 bytes each (12 notes + 4 zero-byte padding per octave) | 122 bytes | Each octave block has 4 trailing zero bytes. Validate: `table[oct*16+12..15] == 0` for all octaves. JC64dis: `linearOctNoteTable` (OCT_NOTE_TABLE=122) |
| **Scale table** | Scale-based lookup, reduced note set | 56 bytes | Fewer entries but still follows equal temperament ratios. JC64dis: `linearScaleTable` |
| **Short linear** | Only the octaves actually used by the song | 72 bytes | Subset of full table, still matches known frequency ratios. JC64dis: `shortLinearTable` |
| **Short combined** | Compact combined lo/hi table | 65 bytes | Interleaved but truncated to fewer octaves. JC64dis: `shortCombinedTable` |
| **High octave combined** | Combined table covering only upper octaves | 26 bytes | First entry > $0800, interleaved format. JC64dis: `hiOctCombinedTable` |
| **High octave inverted** | High octave combined, bytes inverted | 26 bytes | Same as above but byte order reversed. JC64dis: `hiOctCombinedInvertedTable` |
| **Low octave combined** | Combined table covering only lower octaves | 26 bytes | Small table of bass frequencies. JC64dis: `loOctCombinedTable` |
| **High octave 12-tone** | Single high octave, all 12 notes | 24 bytes | 12 entries × 2 bytes, validates geometric progression: each note ≈ `prev * 2^(1/12)`. JC64dis: `hiOct12Table` |
| **Base octave + shift** | One 12-entry base octave table, player shifts for other octaves | 24 bytes | Small table, values double per octave when bit-shifted. Used by size-optimized players |

Core validation: within any 12 consecutive entries (one octave), each successive value ≈ `prev * 2^(1/12)` (equal temperament ratio ~1.0595). **Tolerance ±6 per value** (matching JC64dis's `ERROR=6` constant) to handle PAL/NTSC rounding differences, alternate tuning tables, and custom frequency scaling. Cross-octave validation: `note_octave_N * 2 ≈ note_octave_N+1` (within same tolerance).

**Strategy 2 — Player routine tracing:**
Find subroutines that systematically write to SID voice registers ($D400-$D406, $D407-$D40D, $D40E-$D414):
1. If a routine writes to all 3 voice groups → likely a music player play routine
2. Trace what data it reads — those addresses are music data
3. Music data is often sequential (player reads through it with an incrementing pointer)

**Strategy 3 — Known player signatures (SIDId database):**
JC64dis's `SidId.java` loads player signatures from an external database (HVSC SIDId format) covering 100+ known C64 music player engines. We support the same approach:

1. **External signature file:** Load from a SIDId-compatible text file (space-separated byte patterns with `??` wildcards, `AND` for skip-ahead, `END` terminators). The HVSC (High Voltage SID Collection) maintains the canonical database.
2. **Matching algorithm:** Sequential pattern matching with backtracking — scan the binary for each signature pattern. `??` matches any byte. `AND` skips forward to the next occurrence of the following byte (handles variable-length gaps in player code).
3. **Built-in fallback signatures** for the most common players (when no external file is provided):
   - GoatTracker: specific init pattern (writes to all SID regs, then reads from data table)
   - Rob Hubbard player: characteristic XOR decryption on music data bytes
   - JCH NewPlayer: known header structure
   - Martin Galway player: characteristic voice initialization sequence
   - David Whittaker player: specific data pointer setup pattern
4. **On match:** The identified player name is added to the candidate's `evidence` array and `comment` field. The data region boundaries are inferred from the player's known data layout (init address, play address, data tables referenced by the player routine).

**Confidence scoring:**
- Known player signature match: 90
- Frequency table matching known values: 85
- Data referenced by confirmed SID player routine: 80
- Sequential byte data after SID-writing routine with no other refs: 40

#### Detector: Jump / RTS Dispatch Tables (HIGH feasibility)

Tables of code addresses used for computed jumps.

**RTS dispatch pattern:**
```
LDA table_lo,X    ; load low byte of target address - 1
PHA               ; push to stack
LDA table_hi,X   ; load high byte
PHA               ; push to stack
RTS               ; "return" to the pushed address + 1
```
When this pattern is detected in code discovery, the table addresses are already known from xrefs. Mark the lo/hi byte tables as data with `subtype: "rts_dispatch_table"`. Each entry's value + 1 = a code entry point → feed back into code discovery.

**JMP indirect pattern:**
```
LDA table_lo,X
STA $FB
LDA table_hi,X
STA $FC
JMP ($00FB)
```
Same approach: trace table addresses from xrefs.

**Confidence:** 95 when the code pattern is confirmed. The table entries themselves validate — each should point to a valid code address in a loaded region.

#### Detector: Lookup Tables (MEDIUM feasibility)

Common C64 programming tables with recognizable patterns.

**Screen line offset table:**
25 entries (or 25 lo + 25 hi bytes), values = `row * 40 + screen_base`:
```
Lo: $00, $28, $50, $78, $A0, $C8, $F0, $18, $40, $68, ...
Hi: $04, $04, $04, $04, $04, $04, $04, $05, $05, $05, ...
```
Detect: 25-entry table where successive values differ by 40 (or by 40 mod 256 for lo bytes). Very common — almost every game uses this.

**Bit mask table:**
8 bytes: `$01, $02, $04, $08, $10, $20, $40, $80` (powers of 2). Detect exact match.

**Inverse bit mask table:**
8 bytes: `$FE, $FD, $FB, $F7, $EF, $DF, $BF, $7F`. Detect exact match.

**Sine/cosine table:**
Typically 256 entries, values oscillate periodically. Detect by computing discrete derivative — should change sign approximately every 64-128 entries (quarter period). Or detect: symmetric around the midpoint, values in a bounded range.

**Multiplication table:**
N entries where `table[i] = i * constant`. Detect: constant differences between successive entries. Common constants: 40 (screen width), 8 (char height), 3 (multicolor pixel width).

**Color table:**
All entries in range $00-$0F (C64 has 16 colors). Short tables (8-16 entries) of values all ≤ $0F, referenced by color register writes.

**Confidence scoring:**
- Exact match (bit masks, screen offsets with default base): 90
- Pattern match (sine table with periodicity check): 70
- Heuristic match (color table — all values ≤ $0F but could be anything): 50

#### Detector: BASIC Program (HIGH feasibility)

Tokenized BASIC programs are a well-defined data format. The entry point detector (step 3) already parses BASIC stubs to find `SYS` targets, but the BASIC program itself — the tokenized lines — is a data region that should be classified, not left as `unknown`.

**Detection chain:**
1. If the load address is `$0801` (standard BASIC start) and the entry point detector found a BASIC `SYS` stub, the BASIC program data starts at `$0801`
2. Walk the BASIC line-link chain: each BASIC line starts with a 2-byte pointer to the next line, followed by a 2-byte line number, tokenized content, and a `$00` terminator
3. Follow link pointers until a `$0000` link (end of program) or an invalid pointer (outside loaded region, points backwards, etc.)
4. The BASIC program region spans from `$0801` to the end-of-program marker (two `$00` bytes after the last line's terminator)
5. Everything between the end of BASIC and the `SYS` target address is also part of the BASIC data region (often padding or BASIC variables area)

**Validation:**
- Each link pointer must point forward (monotonically increasing addresses)
- Each link pointer must be within the loaded region
- Line numbers should be monotonically increasing (not strictly required — BASIC allows any order, but ascending is normal)
- Token bytes ($80-$CB for standard BASIC V2.0) should correspond to valid BASIC keywords

**BASIC dialect awareness:**
JC64dis supports 8 BASIC dialects (V2.0, V3.5, V4.0, V7.0, Simons', Andre Fachat, Speech, Final Cartridge III). For static analysis purposes, we only need V2.0 (C64 standard) — the token range $80-$CB covers all V2.0 keywords. Extended BASIC dialects are rare in the programs we target (games/demos) and the AI pipeline can handle them if needed.

**Confidence scoring:**
- Valid BASIC line-link chain with SYS stub at $0801: 95
- Valid line-link chain at $0801 without SYS (pure BASIC program): 85
- Partial chain (some invalid links but starts valid): 50

#### Detector: Padding / Fill (MEDIUM feasibility)

Large regions of repeated byte values are common in C64 binaries — used for alignment padding, memory clearing, or unused space between code/data segments. Classifying these reduces the `unknown` percentage and prevents the AI pipeline from wasting effort on empty regions.

**Detection algorithm:**
1. Scan `unknown` regions for runs of N consecutive identical bytes (N >= 16)
2. Classify by fill value:

| Fill Value | Subtype | Meaning |
|-----------|---------|---------|
| `$00` | `zero_fill` | Most common. Memory clearing, uninitialized space, or BRK sled |
| `$AA` | `alignment_fill` | Common alignment pattern (alternating bits) |
| `$FF` | `ff_fill` | Erased EPROM / unwritten memory |
| `$EA` | `nop_sled` | NOP instruction fill — could be intentional padding between routines or a code sled. If preceded and followed by code blocks, likely inter-routine padding |
| other | `byte_fill` | Any other repeated byte, record the value |

3. **JAM/invalid opcode regions:** If a contiguous region of `unknown` bytes contains >50% JAM opcodes ($02, $12, $22, $32, $42, $52, $62, $72, $92, $B2, $D2, $F2) when decoded as instructions → classify as `subtype: "garbage"` with high confidence. This is almost certainly data that was speculatively rejected as code. JC64dis flags these via `isGarbage` — we achieve the same by recognizing the pattern.

4. **Mixed fill:** Regions that alternate between 2-3 values in a regular pattern (e.g., `$00 $FF $00 $FF ...`) are also fill. Detect: if the region can be described by a pattern of ≤4 bytes repeated ≥8 times → `subtype: "pattern_fill"`.

**Confidence scoring:**
- 64+ bytes of identical fill: 90
- 32-63 bytes of identical fill: 80
- 16-31 bytes of identical fill: 60
- JAM-dense region (>50% JAM opcodes): 85
- Pattern fill (repeating ≤4-byte pattern): 70

#### Detector: Compressed / High-Entropy Data (MEDIUM feasibility)

Large unknown regions that are neither valid code nor structured data patterns may be compressed or encrypted data. Flagging these gives the AI pipeline a useful signal ("likely compressed") instead of raw "unknown".

**Detection algorithm:**
1. Scan `unknown` regions of 64+ bytes
2. **Shannon entropy analysis:** Compute byte-level entropy (0-8 bits):
   - Entropy > 7.5 → `subtype: "encrypted_or_random"` — near-uniform distribution, likely encrypted, compressed with high ratio, or truly random data
   - Entropy 6.0-7.5 → `subtype: "compressed"` — typical of LZ/RLE compressed data
   - Entropy < 6.0 → not flagged (structured data or code has lower entropy)
3. **Known packer signatures:** Check first bytes against known C64 packer headers:
   - Exomizer: decompressor stub patterns (JSR to known depack routines)
   - ByteBoozer: signature bytes at known offsets
   - PuCrunch: header magic
   - Level Crunch, Doynax LZ: other common packers
   - If matched → `subtype: "packed_<packer_name>"`, confidence 85
4. **RLE pattern detection:** Within moderate-entropy regions (4.0-6.0), check for:
   - Repeated byte-count pairs: `[count, value, count, value, ...]` where counts are small (1-127) and the decoded size would be reasonable
   - Run-length marker byte: a single byte value that signals "next byte repeats N times" — detect by: one byte value appears far more frequently than expected and is usually followed by a count + data byte
   - If RLE pattern detected → `subtype: "rle_compressed"`, confidence 70

**Confidence scoring:**
- Known packer signature match: 85
- Entropy > 7.5 and 256+ bytes: 75
- Entropy 6.0-7.5 and 128+ bytes: 65
- RLE pattern detected: 70
- Entropy 6.0-7.5 and 64-127 bytes: 50 (could be a short data table)

**Note:** This detector is intentionally conservative. It flags *likely* compressed regions for the AI pipeline to investigate further (e.g., tracing what code reads this data, looking for decompression loops). It does NOT attempt to decompress anything.

#### Detector Summary

| Detector | Confidence Range | Requires Code Refs? | Fixed Size? |
|----------|-----------------|---------------------|-------------|
| Sprite data | 20-95 | Strongly preferred | 63-64 bytes each |
| Character set | 60-90 | Yes ($D018 write) | 1024 or 2048 bytes |
| Screen map | 60-85 | Yes ($D018 write) | 1000 bytes |
| Color RAM | 50-80 | Paired with screen map | 1000 bytes (fixed at $D800) |
| Bitmap data | 70-90 | Yes ($D011 write) | 8000 bytes |
| String / text | 30-90 | Preferred, not required | Variable |
| SID music data | 40-90 | Preferred | Variable |
| Jump tables | 95 | Yes (code pattern) | Variable |
| BASIC program | 50-95 | Yes (BASIC stub) | Variable (line-link chain) |
| Padding / fill | 60-90 | No (pattern match) | 16+ bytes |
| Compressed / entropy | 50-85 | No (entropy + signatures) | 64+ bytes |
| Screen line offsets | 70-90 | Preferred | 25 or 50 bytes |
| Bit mask tables | 90 | No (pattern match) | 8 bytes |
| Sine/cosine | 70 | Preferred | 256+ bytes |
| Multiplication | 60-80 | Preferred | Variable |
| Color table | 50-70 | Yes (color reg write) | 8-16 bytes |

**Important:** Detectors scan `unknown` and `inline_data` regions — never proven code (hard invariant). When multiple detectors propose overlapping candidates, ALL candidates are kept with their confidences — the AI pipeline makes the final determination. The static analysis layer presents evidence, not verdicts.

Data regions become blocks with `type: "data"` and a `candidates` array (see [Overlapping Candidates](#overlapping-candidates)). The `best_candidate` index points to the highest-confidence proposal for display purposes, but the AI sees all candidates.

Everything else → `type: "unknown"` — left for the AI pipeline's Pass 2 to classify.

### Sub-Splitting Large Blocks

Blocks exceeding `--threshold` instructions (default 120) are sub-split:

1. Find natural split points from the basic block graph:
   - Loop headers (back-edge targets)
   - Major branch convergence points
   - After long linear sequences
2. Split at these boundaries
3. Generate sibling metadata:
   ```
   {
     "id": "sub_C000__loop",
     "parent_block": "sub_C000",
     "sub_block_index": 1,
     "siblings": ["sub_C000__init", "sub_C000__handler", "sub_C000__cleanup"],
     "sibling_summaries": {
       "sub_C000__init": "Lines 1-25: LDA #$00 ... STA $D020"
     }
   }
   ```
4. Summaries are deterministic: "Lines N-M: first_instruction ... last_instruction"

### Symbol Application

Apply known symbols from a built-in database:

**KERNAL entry points:**
```typescript
const KERNAL_SYMBOLS: Record<number, { name: string; description: string; calling: string }> = {
  0xFFD2: { name: "CHROUT", description: "Print character in A", calling: "A=char" },
  0xFFE4: { name: "GETIN", description: "Get character from input", calling: "returns A" },
  0xFFE1: { name: "STOP", description: "Check STOP key", calling: "returns Z flag" },
  0xFFCF: { name: "CHRIN", description: "Get character from input channel", calling: "returns A" },
  0xFFC6: { name: "CHKOUT", description: "Open output channel", calling: "X=file number" },
  0xFFC0: { name: "OPEN", description: "Open logical file", calling: "uses $B8-$BA" },
  // ... ~40 more entries
};
```

**Hardware registers:**
```typescript
const HARDWARE_SYMBOLS: Record<number, { name: string; description: string }> = {
  0xD000: { name: "VIC_SPR0_X", description: "Sprite 0 X position" },
  0xD001: { name: "VIC_SPR0_Y", description: "Sprite 0 Y position" },
  // ... through all VIC-II, SID, CIA registers
  0xD020: { name: "VIC_BORDER_COLOR", description: "Border color" },
  0xD021: { name: "VIC_BG_COLOR0", description: "Background color 0" },
  0xD418: { name: "SID_FILTER_VOL", description: "SID filter mode and volume" },
  0xDC00: { name: "CIA1_PRA", description: "CIA1 data port A (keyboard/joystick)" },
  // ... ~80 more entries
};
```

**Common comparison values:**
```typescript
const COMPARISON_HINTS: Record<number, string> = {
  0x08: "8 sprites / 8 bits",
  0x28: "40 (screen width)",
  0x19: "25 (screen height)",
  0x0F: "color mask (0-15)",
  0x07: "bit position / direction",
  0x00: "null terminator / false",
  0xFF: "all bits set / true / -1",
  0x20: "space character (PETSCII)",
  0x0D: "return character",
  0x03: "STOP key PETSCII",
};
```

These are stored in `blocks.json` instruction annotations, giving the AI a head start in Pass 1.

### Output: blocks.json

The block builder assembles the full `blocks.json` output defined in [Output](#output). It:
1. Creates one block per subroutine/fragment/irq_handler (from code discovery)
2. Creates data blocks with candidates (from detector plugins)
3. Creates unknown blocks for all remaining loaded bytes
4. Runs the coverage validator (see [Address Coverage Tracking](#address-coverage-tracking))
5. Writes the final JSON with metadata, coverage summary, and blocks array

### Address Coverage Tracking

**Every byte in every loaded region must belong to exactly one block.** This is a hard invariant — violations are bugs.

```typescript
function validateCoverage(
  blocks: Block[],
  loadedRegions: LoadedRegion[]
): CoverageReport {
  // Build a byte-level ownership map
  const owner = new Uint32Array(65536);  // 0 = unowned
  let conflicts: CoverageConflict[] = [];
  let gaps: CoverageGap[] = [];

  for (const block of blocks) {
    // Code blocks may be non-contiguous — iterate basic_blocks spans
    // Data/unknown blocks are contiguous — use address..end_address
    const ranges: Array<{start: number, end: number}> = [];
    if (block.basic_blocks && block.basic_blocks.length > 0) {
      for (const bb of block.basic_blocks) {
        ranges.push({ start: bb.start, end: bb.end });
      }
    } else {
      ranges.push({ start: block.address, end: block.end_address });
    }

    const blockIndex = blocks.indexOf(block) + 1;
    for (const range of ranges) {
      for (let addr = range.start; addr < range.end; addr++) {
        if (owner[addr] !== 0) {
          conflicts.push({
            address: addr,
            block1: blocks[owner[addr] - 1].id,
            block2: block.id
          });
        }
        owner[addr] = blockIndex;
      }
    }
  }

  // Check every loaded byte is owned
  for (const region of loadedRegions) {
    for (let addr = region.start; addr < region.end; addr++) {
      if (owner[addr] === 0) {
        // Find contiguous gap
        let gapEnd = addr + 1;
        while (gapEnd < region.end && owner[gapEnd] === 0) gapEnd++;
        gaps.push({ start: addr, end: gapEnd });
        addr = gapEnd - 1;  // skip to end of gap
      }
    }
  }

  return {
    valid: gaps.length === 0 && conflicts.length === 0,
    gaps,       // must be empty
    conflicts,  // must be empty
    classified: {
      code: countBytes(blocks, ["subroutine", "irq_handler", "fragment"]),
      data: countBytes(blocks, ["data"]),
      unknown: countBytes(blocks, ["unknown"])
    }
  };
}
```

**How gaps are prevented:**

After assigning all code blocks and data blocks, the block builder scans for unowned bytes in loaded regions and creates `unknown` blocks to fill every gap:

```typescript
function fillGaps(blocks: Block[], loadedRegions: LoadedRegion[]): Block[] {
  // After code + data blocks are assigned, scan for gaps
  const owned = new Set<number>();
  for (const block of blocks) {
    for (let addr = block.address; addr < block.end_address; addr++) {
      owned.add(addr);
    }
  }

  const unknownBlocks: Block[] = [];
  for (const region of loadedRegions) {
    let gapStart: number | null = null;
    for (let addr = region.start; addr <= region.end; addr++) {
      const isGap = addr < region.end && !owned.has(addr);
      if (isGap && gapStart === null) {
        gapStart = addr;
      } else if (!isGap && gapStart !== null) {
        unknownBlocks.push({
          id: `unknown_${gapStart.toString(16).padStart(4, '0')}`,
          address: gapStart,
          end_address: addr,
          type: "unknown",
          reachability: "unreachable"
        });
        gapStart = null;
      }
    }
  }

  return [...blocks, ...unknownBlocks];
}
```

The coverage validator runs as the **final step** before writing `blocks.json`. If it finds gaps or conflicts, it throws — this is a bug in the block builder, not something to paper over.

**Coverage summary in output:**

```json
{
  "coverage": {
    "loaded_regions": [
      { "start": "0x0801", "end": "0xCFFF" }
    ],
    "classified": {
      "code": { "bytes": 18200, "pct": 68.4 },
      "data": { "bytes": 6400, "pct": 24.0 },
      "unknown": { "bytes": 2022, "pct": 7.6 }
    },
    "gaps": []
  }
}
```

This tells the user (and the AI pipeline) exactly how much of the binary has been classified and how much is still unknown. A high `unknown` percentage suggests the entry points may be incomplete or the binary may contain significant data sections.

---

## Known Symbols Database

### `symbol_db.ts`

Static database of known C64 addresses. NOT an analysis step — just a data module used by the block builder and by the AI pipeline's deterministic annotation pass.

**Sources:**
- Our Qdrant knowledge base (355+ chunks of C64/6502 documentation)
- The C64 memory map from our training data
- KERNAL ROM disassembly from our training data
- The MCP plan's `mapping-c64.txt` reference

**Contents:**
- ~40 KERNAL entry points with calling conventions
- ~80 VIC-II register addresses with read/write semantics
- ~28 SID register addresses
- ~16 CIA1 register addresses
- ~16 CIA2 register addresses
- ~30 zero page system variables ($00-$8F)
- Common BASIC ROM entry points
- Comparison value hints (screen width, sprite count, etc.)

---

## Error Handling & Edge Cases

### Invalid Input
- **Empty/too small PRG:** Error with message
- **Load address outside valid range:** Warning, proceed
- **No entry points found:** Error — user must provide `--entry`
- **Entry point outside loaded region:** Error with message

### Ambiguous Code/Data
- **Bytes that decode as valid instructions but are actually data:** This is expected and normal. The AI pipeline (Pass 2) handles reclassification. Static analysis is conservative — it only marks proven reachable code as "code_proven."
- **Overlapping candidates from speculative discovery:** Resolved by scoring. Higher-scoring candidate wins.
- **Circular dependencies in call graph:** Handled naturally by recursive descent's `visited` set.

### Platform Edge Cases
- **Bank switching:** Detected once during step 3 init scanning and applied globally (see [Banking Detection](#banking-detection)). Programs that switch banking mid-execution use the init-time value; the AI pipeline handles dynamic banking in Pass 2.
- **Interrupt-driven code:** IRQ handlers may share zero page with main code. The block builder doesn't resolve this — the AI pipeline's variable naming (Pass 3) handles scoped naming.
- **Cartridge code:** Load addresses outside $0801-$CFFF might indicate cartridge ROM. Supported via explicit `--load-address`.

---

## Testing Strategy

### Unit Tests
- Opcode decoder: decode every valid opcode, verify mnemonic/mode/length/flowType
- Opcode decoder: undocumented opcodes return correct info
- Opcode decoder: invalid/JAM opcodes handled gracefully
- Entry point detector: parse known BASIC stubs
- Entry point detector: detect IRQ/NMI handler installation patterns
- Recursive descent: simple linear program
- Recursive descent: program with branches
- Recursive descent: program with subroutines (JSR/RTS)
- Recursive descent: program with indirect jump (terminates path)
- Speculative discovery: data between two code blocks
- Speculative discovery: overlap resolution
- Xref builder: track reads, writes, calls, jumps
- Xref builder: detect pointer patterns
- Block builder: assemble subroutines into blocks
- Block builder: detect and classify data regions
- Block builder: sub-split large blocks

### Integration Tests
- Load a known `.prg` (from our examples/), run full pipeline, verify blocks.json
- Compare our subroutine boundaries against Regenerator's output for the same binary
- Verify all KERNAL calls are correctly identified
- Verify all hardware register accesses are correctly identified

### Test Fixtures
Use small C64 programs from our `examples/` directory as test inputs. These are simple enough to manually verify the expected output.

---

## File Structure

```
src/
  static-analysis/
    index.ts                  # CLI entry point, orchestrates steps 1-6
    binary_loader.ts          # Step 1: Calls input_parsers/index.ts, auto-detect, load
    input_parsers/
      types.ts                # InputParser interface, ParsedRegion, etc.
      index.ts                # Auto-discovers *_parser.ts files in this directory
      prg_parser.ts           # .prg binary format (2-byte header + data)
      sid_parser.ts           # PSID/RSID .sid format (header + payload)
      regenerator_parser.ts   # Regenerator .asm disassembly output
      vice_parser.ts          # VICE monitor memory dump format
      c64_debugger_parser.ts  # C64 Debugger disassembly format
      generic_parser.ts       # Generic/fallback .asm parser (priority 99)
    data_detectors/
      types.ts                # DataDetector interface, DataCandidate, etc.
      index.ts                # Auto-discovers *_detector.ts files in this directory
      sprite_detector.ts      # Sprite data (63/64-byte blocks via pointer tracing, mono/multi via $D01C)
      charset_detector.ts     # Character sets (1024/2048 bytes via $D018 tracing, alignment validated)
      screen_map_detector.ts  # Screen maps (1000 bytes via $D018 tracing)
      bitmap_detector.ts      # Bitmap data (8000 bytes via $D011/$D018)
      string_detector.ts      # Strings (PETSCII null/highbit/shifted/length, screen codes)
      sid_music_detector.ts   # SID music (12 frequency table formats, SIDId signatures)
      jump_table_detector.ts  # Jump/RTS dispatch tables (lo/hi byte pairs)
      lookup_table_detector.ts # Lookup tables (screen offsets, bit masks, sine, etc.)
      basic_detector.ts       # BASIC program data (tokenized line-link chains)
      padding_detector.ts     # Padding/fill regions (zero fill, NOP sleds, garbage)
      compressed_detector.ts  # Compressed/encrypted data (entropy analysis, packer signatures, RLE)
    opcode_decoder.ts         # Step 2: Opcode table + decode function
    opcode_table.ts           # Static 256-entry opcode data
    entry_point_detector.ts   # Step 3: Find entry points
    code_discovery.ts         # Step 4: Recursive descent + speculative
    xref_builder.ts           # Step 5: Cross-reference database
    block_builder.ts          # Step 6: Assemble blocks.json
    symbol_db.ts              # Known C64 symbols (KERNAL, hardware, ZP)
    types.ts                  # Shared TypeScript interfaces
```

---

## Known Limitations / Future Improvements

Items acknowledged during review but deferred beyond initial implementation. Ordered by likely impact.

### Detector Plugin Context

Detectors currently receive raw bytes + address ranges. A richer `AnalysisContext` interface would give plugins access to the xref database, byte classification map, banking state, and other detectors' results. This enables detectors that reason about cross-references (e.g. "this table is only indexed by sprite routines") rather than pure byte-pattern matching.

**When needed:** When writing detectors that require relational reasoning, not just byte heuristics.

### Speculative Discovery Performance

The current approach tries candidate start points sequentially. For very large binaries with many unknown regions, this could become slow. Potential optimisations:
- Skip candidates that fall within already-classified regions (currently done, but could use interval tree)
- Batch-evaluate candidates by scoring their first N instructions before full decode
- Parallelise independent candidate evaluations

**When needed:** If analysis of 64KB+ binaries takes more than a few seconds. Unlikely to matter for typical C64 programs.

### Stack Page as Data

The 6502 stack lives at $0100-$01FF. Some C64 programs repurpose parts of the stack page as lookup tables or scratch space (especially $0100-$013F when stack depth is shallow). The current analyser treats the entire stack page as system memory. A future enhancement could detect writes to the stack page outside of PHA/JSR patterns and flag those regions as potential data.

**When needed:** When encountering programs that use stack page for tables (uncommon but exists in size-optimised demos).

### VIC Bank Changes at Runtime

Banking detection currently captures the state set during init and applies it globally. Programs that switch VIC banks mid-frame (e.g. split-screen effects with different charsets per region) will have incorrect bank assumptions for the non-init regions. Detecting these requires tracing $DD00 writes inside IRQ handlers or main loops.

**When needed:** When analysing demos or games with split-screen effects using different VIC banks per screen region.

### Screen Base Dependency Chain

The screen map detector traces $D018 to find the screen base address, but the full dependency chain ($DD00 VIC bank → $D018 screen offset → screen base) could be documented more explicitly as a worked example, helping contributors understand the multi-register tracing pattern.

### User Directives / Overrides

No mechanism exists for users to manually override analysis decisions (e.g. "address $C000-$C0FF is definitely a lookup table" or "force entry point at $B000"). The MCP tools plan covers interactive overrides, but the standalone static analyser should accept a directives file for batch use:

```json
{
  "force_entry_points": ["0xB000"],
  "force_data": [{"start": "0xC000", "end": "0xC0FF", "type": "lookup_table"}],
  "force_code": [{"start": "0xA000", "end": "0xA0FF"}],
  "ignore_regions": [{"start": "0x8000", "end": "0x9FFF", "reason": "cartridge ROM"}]
}
```

**When needed:** When automated analysis makes persistent errors that users need to correct without modifying analyser code.

### IRQ Handler Chaining

Pattern F (default IRQ restoration) detects simple cases like `LDA #<$EA31 / STA $0314`. More complex chaining patterns exist: saving/restoring previous handler addresses, conditional chaining based on raster line, and multi-stage IRQ chains (handler A installs handler B on exit). Full chaining analysis would require tracking $0314/$0315 writes across all IRQ handlers.

**When needed:** When analysing programs with complex multi-stage raster IRQ chains (common in demos, rare in games).

---

## References

- [6502bench SourceGen analysis docs](https://6502bench.com/sgmanual/analysis.html) — primary algorithm reference
- [Spedi (Speculative Disassembly)](https://github.com/abenkhadra/spedi) — inspires Phase 2 speculative discovery
- [masswerk.at 6502 instruction set](https://www.masswerk.at/6502/6502_instruction_set.html) — complete opcode reference
- [NESdev undocumented opcodes](https://www.nesdev.org/wiki/CPU_unofficial_opcodes) — unofficial opcode details
- [Capstone MOS65XX source](https://github.com/capstone-engine/capstone/blob/next/arch/MOS65XX/MOS65XXDisassembler.c) — reference implementation (lookup table approach, ~571 lines C). We build our own to avoid the dependency and add `flowType` classification.
- [JC64dis](https://github.com/ice00/jc64) — Java C64 disassembler with extensive C64-specific heuristics. Informed: granular xref types (branch vs jump, modify, bit_test), SID frequency table layout variants (12 formats in `SidFreq.java` with ±6 error tolerance), SIDId player signature database (`SidId.java` — pattern matching with wildcards, 100+ known players), mono/multi sprite differentiation via `$D01C`, BASIC tokenization/detokenization (8 dialect variants), lo/hi byte relationship tracking, PSID file format support, relocation detection, garbage region detection (`isGarbage` flag for invalid opcode clusters), SIDLN-style memory access flags (execute/read/write/sample)
- [HVSC SIDId database](https://www.hvsc.c64.org/) — High Voltage SID Collection. Canonical source for SID player identification signatures used by our SID music detector's Strategy 3
