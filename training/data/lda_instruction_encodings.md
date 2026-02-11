# LDA (Load Accumulator) — opcode encodings: $A9 $A5 $B5 $A1 $B1 $AD $BD $B9 $B2

**Summary:** LDA loads a byte into the accumulator (A) on 6502-family CPUs. This node lists standard LDA opcode encodings and addressing modes (immediate, zero page, zero page,X, absolute, absolute,X, absolute,Y, (zp,X) indexed-indirect, (zp),Y indirect-indexed) and the 65C02 zero-page-indirect variant ($B2). Includes bytes, CPU cycles, and key behavioral notes (flags, zero-page pointer wrap).

**Description**
LDA transfers a memory operand into the accumulator (A). It updates the Negative (N) and Zero (Z) flags according to the loaded value; it does not affect Carry (C) or Overflow (V). Common addressing modes for accumulator-targeting loads are:

- Immediate (#value): operand is the byte following opcode.
- Zero Page (zp): single-byte zero-page address (wraps to $00-$FF).
- Zero Page,X (zp,X): zero-page address plus X (wraps).
- Absolute (addr): 16-bit address.
- Absolute,X / Absolute,Y: 16-bit address plus X/Y; may add one extra cycle if page boundary crossed.
- (zp,X) — "indexed indirect" / "Indirect,X": take zero-page address + X (wrap in zero page), fetch 16-bit pointer from that zero-page location, then read memory from pointer.
- (zp),Y — "indirect indexed" / "Indirect),Y": fetch 16-bit pointer from zero-page address, add Y to pointer (may cross page) and read memory.

Hardware/implementation caveats:
- Zero-page indirect pointer fetches read the low byte from the specified zero-page address and the high byte from the next zero-page address; on NMOS 6502 this next byte wraps within the zero page (i.e., pointer at $xxFF reads high byte from $xx00). This affects (zp,X) and (zp),Y pointer loads.
- Opcode $B2 (LDA (zp)) is a 65C02 (and some CMOS variants) instruction — it is not available on NMOS 6502 / Commodore 6510 without undocumented/illegal opcode behavior. Use $B2 only when targeting 65C02-compatible cores.
- Undocumented/illegal opcodes are not listed here.

## Source Code
```text
; Opcode table — LDA encodings (6502 NMOS + 65C02 zero-page-indirect variant)
; Columns: Opcode  Addressing Mode       Bytes  Cycles   Notes
$A9    Immediate (#nn)               2      2        ; LDA #$nn
$A5    Zero Page (zp)                2      3        ; LDA $nn
$B5    Zero Page,X (zp,X)            2      4        ; LDA $nn,X
$AD    Absolute (addr)               3      4        ; LDA $hhhh
$BD    Absolute,X (addr,X)           3      4+1*    ; LDA $hhhh,X  (+1 if page crossed)
$B9    Absolute,Y (addr,Y)           3      4+1*    ; LDA $hhhh,Y  (+1 if page crossed)
$A1    (Zero Page,X) (indexed-ind)   2      6        ; LDA ($nn,X)
$B1    (Zero Page),Y (indirect-index)2      5+1*     ; LDA ($nn),Y  (+1 if page crossed)
$B2    (Zero Page) (zero-page-indirect)2     5†      ; LDA ($nn)    ; 65C02-only

; Notes:
; *  +1 cycle if the final effective address crosses a 256-byte page boundary (for absolute,X/Y and (zp),Y)
; †  $B2 is a 65C02/CMOS extension — not present on NMOS 6502/6510 in standard systems (e.g., C64).
; Zero-page pointer fetch wrap: reading a 16-bit pointer from zero page wraps at $FF on NMOS 6502.
```

```asm
; Example assembly encodings
    LDA #$10        ; opcode $A9  $10       ; immediate
    LDA $42         ; opcode $A5  $42       ; zero page
    LDA $42,X       ; opcode $B5  $42       ; zero page,X
    LDA $1234       ; opcode $AD  $34 $12   ; absolute (little-endian)
    LDA $1234,X     ; opcode $BD  $34 $12   ; absolute,X
    LDA $1234,Y     ; opcode $B9  $34 $12   ; absolute,Y
    LDA ($20,X)     ; opcode $A1  $20       ; indexed-indirect (zp,X)
    LDA ($20),Y     ; opcode $B1  $20       ; indirect-indexed (zp),Y
    LDA ($20)       ; opcode $B2  $20       ; zero-page-indirect (65C02 only)
```

## References
- "ora_instruction_encodings" — covers ORA addressing-mode encodings similar to LDA
- "jmp_instruction_variants" — covers control-flow interactions where loaded values are used

## Mnemonics
- LDA
