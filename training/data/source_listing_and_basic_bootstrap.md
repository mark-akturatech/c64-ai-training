# FULL TRACK 27 SOURCE LISTING (BASIC bootstrap for 27M.PAL)

**Summary:** BASIC bootstrap lines that open device 8 for writing with `OPEN 2,8,2,"@0:27M.B,P,W"` and execute machine code with `SYS 40960` (decimal) / `$A000` (hex). Contains the user-level install/load entry points for the assembled program.

**Description**
This chunk is the BASIC-level header and install/entry sequence for a program assembled elsewhere in the source. It provides:
- A `REM` header identifying the assembled source ("27M.PAL").
- An `OPEN` statement that opens channel 2 to device 8 with secondary address 2 and passes the device command string `"@0:27M.B,P,W"` (filename/command for the disk drive).
- A `SYS` call to decimal 40960 (hex `$A000`) to jump to the in-memory assembled code after it has been written/installed.

Typical workflow implied:
1. Run the BASIC lines to create/open the output file on the disk drive (`OPEN ... "@0:27M.B,P,W"`).
2. Provide the assembled machine code (DATA lines / binary) to the open channel (not included here).
3. Execute the installed code with `SYS 40960` to jump to the code entry at `$A000`.

(Parenthetical: `OPEN` syntax is BASIC's `OPEN channel,device,secondary,"command-string"`.)

## Source Code
```basic
100 REM 27M.PAL
110 REM
120 OPEN 2,8,2,"@0:27M.B,P,W"
130 REM
140 SYS 40960
```

## References
- "data_blob_machine_code" — contains the binary DATA lines referenced by the assembled program
- "assembler_directives_and_org" — contains assembler directives and the program organization (ORGs, labels, entry points)