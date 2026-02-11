# Output to Other Devices (modem, cassette, printer, disk)

**Summary:** Explains device I/O using OPEN/PRINT#/INPUT# on the Commodore 64 (BASIC): modem OPEN string parameters (CHR$ codes) control baud/data/stop bits and optional parity/duplex; cassette and printer receive PRINT# output which is formatted differently than screen PRINT (commas/TAB/spacing behave differently); ASCII translation is required when talking to non-Commodore systems.

## Modem I/O
- The modem is treated as a character device: OPEN is used to create a channel, then PRINT# sends characters and INPUT# reads them.
- The OPEN statement for a modem can include a short string (typically two characters) that encodes communication parameters:
  - Bits of the first character determine baud rate, number of data bits, and number of stop bits.
  - The optional second character's bits specify parity and duplex.
- Because most other systems use ASCII while the C64 uses its own PETSCII/Commodore character set, character translation (PETSCII ↔ ASCII) is usually required before sending or after receiving.
- For unattended communications (e.g., automated login or terminal macros), you must precisely control/know the number of characters and RETURNs sent; mismatched counts will confuse the remote device.
- See RS-232 documentation or your modem/VICMODEM manual for the exact bit-to-parameter mappings for the two-character OPEN string.

## Cassette / Printer / Non-screen Formatting
- PRINT# formats output the same way as screen PRINT (commas, semicolons, TAB, numeric formatting), but the physical device behaves differently:
  - Commas between expressions on screen space output into fixed column spacing (approx. 10-character columns). On cassette the commas produce a variable number (1–10) of space characters depending on string lengths — this wastes tape space and breaks structured parsing.
  - INPUT# reading from cassette does not re-parse columned data the same way as keyboard INPUT: a single INPUT# expecting separate variables may read the entire printed line into the first variable (A$), leaving subsequent variables empty if the printed spacing did not include explicit separators like commas in the data stream.
  - Tab (TAB) and other screen-control spacing do not necessarily translate or align on printers or tapes the same way as on the screen; do not rely on visual formatting preserved across devices.
- Common practice for cassette-based programs: read the entire cassette file into RAM, process or edit in memory, then rewrite to tape — this avoids slow sequential access but limits file size to available RAM.
- For larger datasets or random-access needs, use disk instead of cassette (disk supports direct access and overwriting without rescanning).

## Source Code
```basic
REM modem OPEN examples (from source)
OPEN 1,2,0,CHR$(6): REM 300 BAUD
100 OPEN 2,2,0,CHR$(163) CHR$(112): REM 110 BAUD, ETC.

REM cassette / PRINT# example
A$="DOG": B$="CAT": C$="TREE"
PRINT# 1, A$, B$, C$
REM On tape the commas may produce 1-10 spaces; INPUT# may read all into A$.

REM reading back (problematic)
INPUT# 1, A$, B$, C$
REM A$ may contain "DOG   CAT     TREE" (all data), B$ and C$ may be empty
```

## References
- "open_kernal_routine" — expands on OPEN implementation for BASIC via KERNAL OPEN
- RS-232 / VICMODEM manual — for exact bit mappings of the OPEN string parameters (baud/data/stop/parity/duplex)
