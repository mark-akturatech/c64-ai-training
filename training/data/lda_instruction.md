# 6502 LDA (Load Accumulator)

**Summary:** LDA (Load Accumulator) transfers a memory byte into the A register and sets the Negative and Zero flags; common addressing modes and opcodes include Immediate ($A9), Zero Page ($A5), Absolute ($AD), Zero Page,X ($B5), Absolute,X ($BD), Absolute,Y ($B9), (Indirect,X) ($A1), and (Indirect),Y ($B1).

**Operation**
LDA loads an 8-bit value from memory into the accumulator (A). After the transfer, the processor updates:
- Negative flag (N): set if bit 7 of A is 1
- Zero flag (Z): set if A == 0

No other flags are affected by LDA.

**Addressing modes and opcodes**
The following addressing modes and machine opcodes apply to LDA. Byte counts and cycle counts are shown in parentheses.

- Immediate: LDA #$aa — opcode $A9 (2 bytes, 2 cycles)
- Zero Page: LDA $aa — opcode $A5 (2 bytes, 3 cycles)
- Zero Page,X: LDA $aa,X — opcode $B5 (2 bytes, 4 cycles)
- Absolute: LDA $aaaa — opcode $AD (3 bytes, 4 cycles)
- Absolute,X: LDA $aaaa,X — opcode $BD (3 bytes, 4 cycles; add 1 cycle if page boundary is crossed)
- Absolute,Y: LDA $aaaa,Y — opcode $B9 (3 bytes, 4 cycles; add 1 cycle if page boundary is crossed)
- Indexed Indirect: LDA ($aa,X) — opcode $A1 (2 bytes, 6 cycles)
- Indirect Indexed: LDA ($aa),Y — opcode $B1 (2 bytes, 5 cycles; add 1 cycle if page boundary is crossed)

## Source Code
```asm
; LDA opcode summary (mnemonic - addressing - opcode - bytes - cycles - flags affected)
LDA     Immediate       A9      2       2       N,Z
LDA     Zero Page       A5      2       3       N,Z
LDA     Zero Page,X     B5      2       4       N,Z
LDA     Absolute        AD      3       4       N,Z
LDA     Absolute,X      BD      3       4+      N,Z
LDA     Absolute,Y      B9      3       4+      N,Z
LDA     (Indirect,X)    A1      2       6       N,Z
LDA     (Indirect),Y    B1      2       5+      N,Z
```

## References
- "ldx_instruction" — expands on the LDX (Load X register) instruction
- "ldy_instruction" — expands on the LDY (Load Y register) instruction
- "sta_instruction" — expands on the STA (Store Accumulator) counterpart

## Mnemonics
- LDA
