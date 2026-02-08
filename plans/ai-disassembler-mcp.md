# C64 AI Disassembler MCP - Full Architecture & Plan

## Vision

An MCP server that takes **partially-disassembled ASM text** (from tools like Regenerator, VICE monitor dumps, or other disassemblers) and produces well-structured, commented, multi-file KickAssembler source code -- using static analysis scripts for the deterministic work and AI (with Qdrant domain knowledge) for the semantic work (naming, commenting, classification, file splitting).

The output must reassemble byte-for-byte identically to the original binary.

### Input Format

The input is NOT raw `.prg` binary. It is a text-based disassembly dump, typically partially annotated, in this format:

```
ADDR  BYTES        MNEMONIC  OPERAND
7030  20 99 70     jsr       derive_offensive_score
7033  CE 3B BF     dec       idx__selected_piece_destination_col
7036  AD 3B BF     lda       idx__selected_piece_destination_col
7039  30 05        bmi       W7040
703B  CD 2C BD     cmp       WBD2C
703E  B0 B8        bcs       W6FF8
W7040:
7040  60           rts

get_score_flying_piece:
7041  29 0F        and       #$0F
7043  8D 2F BF     sta       private.data__derived_score_adj
```

Key characteristics of the input:
- **Addresses**: 4-digit hex at start of each instruction line
- **Raw bytes**: Hex bytes after address (used for verification)
- **Mnemonics**: Already decoded 6502 instructions (lowercase)
- **Operands**: Mix of named symbols and raw addresses
- **Labels**: Some meaningful (`get_score_flying_piece`), some auto-generated (`W7040`, `WBD2C`)
- **Namespaces**: Some inputs may use dot-notation (`private.data__derived_score_adj`)
- **Data blocks**: May appear as `.byte` directives or hex dumps
- **Partially annotated**: The disassembly is at varying levels of completeness

This means many "hard disassembly problems" (opcode decoding, code/data separation) are already solved by the upstream tool. Our focus is:
1. **Parsing** the dump format into a structured representation
2. **AI-powered semantic analysis** (naming, commenting, understanding purpose)
3. **Conversion** to clean KickAssembler source
4. **Restructuring** into logical multi-file projects
5. **Verification** that output assembles to identical bytes

### Alternative Input: Raw Memory Dump

For cases where no prior disassembly exists, the MCP also supports raw binary input (`.prg` files or memory dumps). In this mode, **Capstone** (`CS_ARCH_MOS65XX`) handles the initial disassembly pass, producing the same intermediate representation as the ASM text parser. This gives us two entry paths into the same pipeline:

```
Raw .prg / memory dump  ──> Capstone disassembler ──┐
                                                     ├──> Internal representation ──> AI analysis ──> KickAssembler output
Partially-disassembled ASM ──> ASM text parser ──────┘
```

### Input Name Trust Policy

**IMPORTANT**: Existing names in the input are treated as **hints only, not truth**. The input may contain:
- Incorrect names (human guesses that turned out wrong)
- Temporary/placeholder names
- Auto-generated names from tools (e.g., `W7040`, `sub_C000`)
- Names from a previous incomplete analysis pass

The AI must independently evaluate whether each existing name matches the code's actual behaviour. If a name appears wrong, the AI should propose a correction and flag the discrepancy. Existing names receive a starting confidence boost (they're evidence, not gospel) but are always verified.

---

## Gaps Identified in Original Requirements

Your 8 requirements are solid. Here are **12 additional gaps** that need addressing for this to actually work:

### Gap 1: Code vs Data Separation
**The #1 fundamental problem in disassembly.** A binary has no metadata -- you must determine what bytes are executable code vs sprite data, character sets, music data, lookup tables, or text strings. Disassembling data bytes as instructions produces garbage, and that garbage cascades (wrong instruction lengths shift everything). This needs a hybrid approach: recursive descent from known entry points (marks reachable code) + heuristic classification of unreachable regions.

### Gap 2: Entry Point Detection
Must find ALL code entry points, not just the load address:
- BASIC stub (`SYS xxxx`) start address
- IRQ handlers (writes to `$0314/$0315` or `$FFFE/$FFFF`)
- NMI handlers (`$0318/$0319` or `$FFFA/$FFFB`)
- BRK vector (`$0316/$0317`)
- Addresses stored in jump tables
- Addresses loaded via `LDA #<addr / STA $0314 / LDA #>addr / STA $0315` patterns

### Gap 3: Self-Modifying Code (SMC)
Extremely common on C64. Example:
```
        LDA #$00        // <-- the $00 gets modified at runtime
modify: STA $0400
        ...
        LDA some_value
        STA modify+1    // <-- this modifies the operand of the STA above
```
Static analysis must detect `STA instruction_addr+1` patterns and annotate them. Without this, the AI will misinterpret operands.

### Gap 4: Indirect Jumps / Computed Branches
`JMP ($xxxx)` and the RTS trick (`push addr-1 then RTS`) make control flow analysis incomplete. Jump tables are used extensively in C64 code. These create "unknown edges" in the control flow graph that must be flagged for human review.

### Gap 5: Bank Switching
C64 has ROM/RAM/IO banking via address `$0001`. Code might bank out:
- BASIC ROM (`$A000-$BFFF`) to use RAM underneath
- KERNAL ROM (`$E000-$FFFF`) for more RAM
- I/O area (`$D000-$DFFF`) to access RAM under VIC/SID/CIA

Same address means different things depending on bank config. Need to track writes to `$0001`.

### Gap 6: Data Format Recognition
Need pattern detectors for specific C64 data formats:
- **Sprite data**: 63 bytes of pixel data + 1 padding byte per sprite
- **Character sets**: 2048 bytes (8 bytes per character x 256 characters)
- **Text strings**: PETSCII-encoded, often terminated by `$00` or high-bit-set
- **Screen maps**: 1000 bytes (40x25) referenced near `$0400`
- **Color maps**: 1000 bytes referenced near `$D800`
- **Lookup tables**: Sequential values, sine/cosine wave patterns
- **SID music data**: Player routine + song data (GoatTracker, SID-Wizard formats)
- **Bitmap data**: 8000 bytes for hi-res, 8000+1000 for multicolor

### Gap 7: Cross-Reference Database
Every address reference needs tracking: who reads it, who writes it, who jumps to it, who calls it (JSR). This is the backbone of ALL subsequent analysis -- variable naming, subroutine identification, data classification all depend on complete xrefs.

### Gap 8: BASIC Stub Detection
Most PRGs start with a BASIC stub (`10 SYS 2064`). Need to detect this and emit it as `BasicUpstart2(entryPoint)` in KickAssembler, not as raw bytes.

### Gap 9: Undocumented ("Illegal") Opcodes
Some C64 software uses undocumented 6502 opcodes: `LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`, `ANE`, `SHA`, `SHY`, `SHX`, `LAS`, `SBX`, `NOP` variants, `JAM/KIL`. The disassembler must handle all 256 opcode bytes.

### Gap 10: Timing-Critical Code & NOPs
C64 demo/game effects depend on exact cycle counting. NOPs used for raster timing alignment should be annotated as timing NOPs, not dead code. Tight loops near raster interrupt handlers should show cycle counts.

### Gap 11: KERNAL Call Semantics
When code does `JSR $FFD2`, we need more than just the label `CHROUT` -- we need the calling convention (A = character to print, returns carry flag). This context is critical for the AI to name the preceding `LDA` instruction's operand correctly (it's a "character to print", not just a random value).

### Gap 12: Output Verification
The disassembled source MUST reassemble to the exact same binary. This is the ultimate correctness check and should be a first-class tool, not an afterthought. Run KickAssembler on output, compare bytes, report any differences with addresses.

---

## Architecture

### System Diagram

```
+------------------------------------------------------------------+
|                        Claude Code                                |
|                                                                   |
|  /disasm-dump  /disasm-convert  /disasm-analyze  /disasm-refine   |
|  /disasm-emit  /disasm-verify   /disasm-document /disasm-entry   |
|  (Skills / Slash Commands)                                        |
+--------+-----------+----------------+-----------+-----------------+
         |           |                |           |
         v           v                v           v
+------------------+  +-------------+  +---------+  +-------------+
| c64-disasm MCP   |  | qdrant MCP  |  | zen MCP |  | kickass-lsp |
| (NEW - Python)   |  | (existing)  |  |(existing)|  | (FUTURE)    |
|                  |  +------+------+  +---------+  +-------------+
|  Layer 1: Static |         |
|   Analysis       |         |
|                  |  +------v------+
|  Layer 2: AI     +->| Qdrant DB   |
|   Analysis       |  | (355+ docs) |
|                  |  +-------------+
|  Layer 3: Output |
|   Generator      |  +-------------+
|                  +->| KickAssembler|
|  Layer 4: Project|  | (verify)    |
|   State          |  +-------------+
+------------------+
```

### Layer 1: Static Analysis Engine (Deterministic Python)

