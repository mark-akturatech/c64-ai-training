# Kick Assembler — DTV Instruction Set (Appendix A.3.3)

**Summary:** The DTV instruction set in Kick Assembler includes the standard 6502 mnemonics, undocumented opcodes, and DTV-specific instructions. This mode is enabled with the assembler directive `.cpu dtv`. Table A.5 lists the DTV mnemonics along with their opcode encodings and addressing modes.

**DTV Instruction Set (Appendix A.3.3)**

The DTV instruction set in Kick Assembler encompasses the standard 6502 instructions, undocumented opcodes, and additional DTV-specific instructions. To enable this mode, use the assembler directive:


The following table (Table A.5) provides a comprehensive list of DTV mnemonics, their opcode values, and supported addressing modes.

## Source Code

```
.cpu dtv
```


```text
A.3.3. DTV
The DTV instruction set contains the standard 6502 mnemonics, undocumented opcodes, and the following DTV-specific instructions. Enable this mode with '.cpu dtv'.

Table A.5. DTV Mnemonics

| Mnemonic | Opcode | Addressing Mode |
|----------|--------|-----------------|
| bra      | $12   | Relative        |
| sac      | $32   | Immediate       |
| sir      | $42   | Immediate       |
```

**Note:** Some undocumented opcodes in the DTV set overlap with Kick Assembler's default illegal 6502 table. Refer to the "dcp_dcm_and_lax_lxa_group" and "65c02_mnemonics_table" references for detailed information on specific illegal-opcode groups and contrasts with the 65C02 mode.

## References

- "dcp_dcm_and_lax_lxa_group" — expands on some illegal opcodes in the DTV set that overlap with the default illegal 6502 table
- "65c02_mnemonics_table" — contrasts 65C02 CPU mode additions/modifications versus DTV mode

## Mnemonics
- BRA
- SAC
- SIR
