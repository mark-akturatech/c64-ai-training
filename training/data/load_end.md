# LOAD END — KERNAL loader finalization

**Summary:** Final part of the KERNAL loader at $F5A9-$F5AE: clears the carry flag (CLC), loads X/Y from zero page end-address bytes ($00AE/$00AF), and returns (RTS). Uses LDX/LDY which affect N/Z flags.

## Description
This routine finishes a file/load operation by:
- Clearing the carry flag with CLC so the caller sees a successful load.
- Loading the low byte of the end address into X from zero page $00AE.
- Loading the high byte of the end address into Y from zero page $00AF.
- Returning to the caller with RTS.

Behavioral notes:
- LDX/LDY update the processor N and Z flags according to the loaded bytes; only the carry flag is explicitly cleared here.
- The low/high bytes are stored in zero page locations $00AE (low) and $00AF (high) by the loader; this routine simply transfers them into X/Y for the caller.

## Source Code
```asm
.,F5A9 18       CLC
.,F5AA A6 AE    LDX $AE
.,F5AC A4 AF    LDY $AF
.,F5AE 60       RTS
```

## Key Registers
- $00AE - Zero Page - End address low byte (loaded into X)
- $00AF - Zero Page - End address high byte (loaded into Y)

## References
- "load_from_serial_bus" — expands on the loader's loop and how the end address is produced/stored in $AE/$AF

## Labels
- $00AE
- $00AF
