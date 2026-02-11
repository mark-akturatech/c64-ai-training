# 6502 interrupts on Commodore machines (IRQ, NMI, BRK, stack / return-address behavior)

**Summary:** IRQ (~60 Hz) fires on all Commodore machines; NMI availability/usage varies by model (PET/CBM: unused but present; 264 series: not available; VIC-20 / C64: used for RESTORE and RS‑232). BRK behaves like an IRQ but sets the B (break) flag in the status register (P bit 4). Interrupt entry pushes PC and P to the stack; ROM interrupt vectors/routines commonly push A, X, Y afterward to preserve registers. The return address pushed for an interrupt is the actual return address (unlike JSR/RTS, which stores return address − 1).

## Interrupt behavior and model differences
- IRQ: On all Commodore machines referenced here, the IRQ hardware interrupt occurs at roughly 60 Hz (used for system timing and background tasks).
- NMI: Available but used differently by models:
  - PET/CBM: NMI is unused by the system but available to software.
  - 264-series: NMI not available.
  - VIC-20 and C64: NMI is used for the RESTORE key and for RS‑232 communications (machine-specific uses).
- BRK: The BRK instruction triggers an interrupt sequence similar to an IRQ, but the processor sets the B (break) flag (status register bit 4). The B bit lets software distinguish BRK-caused interrupts from external IRQs.

## Stack and register preservation
- CPU hardware on interrupt entry pushes, in this order: PC high, PC low, and the status register (P). These three bytes are pushed by the CPU as part of the interrupt entry sequence.
- ROM interrupt-entry code (system ROM vectors/routines) typically pushes A, X, and Y registers onto the stack (done by ROM code, not the CPU hardware) so the ISR can use those registers and restore them before returning.
- Distinction vs JSR/RTS:
  - For interrupts (IRQ/NMI/BRK), the address pushed to the stack is the true return address (the address of the next instruction to execute upon return).
  - For subroutine calls (JSR), the return address stored on the stack differs: JSR/RTS store the return address minus one (JSR pushes PC+2−1). This difference matters when examining stack contents or writing low-level return handling code.

## References
- "interrupts_and_rti" — expands on interrupt mechanics and differences between BRK and IRQ

## Mnemonics
- BRK
- JSR
- RTS
