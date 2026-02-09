# $0316-$0317 CBINV: Vector — BRK Instruction Interrupt

**Summary:** $0316-$0317 (CBINV) is the BRK instruction interrupt vector for the 6510 (BRK opcode $00); it holds the little-endian address of the routine executed on a BRK, defaulting to the Kernal warm-start handler at 65126 ($FE66) which calls RESTOR, IOINIT, part of CINT and then jumps via the BASIC warm start vector (40962).

## Description
This two-byte vector at $0316-$0317 (named CBINV) contains the address of the routine invoked whenever the 6510 BRK instruction (opcode $00) is executed. The stored address is little-endian (low byte at $0316, high byte at $0317).

Default behavior:
- The default vector value points to a Kernal routine located at decimal 65126 (hex $FE66).
- That Kernal routine calls several initialization routines (RESTOR, IOINIT and part of CINT) and then jumps through the BASIC warm start vector at 40962 (decimal).
- The same Kernal routine is used when the STOP and RESTORE keys are pressed simultaneously.

Common modifications:
- Machine-language monitors typically repoint CBINV to a monitor warm-start address so breakpoints can return control to the monitor for debugging.

## Source Code
(omitted — no assembly listings or register maps provided)

## Key Registers
- $0316-$0317 - RAM - CBINV: BRK instruction interrupt vector (stores little-endian address of BRK handler; default -> 65126 / $FE66)

## References
- "nminv_vector" — expands on other system interrupt vectors (NMI)