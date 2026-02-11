# 6502 NOP (No Operation)

**Summary:** NOP — 6502 opcode $EA — implied addressing; 1 byte, 2 clock cycles; performs no state changes (does not modify registers, memory, or processor flags).

## Description
NOP (No Operation) is the canonical single-byte 6502 instruction that consumes processor time without changing CPU or memory state. It uses the implied addressing mode, occupies one byte in memory, and takes 2 clock cycles to execute on the NMOS 6502. It does not affect any status flags or registers. Typical uses include timing padding, alignment, and software patches where a single-byte placeholder is required.

Pseudocode (literal):
- /* NOP */ Nothing.

**[Note: Official 6502 opcode for NOP is $EA.]**

## Source Code
```asm
; Literal source snippet from input
/* NOP */
    Nothing.
```

```asm
; 6502 reference encoding example
NOP         ; mnemonic
.byte $EA   ; machine code encoding
; Size: 1 byte
; Cycles: 2
; Addressing: Implied
```

```text
Opcode  Mnemonic  Bytes  Cycles  Addressing
$EA     NOP       1      2       Implied
```

## References
- "instruction_tables_nop" — expands on NOP opcode $EA

## Mnemonics
- NOP
