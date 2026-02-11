# 6502 Opcode Map — $00-$1F and $20-$3F (BRK, JSR, ORA/AND, BIT, ASL/ROL, branches, PHP/PLP, CLC/SEC)

**Summary:** Opcode listing for 6502 instruction bytes $00-$1F and $20-$3F showing mnemonic and addressing mode (e.g. (Indirect,X), Immediate, Zero Page, Absolute, Accumulator). Unused/undocumented entries are marked "Future Expansion."

## Opcode Map Overview
This chunk documents the 6502 opcodes in the byte ranges $00-$1F and $20-$3F. Each line shows the opcode byte (hex) and the canonical mnemonic plus addressing mode. Addressing mode notation used here: (Indirect,X) and (Indirect),Y indicate zero-page indirect indexed addressing; Accumulator means the instruction acts on the A register.

"Future Expansion" entries indicate slots not detailed in this map (placeholders for unused/undocumented opcodes within the presented ranges).

## Source Code
```text
        00 - BRK                        20 - JSR
        01 - ORA - (Indirect,X)         21 - AND - (Indirect,X)
        02 - Future Expansion           22 - Future Expansion
        03 - Future Expansion           23 - Future Expansion
        04 - Future Expansion           24 - BIT - Zero Page
        05 - ORA - Zero Page            25 - AND - Zero Page
        06 - ASL - Zero Page            26 - ROL - Zero Page
        07 - Future Expansion           27 - Future Expansion
        08 - PHP                        28 - PLP
        09 - ORA - Immediate            29 - AND - Immediate
        0A - ASL - Accumulator          2A - ROL - Accumulator
        0B - Future Expansion           2B - Future Expansion
        0C - Future Expansion           2C - BIT - Absolute
        0D - ORA - Absolute             2D - AND - Absolute
        0E - ASL - Absolute             2E - ROL - Absolute
        0F - Future Expansion           2F - Future Expansion
        10 - BPL                        30 - BMI
        11 - ORA - (Indirect),Y         31 - AND - (Indirect),Y
        12 - Future Expansion           32 - Future Expansion
        13 - Future Expansion           33 - Future Expansion
        14 - Future Expansion           34 - Future Expansion
        15 - ORA - Zero Page,X          35 - AND - Zero Page,X
        16 - ASL - Zero Page,X          36 - ROL - Zero Page,X
        17 - Future Expansion           37 - Future Expansion
        18 - CLC                        38 - SEC
        19 - ORA - Absolute,Y           39 - AND - Absolute,Y
        1A - Future Expansion           3A - Future Expansion
        1B - Future Expansion           3B - Future Expansion
        1C - Future Expansion           3C - Future Expansion
        1D - ORA - Absolute,X           3D - AND - Absolute,X
        1E - ASL - Absolute,X           3E - ROL - Absolute,X
        1F - Future Expansion           3F - Future Expansion
```

## References
- "opcode_map_40_5f_and_60_7f" — expands on paired opcode ranges $40-$5F and $60-$7F (EOR/ADC/LSR/ROR/JMP/branch and related instructions)
- "opcode_map_80_9f_and_a0_bf" — expands on paired opcode ranges $80-$9F and $A0-$BF (store/load/index/transfer and branch groups)
- "opcode_map_c0_df_and_e0_ff" — expands on paired opcode ranges $C0-$DF and $E0-$FF (compare, inc/dec, SBC, CPX/CPY, and branches)

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
