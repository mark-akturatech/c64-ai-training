# Interrupt Disable Flag (I) — 6502

**Summary:** The Interrupt Disable flag (I) is bit 2 in the 6502 processor status register P; it is set by the SEI instruction and cleared by the CLI instruction to disable/enable maskable external interrupts (IRQ).

**Description**
The Interrupt Disable (I) flag is a single bit in the 6502 processor status register P, specifically bit 2. 
- Executing SEI sets the I bit. 
- Executing CLI clears the I bit.

While the I flag is set, the processor will not respond to external (maskable) interrupts from devices; clearing the flag with CLI re-enables those interrupts. The I flag does not affect the handling of non-maskable interrupts (NMI) or the BRK instruction; both are processed regardless of the I flag's state. ([fceux.com](https://fceux.com/web/help/6502CPU.html?utm_source=openai))

## References
- "processor_status_register" — expands on flag P and contains the I bit.

## Mnemonics
- SEI
- CLI
