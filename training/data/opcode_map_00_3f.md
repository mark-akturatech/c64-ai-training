# 6502 Opcode Map: $00–$3F

**Summary:** This document provides a detailed opcode table for the 6502 microprocessor, covering byte values $00–$3F. It includes documented mnemonics, addressing modes, opcode byte lengths, CPU cycle counts, flags affected, and notes on undocumented opcodes. Addressing modes encompass Immediate, Zero Page, Absolute, Accumulator, Indexed (X/Y), and Indirect ((Indirect,X) and (Indirect),Y). The table also highlights instruction families and their respective opcodes.

**Opcode Map and Layout Notes**

The following table lists the 6502 opcodes in the range $00–$3F, organized in two columns: the left column covers $00–$1F, and the right column covers $20–$3F. Each entry includes the opcode, mnemonic, addressing mode, byte length, cycle count, and flags affected. Undocumented opcodes are noted where applicable.


*Note: For branch instructions (e.g., BPL, BMI), add 1 cycle if the branch is taken, and add 1 additional cycle if the branch crosses a page boundary. For indexed addressing modes (e.g., Absolute,X; Absolute,Y; (Indirect),Y), add 1 cycle if a page boundary is crossed.

## Source Code

```text
        00 - BRK                        20 - JSR
             Implied                     Absolute
             1 byte, 7 cycles            3 bytes, 6 cycles
             Affects: B                  Affects: None

        01 - ORA (Indirect,X)           21 - AND (Indirect,X)
             2 bytes, 6 cycles           2 bytes, 6 cycles
             Affects: N, Z               Affects: N, Z

        02 - KIL (Undocumented)         22 - KIL (Undocumented)
             Implied                     Implied
             1 byte, ? cycles            1 byte, ? cycles
             Affects: None               Affects: None

        03 - SLO (Undocumented)         23 - SLO (Undocumented)
             (Indirect,X)                (Indirect,X)
             2 bytes, 8 cycles           2 bytes, 8 cycles
             Affects: N, Z, C            Affects: N, Z, C

        04 - NOP (Undocumented)         24 - BIT Zero Page
             Zero Page                   2 bytes, 3 cycles
             2 bytes, 3 cycles           Affects: N, V, Z
             Affects: None

        05 - ORA Zero Page              25 - AND Zero Page
             2 bytes, 3 cycles           2 bytes, 3 cycles
             Affects: N, Z               Affects: N, Z

        06 - ASL Zero Page              26 - ROL Zero Page
             2 bytes, 5 cycles           2 bytes, 5 cycles
             Affects: N, Z, C            Affects: N, Z, C

        07 - SLO (Undocumented)         27 - RLA (Undocumented)
             Zero Page                   Zero Page
             2 bytes, 5 cycles           2 bytes, 5 cycles
             Affects: N, Z, C            Affects: N, Z, C

        08 - PHP                        28 - PLP
             Implied                     Implied
             1 byte, 3 cycles            1 byte, 4 cycles
             Affects: None               Affects: All

        09 - ORA Immediate              29 - AND Immediate
             2 bytes, 2 cycles           2 bytes, 2 cycles
             Affects: N, Z               Affects: N, Z

        0A - ASL Accumulator            2A - ROL Accumulator
             1 byte, 2 cycles            1 byte, 2 cycles
             Affects: N, Z, C            Affects: N, Z, C

        0B - ANC (Undocumented)         2B - ANC (Undocumented)
             Immediate                   Immediate
             2 bytes, 2 cycles           2 bytes, 2 cycles
             Affects: N, Z, C            Affects: N, Z, C

        0C - NOP (Undocumented)         2C - BIT Absolute
             Absolute                    3 bytes, 4 cycles
             3 bytes, 4 cycles           Affects: N, V, Z
             Affects: None

        0D - ORA Absolute               2D - AND Absolute
             3 bytes, 4 cycles           3 bytes, 4 cycles
             Affects: N, Z               Affects: N, Z

        0E - ASL Absolute               2E - ROL Absolute
             3 bytes, 6 cycles           3 bytes, 6 cycles
             Affects: N, Z, C            Affects: N, Z, C

        0F - SLO (Undocumented)         2F - RLA (Undocumented)
             Absolute                    Absolute
             3 bytes, 6 cycles           3 bytes, 6 cycles
             Affects: N, Z, C            Affects: N, Z, C

        10 - BPL                        30 - BMI
             Relative                    Relative
             2 bytes, 2 cycles*          2 bytes, 2 cycles*
             Affects: None               Affects: None

        11 - ORA (Indirect),Y           31 - AND (Indirect),Y
             2 bytes, 5 cycles*          2 bytes, 5 cycles*
             Affects: N, Z               Affects: N, Z

        12 - KIL (Undocumented)         32 - KIL (Undocumented)
             Implied                     Implied
             1 byte, ? cycles            1 byte, ? cycles
             Affects: None               Affects: None

        13 - SLO (Undocumented)         33 - RLA (Undocumented)
             (Indirect),Y                (Indirect),Y
             2 bytes, 8 cycles           2 bytes, 8 cycles
             Affects: N, Z, C            Affects: N, Z, C

        14 - NOP (Undocumented)         34 - NOP (Undocumented)
             Zero Page,X                 Zero Page,X
             2 bytes, 4 cycles           2 bytes, 4 cycles
             Affects: None               Affects: None

        15 - ORA Zero Page,X            35 - AND Zero Page,X
             2 bytes, 4 cycles           2 bytes, 4 cycles
             Affects: N, Z               Affects: N, Z

        16 - ASL Zero Page,X            36 - ROL Zero Page,X
             2 bytes, 6 cycles           2 bytes, 6 cycles
             Affects: N, Z, C            Affects: N, Z, C

        17 - SLO (Undocumented)         37 - RLA (Undocumented)
             Zero Page,X                 Zero Page,X
             2 bytes, 6 cycles           2 bytes, 6 cycles
             Affects: N, Z, C            Affects: N, Z, C

        18 - CLC                        38 - SEC
             Implied                     Implied
             1 byte, 2 cycles            1 byte, 2 cycles
             Affects: C                  Affects: C

        19 - ORA Absolute,Y             39 - AND Absolute,Y
             3 bytes, 4 cycles*          3 bytes, 4 cycles*
             Affects: N, Z               Affects: N, Z

        1A - NOP (Undocumented)         3A - NOP (Undocumented)
             Implied                     Implied
             1 byte, 2 cycles            1 byte, 2 cycles
             Affects: None               Affects: None

        1B - SLO (Undocumented)         3B - RLA (Undocumented)
             Absolute,Y                  Absolute,Y
             3 bytes, 7 cycles           3 bytes, 7 cycles
             Affects: N, Z, C            Affects: N, Z, C

        1C - NOP (Undocumented)         3C - NOP (Undocumented)
             Absolute,X                  Absolute,X
             3 bytes, 4 cycles*          3 bytes, 4 cycles*
             Affects: None               Affects: None

        1D - ORA Absolute,X             3D - AND Absolute,X
             3 bytes, 4 cycles*          3 bytes, 4 cycles*
             Affects: N, Z               Affects: N, Z

        1E - ASL Absolute,X             3E - ROL Absolute,X
             3 bytes, 7 cycles           3 bytes, 7 cycles
             Affects: N, Z, C            Affects: N, Z, C

        1F - SLO (Undocumented)         3F - RLA (Undocumented)
             Absolute,X                  Absolute,X
             3 bytes, 7 cycles           3 bytes, 7 cycles
             Affects: N, Z, C            Affects: N, Z, C
```


