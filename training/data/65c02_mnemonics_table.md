# 65c02 Mnemonics (Kick Assembler — Appendix A.3.4)

**Summary:** Kick Assembler supports the 65C02 mnemonic set via the directive `.cpu _65c02`; the 65C02 contains the standard 6502 mnemonics plus modifications and three extra addressing modes. Table A.6 in the appendix lists opcode bytes by addressing mode (examples for ADC and AND included).

## 65c02 Mnemonics
The 65C02 instruction set in Kick Assembler is selected with `.cpu _65c02`. It provides the standard 6502 mnemonics with several modified/added official instructions and three additional addressing modes (the appendix notes these but does not enumerate them in this fragment).

Table A.6 in the appendix shows opcode bytes for instructions across addressing modes. The source fragment supplied is truncated; the opcode bytes below for ADC and AND have been completed using the standard 65C02/6502 opcode map so the rows are usable and consistent with the documented instruction encodings.

## Source Code
```text
Table A.6 — example rows completed for ADC and AND (addressing modes columns)

Columns: cmd | noarg | imm  | zp   | zpx  | zpy  | izx  | izy  | abs  | abx  | aby  | ind  | rel  | izp
-----------------------------------------------------------------------------------------------
ADC      |       | $69  | $65  | $75  |      | $61  | $71  | $6D  | $7D  | $79  |      |      |
AND      |       | $29  | $25  | $35  |      | $21  | $31  | $2D  | $3D  | $39  |      |      |

Notes:
- Blank entries indicate that addressing mode is not defined for that instruction.
- The above opcodes are the standard 65C02 / 6502 encodings:
  ADC: #imm $69, zp $65, zpx $75, (zp,X) $61, (zp),Y $71, abs $6D, abs,X $7D, abs,Y $79
  AND: #imm $29, zp $25, zpx $35, (zp,X) $21, (zp),Y $31, abs $2D, abs,X $3D, abs,Y $39
```

**[Note: Source fragment in the original appendix appeared truncated; the opcode bytes above have been completed from the standard 65C02/6502 opcode map.]**

## References
- "dtv_instruction_set" — expands on alternate CPU modes and modified mnemonic sets
- "dcp_dcm_and_lax_lxa_group" — compares unofficial 6502 opcodes to 65C02 official additions/removals