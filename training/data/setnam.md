# SETNAM ($FFBD)

**Summary:** KERNAL function SETNAM at vector $FFBD (real ROM entry $FDF9) establishes filename parameters for OPEN; inputs: A = name length, X/Y = pointer to filename.

## Description
SETNAM stores the filename parameters used by subsequent file operations (e.g., OPEN). Call convention:
- A = filename length (number of bytes)
- X/Y = pointer to filename in memory (low/high address bytes)

Vector and real entry:
- Vector: $FFBD
- Real ROM address: $FDF9

This routine is typically called after SETLFS (which sets device and logical file number) and before OPEN (which uses the filename established by SETNAM).

## Key Registers
- $FFBD - KERNAL ROM - SETNAM vector (JMP entry to real routine at $FDF9)

## References
- "setlfs" — expands on SETLFS, configures device and logical file (#) before OPEN
- "open" — expands on OPEN, uses filename set by SETNAM

## Labels
- SETNAM
