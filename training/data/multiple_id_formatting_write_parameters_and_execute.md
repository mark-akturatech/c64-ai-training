# 1541 Multiple-ID Formatting — format-parameter construction and execute phase

**Summary:** This program constructs per-track format/write parameter packets (D$(J), L$(I), H$(I)), sends M-W/M-E drive commands to device 15 (1541), monitors drive status bytes (EN, EM, ET, ES), toggles JOB between 176/128/144 for seek/read/write phases, performs multiple passes (S flag), issues the "NO: 1541 FORMAT" sequence, and prints completion. Searchable terms: PRINT#15, INPUT#15, M-W, M-E, device 15, CHR$(), D$(), L$(), H$(), JOB=176/128/144, S flag.

**Operation**

This program is the main formatting parameter construction and execution phase of a multiple ID formatting routine for the 1541 drive. It performs the following steps:

- Prompts the user to insert a blank disk and calls a setup subroutine.
- Opens device 15 (OPEN 15,8,15).
- Reads a table (READ D) in nested FOR loops to build D$(J) strings (one D$ per group).
- Sends per-D$ and per-track L$(I)/H$(I) M-W (memory-write) packets to device 15 to program the drive with sector/image/ID parameters.
- Executes the format sequence by sending M-E (memory-execute) and then monitoring drive status via INPUT#15 to read EN, EM, ET, ES status bytes.
- Uses a JOB variable toggled between 176, 128, and 144 for different drive-phase operations (seek, read, write); repeatedly calls a monitor subroutine (GOSUB 970) to wait for/handle drive responses.
- Sends format-control M-W packets containing specific CHR$ bytes (examples: CHR$(18), CHR$(1), CHR$(65), CHR$(255)) to control the 1541 format engine and to perform multiple passes (S flag toggles).
- Closes and reopens device 15 to send the "NO: 1541 FORMAT" (drive command name) sequence and final M-W packets, then closes the device and prints "DONE !".
- Relies on external data and subroutines (data table for READ D, L$() and H$() sources, and subroutines at 910 and 970) which are not included in this chunk.

Behavioral specifics retained: exact I/J loop structure for building parameter strings; exact sequence of M-W and M-E commands; the monitoring of EN/EM/ET/ES via INPUT#15; JOB values used (176, 128, 144); S flag flips to perform multiple passes.

## Source Code

```basic
380 PRINT " CCLRD FORMAT  A  DISKETTE  -  1541"
390 PRINT "  {DOWN>  INSERT   <:RVS3  BLANK <:R0FF> IN DRIVE"
400 GOSUB 910
410 OPEN 15,8,15
420 FOR J = 0 TO 6
430   FOR I = 0 TO 7
440     READ D
450     D$(J) = D$(J) + CHR$(D)
460   NEXT I
470 NEXT J
480 I = 0
490 FOR J = 0 TO 6
500   PRINT#15, "M-W"; CHR$(I); CHR$(4); CHR$(A); D$(J)
510   I = I + 8
520 NEXT J
530 FOR I = 1 TO 35
540   PRINT#15, "M-W"; CHR$(49 + I); CHR$(4); CHR$(1); L$(I)
550   PRINT#15, "M-W"; CHR$(84 + I); CHR$(4); CHR$(1); H$(I)
560 NEXT I
570 REM  EXECUTE
580 PRINT "{DOWN>  RVS3 FORMAT  R0FF>  DISKETTE"
590 PRINT#15, "M-E"; CHR$(0); CHR$(4)
600 INPUT#15, EN, EM, ET, ES
610 T = 18
620 S = 0
630 JOB = 176
640 GOSUB 970
650 JOB = 128
660 GOSUB 970
670 PRINT#15, "M-W"; CHR$(0); CHR$(4); CHR$(3); CHR$(18); CHR$(1); CHR$(65)
680 JOB = 144
690 GOSUB 970
700 S = 1
710 JOB = 128
720 GOSUB 970
730 PRINT#15, "M-W"; CHR$(0); CHR$(4); CHR$(2); CHR$(0); CHR$(255)
740 JOB = 144
750 GOSUB 970
760 CLOSE 15
770 OPEN 15,8,15
780 PRINT#15, "NO: 1541  FORMAT"
790 INPUT#15, EN, EM, ET, ES
800 S = 0
810 JOB = 128
820 GOSUB 970
830 PRINT#15, "M-W"; CHR$(162); CHR$(4); CHR$(2); CHR$(50); CHR$(54)
840 JOB = 144
850 GOSUB 970
860 PRINT#15, "M-W"; CHR$(162); CHR$(7); CHR$(2); CHR$(50); CHR$(54)
870 CLOSE 15
880 PRINT "{DOWN>DONE !"
890 END
```

## References

- "multiple_id_formatting_read_master_ids" — expands on Source of H$() and L$() per-track IDs used to build the write packets
- "multiple_id_formatting_subroutines_delay_and_job_queue" — expands on Uses the delay prompt and job-queue subroutines for drive command sequencing and retries
