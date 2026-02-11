# 6502 Decrement Instructions — DEC, DEX, DEY (Kick Assembler quick-reference)

**Summary:** DEC (memory decrement) and the register decrements DEX/DEY with 6502 opcodes and addressing modes: zero page, zero page,X, absolute, absolute,X, implied. Contains opcode hex bytes ($C6, $D6, $CE, $DE, $CA, $88), instruction lengths, and cycle counts.

## Description
- DEC decrements a memory location by one and writes the result back to the same address. It affects the Negative (N) and Zero (Z) flags; Carry (C) is not affected. DEC supports zero page, zero page,X, absolute, and absolute,X addressing modes.
- DEX decrements the X register by one (implied addressing). DEY decrements the Y register by one (implied). Both set N and Z according to the result and do not affect C. DEX/DEY are single-byte instructions.

Behavior details (standard NMOS 6502):
- DEC: memory = (memory - 1) & 0xFF; set Z if result == 0; set N from bit 7 of result.
- DEX/DEY: reg = (reg - 1) & 0xFF; set Z if result == 0; set N from bit 7 of result.

Timing and sizes (standard 6502 / Kick Assembler reference):
- DEC Zero Page: 2 bytes, 5 cycles.
- DEC Zero Page,X: 2 bytes, 6 cycles.
- DEC Absolute: 3 bytes, 6 cycles.
- DEC Absolute,X: 3 bytes, 7 cycles.
- DEX / DEY: 1 byte, 2 cycles each.

## Source Code
```text
Opcode quick reference — DEC / DEX / DEY

Instruction   Addressing         Opcode  Bytes  Cycles  Notes
DEC           Zero Page          $C6     2      5       DEC $zz
DEC           Zero Page,X        $D6     2      6       DEC $zz,X
DEC           Absolute           $CE     3      6       DEC $hhhh
DEC           Absolute,X         $DE     3      7       DEC $hhhh,X
DEX           Implied            $CA     1      2       DEX
DEY           Implied            $88     1      2       DEY

Examples (machine bytes):
  DEC $10        -> C6 10
  DEC $20,X      -> D6 20
  DEC $1234      -> CE 34 12
  DEC $1234,X    -> DE 34 12
  DEX            -> CA
  DEY            -> 88
```

```asm
; short assembly examples
        C6 10       ; DEC $10          (zero page)
        D6 20       ; DEC $20,X        (zero page,X)
        CE 34 12    ; DEC $1234        (absolute, little-endian)
        DE 34 12    ; DEC $1234,X      (absolute,X)
        CA          ; DEX
        88          ; DEY
```

## References
- "compare_instructions_cmp_cpx_cpy" — comparison instruction family (CMP/CPX/CPY)
- "eor_inc_and_misc_arithmetic" — adjacent block with EOR, INC, and other arithmetic opcodes

## Mnemonics
- DEC
- DEX
- DEY
