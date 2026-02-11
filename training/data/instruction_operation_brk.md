# 6502 BRK (Force Interrupt) pseudocode

**Summary:** BRK sequence: increment PC, push return address (PCH then PCL) and processor status (SR) onto the stack with the Break flag set in the pushed SR, set the Interrupt Disable (I) flag, and load the new PC from the IRQ/BRK vector at $FFFE/$FFFF.

## BRK behavior
This pseudocode shows the 6502 BRK/interrupt entry sequence in order:

- PC is incremented (advance past the BRK opcode/operand).
- The return address is pushed onto the stack as a two-byte value: first the high byte, then the low byte (PCH then PCL).
- The Break (B) flag is set in the copy of the status register that will be pushed; that pushed SR therefore has the B bit = 1.
- The status register (SR) is pushed to the stack.
- The Interrupt Disable (I) flag is set to prevent further interrupts.
- The new program counter is loaded from the IRQ/BRK vector (low byte at $FFFE, high byte at $FFFF), forming the vector as (LOAD($FFFE) | (LOAD($FFFF) << 8)).

(Parenthetical: "SR" denotes the processor status register.)

## Source Code
```asm
/* BRK */
    PC++;
    PUSH((PC >> 8) & 0xff);	/* Push return address onto the stack. */
    PUSH(PC & 0xff);
    SET_BREAK((1));             /* Set BFlag before pushing */
    PUSH(SR);
    SET_INTERRUPT((1));
    PC = (LOAD(0xFFFE) | (LOAD(0xFFFF) << 8));
```

## Key Registers
- $FFFE-$FFFF - CPU - IRQ/BRK vector (low byte at $FFFE, high byte at $FFFF) — loaded into PC on BRK/IRQ

## References
- "instruction_tables_brk" — BRK opcode and vector behavior

## Mnemonics
- BRK
