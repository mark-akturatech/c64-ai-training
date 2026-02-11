# 6502: CLI (Clear Interrupt Disable)

**Summary:** CLI clears the processor status Interrupt Disable flag (I) on the 6502; opcode $58, implied addressing, 1 byte, 2 cycles. Useable to re-enable maskable IRQs (does not affect NMI).

## Description
CLI (Clear Interrupt Disable) writes 0 into the I flag of the status register. Only the I flag is affected; all other status flags (N, V, D, Z, C) remain unchanged. After executing CLI, maskable IRQ interrupts may be taken (NMI is unaffected).

Operation (pseudocode): 0 -> I

Status flags summary (before/after):
- N Z C I D V  -> only I changes to 0

Instruction form and timing:
- Addressing mode: Implied
- Assembly mnemonic: CLI
- Opcode: $58
- Bytes: 1
- Cycles: 2

Reference: see "instruction_operation_cli" for expanded pseudocode.

## References
- "instruction_operation_cli" — expands on CLI pseudocode and operation details

## Mnemonics
- CLI
