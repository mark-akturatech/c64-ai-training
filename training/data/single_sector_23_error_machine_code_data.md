# BASIC DATA block "REM 23 ERROR" — embedded 6502 machine-code bytes

**Summary:** BASIC DATA lines (690–810) containing raw 6502 machine-code bytes for a destructive machine-language routine that the BASIC driver will load and execute to produce a single-sector "23" error on the drive. The block is the raw DATA-as-bytes representation of the machine code (multiple DATA statements).

**Description**
This chunk is a BASIC program fragment labeled "REM 23 ERROR" (line 690) whose subsequent DATA statements (lines 700–810) contain literal 6502 machine-code bytes. The bytes are intended to be READ/POKE'd into a drive buffer and executed by a BASIC driver (external to this chunk) to produce the single-sector 23 error. The source provided is the BASIC DATA block only; no assembly source or annotated disassembly is included here.

Preserved items:
- Exact DATA statements and byte values as presented in the source (some characters show OCR/typo artifacts which have been corrected where the intended meaning was clear).
- The label/comment line "REM 23 ERROR" identifying the purpose of the block.

What is not included in this chunk:
- The BASIC loader/driver code that reads these DATA statements into a drive buffer and executes them.
- An assembly listing or annotated disassembly mapping the bytes to 6502 mnemonics (see References).

## Source Code
```basic
690  REM  23  ERROR 

700  DATA  169,  4,133,  49,165,  58,170,232 
710  DATA  138,133,  58,  32,143,247,  32,  16 
720  DATA  245,162,  8,  80,254,184,202,208 
730  DATA  250,169,255,141,  3,  28,173,  12 
740  DATA  28,  41,  31,  9,192,141,  12,  28 
750  DATA  169,255,162,  5,141,  1,  28,184 
760  DATA  80,254,184,202,208,250,160,187 
770  DATA  185,  0,  1,  80,254,184,141,  1 
780  DATA  28,200,208,244,185,  0,  4,  80 
790  DATA  254,184,141,  1,  28,200,208,244 
800  DATA  80,254,  32,  0,254,169,  5,133 
810  DATA  49,169,  1,  76,105,249,234,234 
```

## References
- "single_sector_23_error_basic_program" — expands on BASIC program that stores/loads these DATA bytes into a drive buffer for execution
- "single_sector_23_error_source_listing" — assembly source corresponding to the machine-code DATA bytes