All non-AI work. This is the foundation everything else builds on. **The principle: offload everything deterministic to scripts so AI doesn't have to think about it.** AI should only handle semantic/creative decisions (naming, commenting, classification) -- never mechanics.

#### `asm_parser.py` -- Pluggable ASM Text Parser (PRIMARY INPUT PATH)

Uses a **pluggable parser architecture** with a common interface and format-specific backends. Each backend registers the formats it handles. The main parser auto-detects the format and delegates to the appropriate backend.

```python
class ParserBackend(ABC):
    """Interface all format-specific parsers implement."""
    @abstractmethod
    def name(self) -> str: ...
    @abstractmethod
    def can_parse(self, sample_lines: list[str]) -> float: ...  # 0.0-1.0 confidence
    @abstractmethod
    def parse_line(self, line: str) -> ParsedLine: ...

class ParsedLine:
    """Common output format from all parsers."""
    address: int | None        # Hex address (e.g., 0x7030)
    raw_bytes: bytes | None    # Original bytes for verification
    mnemonic: str | None       # e.g., "jsr", "lda"
    operand: str | None        # e.g., "$D000,X", "#$FF"
    label: str | None          # Existing label (treated as hint)
    comment: str | None        # Existing comment
    is_data: bool              # True for .byte/.word directives
    data_bytes: bytes | None   # Raw data bytes if is_data
```

**Registered backends:**

| Backend | Format | Detection Pattern |
|---------|--------|------------------|
| `regenerator.py` | Regenerator output | Hex addr + bytes + mnemonic columns, `W` prefix auto-labels |
| `vice_monitor.py` | VICE monitor dump | `.C:xxxx` prefix format |
| `c64_debugger.py` | C64 Debugger export | Similar to VICE but different column layout |
| `kickass_listing.py` | KickAssembler listing file | Already-assembled KickAss output |
| `generic.py` | Generic/manual dumps | Fallback: flexible regex, handles most formats |

**Auto-detection**: Feed first 20 lines to each backend's `can_parse()`. Use the backend with highest confidence. If ambiguous, ask user.

**Common output**: All backends produce `ParsedLine` objects. Downstream code (xref_db, control_flow, etc.) never sees format-specific details.

#### `binary_loader.py` -- PRG File Handling (ALTERNATIVE INPUT PATH)
- Parse `.prg` format (first 2 bytes = load address, little-endian)
- Build 64KB memory image with loaded regions marked
- Multi-part PRG support
- Packer signature detection (Exomizer, ByteBoozer, PuCrunch, Level Crusher)

#### `entry_point.py` -- Entry Point Detection
- **BASIC stub parser**: Find `SYS xxxx` in BASIC program area, extract target address
- **Vector scanner**: Detect IRQ/NMI handler setup patterns:
  - `LDA #<addr / STA $0314 / LDA #>addr / STA $0315` (IRQ via KERNAL)
  - `LDA #<addr / STA $FFFE / LDA #>addr / STA $FFFF` (IRQ direct)
  - Same patterns for NMI (`$0318/$0319`, `$FFFA/$FFFB`) and BRK (`$0316/$0317`)
- **Init signature detection**: Common patterns like `SEI` / `LDA #$35` / `STA $01`
- **Jump table extractor**: Find tables of 16-bit addresses used with `JMP ($xxxx)` or RTS trick
- Returns candidate entry points with confidence levels, **always asks user to confirm**
- Outputs structured list: `[{address, type: "basic_sys"|"irq"|"nmi"|"init"|"jump_table", confidence}]`

#### `opcode_table.py` -- Complete 6502 Opcode Database
- All 256 opcodes (151 official + 105 undocumented)
- For each: mnemonic, addressing mode, byte count, cycle count, flags affected
- Addressing mode decoder (immediate, absolute, zero page, indexed, indirect, relative)

#### `disasm_engine.py` -- Core Disassembler (for binary input path)
- **Linear sweep**: Decode every byte sequentially (full coverage, but misidentifies data)
- **Recursive descent**: Follow control flow from entry points (accurate, but incomplete coverage)
- **Hybrid approach**: Recursive descent first, then linear sweep for unvisited regions marked as "uncertain"
- Instruction boundary map (which bytes are opcode vs operand)
- Uses Capstone (`CS_ARCH_MOS65XX`) for initial instruction decode

#### `xref_db.py` -- Cross-Reference Database
The backbone of all analysis. Every address gets a comprehensive usage profile.
- For every address in the binary:
  - `read_by`: list of addresses that read this location (`LDA`, `LDX`, `LDY`, `CMP`, `BIT`, etc.)
  - `written_by`: list of addresses that write this location (`STA`, `STX`, `STY`, `INC`, `DEC`, etc.)
  - `jumped_to_by`: list of JMP/branch instructions targeting this
  - `called_by`: list of JSR instructions targeting this
  - `data_ref_by`: list of instructions that reference this as a data address
  - `modified_by_smc`: list of SMC writes that alter this instruction's operand
- Indirect reference tracking (`JMP ($xxxx)` -- target unknown, flagged)
- Hardware register references (any access to `$D000-$DFFF` range)
- **Usage summary per address**: is it read-before-write (parameter)? Write-then-read (local)? Cross-subroutine (global)?
- **Comparison value tracking**: when address is compared (`CMP #$xx`), record the comparison value (helps AI infer meaning: `CMP #$08` = sprite count, `CMP #$28` = screen width, `AND #$0F` = color mask)

#### `control_flow.py` -- Control Flow Analysis
- Build Control Flow Graph (CFG) from recursive descent results
- **Subroutine detection**: JSR targets = function starts, RTS/RTI = function ends
- **Basic block identification**: Straight-line code between branches
- **Loop detection**: Back-edges in CFG via depth-first search
- **Raster IRQ chain detection**: Pattern match `STA $D012` + handler setup
- **Dead code detection**: Code unreachable from any entry point
- **Call graph**: Which subroutines call which others

#### `game_loop_detector.py` -- Game Loop & Program Structure Detection
High-level program structure analysis. Critical for bank switching context, file splitting, and understanding program flow.
- **Main loop detection**: Find `JMP` back to start of same routine, or `JSR chain + JMP` patterns
- **Game state machine**: Detect state variable checked at top of main loop (`LDA game_state / CMP #xx / BEQ handler`)
- **Update/draw/wait cycle**: Detect common game tick pattern (update logic, draw to screen, wait for VBlank)
- **Raster interrupt chains**: Follow `STA $D012` + handler setup to map the full raster chain
- **Bank switching context**: Track `STA $0001` writes and associate with surrounding code scope. If a bank switch occurs in a detected loop, all code in that loop uses the switched bank configuration
- Outputs: `[{type: "main_loop"|"game_state"|"irq_chain"|"bank_switch_scope", addresses, subroutines_involved}]`

#### `data_classifier.py` -- Code/Data Separation & Format Detection
Uses xref_db to confirm data classifications (two-pass: mark candidates, then confirm via usage).
- Primary: Everything reachable via recursive descent = code, everything else = candidate data
- **Two-pass confirmation**: Mark regions as "probably data" (MEDIUM confidence), then promote to HIGH when xref analysis confirms usage (e.g., address is pointed to by `$D018` write = charset)
- Sprite detector: 63+1 byte aligned blocks, referenced by sprite pointer math
- Charset detector: 2048-byte blocks, referenced by `$D018` writes
- String detector: PETSCII range byte sequences, null-terminated or length-prefixed
- Lookup table detector: Sequential/periodic values (sine tables have characteristic shape)
- Screen/color map detector: 1000-byte blocks, cross-referenced with `$0400`/`$D800` usage
- Music data detector: Known SID player signatures + data blocks
- Bitmap detector: 8000-byte blocks, `$D011`/`$D016` multicolor flag nearby
- Heuristic: Runs of `$00`/`$FF`/`$AA` = padding/fill, not code

#### `smc_analyzer.py` -- Self-Modifying Code Detection
- Pattern: `STA label+1` where `label` is an instruction address -- marks operand as runtime-modified
- Pattern: `LDA table,X / STA jump+1 / LDA table+1,X / STA jump+2` -- computed jump
- Pattern: `INC instruction+1` -- incrementing an operand (common for address scanning)
- Annotates SMC targets with source location and modification type
- Feeds into xref_db (`modified_by_smc` field)

#### `bank_tracker.py` -- Bank Configuration Tracking
- Track all writes to `$0001` (processor port / memory configuration)
- Map which bank config is active at each point in the code
- Integrate with game_loop_detector: if a bank switch happens inside a game loop, all code within that loop iteration uses the switched config
- Flag addresses where `$D000-$DFFF` might be RAM instead of I/O
- Flag addresses where `$A000-$BFFF` or `$E000-$FFFF` might be RAM instead of ROM

