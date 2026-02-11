# SETLFS ($FFBA) — Save file details (KERNAL)

**Summary:** SETLFS is the KERNAL routine vectored at $FFBA that stores file-parameter registers from the CPU registers into zero page: A -> LA ($B8), X -> FA ($BA), Y -> SA ($B9); then returns (RTS). Used before OPEN.

## Description
On entry:
- A = logical file number (LA)
- X = device number (FA)
- Y = secondary address (SA)

This routine writes those values into zero page so subsequent KERNAL file operations (for example OPEN) can use them. It is a simple three-store sequence followed by RTS and is reached via the vector at $FFBA.

## Source Code
```asm
.,FE00 85 B8    STA $B8         store logical filenumber in LA
.,FE02 86 BA    STX $BA         store devicenumber in FA
.,FE04 84 B9    STY $B9         store secondary address in SA
.,FE06 60       RTS
```

## Key Registers
- $B8-$BA - Zero Page - File parameters: $B8 = LA (logical file number), $BA = FA (device number), $B9 = SA (secondary address)

## References
- "open_file_part1" — expands on OPEN; expects these file parameters to be set before call

## Labels
- SETLFS
- LA
- FA
- SA