## Key Registers

- **Accumulator (A):** Used in arithmetic and logic operations.
- **X Register (X):** Index register used for addressing.
- **Y Register (Y):** Index register used for addressing.
- **Program Counter (PC):** Holds the address of the next instruction.
- **Stack Pointer (SP):** Points to the top of the stack.
- **Processor Status Register (P):** Contains flags that reflect the outcome of operations.

## References

- "opcode_map_40_7f" — opcode entries for $40–$7F
- "opcode_map_80_bf" — opcode entries for $80–$BF
- "opcode_map_c0_ff" — opcode entries for $C0–$FF
- [6502 Instruction Set](https://masswerk.at/6502/6502_instruction_set.html)
- [6502 Opcodes](https://www.atarimax.com/jindroush.atari.org/aopc.html)
- [Visual6502wiki/6502 all 256 Opcodes - NESdev Wiki](https://www.nesdev.org/wiki/Visual6502wiki/6502_all_256_Opcodes)
- [6502 - map of documented opcodes · GitHub](https://gist.github.com/3be16a5333a50732

## Mnemonics
- BRK
- JSR
- ORA
- AND
- BIT
- ASL
- ROL
- PHP
- PLP
- BPL
- BMI
- CLC
- SEC
- NOP
- KIL
- SLO
- RLA
- ANC
