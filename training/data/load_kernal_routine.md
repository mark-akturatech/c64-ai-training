# LOAD ($FFD5) — KERNAL routine

**Summary:** KERNAL LOAD routine at $FFD5 (65493) reads data from an input device into RAM or verifies device data against memory. Uses A (0=LOAD, 1=VERIFY) and X,Y for start address when secondary address=0; requires SETLFS and SETNAM before calling.

## Description
LOAD reads bytes from an opened input device into memory or verifies device data without modifying RAM. Behavior depends on the device's secondary address (SA):

- A = 0: perform a LOAD (write incoming bytes to memory).
- A = 1: perform a VERIFY (compare incoming bytes to RAM; do not alter memory).

If the device was opened with SA = 0, the device header is ignored and X/Y must contain the 16-bit start address for the load (relocated load). If the device was opened with SA = 1, the starting address is taken from the file header on the device.

The routine returns the address of the highest RAM location loaded (returned in X and Y). Registers A, X, and Y are affected by the call. No stack setup is required.

Notes and restrictions:
- Preparatory calls required: SETLFS (select device/logical file/SA) and SETNAM (supply filename).
- You cannot LOAD from these devices: keyboard (0), RS-232 (2), or screen (3).
- Error returns listed by the source: 0, 4, 5, 8, 9 and READST (check device status via READST).

## How to use
1. Call SETLFS to set device number, logical file number, and secondary address (use SA=0 for relocated loads).
2. Call SETNAM with filename pointer and length.
3. Set A = 0 for LOAD or A = 1 for VERIFY.
4. If SA = 0 (relocated), set X/Y = start address.
5. JSR $FFD5 to execute LOAD.
6. On return, inspect X/Y for the highest RAM address loaded and check for error codes (or READST).

## Source Code
```asm
;LOAD   A FILE FROM TAPE

        LDA #DEVICE1        ;SET DEVICE NUMBER
        LDX #FILENO         ;SET LOGICAL FILE NUMBER
        LDY CMD1            ;SET SECONDARY ADDRESS
        JSR SETLFS
        LDA #NAME1-NAME     ;LOAD A WITH NUMBER OF
                            ;CHARACTERS IN FILE NAME
        LDX #<NAME          ;LOAD X AND Y WITH ADDRESS OF
        LDY #>NAME          ;FILE NAME
        JSR SETNAM
        LDA #0              ;SET FLAG FOR A LOAD
        LDX #$FF            ;ALTERNATE START
        LDY #$FF
        JSR LOAD
        STX VARTAB          ;END OF LOAD
        STY VARTA B+1
        JMP START
NAME    .BYT 'FILE NAME'
NAME1                       ;
```

## Key Registers
- $FFD5 - KERNAL - LOAD/VERIFY call (uses/affects A, X, Y; returns highest RAM location loaded)

## References
- "setlfs_kernal_routine" — SETLFS routine (select device, logical file, secondary address)
- "setnam_kernal_routine" — SETNAM routine (supply filename pointer/length)
- "readst_kernal_routine" — READST routine (check device status / error codes)

## Labels
- LOAD
