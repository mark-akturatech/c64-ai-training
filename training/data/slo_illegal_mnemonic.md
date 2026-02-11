# SLO (illegal ASL then ORA) — opcodes $03 $13 $07 $17 $0F $1F $1B

**Summary:** SLO (also called ASO in some sources) is an unofficial 6502 opcode that performs ASL on a memory operand (shifts memory left, storing the bit7 into Carry and the shifted value back to memory) and then ORs that shifted memory into the accumulator (A |= M). Common opcode encodings: $03, $13, $07, $17, $0F, $1F, $1B (these map to (zp,X), (zp),Y, zp, zp,X, abs, abs,X, abs,Y).

## Description
SLO is an unofficial (illegal) 6502 instruction combining a memory shift (ASL) with a logical OR into the accumulator (ORA). Operationally it does:

1. Read the memory operand M.
2. Perform ASL on M:
   - New carry = old M bit7.
   - New M = (M << 1) & 0xFF (store back to memory).
3. A := A OR New M (accumulator updated with bitwise OR).
4. Set processor flags:
   - Carry (C) is set from the ASL result (old bit7 of M).
   - Negative (N) and Zero (Z) are set from the new Accumulator value (A after OR).
   - Overflow (V) is not defined by an OR — typically left unaffected by the OR (behavior consistent with ORA).
5. Memory is modified (it is a read-modify-write style operation).

Because SLO combines a write-back to memory followed by a register operation, it behaves as a read-modify-write instruction (the memory is changed). Assemblers and documentation may use the mnemonic ASO or SLO; Kick Assembler accepts SLO as the illegal mnemonic.

Caveats:
- SLO is illegal on NMOS 6502 and may not be present or behave identically on all 65xx-family variants; use on exact hardware/emulator with caution.
- Timing and exact side-effects (e.g., internal bus states) depend on the CPU variant and are not specified here.

## Behavior and flags
- Memory: M is replaced with ASL(M) (8-bit, bit7 -> C).
- Accumulator: A becomes A OR M (using the newly stored M).
- Flags:
  - C = old bit7 of memory before ASL.
  - Z = 1 if A after OR == 0, else 0.
  - N = bit7 of A after OR.
  - V = unchanged (no defined effect from OR).
- Instruction is a read-modify-write operation; memory is written.

## Source Code
```asm
; SLO (ASL then ORA) — opcode encodings and example assembly forms
; Byte encodings show opcode followed by operand bytes (little-endian for abs).
; These encodings are the common illegal opcodes found on NMOS 6502-class CPUs.

; (zp,X) -> opcode $03  (2 bytes)
        slo ($44,x)       ; assembles to: $03 $44

; (zp),Y -> opcode $13  (2 bytes)
        slo ($44),y       ; assembles to: $13 $44

; zp -> opcode $07  (2 bytes)
        slo $44           ; assembles to: $07 $44

; zp,X -> opcode $17  (2 bytes)
        slo $44,x         ; assembles to: $17 $44

; abs -> opcode $0F  (3 bytes)
        slo $1234         ; assembles to: $0F $34 $12

; abs,X -> opcode $1F  (3 bytes)
        slo $1234,x       ; assembles to: $1F $34 $12

; abs,Y -> opcode $1B  (3 bytes)
        slo $1234,y       ; assembles to: $1B $34 $12

; Example: manual byte emission
        .byte $07, $44    ; SLO $44  ; zero page SLO
```

## References
- "rra_illegal_mnemonic" — covers related rotate/shift combined-effect illegal opcodes (RRA)
- "sre_illegal_mnemonic" — covers related shift-then-EOR illegal opcodes (SRE)

## Mnemonics
- SLO
- ASO
