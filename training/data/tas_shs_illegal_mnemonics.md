# Kick Assembler: Illegal mnemonics TAS / SHS (opcode $9B)

**Summary:** Kick Assembler lists illegal 6502 mnemonics TAS and SHS mapped to opcode $9B in its illegal-opcode table; this entry records the assembler-level mnemonic-to-opcode mapping (opcode $9B) but does not include addressing-mode or behavioral semantics.

**Description**

Kick Assembler's illegal-opcode table includes the mnemonics "tas" and "shs" and associates them with the single-byte opcode $9B. The source provided here is a literal assembler-level mapping (mnemonic → opcode); it does not define the addressing mode, memory operand form, CPU effects, timing, or side effects of executing $9B on a 6502-family CPU. For behavioral details (addressing mode, what is stored/masked, interaction with registers A/X/S, cycle counts, and known emulator/real-hardware behavior), consult dedicated opcode references or the related chunks listed below.

## Source Code

```asm
; Kick Assembler illegal opcode table entry (as provided)
; mnemonics: tas, shs
tas
shs

; opcode encoding (hex)
$9B
```

## References

- "shx_shy_illegal_mnemonics" — expands on other store-high/X/Y illegal mnemonics
- "sax_illegal_mnemonic" — expands on other store-related unofficial opcodes (SAX)
