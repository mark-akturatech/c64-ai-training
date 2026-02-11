# RESTOR ($FF8A)

**Summary:** Restores the default interrupt vector table at $0314-$0333 (KERNAL vectors). KERNAL entry $FF8A (real ROM address $FD15). No input/output parameters — call with JSR $FF8A.

## Description
RESTOR is a KERNAL routine that restores the system's default interrupt vector table into the RAM area $0314-$0333. It takes no parameters and produces no return values; invoke it with JSR $FF8A. The routine's entrypoint in the visible KERNAL table is $FF8A and its physical ROM address is $FD15.

Use this routine when you need to revert any modified vectors back to the KERNAL-supplied defaults. For moving vector tables between system and user areas, see the VECTOR routine.

## Key Registers
- $0314-$0333 - KERNAL - Interrupt vector table area restored by RESTOR
- $FF8A - KERNAL - RESTOR entrypoint (use JSR $FF8A)
- $FD15 - ROM - Real ROM address of RESTOR

## References
- "VECTOR ($FF8D)" — transferring vector table between system and user areas (related routine)

## Labels
- RESTOR
