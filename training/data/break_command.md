# Break Command Flag (B) — 6502

**Summary:** The B flag (Break Command) in the 6502 processor status register (P) is set when a BRK instruction executes and an interrupt is generated to process that software break (see BRK/IRQ vectors at $FFFE/$FFFF).

**Description**

The Break Command bit (B) is a status flag in the 6502 processor status register (P). It is set when a BRK instruction has been executed and the processor generates an interrupt to allow a software break handler to run. BRK forces an interrupt sequence so the CPU vectors to the BRK/IRQ handler.

## Source Code

(omitted — no code listings or register maps in this chunk)

## Key Registers

(omitted — this chunk documents a CPU status flag, not a memory-mapped C64 register)

## References

- "processor_status_register" — expands on status register P and its flags (including B)
- "interrupt_and_reset_vectors" — covers BRK/IRQ handler vector at $FFFE/$FFFF)