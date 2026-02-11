# KILL macro and interrupt vector changes

**Summary:** The KILL macro disables all devices that can generate interrupts so you can safely change interrupt vectors; after KILL, set the NMI vector to an RTI and set the maskable IRQ vector to your interrupt routine entry (vectors at $FFFA-$FFFF).

## Description
The KILL macro disables every device in the system that can generate interrupts. With those interrupt sources turned off, you may safely modify the CPU interrupt vectors without spurious interrupts occurring.

Recommended sequence after calling KILL:
- Install an RTI (return from interrupt) at the NMI vector so any accidental NMI will immediately return (NMIs are rarely used in game programs).
- Install the entry address of your maskable IRQ interrupt routine at the IRQ/BRK vector so maskable interrupts transfer to your handler.

The text uses the names NMINV (nonmaskable interrupt vector) and CINV (maskable interrupt vector) for the vectors to update.

## Key Registers
- $FFFA-$FFFF - CPU - NMI/RESET/IRQ interrupt vectors (NMI: $FFFA-$FFFB; RESET: $FFFC-$FFFD; IRQ/BRK: $FFFE-$FFFF) — addresses storing vector pointers you update after KILL

## References
- "disable_other_interrupts" — expands on why disable other interrupt sources first  
- "raster_example_and_assembly_notes" — example program that installs a raster interrupt
