# Tape: flag block done and exit interrupt (SEC; ROR $B6; BMI $FC09)

**Summary:** Short interrupt exit sequence used by the tape write routine: SEC sets carry, ROR $B6 marks the buffer high byte negative and flags that sync/data/checksum bytes are written, then BMI $FC09 restores registers and exits the IRQ (branch always taken).

**Description**
This three-instruction sequence is executed when a tape block write completes. Behavior:

- **SEC** — Set the processor Carry flag to 1 (prepares the carry input for the rotate).
- **ROR $B6** — Rotate right the zero-page byte at $B6 through the carry. Because Carry was set, the high bit (bit 7) of $B6 becomes 1. The effect: mark the buffer high byte negative (N = 1) and use that high bit as an internal flag indicating that the sync, data, and checksum bytes have been written.
- **BMI $FC09** — Branch if Negative flag is set. Since ROR set bit 7 to 1, the Negative flag will be true, and the branch is taken; this branches to $FC09 to restore registers and exit the interrupt. (Intent: branch always.)

This sequence is part of the tape write IRQ path and signals completion to the higher-level routine before doing the usual interrupt restoration/return.

## Source Code
```asm
.,FBC8 38       SEC             ; set carry flag
.,FBC9 66 B6    ROR $B6         ; set buffer address high byte negative, flag all sync,
                                ; data and checksum bytes written
.,FBCB 30 3C    BMI $FC09       ; restore registers and exit interrupt, branch always
```

## Key Registers
- **$B6**: Zero-page address used in tape operations. The high byte of the buffer address, it is manipulated to signal the completion of tape write operations.

## References
- "tape_write_irq_routine" — expands on use when the tape block write completes

## Mnemonics
- SEC
- ROR
- BMI
