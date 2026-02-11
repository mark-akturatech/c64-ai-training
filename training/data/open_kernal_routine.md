# KERNAL OPEN ($FFC0)

**Summary:** KERNAL routine OPEN at $FFC0 (65472) opens a logical file; requires SETLFS and SETNAM to be called first. A, X, Y registers are affected; returns error codes 1,2,4,5,6,240 and READST.

## Description
Purpose: Open a logical file for subsequent I/O operations. No direct arguments are passed in registers or memory at the time of the call; instead, OPEN uses file information prepared by the SETLFS and SETNAM KERNAL routines.

Call address: $FFC0 (hex) / 65472 (decimal)

Preparatory routines (must be called before OPEN):
- SETLFS — set logical file, device, and secondary address
- SETNAM — supply filename pointer and length

Communication registers: None

Stack requirements: None

Registers affected: A, X, Y

Error returns: 1, 2, 4, 5, 6, 240 and READST (use READST to examine error status)

How to use:
1. Call SETLFS to set logical file number, device number, and secondary address.
2. Call SETNAM to provide the filename (pointer and length).
3. JSR $FFC0 (OPEN) to open the logical file.

## Source Code
```asm
        LDA #NAME2-NAME    ; LENGTH OF FILE NAME FOR SETLFS
        LDY #>NAME         ; ADDRESS OF FILE NAME
        LDX #<NAME
        JSR SETNAM
        LDA #15
        LDX #8
        LDY #15
        JSR SETLFS
        JSR OPEN
NAME    .BYT 'I/O'
```

## Key Registers
- $FFC0 - KERNAL - OPEN (open logical file entry point)

## References
- "setlfs_kernal_routine" — sets logical file number, device number, secondary address
- "setnam_kernal_routine" — provides filename pointer and length for OPEN
- "readst_kernal_routine" — check error status after OPEN

## Labels
- OPEN
