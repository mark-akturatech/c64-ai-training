# NMI Vector ($0318-$0319)

**Summary:** Describes the Non-Maskable Interrupt vector at $0318-$0319 (NMINV), its two possible sources (RESTORE key, CIA#2), the ROM control flow for handling NMI (ROM sets I flag and jumps through the RAM vector), and the effect of changing the vector (e.g. pointing it at an RTI to disable STOP/RESTORE).

## Vector behavior
$0318-$0319 (labelled NMINV) holds the 16-bit address of the routine executed when a Non-Maskable Interrupt (NMI) occurs. On the stock C64 this vector ultimately points into ROM (reported in the source as decimal 65095 / $FE47).

Two physical sources can assert NMI on the 6510:
- RESTORE key (directly wired to the 6510 NMI pin)
- CIA #2 interrupt line (its IRQ wired to the 6510 NMI pin)

When an NMI occurs the ROM entry sequence does the following (as described in the source):
- Sets the processor Interrupt-disable flag (I).
- Jumps through the RAM vector at $0318/$0319 (so the vector controls which routine is entered).

The default NMI handler (via the vector) discriminates the cause and proceeds:
- If CIA #2 caused the NMI: the handler checks whether any RS-232 (CIA#2-driven) routines should be invoked.
- If RESTORE caused the NMI: the handler checks for an attached cartridge; if present it jumps into the cartridge's warm-start entry point.
  - If there is no cartridge, the handler tests the STOP key. If STOP was pressed together with RESTORE, several Kernal initialization routines (RESTOR, IOINIT and part of CINT) are executed and BASIC is entered through its warm-start vector (reported in the source as decimal 40962).
  - If STOP was not pressed with RESTORE, the interrupt ends and the user sees no effect from pressing RESTORE alone.

Because the ROM jumps through the RAM-stored vector, altering $0318/$0319 changes what happens when RESTORE is pressed. Pointing the vector at an address containing an RTI will cause the NMI to immediately return, effectively disabling the STOP/RESTORE warm-start sequence.

## Source Code
```text
792-793 $318-$319 NMINV
Vector: Non-Maskable Interrupt

This vector points to the address of the routine that will be executed when a Non-Maskable Interrupt (NMI) occurs (currently at 65095 ($FE47)).
```

(quoted behavior and decision flow as in source; source text truncated after "A simple" — no further example code included)

## Key Registers
- $0318-$0319 - CPU/RAM vector - Non-Maskable Interrupt vector (points to NMI handler; default reported as $FE47 / 65095)

## References
- "disable_restore_vector_example" — code example changing NMI vector to RTI