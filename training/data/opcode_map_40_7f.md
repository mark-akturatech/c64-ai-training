# 6502 opcode map $40–$7F

**Summary:** Opcode map for 6502 byte values $40–$7F showing mnemonics and addressing modes (RTI/RTS, EOR/ADC groups, LSR/ROR shifts, stack ops PHA/PLA, JMP absolute/indirect, branches BVC/BVS, flag ops CLI/SEI). Includes reserved/"Future Expansion" placeholders for undocumented/reserved opcodes.

**Opcode map overview**
This block covers opcodes $40–$7F. Opcodes are grouped by low nibble patterns: the $4x/$5x range contains EOR (exclusive OR) and related instructions and shifts (LSR) plus RTI and various control/stack ops; the $6x/$7x range contains ADC (add with carry) and related instructions and shifts (ROR) plus RTS and control/stack ops. Common notable entries:

- RTI/RTS: $40 = RTI, $60 = RTS.
- EOR (0x4x/0x5x) vs ADC (0x6x/0x7x): each addressing mode appears in the same low-nibble positions across the two groups (immediate, zero page, absolute, (indirect,X), (indirect),Y, indexed X/Y).
- Shifts: LSR family in $4x (4A acc, 46 zp, 4E abs, 56 zp,X, 5E abs,X); ROR family in $6x (6A acc, 66 zp, 6E abs, 76 zp,X, 7E abs,X).
- Stack ops: $48 = PHA, $68 = PLA.
- Jumps: $4C = JMP absolute, $6C = JMP indirect.
- Branch and flag ops: $50 = BVC, $70 = BVS; $58 = CLI, $78 = SEI.
- Many entries are listed as "Future Expansion" in the source (reserved/undocumented opcodes).

**[Note: Source contains an apparent numbering error:** the original line "50 - EOR - Absolute,X  70 - ADC - Absolute,X" is inconsistent with the rest of the map; standard 6502 mapping places EOR Absolute,X at $5D and ADC Absolute,X at $7D. The table below uses the standard $5D/$7D entries.**]**

## Source Code
```text
        40 - RTI                        60 - RTS
        41 - EOR - (Indirect,X)         61 - ADC - (Indirect,X)
        42 - JAM (undocumented)         62 - JAM (undocumented)
        43 - SRE - (Indirect,X)         63 - RRA - (Indirect,X)
        44 - NOP - Zero Page            64 - NOP - Zero Page
        45 - EOR - Zero Page            65 - ADC - Zero Page
        46 - LSR - Zero Page            66 - ROR - Zero Page
        47 - SRE - Zero Page            67 - RRA - Zero Page
        48 - PHA                        68 - PLA
        49 - EOR - Immediate            69 - ADC - Immediate
        4A - LSR - Accumulator          6A - ROR - Accumulator
        4B - ALR - Immediate            6B - ARR - Immediate
        4C - JMP - Absolute             6C - JMP - Indirect
        4D - EOR - Absolute             6D - ADC - Absolute
        4E - LSR - Absolute             6E - ROR - Absolute
        4F - SRE - Absolute             6F - RRA - Absolute
        50 - BVC                        70 - BVS
        51 - EOR - (Indirect),Y         71 - ADC - (Indirect),Y
        52 - JAM (undocumented)         72 - JAM (undocumented)
        53 - SRE - (Indirect),Y         73 - RRA - (Indirect),Y
        54 - NOP - Zero Page,X          74 - NOP - Zero Page,X
        55 - EOR - Zero Page,X          75 - ADC - Zero Page,X
        56 - LSR - Zero Page,X          76 - ROR - Zero Page,X
        57 - SRE - Zero Page,X          77 - RRA - Zero Page,X
        58 - CLI                        78 - SEI
        59 - EOR - Absolute,Y           79 - ADC - Absolute,Y
        5A - NOP (undocumented)         7A - NOP (undocumented)
        5B - SRE - Absolute,Y           7B - RRA - Absolute,Y
        5C - NOP - Absolute             7C - NOP - Absolute,X
        5D - EOR - Absolute,X           7D - ADC - Absolute,X
        5E - LSR - Absolute,X           7E - ROR - Absolute,X
        5F - SRE - Absolute,X           7F - RRA - Absolute,X
```

## References
- "opcode_map_00_3f" — expands on Opcode entries for $00–$3F (previous block)
- "opcode_map_80_bf" — expands on Opcode entries for $80–$BF (next block)
- "opcode_map_c0_ff" — expands on Opcode entries for $C0–$FF (later block)

## Mnemonics
- RTI
- RTS
- EOR
- ADC
- JAM
- SRE
- RRA
- NOP
- LSR
- ROR
- PHA
- PLA
- ALR
- ARR
- JMP
- BVC
- BVS
- CLI
- SEI
