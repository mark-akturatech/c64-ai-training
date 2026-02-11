# 6502 RTS — pull return address from stack, add 1, set PC

**Summary:** RTS (Return from Subroutine) pops a 16-bit return address from the stack (little-endian: low then high), increments that 16-bit value by one, and loads it into the program counter (PC). Searchable terms: RTS, PULL, stack, return address, PC, little-endian.

## Operation
RTS performs the following steps in order:
- Pop the low byte of the saved return address from the stack (first PULL).
- Pop the high byte of the saved return address from the stack (second PULL).
- Form a 16-bit little-endian value (high << 8) | low, add 1 to that word, and transfer the result to PC.

The increment is necessary because the address pushed by JSR is stored one less than the actual return address; RTS adds one to restore the correct next-instruction address. The increment is done on the full 16-bit word, so a carry from the low byte properly increments the high byte (wrap across page boundaries is handled by the 16-bit addition).

(Short note: PULL here denotes the 6502 stack pull behavior — pop byte from stack memory.)

## Source Code
```asm
/* RTS */
    src = PULL();
    src += ((PULL()) << 8) + 1;	/* Load return address from stack and add 1. */
    PC = (src);
```

## References
- "instruction_tables_rts" — RTS opcode entry, timing and related details

## Mnemonics
- RTS
