# SINGLE SECTOR 21 ERROR SOURCE LISTING — BASIC loader header

**Summary:** BASIC loader header using OPEN channel 2 to device 8 and a SYS 40960 ($A000) transfer to machine code; includes REM comments and a file-open string "@0:DAS.B,P,W". Searchable terms: OPEN 2,8,2, device 8, SYS 40960, $A000, BASIC-to-machine-code transfer.

## Description
This chunk is a minimal Commodore BASIC program header that opens a file on device 8 (disk drive) and then transfers execution from BASIC to assembled machine code via SYS 40960 (decimal), which is $A000 in hexadecimal — the usual machine-code entry address. Lines include REM comments and the OPEN statement that prepares a channel (file handle) for file I/O before the SYS call.

- REM lines (100, 110, 130) are program comments and a title line ("SINGLE SECTOR 21 ERROR SOURCE LISTING").
- OPEN 2,8,2,"@0:DAS.B,P,W" opens channel 2 to device 8 with secondary address 2 and the file specifier "@0:DAS.B,P,W" (as in the source). The exact file-mode letters are preserved from the source; they are not expanded here.
- SYS 40960 transfers control from BASIC to the machine-code routine expected at memory address 40960 decimal ($A000 hex).

**[Note: Source contained OCR/typo artifacts: "0PEN2" was corrected to "OPEN 2", and "SYS40960" was corrected to "SYS 40960".]**

## Source Code
```basic
10 REM SINGLE  SECTOR  21  ERROR  SOURCE  LISTING
100 REM DAS. PAL
110 REM
120 OPEN 2,8,2,"@0:DAS.B,P,W"
130 REM
140 SYS 40960
```

## Key Registers
(omitted — this chunk does not document chip registers)

## References
- "assembler_directives_and_origin" — assembler options and origin for the machine code invoked by SYS 40960