#### `symbol_db.py` -- Known Symbol Database
- **Hardware registers** parsed from mapping-c64.txt:
  - VIC-II: `$D000`-`$D02E` (sprite positions, scroll, colors, interrupts)
  - SID: `$D400`-`$D41C` (voice freq, pulse, waveform, envelope, filter)
  - CIA1: `$DC00`-`$DC0F` (keyboard, joystick, timer)
  - CIA2: `$DD00`-`$DD0F` (serial, VIC bank, NMI)
  - Processor port: `$0000`-`$0001`
- **KERNAL entry points** with calling conventions:
  - `$FFD2` CHROUT (A=char), `$FFE4` GETIN (returns A), `$FFE1` STOP, etc.
- **BASIC ROM entry points**
- **Zero page system variables**: `$01` processor port, `$2B-$2C` BASIC start, etc.
- **Auto-generated labels**: `sub_C000`, `loop_C010`, `data_E000`, `irq_handler_1`
- **User overrides**: Custom names from project state file

#### `naming.py` -- Naming Convention Engine
Deterministic naming rules so AI doesn't have to remember conventions. AI provides the semantic meaning; this script applies the correct prefix/suffix format.
- **Input**: semantic description from AI (e.g., `{type: "index", purpose: "sprite loop counter", scope: "local"}`)
- **Output**: correctly formatted name (e.g., `idx__sprite`)
- Enforces all prefix rules (`data__`, `flag__`, `ptr__`, `vec__`, `idx__`, `cnt__`, `temp__`, `tbl__`, `buf__`, `txt__`, `snd__`, `param__`)
- Enforces all suffix rules (`_list`, `_lo`/`_hi`, `_fn`, `_ctl`, `_curr`, `_prev`, `_max`/`_min`, `_mask`, `_offset`)
- Enforces subroutine verb-first convention (`init_`, `update_`, `draw_`, `calc_`, etc.)
- Validates names against conventions, reports violations
- Deduplication: ensures no name collisions within scope

#### `memory_map.py` -- Memory Region Tracking
- Region list: `[{start, end, type: code|data|unknown, subtype, label, confidence}]`
- Bank configuration tracking (integrates with `bank_tracker.py`)
- Segment boundaries for `*=` directive generation
- Gap detection (unloaded address ranges)

#### `project.py` -- Project State Management
- JSON project file persisting all analysis state
- Memory regions with types, labels, notes, confidence levels
- Custom symbol names (user overrides)
- Analysis pass history
- Supports iterative refinement: load project, modify, re-analyze, save

---

### Layer 2: AI Analysis Engine (LLM-Powered via MCP Tools)

These tools provide structured data to Claude and receive semantic analysis back.

#### Tool: `disasm_ai_analyze_subroutine(address)`
**Input to AI:**
- Disassembled instructions for the subroutine
- All cross-references (who calls it, what it calls)
- Known symbol names for any hardware registers referenced
- Qdrant search results for relevant hardware/technique documentation
- Loop structure (from CFG analysis)
- Register usage summary (which registers are read/written)

**AI produces:**
- Subroutine name (e.g., `init_sprites`, `scroll_text`, `read_joystick`)
- Block comment explaining purpose and algorithm
- Category tag: `init`, `main_loop`, `graphics`, `sound`, `input`, `ai`, `math`, `irq`
- Inline comments for non-obvious instructions

#### Tool: `disasm_ai_name_variable(address, scope_subroutine)`
**Input to AI:**
- The memory address
- All xrefs WITHIN the scope subroutine only (not global -- address reuse!)
- Context: Is it read-before-write (parameter)? Write-then-read (local)? Shared across subs (global)?
- If zero page: likely a frequently-used working variable
- If hardware register: use standard name from symbol_db
- Comparison values (e.g., `CMP #$08` suggests "count of 8 things" -- 8 sprites?)

**AI produces:**
- Variable name (e.g., `idx__sprite`, `data__scroll_position`, `cnt__frame`)
- Brief description
- Scope qualifier (local/parameter/global)

#### Tool: `disasm_ai_classify_data(start, end)`
**Input to AI:**
- Raw bytes of the data region
- Surrounding code context (what instructions reference this data?)
- Size and alignment characteristics
- Qdrant results for relevant data format documentation

**AI produces:**
- Data type classification (sprite, charset, music, text, lookup table, etc.)
- Appropriate KickAssembler directive (.byte, .word, .text, .fill with expression)
- Label name and comment
- For lookup tables: detection of mathematical pattern (sine, linear ramp, etc.) for `.fill` expression

#### Tool: `disasm_ai_suggest_kickass(code_block)`
**Input to AI:**
- A block of repetitive or patterned code/data
- The raw bytes it must produce

**AI produces:**
- KickAssembler construct (`.for`, `.macro`, `.fill` with expression) that generates identical bytes
- Verification note (assembles to same output)

#### Tool: `disasm_ai_split_files(analysis_results)`
**Input to AI:**
- Complete subroutine list with categories and call graph
- Data block list with types
- Memory layout

**AI produces:**
- File grouping: which subroutines/data go in which file
- File names (e.g., `init.asm`, `main_loop.asm`, `sprites.asm`, `sound.asm`, `data.asm`)
- `#import` dependency order
- Main entry file structure

---

### Layer 3: Output Generator

#### `kickass_emitter.py` -- KickAssembler Source Generation

