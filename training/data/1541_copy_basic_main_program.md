# 1541 COPY — BASIC main flow (lines 100–690)

**Summary:** Commodore 64 BASIC program implementing a 1541 disk copy/backup flow: initialization POKEs (56, 251–254), prompts to insert master/clone, filename and file-type input/validation, opening the source file on the 1541 via channel 15, reading the directory header (EN$, EM$, ET$, ES$), computing blocks/free space, selecting read/write mode, preparing job queue and issuing SYS 49152 machine-language transfers, closing channels and finishing with END.

## Main flow description
This chunk contains the main control flow of a Full BASIC "1541 COPY" utility (lines 100–690). It:

- Performs low-level initialization with POKE 56 and POKE 251–254 to set communication and buffer parameters used by the embedded driver/ML routines.
- Puts machine-code bytes into memory at $C000+ (POKE 49151+I,D with a READ loop) so SYS 49152 can be called to run the ML transfer routines.
- Prompts the user to insert the master (source) disk, asks for filename (validated for length 1–17) and file type (D/S/P/U), and validates those inputs.
- Opens the named file/device on the 1541 using channel 15 (via a driver ML routine invoked by SYS 49152) and reads the directory header into variables EN$, EM$, ET$, ES$ (INPUT#15,...).
- Checks EN$ to ensure a file was found; branches to error handling if not.
- Prompts for the clone (target) disk and performs a minimal DOS/drive check by communicating with drive via channel 15 (sending "M-R" and parsing responses with GET#15 and ASC()).
- Reads file length/track/sector header bytes (via GET#15 and ASC()) and computes:
  - C = low + (high * 256) (file length in bytes)
  - S = PEEK(252) + ((PEEK(253) - 16) * 256) (system free-space calculation as used by this program)
  - B = INT((S / 254) + .5) (blocks free estimate)
  - compares C and B to detect disk-full
- Chooses read or write mode (RW$="R" or "W"), calls a supporting GOSUB to set up job-queue/driver state, then performs SYS 49152 to run the ML transfer that moves data between the 1541 and C64 memory (machine-language transfer routines are loaded at program start).
- Closes channels (CLOSE 2, CLOSE 15) and prints completion or disk-full messages, restores POKE 56 and clears variables, then END.

**[Note: Source may contain OCR/typographic errors that were corrected for syntax consistency (e.g., P0KE→POKE, G0SUB→GOSUB, 6ET/GET, CL0SE/CLOSE). Corrections were limited to obvious character substitutions to reconstruct valid Commodore BASIC statements.]**

## Source Code
```basic
100 REM 1541 COPY

110 POKE 56,16
120 CLR
130 POKE 251,0
140 POKE 252,16
150 POKE 253,0
160 POKE 254,16

170 FOR I=1 TO 72
180 READ
190 POKE 49151+I,D
200 NEXT I

210 PRINT "<CLR> 1541 COPY"
220 PRINT " <DOWN> INSERT MASTER IN DRIVE"
230 GOSUB 750
240 GOSUB 810

250 INPUT " <DOWN> filename";F$
260 IF LEN(F$)>0 AND LEN(F$)<17 GOTO 280
270 GOTO 1000

280 INPUT " <DOWN> FILE TYPE (D S P U)";T$
290 IF T$="D" OR T$="S" OR T$="P" OR T$="U" GOTO 310
300 GOTO 1000

310 RW$="R"
320 GOSUB 590
330 SYS 49152
340 CLOSE 2

350 INPUT#15,EN$,EM$,ET$,ES$
360 IF EN$="00" GOTO 380
370 GOTO 850

380 CLOSE 15

390 PRINT " <DOWN> INSERT CLONE IN DRIVE"
400 GOSUB 750
410 GOSUB 810

420 PRINT#15,"M-R";CHR$(1);CHR$(1)
430 GET#15,D$
440 D = ASC(D$+CHR$(0))
450 IF D=65 GOTO 490

460 PRINT " <DOWN> CBM DOS V2.6 1541,00,00"
470 GOTO 710

480 PRINT#15,"M-R";CHR$(250);CHR$(2);CHR$(3)
490 GET#15,L$
500 L = ASC(L$+CHR$(0))
510 GET#15,B$
520 GET#15,H$
530 H = ASC(H$+CHR$(0))

540 C = L + (H * 256)
550 S = PEEK(252) + ((PEEK(253) - 16) * 256)
560 B = INT((S / 254) + .5)
570 IF C-B>=0 GOTO 600

580 PRINT " <DOWN> *** DISK FULL, 00,00"
590 GOTO 710

600 RW$="W"
610 GOSUB 890
620 SYS 49152
630 CLOSE 2

640 INPUT#15,EN$,EM$,ET$,ES$
650 PRINT " <DOWN> DONE!"
660 CLOSE 15
670 POKE 56,160
680 CLR
690 END
```

## Key Registers
- (None) — this chunk is a BASIC program and does not document specific C64 hardware register addresses for exact-match lookup.

## References
- "support_routines_delay_and_return" — Small supporting subroutines (close, delay/press-return) called by the main program
- "initialization_and_error_handling_and_mldata" — Initialization, file-not-found handling, and embedded machine-code DATA bytes used by the SYS routines
- "1541_backup_source_annotation" — Explains the high-level backup flow that this BASIC program implements