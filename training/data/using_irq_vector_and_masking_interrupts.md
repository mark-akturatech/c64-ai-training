# Changing the IRQ Vector in RAM (PET / VIC/C64)

**Summary:** Changing the IRQ vector in RAM (e.g. $0090-$0091 on many PET/CBM machines, $0314-$0315 on VIC/Commodore 64) redirects IRQs to a machine-language ISR; always mask interrupts with `SEI` before updating the two-byte vector and `CLI` after to avoid a partial-update race. Alternative: disable the interrupt source via I/O/IA chips (POKE system-specific registers) while updating the vector.

## IRQ vector locations
Many Commodore-family machines use a two-byte RAM vector that the system IRQ handler consults; changing that RAM vector redirects IRQ handling to your code. Common system locations noted in source material:
- PET/CBM (many models): $0090-$0091 (decimal 144–145)
- VIC / Commodore 64: $0314-$0315 (decimal 788–789)

These are system/OS vectors used by the machine's normal IRQ dispatch; changing them affects the regular 60 Hz (approx.) servicing tasks performed by the machine's IRQ handling.

## Changing the vector safely
- Race condition: The vector is two bytes. If an IRQ occurs while you have written only the low byte (or only the high byte), the CPU may fetch a half-old/half-new address and branch to an invalid or unintended location. This can crash the system or leave it unresponsive.
- Mask the IRQ during update: In machine language, execute `SEI` (set interrupt disable) before writing both bytes of the vector, then write both bytes, then execute `CLI` (clear interrupt disable) to re-enable IRQs. `SEI` prevents IRQs but does not disable NMI (NMI is non-maskable).
- Alternative: If you cannot or do not want to use `SEI`/`CLI`, temporarily disable the interrupt source(s) by clearing or masking the event at the I/O/IA chip (for example via POKE to CIA/PIA/VIA registers or other machine-specific control locations). This prevents IRQs from being generated while the vector is updated. (Specific register addresses and bit fields are machine-dependent and must be taken from that machine's hardware docs.)

## Chaining to the original ISR
- To preserve system services (clock, keyboard scanning, cassette handling, cursor flashing, etc.), save the original two-byte vector before replacing it.
- Your custom ISR should perform its work quickly, then jump to or JSR the original handler so the OS services continue. This preserves expected system behavior while letting your code run on each IRQ.
- Restore the original vector before operations that expect the native IRQ behavior (for example, before loading/saving, or returning control to unmodified BASIC programs) to avoid breaking keyboard, tape, and other system services.

## Warnings and effects
- The IRQ routine performs many essential services (clock, RUN/STOP handling, keyboard input, cassette motors, cursor, etc.). Redirecting or disabling IRQs can disable these services.
- Always restore the original vector (or properly chain) before returning to normal system use or performing OS I/O like load/save.
- `SEI` does NOT stop NMI; NMI-driven behavior remains active.
- Changing vectors can leave the system unusable if done incorrectly (partial writes, forgetting to restore, or having a buggy ISR).

## Key Registers
- $0090-$0091 - PET/CBM - system IRQ vector (low/high)
- $0314-$0315 - VIC/C64 - system IRQ vector (low/high)

## References
- "interrupt_project_c64_example" — example of saving original vector and replacing with custom ISR  
- "ia_chips_pia_via_cia_and_interrupt_latching" — IA chips (CIA/PIA/VIA) control interrupt gating and event latching (disabling IRQ sources via POKEs)