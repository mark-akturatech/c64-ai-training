# CLI — Clear Interrupt Disable (6502)

**Summary:** CLI clears the processor status Interrupt Disable flag (I = 0) in the 6502 status register P, enabling maskable IRQs. Searchable terms: CLI, I flag, processor status, 6502.

## Operation
CLI is the 6502 instruction that clears the Interrupt Disable bit (I) in the processor status register P. Clearing I (I = 0) allows maskable IRQ interrupts to occur; it does not modify the other status flags. (I = Interrupt Disable bit in P.)

## Source Code
```asm
; Assembly mnemonic (implied addressing)
CLI
```

```text
/* CLI */
    SET_INTERRUPT((0));
```

## References
- "instruction_tables_cli" — expands on CLI opcode and encoding

## Mnemonics
- CLI
