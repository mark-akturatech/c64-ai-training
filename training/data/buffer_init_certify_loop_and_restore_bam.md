# byRiclianll - Main certification logic and buffer management

**Summary:** C64 BASIC routine that writes a worst-case binary pattern into the RAM buffer at $0400 (M-W writes), issues DOS block-allocate ("B-A") commands to force allocation of unallocated sectors, parses drive responses via INPUT#15 (EN$, EM$, ET$, ES$), records bad-sector locations in arrays, and restores a previously captured BAM image back to the disk to compensate for a B-A bug. Uses variables T, S, C, A for track/sector/counters and MID$(BAM$,...) to restore the BAM image.

**Operation**
This BASIC chunk performs the following steps:

- Fill the drive buffer (C64 memory block that the drive reads from) with a worst-case binary pattern located at $0400 using the drive "M-W" (memory-write) command. The loop writes 32-byte chunks multiple times (6 × 32 = 192 bytes) to fill a typical drive buffer area.
- Initialize counters: T (track), S (sector), C (count of certified sectors), A (count of allocated/bad sectors).
- Issue a block-allocate command (PRINT#15,"B-A";0;T$;S$) to the drive and read the response with INPUT#15 into EN$, EM$, ET$, ES$.
  - If EN$ = "00" the code handles the drive's "no error" path (GOTO 620).
  - ET$/ES$ are parsed back into numeric T and S.
- Maintain formatted two-character track/sector strings (T$, S$) for display and for the B-A command.
- Increment the certified-sector counter C each successful attempt; if a bad-sector is detected, increment A and store the bad location in numeric arrays T(A) and S(A), then continue.
- When all sectors are found allocated (or the operation ends), the code closes the drive channel and prints summary messages.
- After the certification loop, the program writes a saved BAM image back to the drive buffer using MID$(BAM$,1+I,32) in 32-byte chunks and issues a write (via GOSUB 1030 and then PRINT#15,"10") to restore the BAM on track 18 (T=18, S=0) — this compensates for a known block-allocate bug that can corrupt the BAM.
- If no bad sectors were recorded, the program prints "NO BAD SECTORS!" and ends; otherwise, it branches to further handling for the recorded bad-sector array (not included in this chunk).

Data structures and variables:
- I, J — loop indices for buffer write (I used as byte-offset)
- T, S — numeric current track and sector returned by the drive
- T$, S$ — formatted two-character strings for track/sector (leading-zero formatted)
- C — number of sectors certified
- A — number of bad/allocated sectors encountered
- EN$, EM$, ET$, ES$ — strings returned from drive via INPUT#15 (error/status & track/sector)
- T(A), S(A) — numeric arrays recording bad sector track/sector pairs
- BAM$ — string variable holding a captured BAM snapshot (restored later via MID$)

Notes:
- The code expects a GOSUB 1030 subroutine (not included here) to perform the actual write/commit of the buffer to disk; that subroutine is referenced but outside this chunk.
- PETSCII control sequences in the PRINT statements (cursor/attribute codes) appear in the source as markers (e.g., `<:UP>`, `<:RVS>`, etc.) and were left as printed literals where they appeared garbled by OCR.

## Source Code
```basic
450 REM BUFFER
460 I=0
470 FOR J=1 TO 6
480 PRINT#15,"M-W";CHR$(I);CHR$(4);CHR$(32);WRITE*
490 I=I+32
500 NEXT J

510 T=1
520 S=0
530 C=0
540 A=0

550 PRINT#15,"B-A";0;T;S
560 INPUT#15,EN$,EM$,ET$,ES$
570 IF EN$="00" GOTO 620
580 T=VAL(ET$)
590 IF T=0 AND C=0 GOTO 760
600 IF T=0 GOTO 800
610 S=VAL(ES$)

620 T$=RIGHT$("0"+STR$(T),2)
630 S$=RIGHT$("0"+STR$(S),2)

640 C=C+1
650 IF C=1 THEN PRINT "<:UP>"
660 PRINT#15,"B-A";0;T$;S$
670 PRINT " t HOME X DOWN 6><RVS>CERTIFYING<ROFF>   TRACK ";T$;"   -  SECTOR   ";S$
680 PRINT "NUMBER OF SECTORS CERTIFIED :";C
690 PRINT "NUMBER OF BAD SECTORS ALLOCATED: ";A

700 GOSUB 1030
710 IF E=1 GOTO 550
720 A=A+1
730 T(A)=T
740 S(A)=S
750 GOTO 550

760 CLOSE 15
770 PRINT "  ALL SECTORS HAVE BEEN ALLOCATED"
780 PRINT "  <:down> <:rvs>failed<:roff>"
790 END

800 I=0
810 FOR J=1 TO 6
820 PRINT#15,"M-W";CHR$(I);CHR$(4);CHR$(32);MID$(BAM$,1+I,32)
830 I=I+32
840 NEXT J

850 PRINT#15,"M-W";CHR$(192);CHR$(4);CHR$(32);NULL$
860 PRINT#15,"M-W";CHR$(224);CHR$(4);CHR$(32);NULL$

870 T=18
880 S=0
890 GOSUB 1030

900 PRINT#15,"10"
910 INPUT#15,EN$,EM$,ET$,ES$
920 IF A<>0 GOTO 960
930 CLOSE 15
940 PRINT " ^DOWN>NO BAD SECTORS!"
950 END
```

## Key Registers
- $0400 - RAM - buffer start used for M-W writes (drive memory-write source)

## Incomplete
- Missing: GOSUB 1030 subroutine (write/commit routine) referenced at lines 700/890 is not included in this chunk.
- Missing: Exact PETSCII control-sequence byte values used in the PRINT statements were garbled by OCR (e.g., "<:UP>", "<:RVS>") — the intended control bytes are not available in the source.
- Missing: Full BAM$ content (the saved BAM snapshot) is not included here; code references MID$(BAM$,...) but the BAM data blob is outside this chunk.

## References
- "read_bam_and_dos_check" — expands on using the BAM snapshot read earlier to restore after certification
- "job_queue_and_subroutines" — expands on disk subroutines (seek/write) and job-queue logic referenced later
- "annotated_line_range_summary" — expands on program line annotations and mapping (write buffer, block-allocate, error array)