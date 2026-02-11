# Opcode map: $C0–$FF (6502)

**Summary:** Opcode map entries for byte values $C0–$FF showing mnemonics, addressing modes, byte sizes, cycle counts, and notes on undocumented opcodes. This range includes compare instructions (CPY, CPX, CMP), SBC family, increment/decrement operations, branch instructions, flag operations, and the NOP instruction at $EA. Useful for instruction decoding and assembler reference.

**Overview**

This chunk documents the 6502 opcode assignments for the high range $C0–$FF. It lists each opcode byte with its mnemonic, addressing mode, byte size, cycle count, and notes on undocumented opcodes. The table shows grouped instruction families:

- **Compare Instructions:** CPY, CPX, and CMP appear across $C0–$CF and $E0–$EF ranges in immediate, zero page, absolute, and indexed variants.
- **SBC Family:** Appears in $E1, $E5, $E9, $ED, $F1, $F5, $F9, and $FD addressing-mode variants.
- **Increment/Decrement Instructions:** DEC and INC in zero page, absolute, and indexed forms (e.g., $C6, $CE, $D6, $DE, $E6, $EE, $F6, $FE).
- **Branch Instructions:** BNE at $D0 and BEQ at $F0.
- **Flag Operations:** CLD at $D8 and SED at $F8.
- **NOP Instruction:** $EA is the official no-operation instruction.
- **Undocumented Opcodes:** Several opcodes are marked as "Undocumented" or "Future Expansion," indicating undefined or unspecified instruction encodings.

This listing serves as a concise decode table; the full code/data table follows in the Source Code section.

## Source Code

```text
        C0 - CPY - Immediate            E0 - CPX - Immediate
             Bytes: 2                        Bytes: 2
             Cycles: 2                       Cycles: 2

        C1 - CMP - (Indirect,X)         E1 - SBC - (Indirect,X)
             Bytes: 2                        Bytes: 2
             Cycles: 6                       Cycles: 6

        C2 - Undocumented               E2 - Undocumented
             Bytes: 1                        Bytes: 1
             Cycles: 2                       Cycles: 2

        C3 - Undocumented               E3 - Undocumented
             Bytes: 2                        Bytes: 2
             Cycles: 8                       Cycles: 8

        C4 - CPY - Zero Page            E4 - CPX - Zero Page
             Bytes: 2                        Bytes: 2
             Cycles: 3                       Cycles: 3

        C5 - CMP - Zero Page            E5 - SBC - Zero Page
             Bytes: 2                        Bytes: 2
             Cycles: 3                       Cycles: 3

        C6 - DEC - Zero Page            E6 - INC - Zero Page
             Bytes: 2                        Bytes: 2
             Cycles: 5                       Cycles: 5

        C7 - Undocumented               E7 - Undocumented
             Bytes: 2                        Bytes: 2
             Cycles: 5                       Cycles: 5

        C8 - INY                        E8 - INX
             Bytes: 1                        Bytes: 1
             Cycles: 2                       Cycles: 2

        C9 - CMP - Immediate            E9 - SBC - Immediate
             Bytes: 2                        Bytes: 2
             Cycles: 2                       Cycles: 2

        CA - DEX                        EA - NOP
             Bytes: 1                        Bytes: 1
             Cycles: 2                       Cycles: 2

        CB - Undocumented               EB - Undocumented
             Bytes: 2                        Bytes: 2
             Cycles: 2                       Cycles: 2

        CC - CPY - Absolute             EC - CPX - Absolute
             Bytes: 3                        Bytes: 3
             Cycles: 4                       Cycles: 4

        CD - CMP - Absolute             ED - SBC - Absolute
             Bytes: 3                        Bytes: 3
             Cycles: 4                       Cycles: 4

        CE - DEC - Absolute             EE - INC - Absolute
             Bytes: 3                        Bytes: 3
             Cycles: 6                       Cycles: 6

        CF - Undocumented               EF - Undocumented
             Bytes: 3                        Bytes: 3
             Cycles: 6                       Cycles: 6

        D0 - BNE                        F0 - BEQ
             Bytes: 2                        Bytes: 2
             Cycles: 2 (+1 if branch taken, +1 if page crossed)
             Cycles: 2 (+1 if branch taken, +1 if page crossed)

        D1 - CMP - (Indirect),Y         F1 - SBC - (Indirect),Y
             Bytes: 2                        Bytes: 2
             Cycles: 5 (+1 if page crossed)  Cycles: 5 (+1 if page crossed)

        D2 - Undocumented               F2 - Undocumented
             Bytes: 1                        Bytes: 1
             Cycles: 2                       Cycles: 2

        D3 - Undocumented               F3 - Undocumented
             Bytes: 2                        Bytes: 2
             Cycles: 8                       Cycles: 8

        D4 - Undocumented               F4 - Undocumented
             Bytes: 2                        Bytes: 2
             Cycles: 4                       Cycles: 4

        D5 - CMP - Zero Page,X          F5 - SBC - Zero Page,X
             Bytes: 2                        Bytes: 2
             Cycles: 4                       Cycles: 4

        D6 - DEC - Zero Page,X          F6 - INC - Zero Page,X
             Bytes: 2                        Bytes: 2
             Cycles: 6                       Cycles: 6

        D7 - Undocumented               F7 - Undocumented
             Bytes: 2                        Bytes: 2
             Cycles: 6                       Cycles: 6

        D8 - CLD                        F8 - SED
             Bytes: 1                        Bytes: 1
             Cycles: 2                       Cycles: 2

        D9 - CMP - Absolute,Y           F9 - SBC - Absolute,Y
             Bytes: 3                        Bytes: 3
             Cycles: 4 (+1 if page crossed)  Cycles: 4 (+1 if page crossed)

        DA - Undocumented               FA - Undocumented
             Bytes: 1                        Bytes: 1
             Cycles: 2                       Cycles: 2

        DB - Undocumented               FB - Undocumented
             Bytes: 2                        Bytes: 2
             Cycles: 8                       Cycles: 8

        DC - Undocumented               FC - Undocumented
             Bytes: 3                        Bytes: 3
             Cycles: 4                       Cycles: 4

        DD - CMP - Absolute,X           FD - SBC - Absolute,X
             Bytes: 3                        Bytes: 3
             Cycles: 4 (+1 if page crossed)  Cycles: 4 (+1 if page crossed)

        DE - DEC - Absolute,X           FE - INC - Absolute,X
             Bytes: 3                        Bytes: 3
             Cycles: 7                       Cycles: 7

        DF - Undocumented               FF - Undocumented
             Bytes: 3                        Bytes: 3
             Cycles: 7                       Cycles: 7
```

## References

- "opcode_map_00_3f" — expands on Opcode entries for $00–$3F
- "opcode_map_40_7f" — expands on Opcode entries for $40–$7F
- "opcode_map_80_bf" — expands on Opcode entries for $80–$BF

## Mnemonics
- CPY
- CPX
- CMP
- SBC
- DEC
- INC
- INY
- INX
- DEX
- NOP
- BNE
- BEQ
- CLD
- SED
