# MACHINE - SEI: short caution for timing-critical code

**Summary:** SEI (6502) sets the Interrupt Disable flag (I) to mask maskable IRQs; it can be used to lock out interrupts for precise timing but is potentially dangerous and is seldom necessary.

## Details
- What SEI does: SEI sets the processor Interrupt Disable flag (I), preventing maskable IRQs from being accepted. NMIs and RESET are not affected.
- Why it's dangerous: disabling interrupts removes system-level servicing (raster IRQs, serial/disk handling, CIA timers, etc.), which can cause missed events, corrupted I/O, lost timing, or system lockups if the disabled interval is too long.
- When to consider it: only for extremely short, well-audited critical sections where no other option can achieve the required cycle determinism.
- Minimal rules if used:
  - Keep the disabled interval as short as possible.
  - Save/restore any state that interrupt handlers or system code expect.
  - Ensure no code paths can block waiting for an interrupt while I is set.
  - Remember SEI does not affect NMI/RESET — it is not a complete “stop everything” mechanism.
- Prefer alternatives: design for interrupt-tolerance, schedule timing around known interrupt-free windows, use raster-synchronized techniques or cycle-counted code instead of broadly disabling IRQs.

## References
- "timing_rules_and_memory_cycles" — expands on When to consider disabling interrupts for timing

## Mnemonics
- SEI
