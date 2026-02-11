# Kick Assembler Table A.4 — Illegal 6502 Mnemonics and Opcode Bytes

**Summary:** Kick Assembler's reference table of undocumented 6502 instructions (e.g., AHX/SHA, ALR/ASR, ANC/ANC2, ARR, AXS/SBX, ISC/INS/ISB, LAS/LAE/LDS) with corresponding opcode bytes and addressing modes.

**Description**

This chunk presents Kick Assembler's Table A.4, detailing undocumented 6502 mnemonics alongside their opcode hex values and addressing modes. The table is structured with mnemonics listed in rows and addressing modes as columns. Each cell contains the opcode byte corresponding to the mnemonic and addressing mode.

## Source Code

```text
-- Table A.4: Undocumented 6502 Mnemonics and Opcode Bytes

Mnemonic | Immediate | Zero Page | Zero Page,X | Absolute | Absolute,X | Absolute,Y | (Indirect,X) | (Indirect),Y
---------|-----------|-----------|-------------|----------|------------|------------|--------------|--------------
ALR/ASR  | $4B       |           |             |          |            |            |              |              
ANC       | $0B       |           |             |          |            |            |              |              
ANC2      | $2B       |           |             |          |            |            |              |              
ARR       | $6B       |           |             |          |            |            |              |              
AXS/SBX   | $CB       |           |             |          |            |            |              |              
AHX/SHA   |           |           |             |          | $9F        | $9B        |              | $93         
ISC/INS/ISB |         | $E7       | $F7         | $EF      | $FF        | $FB        | $E3          | $F3         
LAS/LAE/LDS |         |           |             | $BB      |            |            |              |              
LAX       |           | $A7       | $B7         | $AF      | $BF        | $A3        | $B3          |              
RLA       |           | $27       | $37         | $2F      | $3F        | $3B        | $23          | $33         
RRA       |           | $67       | $77         | $6F      | $7F        | $7B        | $63          | $73         
SAX       |           | $87       | $97         | $8F      |            |            | $83          |              
SLO       |           | $07       | $17         | $0F      | $1F        | $1B        | $03          | $13         
SRE       |           | $47       | $57         | $4F      | $5F        | $5B        | $43          | $53         
TAS       |           |           |             |          | $9B        |            |              |              
SHX       |           |           |             |          | $9E        |            |              |              
SHY       |           |           |             |          |            | $9C        |              |              
```

## References

- "illegal_mnemonics_intro" — Introduction to the illegal instruction table and how to enable the illegal set in Kick Assembler.
- "standard_table_header_addressing_modes" — Quick-reference table layout and column conventions for addressing modes.

## Mnemonics
- ALR
- ASR
- ANC
- ANC2
- ARR
- AXS
- SBX
- AHX
- SHA
- ISC
- INS
- ISB
- LAS
- LAE
- LDS
- LAX
- RLA
- RRA
- SAX
- SLO
- SRE
- TAS
- SHX
- SHY
