# FAKE IRQ TAPE (KERNAL, $FF43-$FF47)

**Summary:** A KERNAL helper routine at $FF43-$FF47 that manipulates the status byte on the stack using PHP, PLA, AND #$EF, and PHA. This clears bit 4 (the B flag) of the status register stored on the stack, affecting the behavior upon returning from an interrupt.

**Description**

This routine modifies the status byte on the stack, which will be restored by the RTI instruction, by clearing bit 4 (the B flag). The sequence of operations is:

- PHP: Pushes the current processor status register onto the stack.
- PLA: Pulls the top byte from the stack into the accumulator (removing the pushed status byte).
- AND #$EF: Clears bit 4 of the accumulator (mask 1110 1111).
- PHA: Pushes the modified accumulator back onto the stack.

The net effect is that the stored status byte, which RTI will restore, is rewritten with bit 4 cleared. This manipulation is used by the KERNAL to alter the processor's behavior when returning from an interrupt, particularly in handling tape-related IRQ conditions.

The disassembly fragment indicates that this routine is part of the IRQ handling process. The standard IRQ vector at $FFFE/$FFFF points to the KERNAL's IRQ entry routine at $FF48, which saves the processor registers and then jumps through the vector stored at $0314/$0315 (CINV) to the main IRQ service routine.

The "tape_irq_vectors" table is a set of vectors related to tape IRQ handling routines.

## Source Code

```asm
.,FF43 08       PHP             ; push processor status onto stack
.,FF44 68       PLA             ; pull top of stack into A (remove pushed byte)
.,FF45 29 EF    AND #$EF        ; clear bit 4 (mask with $EF)
.,FF47 48       PHA             ; push modified A back onto stack
```

## Key Registers

- $FF43-$FF47: KERNAL ROM - FAKE IRQ TAPE helper (stack status byte modifier)
- $FF48: KERNAL ROM - IRQ entry routine
- $0314-$0315: CINV - Vector: Hardware IRQ Interrupt Address

## References

- "tape_irq_vectors" — related tape IRQ handling table and routines
- CINV ($0314/$0315) — Vector: Hardware IRQ Interrupt Address
- KERNAL IRQ entry routine at $FF48

## Labels
- CINV
