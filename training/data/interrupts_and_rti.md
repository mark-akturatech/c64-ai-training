# MACHINE - Interrupt mechanics: IRQ/NMI/BRK

**Summary:** 6502 interrupt sequence: CPU finishes current instruction, pushes PC (two bytes, high-first) and the status register (one byte) to the stack, then loads the ISR address from vectors at $FFFE/$FFFF (IRQ/BRK) or $FFFA/$FFFB (NMI). RTI restores the pushed status and PC; BRK sets the B flag in the pushed status to distinguish it from an external IRQ.

## Interrupt sequence
- Types: IRQ (maskable interrupt pin), NMI (non-maskable interrupt pin), BRK (software "break" instruction, behaves like an interrupt).
- When an interrupt is taken the CPU:
  1. Completes the current instruction.
  2. Pushes the Program Counter (PC) to the stack: high byte first, then low byte (two bytes total).
  3. Pushes the Processor Status register to the stack (one byte).
  - Total pushed: 3 bytes.
- Vector fetch:
  - IRQ and BRK use the vector at $FFFE/$FFFF (low/high).
  - NMI uses the vector at $FFFA/$FFFB (low/high).
  - The 16-bit address read from the two vector bytes becomes the interrupt service routine (ISR) start address.
- Return:
  - The RTI instruction restores the Processor Status and the PC from the stack and execution resumes where it left off.
- BRK specifics:
  - BRK behaves like a software interrupt and uses the IRQ/BRK vector ($FFFE/$FFFF).
  - BRK sets the B flag in the pushed status byte so the handler can distinguish a BRK from an external IRQ.

## Key Registers
- $FFFA-$FFFB - 6502 - NMI vector (16-bit ISR address low/high)
- $FFFE-$FFFF - 6502 - IRQ/BRK vector (16-bit ISR address low/high)

## References
- "using_irq_vector_and_masking_interrupts" — expands on IRQ vectors and how to change them safely

## Labels
- NMI_VECTOR
- IRQ_BRK_VECTOR

## Mnemonics
- BRK
- RTI
