# Three-parameter M-R example — read 16-byte disk name from buffer #1 ($0400-$04FF)

**Summary:** Demonstrates the alternate three-parameter memory-read format for CBM DOS device I/O: sending `PRINT#15,"M-R"CHR$(lo)CHR$(hi)CHR$(count)` to read memory (buffer #1 $0400-$04FF) and using `GET#15` to retrieve the specified number of bytes into the C64, normalizing them into a printable disk name.

**Description**
This BASIC example shows how to request a block of memory from a device (disk drive) using the alternate memory-read (M-R) command format and then pull the returned bytes into the C64 with `GET#`.

- The M-R command format used is:
  `PRINT#15,"M-R"CHR$(lo)CHR$(hi)CHR$(count)`
  where lo/hi are the low/high bytes of the 16-bit address to read (C64 low byte first), and count is the number of bytes to fetch.
- The example targets buffer #1, which corresponds to $0400-$04FF in RAM (the disk name resides at the start of that buffer). It requests 16 bytes (the disk name length) starting at $0400.
- After issuing the request, the program loops `GET#` to read one byte at a time into a BASIC string, converts to numeric ASCII (`ASC`), maps high-ASCII values by subtracting 128, replaces non-printable or out-of-range codes with ASCII 63 ('?'), and converts any double-quote character to '?' to avoid string delimiters.
- The code uses the typical device-open/command/response pattern with `INPUT#15` to read the device's response fields (EN$, EM$, ET$, ES$) and checks EN$ for "00" (success).

Behavioral details preserved from the source:
- High-bit ASCII handling: if byte > 127 then subtract 128 (A=A-128).
- Printable range mapping: only 32..95 are considered printable; outside that range map to 63 ('?').
- Double-quote (34) is replaced by 63 ('?') to ensure the assembled string is printable and safe for BASIC printing.

Caveats:
- Some lines in the original source were garbled/OCR-damaged; where the device-address/count bytes were obviously wrong (e.g. CHR$(144) in the source), they are corrected to the logical values for $0400 (CHR$(0) CHR$(4) CHR$(16)).

## Source Code
```basic
100 REM THREE PARAMETER MEMORY-READ (read 16 bytes from buffer #1 $0400)
110 OPEN 15,8,15
120 PRINT#15,"I0"
130 INPUT#15,EN$,EM$,ET$,ES$
140 IF EN$<>"00" GOTO 320
150 OPEN 2,8,2,"#1"
160 PRINT#15,"U1";2;0;18;0
170 INPUT#15,EN$,EM$,ET$,ES$
180 IF EN$<>"00" GOTO 300
190 PRINT#15,"M-R";CHR$(0);CHR$(4);CHR$(16)
200 FOR I=1 TO 16
210 GET#15,B$
220 IF B$="" THEN B$=CHR$(0)
230 A=ASC(B$)
240 IF A>127 THEN A=A-128
250 IF A<32 OR A>95 THEN A=63
260 IF A=34 THEN A=63
270 DN$=DN$+CHR$(A)
280 NEXT I
290 PRINT"  DISK NAME: ";DN$
300 CLOSE 2
310 INPUT#15,EN$,EM$,ET$,ES$
320 CLOSE 15
330 END
```

Notes on the listing:
- Line 120: `PRINT#15,"I0"` initializes the disk drive. The "I0" command resets the drive and clears the error channel. ([manualzilla.com](https://manualzilla.com/doc/7392668/commodore-computer-commodore-64-user-s-manual?utm_source=openai))
- Line 160: `PRINT#15,"U1";2;0;18;0` issues a block-read command to load track 18, sector 0 into buffer #1. The "U1" command format is `PRINT#15,"U1";channel;drive;track;sector`. ([manualzilla.com](https://manualzilla.com/doc/7392668/commodore-computer-commodore-64-user-s-manual?utm_source=openai))
- Line 190: `PRINT#15,"M-R";CHR$(0);CHR$(4);CHR$(16)` sends the memory-read command to read 16 bytes starting at address $0400. The "M-R" command format is `PRINT#15,"M-R"CHR$(lo)CHR$(hi)CHR$(count)`. ([manualzilla.com](https://manualzilla.com/doc/7392668/commodore-computer-commodore-64-user-s-manual?utm_source=openai))

## Key Registers
- $0400-$04FF - RAM - buffer #1 (disk name buffer; this example reads the first 16 bytes)

## References
- Commodore 64 User's Guide: ([manualzilla.com](https://manualzilla.com/doc/7392668/commodore-computer-commodore-64-user-s-manual?utm_source=openai))
- Inside Commodore DOS: ([scribd.com](https://www.scribd.com/document/209854469/Inside-Commodore-DOS?utm_source=openai))