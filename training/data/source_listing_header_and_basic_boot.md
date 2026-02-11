# byRiclianll — BASIC wrapper: SINGLE SECTOR 23 ERROR SOURCE LISTING

**Summary:** BASIC bootstrap that opens disk file "@0: 23A- B, P, W" and jumps to machine code with SYS 40960; includes human-readable title and REM lines. Searchable terms: OPEN 2, device 8 (disk), file string "@0: 23A- B, P, W", SYS40960, 23A.PAL, BASIC bootstrap.

## Description
This chunk is the non-assembly header (BASIC wrapper) that precedes the machine-code listing titled "SINGLE SECTOR 23 ERROR SOURCE LISTING". It contains the human-readable title and REM comments, an OPEN call to load the assembly/machine file from the disk, and a SYS call that transfers execution to the loaded code.

- The OPEN line opens channel 2 to device 8 (disk drive) and requests the file string "@0: 23A- B, P, W". (OPEN 2 to device 8 = disk drive.)
- The SYS 40960 call transfers control to the machine code at decimal 40960 (hex $A000). (SYS 40960 jumps to $A000.)
- The BASIC lines are simply a bootstrap; actual assembly and GCR initialization are in the following assembly chunks (see References).

## Source Code
```basic
100 REM 23A.PAL
110 REM
120 OPEN 2,8,2,"@0: 23A- B, P, W"
130 REM
140 SYS 40960
```

## References
- "initialization_and_gcr_conversion" — expands on assembly origin and initialization (follows the BASIC bootstrap)
