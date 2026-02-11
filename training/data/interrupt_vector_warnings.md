# Modifying the IRQ Vector — warnings about atomic updates

**Summary:** Changing the IRQ vector ($FFFE/$FFFF) is a two‑byte operation (low/high, little‑endian) and must be done atomically to avoid leaving a half‑updated address; disable maskable interrupts (SEI) while updating and restore the original vector before attempting disk/tape load or save operations.

## Warning: avoid half-updated IRQ vectors
The IRQ vector is stored as two consecutive bytes (low then high) in zero page memory at $FFFE/$FFFF on a 6502-based system. If an IRQ occurs while you have written only the low byte and not yet the high byte, the CPU may fetch an ISR address composed of one new byte and one old byte — causing execution to jump to an unintended location (often crashing or corrupting state).

To prevent this race:
- Disable maskable IRQs (SEI) before writing both bytes of the vector.
- Update both bytes while interrupts are disabled, then re-enable interrupts (CLI) when safe.
- Remember that SEI does not disable NMI or RESET; those vectors are separate.

Also note practical consequences:
- Many loaders and savers (disk/tape I/O routines) expect the system IRQ vector to be in its original state. If you change the IRQ vector while running, you will likely need to restore the original vector before performing load/save operations or invoking OS routines that assume the default IRQ handler.

## Key Registers
- $FFFE/$FFFF - 6502 - IRQ vector (low byte / high byte, little‑endian)

## References
- "interrupts_intro_and_irq_vectors" — expands on why changing the IRQ vector matters and how vectors interact with system routines