**Reference Project**: The output standard is modelled on the [Archon C64 Reverse Engineering](https://github.com/mark-akturatech/archon-c64) project. The MCP must produce output at this level of quality and consistency.

**Project Structure (per-game output):**
```
game_name/
  main.asm              -- Entry point, segment definitions, memory map, imports
  src/
    io.asm              -- Standard C64 symbols (from Mapping the C64)
    const.asm           -- Game-specific constants
    resources.asm       -- Binary assets (sprites, charsets, music, text strings)
    <module>.asm         -- One file per logical module (ai, intro, game, sound, etc.)
  assets/
    <binary_assets>      -- Extracted binary data (charset .bin, sprite .bin)
  unprocessed/
    original_dump.asm   -- Original input dump (preserved for reference)
    <region>.asm        -- Unprocessed code, split by memory region (e.g., $8000-$8FFF.asm)
  docs/
    INTERESTING.md       -- Discovered insights, modifiable addresses, game mechanics
    How it works.md      -- High-level architecture documentation
  TERMINOLOGY.md         -- Glossary of domain-specific terms
  README.md              -- Project documentation, conventions, tools used
```

The `unprocessed/` directory holds code not yet fully analysed. As subroutines and data blocks are understood, they migrate from `unprocessed/` into `src/` module files. This gives a clear picture of reverse engineering progress.

**KickAssembler Conventions:**
- `.filenamespace <module>` at top of each file
- `.namespace private { }` for file-internal symbols
- KickAssembler segments for memory layout:
  - `.segmentdef Main`, `.segmentdef Game`, `.segmentdef Common`, `.segmentdef Intro`, etc.
  - `.segmentdef Assets` for constant data stored in the file
  - `.segmentdef Data` for persistent runtime data
  - `.segmentdef Variables [virtual]` for per-game variables (cleared on reset)
- `#importonce` in all included files
- `.const` for ALL constants (ALL_CAPS naming)
- `BasicUpstart2(entry)` for BASIC stub
- `.file [name="main.prg", segments="..."]` for output configuration
- `*= $xxxx` for relocated/non-contiguous segments

**Variable Naming Convention (evolved from Archon standard, standardised for AI consistency):**

| Prefix | Meaning | Example |
|--------|---------|---------|
| `data__` | Calculated/derived data stored for later use | `data__curr_player_color` |
| `flag__` | Conditional flags (boolean or multi-state) | `flag__is_light_turn` |
| `ptr__` | Pointer to memory address (data target) | `ptr__screen_memory_lo` |
| `vec__` | Interrupt vector or jump table entry (code target) | `vec__irq_handler` |
| `idx__` | Index into an array/memory block | `idx__selected_piece_square_offset` |
| `cnt__` | Loop counter (0 to N, not used as array index) | `cnt__active_ai_pieces` |
| `temp__` | Temporary storage (not used outside current routine) | `temp__sprite_x` |
| `tbl__` | Lookup table (read-only reference data: sine, multiply, row addresses) | `tbl__screen_row_addr_lo` |
| `buf__` | Multi-byte scratch/buffer area | `buf__sort_workspace` |
| `txt__` | Pointer to text string | `txt__game_title` |
| `snd__` | Pointer to sound pattern data | `snd__effect_walk_large` |
| `param__` | Subroutine input parameter | `param__icon_offset_list` |

| Suffix | Meaning | Example |
|--------|---------|---------|
| `_list` | Two or more related items (array) | `data__player_icon_color_list` |
| `_lo` / `_hi` | Low/high byte of 16-bit value (essential for 6502) | `ptr__sprite_data_lo`, `ptr__sprite_data_hi` |
| `_fn` | Pointer to a function/routine | `ptr__raster_interrupt_fn` |
| `_ctl` | Control flag with multiple states | `data__ai_player_ctl` |
| `_curr` | Current value in a loop/calculation | `data__curr_player_color` |
| `_prev` | Previous value (for change detection) | `data__prev_joystick_state` |
| `_max` / `_min` | Boundary/limit values | `data__score_max` |
| `_mask` | Bitmask value | `data__sprite_enable_mask` |
| `_offset` | Offset from a base address | `idx__board_row_offset` |

**Subroutine Naming Convention:**

Routines use **verb-first snake_case** to clearly indicate their purpose:

| Verb Prefix | Usage | Example |
|-------------|-------|---------|
| `init_` | One-time setup | `init_sprites`, `init_sid` |
| `update_` | Per-frame/per-tick state update | `update_score_display`, `update_sprite_positions` |
| `draw_` / `render_` | Visual output to screen/bitmap | `draw_board`, `render_status_bar` |
| `calc_` / `compute_` | Pure computation, no side effects | `calc_move_score`, `compute_distance` |
| `check_` / `is_` | Boolean test (returns carry or zero flag) | `check_collision`, `is_game_over` |
| `read_` / `get_` | Input or data retrieval | `read_joystick`, `get_piece_at_square` |
| `set_` / `store_` | Write data to memory or hardware | `set_sprite_color`, `store_high_score` |
| `handle_` | Event/interrupt handler | `handle_irq_raster`, `handle_nmi` |
| `play_` | Sound/music playback | `play_sound_effect`, `play_music` |
| `wait_` | Timing/delay | `wait_vblank`, `wait_raster_line` |
| `copy_` / `move_` | Memory transfer | `copy_charset`, `move_sprite_block` |
| `clear_` | Zero/reset memory or state | `clear_screen`, `clear_sprite_area` |

For routines that don't fit a verb pattern (e.g., main loop, entry points), use a descriptive noun: `main_loop`, `game_loop`, `title_screen`.

**Code Label Conventions:**
- Subroutine labels: verb-first snake_case (see table above)
- Multi-labels for internal flow use a **standard set** (no ad-hoc names):

| Multi-label | Usage |
|-------------|-------|
| `!loop` | Loop back target |
| `!next` | Skip to next iteration / next item |
| `!skip` | Skip a conditional block |
| `!done` | End of routine logic (before cleanup/return) |
| `!return` | Immediately before RTS |
| `!else` | Alternative branch in if/else pattern |
| `!found` / `!not_found` | Search result branches |

- Multi-labels use `+` for forward references only (`!skip+`), never `++` or beyond
- Internal labels use multi-label syntax (not global labels)
- Constants: ALL_CAPS with underscores (`FLAG_ENABLE`, `BOARD_NUM_COLS`, `VIC_SPRITE_X`)

**Commenting Standard:**
- Original address as comment before each routine: `// 6D3C`
- Horizontal rule separators: `//-----...-----` (117 chars)
- **Routine header comments** explain:
  - What the routine does and WHY
  - `Requires:` section listing input registers/memory
  - `Sets:` section listing output registers/memory
  - `Notes:` section for important caveats
- **Inline comments** explain WHY, not WHAT (don't say "load A with 8" -- say "8 sprites")
- **Block comments** for complex logic: multi-paragraph explanations of algorithms, data structures, game mechanics
- **ASCII diagrams** for data layouts (board matrices, memory maps, sprite layouts)
- **Magic number elimination**: All magic numbers replaced with descriptive `.const` values
- **`// 0 offset`** notation to explain zero-based indexing

**Example output (matching Archon quality, with standardised conventions):**
```kickass
.filenamespace ai
//---------------------------------------------------------------------------------------------------------------------
// Code and assets used for AI in board and challenge game play.
//---------------------------------------------------------------------------------------------------------------------
.segment Game

// 6D3C
//---------------------------------------------------------------------------------------------------------------------
// Determine the piece, action and destination for the current turn.
// The AI evaluates each piece's defensive value on its current square, then calculates
// offensive scores for all reachable destination squares. The piece-move combination with
// the highest total score is selected. If multiple moves tie, one is chosen at random.
//
// Requires:
// - `game.data__ai_player_ctl`: Current AI player ($55=light, $AA=dark)
// - `board.data__square_occupancy_list`: Current board state
// Sets:
// - `common.param__icon_offset_list`: Selected piece to move
// - `private.data__destination_row_list`: Destination row
// - `private.data__destination_col_list`: Destination column
//---------------------------------------------------------------------------------------------------------------------
calc_best_move:
    lda #(FLAG_ENABLE/2)
    sta private.flag__move_selected
    //
    // Determine if AI should cast a spell.
    // Y=current player (0 or 1)
    // X=Player piece (wizard or sorceress)
    ldy #$00
    ldx #WIZARD
    lda game.data__ai_player_ctl
    bpl !next+
    iny
    ldx #SORCERESS
!next:
    sty game.data__player_offset
    // Ignore caster if dead or imprisoned.
    lda game.data__piece_strength_list,x
    beq !skip+
    ...
```

**Data Section Example:**
```kickass
//---------------------------------------------------------------------------------------------------------------------
// Assets
//---------------------------------------------------------------------------------------------------------------------
// Assets are constant data. Assets are permanent and will not change during the program lifetime.
.segment Assets

//---------------------------------------------------------------------------------------------------------------------
// Private assets.
.namespace private {
    // 721F
    // AI square occupancy preference. Higher values indicate more strategically desirable squares.
    // The magic squares and centre of the board have highest preference.
    //
    //   03 01 01 01 03 01 01 01 03
    //   01 02 02 02 04 02 02 02 01
    //   01 02 03 03 05 03 03 02 01
    //   01 02 03 04 06 04 03 02 01
    //   03 04 05 06 08 06 05 04 03   <-- Magic square centre has highest value
    //   01 02 03 04 06 04 03 02 01
    //   01 02 03 03 05 03 03 02 01
    //   01 02 02 02 04 02 02 02 01
    //   03 01 01 01 03 01 01 01 03
    //
    data__square_occupancy_preference_list:
        .byte $03,$01,$01,$01,$03,$01,$01,$01,$03
        .byte $01,$02,$02,$02,$04,$02,$02,$02,$01
        ...
}
```

**Documentation Outputs:**
The MCP should also generate:
- **README.md**: Purpose, conventions used, entry point, memory map, build instructions
- **TERMINOLOGY.md**: Game-specific terms used in labels/comments (e.g., "Icon", "Phase", "Challenge")
- **INTERESTING.md**: Discovered insights -- modifiable addresses, game mechanics, clever tricks
- **How it works.md**: High-level architecture overview (modules, game loop, state machine)

#### `verify.py` -- Reassembly Verification
- Invoke KickAssembler on generated source: `kickass output/main.asm`
- Read resulting `.prg`
- Byte-by-byte comparison against original `.prg`
- Report: PASS or FAIL with list of differing addresses
- This is the ultimate correctness gate

---

### Layer 4: Project State

#### `project.json` Structure
```json
{
  "source_prg": "game.prg",
  "load_address": "0x0801",
  "binary_size": 32768,
  "analysis_passes": [
    {"timestamp": "...", "type": "auto_static", "notes": "Initial pass"},
    {"timestamp": "...", "type": "ai_analyze", "notes": "AI naming pass"}
  ],
  "regions": [
    {"start": "0x0801", "end": "0x080D", "type": "basic_stub"},
    {"start": "0x080E", "end": "0x0900", "type": "code", "label": "init_game"},
    {"start": "0x2000", "end": "0x27FF", "type": "data", "subtype": "charset", "label": "charset_data__custom_font"},
    {"start": "0x3000", "end": "0x3F40", "type": "data", "subtype": "sprites", "label": "sprite_data__player"}
  ],
  "symbols": {
    "0xC000": {"name": "init_sprites", "type": "subroutine", "category": "init"},
    "0x00FB": {"name": "idx__sprite", "type": "variable", "scope": "init_sprites"}
  },
  "xrefs": { },
  "verification": {
    "last_run": "...",
    "result": "PASS",
    "mismatches": []
  }
}
```

---

## MCP Server Tool List

### Project Management
| Tool | Description |
|------|-------------|
| `disasm_create_project(source_path, type)` | Create project from .prg (type="binary") or .asm (type="asm") |
| `disasm_load_project(project_path)` | Load existing project state |
| `disasm_save_project()` | Save current state |
| `disasm_import_vice_labels(vs_path)` | Import VICE monitor label file (symbols at MEDIUM confidence) |

### Static Analysis (all deterministic -- no AI)
| Tool | Description |
|------|-------------|
| `disasm_detect_entry_points()` | Run entry point detection heuristics, return candidates for user confirmation |
| `disasm_auto_analyze()` | Run full static analysis pipeline (xrefs, CFG, loops, SMC, data classification) |
| `disasm_get_memory_map()` | Show code/data/unknown regions with confidence levels |
| `disasm_get_subroutines()` | List all detected subroutines with call counts |
| `disasm_get_subroutine(address)` | Get disassembly of one subroutine with xrefs and loop structure |
| `disasm_get_xrefs(address)` | Get full cross-reference profile for an address (reads, writes, jumps, calls, comparisons) |
| `disasm_get_cfg(address)` | Get control flow graph for subroutine |
| `disasm_get_data_blocks()` | List detected data regions with types and confidence |
| `disasm_get_game_loops()` | List detected game loops, state machines, IRQ chains |
| `disasm_get_bank_state(address)` | Get bank configuration active at a given address |
| `disasm_search_bytes(hex_pattern)` | Search for byte pattern in binary |
| `disasm_get_smc_sites()` | List self-modifying code locations with source/target |
| `disasm_mark_region(start, end, type)` | Manually mark code/data region (user override) |
| `disasm_set_symbol(address, name)` | Manually set symbol name (user override, KNOWN confidence) |
| `disasm_get_address_profile(address)` | Get full usage profile: who reads/writes/jumps/compares, in which scopes, with what values |

### AI Analysis
| Tool | Description |
|------|-------------|
| `disasm_ai_analyze_subroutine(addr)` | AI names + comments a subroutine (uses xrefs + Qdrant context) |
| `disasm_ai_name_variable(addr, scope)` | AI names a variable in scope context (uses comparison tracking + usage profile) |
| `disasm_ai_classify_data(start, end)` | AI classifies a data region (uses xref confirmation) |
| `disasm_ai_suggest_kickass(start, end)` | AI suggests .for/.fill/.macro optimization |
| `disasm_ai_analyze_all()` | Run AI analysis on all subroutines + data (batch) |
| `disasm_ai_split_files(analysis_results)` | AI decides file grouping (which subroutines/data go in which file) |

### Output
| Tool | Description |
|------|-------------|
| `disasm_emit_source(output_dir)` | Generate KickAssembler source (single file) |
| `disasm_emit_split(output_dir)` | Generate split multi-file output (AI-guided grouping) |
| `disasm_verify(output_dir)` | Reassemble and verify byte-for-byte match |
| `disasm_apply_naming(project)` | Run naming.py to format all AI-provided names to convention |

---

## Claude Code Skills (Slash Commands)

The pipeline is split into two independent entry points, so users with existing disassembly dumps skip straight to conversion. Skills orchestrate the MCP tools and scripts into coherent workflows.

### Complete Skills Inventory

| # | Skill | Input | Purpose | Scripts Used |
|---|-------|-------|---------|-------------|
| 1 | `/disasm-dump` | `.prg` file | Binary to ASM text | `binary_loader`, `disasm_engine`, `entry_point`, `data_classifier` |
| 2 | `/disasm-convert` | `.asm` file | ASM text to project (static analysis) | `asm_parser`, `xref_db`, `control_flow`, `game_loop_detector`, `smc_analyzer`, `bank_tracker`, `data_classifier`, `memory_map`, `entry_point` |
| 3 | `/disasm-analyze` | project | AI naming + commenting + classification | `naming`, `symbol_db` + AI tools + Qdrant |
| 4 | `/disasm-refine` | project | Interactive human review of AI results | `naming` + project state |
| 5 | `/disasm-emit` | project | Generate KickAssembler source files | `kickass_emitter`, `naming`, `memory_map` |
| 6 | `/disasm-verify` | output dir | Reassemble + byte-for-byte comparison | `verify` |
| 7 | `/disasm-document` | address | Deep documentation of one subroutine | `xref_db`, `control_flow` + AI + Qdrant |
| 8 | `/disasm-entry` | project | Detect and confirm entry points | `entry_point` |

---

### Skill 1: `/disasm-dump <file.prg>` -- Binary to ASM Text

Takes a raw `.prg` file or memory dump and produces an intermediate ASM text file using Capstone. This is the **optional** first stage for users who don't already have a disassembly.

1. Load binary via `binary_loader.py` (parse 2-byte PRG header, or accept raw dump with user-specified base address)
2. Run `/disasm-entry` to detect and confirm entry points with user
3. Run Capstone disassembler (`CS_ARCH_MOS65XX`) for initial instruction decode
4. Recursive descent from confirmed entry points to separate code from data
5. Auto-generate labels for branch/jump targets
6. Run `data_classifier.py` for obvious data regions (sprites, charsets, text strings)
7. Output: intermediate `.asm` text file in the standard dump format
8. Report: code regions, data regions, entry points found, unknowns

**Output format matches what the conversion skill expects:**
```
*= $0801
// BASIC stub
0801 0B 08 0A 00 .byte $0B,$08,$0A,$00   // BASIC line: 10 SYS 2064
...
*= $0810
main:
0810 78           sei
0811 A9 35        lda #$35
0813 85 01        sta $01
...
```

### Skill 2: `/disasm-convert <file.asm>` -- ASM Text to KickAssembler Project

Takes an ASM text file (from `/disasm-dump`, Regenerator, VICE, or any other source) and runs all static analysis to create a project. This is **deterministic only -- no AI yet**.

1. `asm_parser.py`: Parse ASM text file into internal representation (auto-detect format)
2. `entry_point.py`: Detect entry points if not already labelled. **Ask user to confirm.**
3. `xref_db.py`: Build cross-reference database (reads, writes, jumps, calls, comparison values)
4. `control_flow.py`: Build CFG, detect subroutines, basic blocks, loops
5. `game_loop_detector.py`: Find main loops, state machines, IRQ chains
6. `smc_analyzer.py`: Detect self-modifying code patterns
7. `bank_tracker.py`: Track bank switching, map active bank config per code region
8. `data_classifier.py`: Two-pass code/data separation (candidates then xref confirmation)
9. `memory_map.py`: Build memory region map with confidence levels, segment boundaries, gap detection
10. `project.py`: Create project state file with all analysis results
11. Report: subroutines found, data blocks, xref count, game loops, SMC sites, bank switches, analysis summary

**Does NOT automatically chain into AI analysis** -- user runs `/disasm-analyze` when ready.

### Skill 3: `/disasm-analyze` -- AI Analysis Pass

AI-powered semantic analysis. Uses structured data from static analysis (xrefs, loops, comparisons) to make intelligent naming and classification decisions.

1. For each subroutine: feed AI the disassembly + xrefs + Qdrant context, receive name + comments
2. For each data block: feed AI the bytes + xref usage, receive classification
3. For each variable: feed AI the address profile (reads, writes, comparisons, scopes), receive semantic name
4. Run `naming.py` on all AI-provided names to enforce prefix/suffix conventions
5. Validate existing input names against code behaviour (flag CONFLICTs)
6. Report: named subroutines, classified data, named variables, confidence report

### Skill 4: `/disasm-refine` -- Interactive Refinement

Interactive session for human review and correction of AI analysis.

1. Show categorised confidence report (subroutines, variables, data, regions)
2. List CONFLICT items first (input names that contradict behaviour)
3. List LOW confidence items for review
4. Interactive: user confirms/overrides names, marks regions, adds notes
5. Re-run affected analysis with user corrections (re-runs naming.py)

### Skill 5: `/disasm-emit` -- Generate KickAssembler Source

Generate clean multi-file KickAssembler output.

1. `kickass_emitter.py`: Generate KickAssembler source with proper formatting and conventions
2. `naming.py`: Final pass to ensure all names comply with conventions
3. Split into logical files (AI-guided grouping using game loop structure + call graph)
4. Generate `*=` directives for non-contiguous segments
5. Generate `BasicUpstart2(entry)` for BASIC stub (only if byte-exact match; raw `.byte` otherwise)
6. Move remaining unprocessed code to `unprocessed/` directory
7. Generate documentation files (README.md, TERMINOLOGY.md, INTERESTING.md, How it works.md)

### Skill 6: `/disasm-verify` -- Standalone Verification

Can be run at any point during the process, not just at the end.

1. Invoke KickAssembler on generated source: `kickass output/main.asm`
2. Load resulting `.prg` and original `.prg` into memory
3. Byte-by-byte comparison
4. Report: PASS or FAIL with list of differing addresses and surrounding context
5. If FAIL: suggest likely causes (missing data block, wrong `*=` address, SMC not handled)

### Skill 7: `/disasm-document <address>` -- Deep Documentation

Deep documentation of a specific subroutine.

1. Full disassembly with all xrefs from `xref_db`
2. Loop structure from `control_flow`
3. Query Qdrant for technique context (hardware registers used, common patterns)
4. AI writes detailed block comment (algorithm explanation, Requires/Sets)
5. AI adds inline comments to every non-obvious instruction
6. Trace data flow through the subroutine

### Skill 8: `/disasm-entry` -- Entry Point Detection

Dedicated skill for finding program entry points. Used by `/disasm-dump` and `/disasm-convert`, or can be run standalone.

1. Run `entry_point.py` heuristics (BASIC stub, IRQ/NMI vectors, init signatures, jump tables)
2. Present candidates to user with confidence levels and evidence
3. User confirms, rejects, or adds manual entry points
4. Store confirmed entry points in project state (KNOWN confidence)

### Pipeline Summary

```
                      +-- /disasm-dump -----+
Raw .prg / dump ----->|  binary_loader      |---+
                      |  entry_point (ask!) |   |
                      |  Capstone decode    |   |
                      |  data_classifier    |   |
                      +---------------------+   |
                                                 v
                      +-- /disasm-convert --+   intermediate
Existing ASM dump --->|  asm_parser         |<--+ .asm file
(Regenerator/VICE)--->|  entry_point (ask!) |
                      |  xref_db            |
                      |  control_flow       |
                      |  game_loop_detector |
                      |  smc_analyzer       |
                      |  bank_tracker       |
                      |  data_classifier    |
                      +----------+----------+
                                 |
                      +----------v----------+
                      |  /disasm-analyze    |
                      |  AI + Qdrant        |
                      |  naming.py          |
                      +----------+----------+
                                 |
                      +----------v----------+
                      |  /disasm-refine     |
                      |  Human review       |<---+
                      |  naming.py          |    | iterate
                      +----------+----------+    |
                                 |               |
                      +----------v----------+    |
                      |  /disasm-emit       |    |
                      |  kickass_emitter    |    |
                      |  naming.py          |    |
                      +----------+----------+    |
                                 |               |
                      +----------v----------+    |
                      |  /disasm-verify     |----+
                      |  KickAssembler      |  (if FAIL)
                      |  byte comparison    |
                      +---------------------+
```

---

## Variable Naming Strategy (The Hard Problem)

This is the most challenging part of disassembly. Here's the multi-stage approach:

### Stage 1: Static Classification
```
For each memory address referenced in the binary:
  1. Is it a known hardware register? -> Use standard name (VIC_SPRITE_X, SID_FREQ_LO)
  2. Is it a known KERNAL/BASIC entry? -> Use standard name (CHROUT, GETIN)
  3. Is it a known ZP system variable? -> Use standard name (PROCESSOR_PORT)
```

### Stage 2: Usage Pattern Analysis
```
For each remaining address, within each subroutine scope:
  1. Count reads vs writes
  2. Check read-before-write? -> It's a parameter/input
  3. Check write-then-read? -> It's a local variable
  4. Check compared with constant? -> Infer meaning from constant:
     - CMP #$08 -> likely sprite count or bit count
     - CMP #$28 -> likely screen width (40 columns)
     - CMP #$19 -> likely screen height (25 rows)
     - AND #$0F -> likely color value (0-15)
  5. Check if address is in zero page? -> Frequently-used working variable
  6. Used across multiple subroutines? -> Global state
```

### Stage 3: Loop Context Analysis
```
For each loop:
  1. What initializes the loop counter? (LDX #$00)
  2. What terminates it? (CPX #$08, BNE)
  3. What does the body do with the counter? (indexed addressing: STA $D000,X)
  4. -> Infer: "iterates over sprites" -> name: spriteIndex
```

### Stage 4: AI Semantic Naming
Feed all the above structured data to the AI. The AI gets:
```
Address $FB:
  - Zero page location
  - Written by: init_sprites ($C000), draw_explosion ($C100)
  - In init_sprites: initialized to 0, incremented, compared with 8, used as index into $D000,X and $D027,X
  - In draw_explosion: initialized to 0, incremented, compared with 4, used as index into explosion_frame_data
```
AI response:
```
In init_sprites scope: "idx__sprite" -- "Loop counter iterating over all 8 hardware sprites"
In draw_explosion scope: "idx__frame" -- "Current animation frame within 4-frame explosion sequence"
```

### Stage 5: Confidence Tracking & Flagging

Every symbol (subroutine name, variable name, data block label) carries a confidence level that affects how it appears in the output:

**Confidence Levels:**

| Level | Meaning | Output Behaviour |
|-------|---------|-----------------|
| `KNOWN` | Hardware register, KERNAL entry, or user-confirmed name | Name used as-is, no flag |
| `HIGH` | Strong evidence from multiple signals (xrefs + context + pattern match) | Name used as-is, no flag |
| `MEDIUM` | Reasonable inference but not certain | Name used, flagged in comment: `// [?] AI-inferred name` |
| `LOW` | Weak evidence, single signal, or ambiguous | Auto-name kept, AI suggestion in comment: `// [??] possibly: readJoystick` |
| `CONFLICT` | Existing input name contradicts code behaviour | Both shown: `// [!] input name "doSound" -- behaviour suggests screen update routine` |

**Naming Convention in Output:**
```kickass
//---------------------------------------------------------------------------------------------------------------------
// [?] update_sprite_positions
// Reads joystick state and adjusts sprite X/Y coordinates.
// Confidence: MEDIUM -- writes to VIC sprite registers but also
// touches SID, may be a combined update routine.
//---------------------------------------------------------------------------------------------------------------------
update_sprite_positions:
    lda CIA1_DATA_PORT_A        // Read joystick port
    sta temp__joystick_state    // [?] local, read-before-write in this scope
    ...

//---------------------------------------------------------------------------------------------------------------------
// [!] Name conflict: input called this "doSound" but it writes
// to VIC registers $D000-$D00F (sprite positions), not SID.
// Renamed to: move_sprite_block
//---------------------------------------------------------------------------------------------------------------------
move_sprite_block:
    ...
```

**Confidence in Project State:**
```json
{
  "symbols": {
    "0xC000": {
      "name": "update_sprite_positions",
      "confidence": "MEDIUM",
      "input_name": "sub_C000",
      "reasoning": "Writes to $D000-$D00F (VIC sprite X/Y), reads $DC00 (joystick)",
      "signals": ["vic_sprite_writes", "cia_joystick_read"]
    },
    "0xC100": {
      "name": "move_sprite_block",
      "confidence": "CONFLICT",
      "input_name": "doSound",
      "reasoning": "Input named doSound but code writes VIC $D000-$D00F, no SID access",
      "signals": ["vic_sprite_writes", "no_sid_access", "input_name_mismatch"]
    }
  }
}
```

**Confidence applies to ALL classifications, not just names:**

| What | Confidence Applies To | Example |
|------|-----------------------|---------|
| Subroutine names | Is `update_sprites` correct? | MEDIUM — writes VIC regs but also touches SID |
| Variable names | Is `idx__sprite_count` correct? | HIGH — used as loop counter 0-7, indexes $D000,X |
| Data block labels | Is this really sprite data? | HIGH — 64-byte aligned, referenced by sprite pointer math |
| Region type | Is $8000-$8FFF code or data? | LOW — unreachable via control flow, but contains valid opcodes |
| Address labels | Is $C000 a subroutine entry? | KNOWN — JSR $C000 found in 3 call sites |

This means the `/disasm-refine` report covers all categories:

**Summary output** (for `/disasm-refine`):
```
CONFIDENCE REPORT:

  Subroutine names:
    KNOWN:  12  HIGH:  23  MEDIUM:  31  LOW:   8  CONFLICT:  3

  Variable names:
    KNOWN:  45  HIGH:  67  MEDIUM:  22  LOW:  14  CONFLICT:  1

  Data classifications:
    KNOWN:   5  HIGH:  12  MEDIUM:   8  LOW:   3  CONFLICT:  0

  Memory regions (code vs data):
    KNOWN:  30  HIGH:  18  MEDIUM:   6  LOW:   4  CONFLICT:  2

  TOTAL ITEMS NEEDING REVIEW: 36 (MEDIUM) + 29 (LOW) + 6 (CONFLICT)
```

### Stage 6: KickAssembler Scoping
```kickass
.namespace init_sprites {
    .label idx__sprite = $FB    // Loop counter for 8 sprites
}
.namespace draw_explosion {
    .label idx__frame = $FB     // Animation frame counter (0-3)
}
```

---

## Qdrant Knowledge Gaps to Fill

Current Qdrant has 355 chunks covering hardware docs. For disassembly, we need additional training data:

| Topic | Why Needed | Source |
|-------|-----------|--------|
| KERNAL entry point calling conventions | AI needs register semantics for JSR targets | C64 PRG, ROM disassembly |
| Common C64 programming patterns | Recognize standard routines (scroll, multiplex) | Codebase64 wiki, tutorials |
| SID player formats | Identify music data structures | GoatTracker docs, SID format specs |
| Sprite multiplexer algorithms | Very common pattern to recognize | Codebase64, demo scene tutorials |
| IRQ handler setup patterns | Detect raster interrupt chains | C64 programming guides |
| Common game engine patterns | Joystick reading, collision, scoring | Game programming tutorials |
| Packer/cruncher signatures | Detect compressed binaries | Exomizer, ByteBoozer docs |
| PETSCII character encoding | String detection and decoding | C64 reference |

---

## Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| MCP Server | Python 3.11+ with `mcp` SDK | Rich ecosystem, fast enough for 64KB, official MCP support |
| Static analysis | Pure Python | No external dependencies, full control |
| Initial disassembly | Capstone (`CS_ARCH_MOS65XX`) | Mature disassembler for raw binary input path; also verifies our opcode handling |
| ASM parser | Pluggable Python backends | Common interface, format-specific backends, auto-detection |
| Opcode table | Python dict / JSON | All 256 opcodes with metadata |
| Symbol database | JSON + Python dict | Parsed from mapping-c64.txt at startup |
| Project state | JSON files | Human-readable, easy to version control |
| Qdrant access | `qdrant-client` Python library | Direct access from within MCP server, config in MCP server settings |
| Verification | KickAssembler via subprocess | `kickass output.asm` + binary diff |
| Graph analysis | `networkx` (optional) | CFG traversal, loop detection, topological sort |
| Code navigation | KickAssembler LSP (TypeScript, via stdio) | Output validation, rename, xref checking (Phase 6). See [kickassembler-lsp.md](kickassembler-lsp.md) |

---

## MCP Integration Architecture

```
Claude Code Session
    |
    +-- c64-disasm MCP (NEW - Python)
    |       |-- Static analysis engine (17 Python scripts)
    |       |-- Direct qdrant-client access for semantic search
    |       |-- Subprocess: KickAssembler for verification
    |       |-- LSP client: connects to KickAssembler LSP for output navigation
    |       '-- Project state management
    |
    +-- qdrant-local MCP (EXISTING)
    |       '-- 355+ semantic chunks of C64/6502 documentation
    |
    +-- zen MCP (EXISTING)
    |       '-- Multi-model analysis, deep thinking tools
    |
    +-- sequential-thinking MCP (EXISTING)
    |       '-- Complex reasoning chains
    |
    '-- kickassembler-lsp (TypeScript - standalone server)
            |-- Parser, symbol table, scope tracking
            |-- Code navigation (definition, references, rename, call hierarchy)
            |-- Connected to by: c64-disasm MCP (as LSP client)
            '-- Connected to by: VS Code extension (as LSP client)
            See: plans/kickassembler-lsp.md
```

### LSP Integration

The [KickAssembler LSP core library](kickassembler-lsp.md) is a shared dependency used by both the VS Code extension and this disassembler MCP. The disassembler connects as an LSP client over stdio.

**How the disassembler uses the LSP:**

| Skill | LSP Feature Used | Purpose |
|-------|-----------------|---------|
| `/disasm-emit` | `textDocument/documentSymbol` | Validate generated symbol structure is well-formed |
| `/disasm-emit` | `textDocument/definition` | Verify all symbol references resolve |
| `/disasm-refine` | `textDocument/rename` | Cross-file rename when user changes a symbol name |
| `/disasm-verify` | `textDocument/references` | Check xref consistency between static analysis and generated output |
| `/disasm-document` | `textDocument/callHierarchy` | Trace subroutine call chains for documentation |
| General | `workspace/symbol` | Search generated output for any symbol |

**Workflow**: After `/disasm-emit` generates KickAssembler source files, the LSP server is started on the output directory. The disassembler MCP connects as a client and uses LSP features for validation, navigation, and refactoring of the generated code.

**Phasing**: LSP integration is additive. The disassembler works without the LSP (Phases 1-5). LSP integration comes in Phase 6 when the LSP library is available.

---

## Workflow: End-to-End Disassembly

### Path A: Starting from raw binary

```
Step 1: DISASSEMBLE BINARY
  User: /disasm-dump game.prg
  System: binary_loader -> Loads 32,768 bytes at $0801
          entry_point -> "BASIC SYS $0810 detected. Also found IRQ setup at $C200. Confirm? [Y/n]"
          User: Y
          Capstone -> Decodes instructions from confirmed entry points
          data_classifier -> Marks obvious data regions
          -> Output: game_dump.asm (intermediate format)
          -> 8,192 bytes code, 24,576 bytes data, 4,096 unknown

Step 2: CONVERT TO PROJECT
  User: /disasm-convert game_dump.asm
  [continues at Path B Step 1 -- same pipeline from here]
```

### Path B: Starting from existing disassembly

```
Step 1: IMPORT + STATIC ANALYSIS
  User: /disasm-convert chess_disasm.asm
  System: asm_parser -> Parses 4,200 lines of partially-annotated ASM
          entry_point -> Found BASIC SYS $0810, IRQ setup at $C200
            "Entry points detected: $0810 (BASIC SYS), $C200 (IRQ handler). Confirm? [Y/n]"
          User: Y
          xref_db -> 2,341 cross-references built
          control_flow -> 47 subroutines, 12 loops
          game_loop_detector -> Main loop at $0900 (JMP $0900), IRQ chain: $C200->$C280
          smc_analyzer -> 3 SMC sites
          bank_tracker -> Bank switch at $0850 ($35 -> $34, RAM under I/O)
          data_classifier -> 8 data regions (2 confirmed via xref, 6 candidates)
          156 existing labels preserved as hints (MEDIUM confidence)

Step 2: AI ANALYSIS
  User: /disasm-analyze
  System: For each subroutine, feed AI: disassembly + xrefs + comparisons + Qdrant context
          naming.py -> Enforces prefix/suffix conventions on all AI names
          -> Names: init_board, calc_move_score, generate_moves, play_sid_music...
          -> Validates existing names: 3 CONFLICTs found
             [!] "doSound" at $C100 -- writes VIC regs, not SID. Renamed: update_sprite_positions
          -> Data: 64 sprite frames, opening book table, piece values
          -> Variables: idx__piece, data__board_square, data__move_score...
          Report:
            Subroutines:  KNOWN: 2 | HIGH: 23 | MEDIUM: 15 | LOW: 5 | CONFLICT: 2
            Variables:    KNOWN: 45 | HIGH: 67 | MEDIUM: 22 | LOW: 14 | CONFLICT: 1
            Data blocks:  KNOWN: 2 | HIGH: 6 | MEDIUM: 4 | LOW: 2 | CONFLICT: 0
            Regions:      KNOWN: 30 | HIGH: 18 | MEDIUM: 6 | LOW: 4 | CONFLICT: 0

Step 3: HUMAN REFINEMENT
  User: /disasm-refine
  System: Shows CONFLICT items first, then LOW confidence
  User: Confirms corrections, overrides 2 names, marks a data region
  System: Re-runs naming.py on changed items, updates project state

Step 4: EMIT
  User: /disasm-emit
  System: kickass_emitter -> Generates KickAssembler source in 12 files
          Unprocessed code -> unprocessed/ directory
          Documentation -> README.md, TERMINOLOGY.md, INTERESTING.md

Step 5: VERIFY
  User: /disasm-verify
  System: verify.py -> Runs KickAssembler on output
          -> Compiles cleanly
          -> Binary comparison: PASS (byte-for-byte match)
          Output: game_name/main.asm, game_name/src/init.asm, game_name/src/sprites.asm, ...

Step 6: ITERATE
  User reads output, spots improvements, runs /disasm-refine, re-emits, re-verifies
```

---

## Complete Script Inventory

All deterministic scripts. These run without AI and produce structured data for AI to consume.

| # | Script | Purpose | Depends On | Phase |
|---|--------|---------|-----------|-------|
| 1 | `asm_parser.py` | Pluggable parser framework + format auto-detection | - | 1 |
| 1a | `parsers/regenerator.py` | Regenerator dump format backend | `asm_parser` | 1 |
| 1b | `parsers/vice_monitor.py` | VICE monitor dump format backend | `asm_parser` | 1 |
| 1c | `parsers/c64_debugger.py` | C64 Debugger export format backend | `asm_parser` | 1 |
| 1d | `parsers/kickass_listing.py` | KickAssembler listing file backend | `asm_parser` | 1 |
| 1e | `parsers/generic.py` | Generic/fallback format backend | `asm_parser` | 1 |
| 2 | `binary_loader.py` | Parse .prg files, build memory image | - | 1 |
| 3 | `opcode_table.py` | Complete 256-opcode database (mnemonic, mode, bytes, cycles, flags) | - | 1 |
| 4 | `disasm_engine.py` | Core disassembler (Capstone + recursive descent + linear sweep) | `opcode_table` | 1 |
| 5 | `entry_point.py` | Detect BASIC SYS, IRQ/NMI vectors, init signatures, jump tables | `opcode_table` | 1 |
| 6 | `xref_db.py` | Cross-reference database (reads, writes, jumps, calls, comparisons) | `asm_parser` or `disasm_engine` | 1 |
| 7 | `symbol_db.py` | Known C64 symbols (hardware regs, KERNAL, BASIC, zero page) | - | 1 |
| 8 | `control_flow.py` | CFG, subroutines, basic blocks, loops, call graph, dead code | `xref_db` | 1 |
| 9 | `project.py` | Project state management (JSON save/load) | - | 1 |
| 10 | `data_classifier.py` | Code/data separation, format detection (sprites, chars, strings, etc.) | `xref_db` | 2 |
| 11 | `smc_analyzer.py` | Self-modifying code pattern detection | `xref_db` | 2 |
| 12 | `memory_map.py` | Memory region tracking with confidence levels | `data_classifier` | 2 |
| 13 | `game_loop_detector.py` | Main loops, state machines, IRQ chains, update/draw/wait cycles | `control_flow` | 2 |
| 14 | `bank_tracker.py` | Track $0001 writes, map active bank config per code region | `xref_db`, `game_loop_detector` | 2 |
| 15 | `naming.py` | Naming convention engine (prefix/suffix rules, validation, dedup) | - | 3 |
| 16 | `kickass_emitter.py` | KickAssembler source generation with formatting conventions | `naming`, `symbol_db` | 4 |
| 17 | `verify.py` | Reassembly verification (KickAssembler + byte comparison) | - | 4 |

**Key principle**: Scripts 1-14 produce structured data. Script 15 formats AI decisions into convention-compliant names. Scripts 16-17 produce output. AI only operates between steps 14 and 15 -- it receives structured data and returns semantic decisions.

---

## Implementation Phases

### Phase 1: Core Engine -- Parse & Analyse
Build the deterministic static analysis foundation. After this phase, `/disasm-convert` and `/disasm-entry` work (minus AI).

Scripts: `asm_parser`, `binary_loader`, `opcode_table`, `disasm_engine`, `entry_point`, `xref_db`, `symbol_db`, `control_flow`, `project`

MCP tools: `disasm_create_project`, `disasm_detect_entry_points`, `disasm_auto_analyze`, `disasm_get_subroutines`, `disasm_get_subroutine`, `disasm_get_xrefs`, `disasm_get_address_profile`, `disasm_get_cfg`, `disasm_get_memory_map`, `disasm_load_project`, `disasm_save_project`

Skills: `/disasm-convert` (static analysis only), `/disasm-entry`

### Phase 2: Data & Structure Analysis
Add data classification, SMC detection, game loop detection, and bank tracking. After this phase, the static analysis is complete.

Scripts: `data_classifier`, `smc_analyzer`, `memory_map`, `game_loop_detector`, `bank_tracker`

MCP tools: `disasm_get_data_blocks`, `disasm_get_smc_sites`, `disasm_get_game_loops`, `disasm_get_bank_state`, `disasm_search_bytes`, `disasm_mark_region`, `disasm_set_symbol`

Skills: `/disasm-dump` (binary input path now works)

### Phase 3: AI Integration + Naming
Add Qdrant integration, AI analysis tools, and the naming convention engine. After this phase, `/disasm-analyze` works.

Scripts: `naming`

MCP tools: `disasm_ai_analyze_subroutine`, `disasm_ai_name_variable`, `disasm_ai_classify_data`, `disasm_ai_analyze_all`, `disasm_apply_naming`

Skills: `/disasm-analyze`, `/disasm-refine`

Additional: Qdrant training data (KERNAL conventions, common patterns, SID formats)

### Phase 4: KickAssembler Output + Verification
Generate output and verify correctness. After this phase, end-to-end pipeline works.

Scripts: `kickass_emitter`, `verify`

MCP tools: `disasm_emit_source`, `disasm_emit_split`, `disasm_verify`, `disasm_ai_suggest_kickass`

Skills: `/disasm-emit`, `/disasm-verify`

### Phase 5: Documentation + Polish
Documentation generation, VICE label import/export, `/disasm-document` skill.

MCP tools: `disasm_import_vice_labels`

Skills: `/disasm-document`

Outputs: README.md, TERMINOLOGY.md, INTERESTING.md, How it works.md generation

### Phase 6: LSP Integration + Advanced Features

**LSP integration** (requires [kickassembler-lsp](kickassembler-lsp.md) Phases 1-2):
- Connect to KickAssembler LSP as client for output validation
- Use `textDocument/rename` for cross-file symbol renaming in `/disasm-refine`
- Use `textDocument/references` for xref consistency checks in `/disasm-verify`
- Use `textDocument/callHierarchy` for call chain tracing in `/disasm-document`
- Use `textDocument/documentSymbol` for output structure validation in `/disasm-emit`

**Other advanced features:**
- Known routine pattern matching (common scroll routines, SID players)
- Packer detection and warning
- Raster IRQ chain visualisation
- Cycle count annotation for timing-critical code
- Export to VICE label format
- Multi-load game support (multiple .prg files in one project)

---

## Resolved Questions

1. **Qdrant access**: Use `qdrant-client` directly from within the MCP server. Simpler than MCP-to-MCP chaining. Qdrant connection details (URL, collection name, API key) configured in MCP server settings. Training data from `.memories/qdrant_data` can be bundled or copied for new installations.

2. **VICE label import**: Include support -- not a primary input path but useful for users who have done manual analysis in VICE monitor. Parse `.vs` format and import as symbol hints (with MEDIUM confidence, since VICE labels are often partial).

3. **Capstone**: Yes, include as a dependency. Dual role:
   - **Primary**: Disassemble raw `.prg` / memory dump input (alternative to ASM text input)
   - **Verification**: Cross-check our opcode handling against Capstone's `CS_ARCH_MOS65XX` output
   - **Note**: Capstone decodes instructions only. It does NOT identify data structures, xrefs, or program structure. Those are handled by our own scripts (`xref_db`, `data_classifier`, `control_flow`, etc.)

4. **Confidence tracking**: Yes, implemented as a first-class system (see "Confidence Tracking & Flagging" section above). Applies to subroutine names, variable names, data block classifications, and region type (code vs data). Low-confidence and CONFLICT items are flagged in output comments and surfaced in `/disasm-refine`.

5. **Data classification approach**: Two-pass system. First pass marks candidate data regions (MEDIUM confidence). Second pass confirms via xref analysis -- when AI finds code that *uses* the data (e.g., VIC-II `$D018` write pointing at a charset region, or SID register writes using values from a data block), the classification is promoted to HIGH. This handles the "possibly data" problem iteratively.

6. **Entry point detection**: Dedicated `entry_point.py` script and `/disasm-entry` skill. Uses heuristics (BASIC SYS, IRQ/NMI vector setup patterns, init signatures, jump tables). Always asks user to confirm before proceeding. Can be passed explicitly or auto-detected.

7. **Self-modifying code**: Handled by `smc_analyzer.py` (static pattern detection) and AI flagging. AI should flag any code that writes to what it believes is a code region. SMC targets are tracked in xref_db via `modified_by_smc` field.

8. **Bank switching context**: `bank_tracker.py` tracks `$0001` writes. Integrates with `game_loop_detector.py` -- if a bank switch occurs within a detected game loop, all code in that loop iteration uses the switched bank configuration. This resolves the "same address means different things" problem.

9. **Game loop detection**: `game_loop_detector.py` finds main loops, state machines, IRQ chains, and update/draw/wait cycles. Critical for: bank switching context, file splitting decisions, understanding program flow, and variable scoping.

10. **BasicUpstart2**: Use `BasicUpstart2(entry)` only if it produces byte-exact match with the original BASIC stub. If the original uses a non-standard stub, emit raw `.byte` directives instead. `verify.py` catches any mismatch.

11. **Undocumented opcodes**: `opcode_table.py` must have all 256 opcodes. Check Qdrant for completeness; if missing, add full opcode table as training data.

12. **Output verification**: Standalone `/disasm-verify` skill that can run at any point. Invokes KickAssembler, compares bytes, reports mismatches with addresses and likely causes.

13. **Naming convention enforcement**: Deterministic `naming.py` script handles all prefix/suffix formatting. AI provides semantic meaning (e.g., "this is a sprite loop counter"); the script produces the correctly formatted name (`idx__sprite`). This ensures consistency regardless of AI variability.

14. **What AI does vs what scripts do**: Clear separation:
    - **Scripts (deterministic)**: Parsing, xref building, control flow, loop detection, SMC detection, bank tracking, data candidate marking, naming format enforcement, output generation, verification
    - **AI (semantic)**: Subroutine naming, variable purpose identification, data classification confirmation, commenting, file splitting decisions, documentation generation

## Open Questions

None -- all questions resolved.

## Resolved (from previous open questions)

- **Multi-load games**: Separate projects per loaded file is an acceptable workaround for now. Multi-file project support is Phase 6+.

- **Qdrant opcode completeness**: Resolved. Qdrant will contain a complete 256-opcode table including all undocumented opcodes (sourced from `training/raw/6502 undocumented opcodes.txt` and existing 6502 reference docs). Both `opcode_table.py` (disassembler) and `opcodes.json` (LSP) share this as authoritative source.

- **Serena MCP?** Resolved: The LSP is now a [separate core library](kickassembler-lsp.md) that both the VS Code extension and this disassembler MCP connect to directly. Serena remains an option for the VS Code extension but is not needed by the disassembler -- it connects as a native LSP client.

- **Input format variations**: Resolved: Pluggable parser architecture. Common `ParserBackend` interface with format-specific backends (`regenerator.py`, `vice_monitor.py`, `c64_debugger.py`, `kickass_listing.py`, `generic.py`). Auto-detection via `can_parse()` confidence scoring. See `asm_parser.py` in Layer 1.
