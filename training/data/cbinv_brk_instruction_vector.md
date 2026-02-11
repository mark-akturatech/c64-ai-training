# CBINV — BRK Instruction Interrupt Vector ($0316-$0317)

**Summary:** CBINV at $0316-$0317 (locations 790–791 decimal) is the 6510 BRK instruction vector (opcode $00). By default it points to a KERNAL warm-start/initialization routine (calls RESTOR, IOINIT, part of CINT) at $FE66 and then jumps via the BASIC warm-start vector ($A002). Machine-language monitors commonly patch this vector to route BRK to the monitor.

## Description
This vector contains the address of the routine executed when the 6510 BRK instruction (opcode $00) is encountered. The system default points to a KERNAL routine that:

- Calls several KERNAL initialization routines such as RESTOR and IOINIT, and performs part of CINT.
- Then jumps through the BASIC warm-start vector (address $A002).
- The default KERNAL routine location is at $FE66 (decimal 65126).
- The same routine is used when the STOP and RESTORE keys are pressed simultaneously.

Machine-language monitor programs typically overwrite CBINV so that BRK will return control to the monitor warm-start address, enabling breakpoints to transfer control to the monitor for debugging.

## Key Registers
- $0316-$0317 - Vector - CBINV (BRK instruction interrupt vector); default points to KERNAL warm-start routine at $FE66

## References
- "warm_start_and_brk_behavior" — Warm start vector and BRK/STOP/RESTORE behavior

## Labels
- CBINV
