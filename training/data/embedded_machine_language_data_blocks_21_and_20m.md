# 21 ERROR / 20M ERROR — BASIC DATA machine-code blocks

**Summary:** BASIC DATA statements containing two embedded 6502 machine-code routines labeled "21 ERROR" and "20M ERROR" — byte sequences intended to be READ/POKE'd into memory or written to a drive buffer; contain disk I/O and header-manipulation code.

**Description**
This chunk is a literal transcription of the BASIC program's DATA statements that hold two machine-language routines:

- "21 ERROR" — short routine (lines 730–750) encoded as DATA bytes.
- "20M ERROR" — larger full-track error routine (lines 770–1010) encoded as DATA bytes. These bytes include disk I/O and header-manipulation operations intended to be written into a drive buffer or into RAM via POKE (the BASIC program writes these DATA bytes into the target code area).

The source is presented as the original BASIC DATA statements (cleaned for obvious OCR artifacts where "O" appears in place of numeric zero). No assembly disassembly or usage code is included here — the bytes are provided exactly as stored in the BASIC program.

## Source Code
```basic
720  REM 21 ERROR

730  DATA 32,163,253,169,85,141,1,28
740  DATA 162,255,160,48,32,201,253,32
750  DATA 0,254,169,1,76,105,249,234

760  REM 20M ERROR

770  DATA 169,0,133,127,166,12,134,81
780  DATA 134,128,166,13,232,134,67,169
790  DATA 1,141,32,6,169,8,141,38
800  DATA 6,169,0,141,40,6,32,0
810  DATA 193,162,0,169,9,157,0,3
820  DATA 232,232,173,40,6,157,0,3
830  DATA 232,165,81,157,0,3,232,169
840  DATA 0,157,0,3,232,157,0,3
850  DATA 232,169,15,157,0,3,232,157
860  DATA 0,3,232,169,0,93,250,2
870  DATA 93,251,2,93,252,2,93,253
880  DATA 2,157,249,2,238,40,6,173
890  DATA 40,6,197,67,208,189,138,72
900  DATA 169,75,141,0,5,162,1,138
910  DATA 157,0,5,232,208,250,169,0
920  DATA 133,48,169,3,133,49,32,48
930  DATA 254,104,168,136,32,229,253,32
940  DATA 245,253,169,5,133,49,32,233
950  DATA 245,133,58,32,143,247,169,35
960  DATA 133,81,169,0,141,0,6,169
970  DATA 5,141,1,6,169,133,141,2
980  DATA 6,169,49,141,3,6,169,76
990  DATA 141,4,6,169,170,141,5,6
1000 DATA 169,252,141,6,6,169,224,133
1010 DATA 3,165,3,48,252,76,148,193
```

## References
- "basic_driver_user_interface_and_execution_flow" — expands on how these DATA blocks are written to the drive/buffer by the BASIC program to create the error-producing code
- "assembly_source_listing_initialization_and_header_creation" — assembly source listing of the routines represented by these DATA byte sequences