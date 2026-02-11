# Kick Assembler Quick Reference — Addressing-Mode Opcode Mapping (Indexed/Indirect Encodings)

**Summary:** This reference provides a mapping of 6502 addressing modes to their corresponding opcode bytes for the `STA` (Store Accumulator) instruction. It includes the instruction mnemonic, addressing modes, and their respective opcodes, facilitating the understanding of indexed and indirect addressing in 6502 assembly language.

**Quick Description**

The table below aligns the `STA` instruction with various 6502 addressing modes, listing the corresponding opcode bytes. This mapping is essential for assembly language programmers working with indexed and indirect addressing modes.

## Source Code

```text
Quick Reference

cmd  noarg  imm  zp   zpx  zpy  izx  izy  abs  abx  aby
STA  ---    ---  $85  $95  ---  $81  $91  $8D  $9D  $99
```

## Key Registers

- **A**: Accumulator
- **X**: Index Register X
- **Y**: Index Register Y

## References

- [6502 Instruction Set](https://www.masswerk.at/6502/6502_instruction_set.html)
- [Kick Assembler Manual](https://theweb.dk/KickAssembler/webhelp/content/index.html)

## Mnemonics
- STA
