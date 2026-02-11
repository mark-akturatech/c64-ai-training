# NMOS 6510 — Opcode matrix row E0..FF (NOP / INC / ISC / SBC / JAM)

**Summary:** This document details the NMOS 6510 opcodes from $E0 to $FF, encompassing both documented and undocumented instructions. It includes NOP (immediate), INC (various addressing modes), undocumented ISC (increment memory then SBC-like effect), undocumented immediate SBC variants, and JAM (CPU lock-up) entries. Each opcode is accompanied by its mnemonic, addressing mode, byte size, cycle count, and a brief description.

**Opcode row description**

This section documents the 32 opcodes in the NMOS 6510 opcode matrix rows beginning at $E0 and $F0. The rows include a mix of legal instructions (NOP immediate, INC in several addressing modes), undocumented "ISC" combined opcodes (increment memory then SBC-like effect) over multiple addressing modes, an immediate-mode SBC variant, and JAM (illegal/lock-up) entries.

Notes:
- **ISC** is an undocumented combined opcode; it appears in multiple addressing modes in these rows.
- **JAM** opcodes cause the CPU to lock up and are present at specific positions.
- **SBC** immediate-mode variants are present in these rows.
- The opcodes are listed with their hexadecimal value, mnemonic, addressing mode, byte size, cycle count, and a brief description.

## Source Code

```text
; Opcode matrix rows starting at $E0 and $F0 (32 entries: $E0..$FF)
; Format: <opcode hex>  <mnemonic>  <addressing mode>  <bytes>  <cycles>  <description>

$E0   NOP    #imm       2   2   ; No operation (immediate)
$E1   ISC    (zp,x)     2   8   ; Increment memory, then SBC (indirect,X)
$E2   NOP    #imm       2   2   ; No operation (immediate)
$E3   ISC    zp         2   5   ; Increment memory, then SBC (zero page)
$E4   NOP    zp         2   3   ; No operation (zero page)
$E5   SBC    zp         2   3   ; Subtract with carry (zero page)
$E6   INC    zp         2   5   ; Increment memory (zero page)
$E7   ISC    zp         2   5   ; Increment memory, then SBC (zero page)

$E8   INX    impl       1   2   ; Increment X register
$E9   SBC    #imm       2   2   ; Subtract with carry (immediate)
$EA   NOP    impl       1   2   ; No operation (implied)
$EB   SBC    #imm       2   2   ; Subtract with carry (immediate)
$EC   NOP    abs        3   4   ; No operation (absolute)
$ED   SBC    abs        3   4   ; Subtract with carry (absolute)
$EE   INC    abs        3   6   ; Increment memory (absolute)
$EF   ISC    abs        3   6   ; Increment memory, then SBC (absolute)

$F0   BEQ    rel        2   2+  ; Branch if equal (relative)
$F1   ISC    (zp),y     2   8+  ; Increment memory, then SBC (indirect),Y
$F2   JAM    impl       1   -   ; CPU lock-up (implied)
$F3   ISC    (zp),y     2   8+  ; Increment memory, then SBC (indirect),Y
$F4   NOP    zp,x       2   4   ; No operation (zero page,X)
$F5   SBC    zp,x       2   4   ; Subtract with carry (zero page,X)
$F6   INC    zp,x       2   6   ; Increment memory (zero page,X)
$F7   ISC    zp,x       2   6   ; Increment memory, then SBC (zero page,X)

$F8   SED    impl       1   2   ; Set decimal mode
$F9   SBC    abs,y      3   4+  ; Subtract with carry (absolute,Y)
$FA   NOP    impl       1   2   ; No operation (implied)
$FB   ISC    abs,y      3   7   ; Increment memory, then SBC (absolute,Y)
$FC   NOP    abs,x      3   4+  ; No operation (absolute,X)
$FD   SBC    abs,x      3   4+  ; Subtract with carry (absolute,X)
$FE   INC    abs,x      3   7   ; Increment memory (absolute,X)
$FF   ISC    abs,x      3   7   ; Increment memory, then SBC (absolute,X)
```

## Key Registers

- **A (Accumulator):** Used in arithmetic and logic operations.
- **X (Index Register X):** Used for indexing and loop counters.
- **Y (Index Register Y):** Used for indexing and loop counters.
- **P (Processor Status):** Contains status flags (N, V, B, D, I, Z, C).
- **PC (Program Counter):** Points to the next instruction to be executed.
- **SP (Stack Pointer):** Points to the top of the stack.

## References

- "opcode_matrix_row_c0" — expands on previous opcode row (C0..DF) with DEC/DCP/SBX
- "opcode_matrix_notes_and_labels" — expands on block labels and concluding note about variant grouping
- "NMOS 6510 Unintended Opcodes — No More Secrets" by Groepaz — detailed analysis of undocumented opcodes
- "6502/6510/8500/8502 Opcodes" — comprehensive opcode matrix
- "C64-Wiki: Opcode" — detailed opcode information
- "C64 Studio: CPU - 6510 - Opcodes" — opcode details and descriptions

**Note:** The cycle counts marked with '+' indicate that an additional cycle is required if a page boundary is crossed during the operation.

## Mnemonics
- ISC
- JAM
