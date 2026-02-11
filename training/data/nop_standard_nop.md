# Kick Assembler: NOP opcode $EA (standard)

**Summary:** Standard 6502 NOP instruction encoded as $EA; appears in Kick Assembler's mnemonic table and may be listed among "illegal mnemonics" entries if the assembler's .cpu mode is not set to _6502.

## Description
The NOP (No Operation) instruction is the official 6502 opcode with machine code $EA. In Kick Assembler listings this mnemonic appears alongside its opcode. Kick Assembler's mnemonic table includes both official and unofficial (illegal) opcodes; if the assembler's .cpu mode is not set to _6502, NOP may show up among entries flagged as illegal mnemonics by the assembler's general-purpose opcode table view.

## Source Code
```asm
; Kick Assembler style listing showing mnemonic and opcode
nop
$ea
```

## References
- "dcp_dcm_and_lax_lxa_group" — expands on context: table contains both official and unofficial opcodes

## Mnemonics
- NOP
