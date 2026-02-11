# NMOS 6510 — single-byte undocumented NOPs ($DA, $FA)

**Summary:** Undocumented single-byte NOP opcodes $DA and $FA on NMOS 6502 / 6510 (C64). Both are "No operation" (NOP), size 1 byte, 2 clock cycles.

## Description
The opcodes $DA and $FA are undocumented (illegal) single-byte NOP instructions on NMOS 6502-family CPUs (including the 6510 used in the Commodore 64). Their observable behavior:

- Mnemonic: NOP (No operation)
- Size: 1 byte
- Cycles: 2 clock cycles (NMOS 6502 timing)
- Effect: No changes to registers or memory besides advancing the program counter by one byte and consuming cycles.

These belong to the single-byte NOP class (not the multi-byte/imm variants). For other undocumented NOP forms (immediate-mode, multi-byte follow-ons), see the referenced "immediate_nop_variants".

## Source Code
```text
Opcode  Mnemonic  Description     Size  Cycles
$DA     NOP       No operation    1     2
$FA     NOP       No operation    1     2
```

```asm
; Single-byte undocumented NOPs (NMOS 6502 / 6510)
        .byte $DA    ; NOP - 1 byte, 2 cycles
        .byte $FA    ; NOP - 1 byte, 2 cycles
```

## References
- "immediate_nop_variants" — expands on immediate-mode undocumented NOPs (#imm) and multi-byte NOP types

## Mnemonics
- NOP
