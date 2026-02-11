# Commodore 64 — 6502 Opcode Map $40-$5F and $60-$7F

**Summary:** Opcode map for 6502 ranges $40-$5F and $60-$7F showing RTI/RTS, EOR/ADC variants with (Indirect,X)/(Indirect),Y addressing, immediate/absolute/zero-page forms, LSR/ROR (zero page/absolute/accumulator), stack ops PHA/PLA, JMP absolute/indirect, branches BVC/BVS, CLI/SEI, and unused opcode slots marked "Future Expansion". Includes exact hex opcode labels ($40-$5F, $60-$7F).

## Overview
This chunk is a compact opcode table for the 6502 opcodes in the two 32-byte ranges $40–$5F and $60–$7F. Each line pairs the opcode in the $40-range (left) with the corresponding opcode in the $60-range (right). "Future Expansion" denotes unused/undefined slots in the map (commonly treated as illegal/unused opcodes). The table lists instruction mnemonic and the addressing mode where applicable (Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X), (Indirect),Y, Indirect, Accumulator).

**[Note: Source may contain an error — the prompt mentioned BCC/BCS branch group, but this specific table only shows BVC (50) and BVS (70) within these ranges.]**

## Source Code
```text
        40 - RTI                        60 - RTS
        41 - EOR - (Indirect,X)         61 - ADC - (Indirect,X)
        42 - Future Expansion           62 - Future Expansion
        43 - Future Expansion           63 - Future Expansion
        44 - Future Expansion           64 - Future Expansion
        45 - EOR - Zero Page            65 - ADC - Zero Page
        46 - LSR - Zero Page            66 - ROR - Zero Page
        47 - Future Expansion           67 - Future Expansion
        48 - PHA                        68 - PLA
        49 - EOR - Immediate            69 - ADC - Immediate
        4A - LSR - Accumulator          6A - ROR - Accumulator
        4B - Future Expansion           6B - Future Expansion
        4C - JMP - Absolute             6C - JMP - Indirect
        4D - EOR - Absolute             6D - ADC - Absolute
        4E - LSR - Absolute             6E - ROR - Absolute
        4F - Future Expansion           6F - Future Expansion
        50 - BVC                        70 - BVS
        51 - EOR - (Indirect),Y         71 - ADC - (Indirect),Y
        52 - Future Expansion           72 - Future Expansion
        53 - Future Expansion           73 - Future Expansion
        54 - Future Expansion           74 - Future Expansion
        55 - EOR - Zero Page,X          75 - ADC - Zero Page,X
        56 - LSR - Zero Page,X          76 - ROR - Zero Page,X
        57 - Future Expansion           77 - Future Expansion
        58 - CLI                        78 - SEI
        59 - EOR - Absolute,Y           79 - ADC - Absolute,Y
        5A - Future Expansion           7A - Future Expansion
        5B - Future Expansion           7B - Future Expansion
        5C - Future Expansion           7C - Future Expansion
        5D - EOR - Absolute,X           7D - ADC - Absolute,X
        5E - LSR - Absolute,X           7E - ROR - Absolute,X
        5F - Future Expansion           7F - Future Expansion
```

## References
- "opcode_map_00_1f_and_20_3f" — expands on previous opcode pairs $00-$1F and $20-$3F (BRK/JSR, ORA/AND, ASL/ROL, BIT, branches)
- "opcode_map_80_9f_and_a0_bf" — expands on subsequent opcode pairs $80-$9F and $A0-$BF (store/load/index/transfer and branch groups)
- "opcode_map_c0_df_and_e0_ff" — expands on remaining opcode pairs $C0-$DF and $E0-$FF (compare, inc/dec, SBC, CPX/CPY, branches)

## Mnemonics
- RTI
- RTS
- EOR
- ADC
- LSR
- ROR
- PHA
- PLA
- JMP
- BVC
- BVS
- CLI
- SEI
