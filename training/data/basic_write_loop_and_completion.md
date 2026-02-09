# BASIC WRITE routine (lines 810–1090) — 1541 write loop, RW/RAM pointer updates, POKE 252, SYS call

**Summary:** BASIC write routine for writing disk sectors to a 1541: updates read/write pointer (RW) and drive RAM address (RAM), uses POKE 252 to select the 1541 RAM page, loops over tracks/sectors (T/S), calls machine code via SYS, invokes GOSUB 1300/1190 for I/O handling, closes device with CLOSE 15, restores I/O flag (POKE 56,160), CLR and END.

## Behavior / Description
- Entry: routine labeled REM WRITE. Operates over track T and sectors S (FOR S=0 TO NS ... NEXT S; NEXT T).
- Pointer arithmetic:
  - RW is advanced by (NS+1) at track start and by 1 per sector. RW is the host-side pointer into the data buffer read/write map (PEEK(RW) is tested).
  - RAM is advanced by 256 bytes per sector (RAM = RAM + 256; RAM is the 1541 RAM address pointer). At track start it is advanced by 256*(NS+1) to skip whole track block.
- 1541 RAM-page selection:
  - POKE 252,(RAM/256) is used to set the 1541 RAM page (divide by 256 yields the 256-byte page number). This POKE is done at track entry and after each sector increment so the drive bank/page matches RAM.
- Per-sector operation:
  - If PEEK(RW)=0 the sector is skipped (GOTO to pointer advance).
  - Otherwise GOSUB 1300 (I/O send routine referenced elsewhere) is called, a progress message is printed showing track T and sector S, then SYS is issued to run machine code that performs the low-level write (machine-code entry invoked with a parameter; see machine_code_data_and_track_skip_table).
  - JOB is set (JOB=144) to mark the in-progress task, then GOSUB 1190 (I/O receive/ack/error handling) is called. Error count management updates W (write error tally) if E<>1.
- Loop termination and cleanup:
  - After loops finish, CLOSE 15 closes the device channel.
  - Error summary prints show read and write error counts (R and W) and final "DONE!" message.
  - POKE 56,160 restores the I/O flag byte used by the program (restores KERNAL/IO control as expected).
  - CLR and END terminate the program.
- Calls and cross-references:
  - GOSUB 1300 and 1190 are I/O helper subroutines (see job_queue_and_channel_io).
  - The SYS call executes machine code (see machine_code_data_and_track_skip_table).
  - STR$ formatting for track/sector strings referenced by PRINT uses routines described in format_two_digit_str_and_c000_marker.

**[Note: Source text contained OCR/artifact corruption (zeros/O, missing spaces). I corrected spacing and obvious OCR errors while preserving line structure and flow.]**

## Source Code
```basic
810 REM WRITE

820 IF T=1 GOTO 990
830 RW = RW + (NS + 1)
840 RAM = RAM + (256 * (NS + 1))
850 POKE 252, (RAM / 256)
860 GOTO 990

870 FOR S = 0 TO NS
880   IF PEEK(RW) = 0 GOTO 950
890   GOSUB 1300
900   PRINT "  <HOME>  DOWN  2>RVS3  WRITING  TRACK "; T; " - SECTOR "; S
910   SYS 4922, S
920   JOB = 144
930   GOSUB 1190
940   IF E <> 1 THEN W = W + 1

950   RW = RW + 1
960   RAM = RAM + 256
970   POKE 252, (RAM / 256)
980 NEXT S

990 NEXT T

1000 CLOSE 15

1010 IF ER > 35 GOTO 210

1020 PRINT "  < HOME > DOWN  2>READ  ERRORS :  "; R
1030 PRINT "  < DOWN > WRITE  ERRORS :  "; W
1040 PRINT
1050 PRINT "DONE!"

1070 POKE 56, 160

1080 CLR
1090 END
```

## Key Registers
- (none) — this chunk is a BASIC program manipulating program variables and using POKE to zero-page locations; no VIC/SID/CIA register ranges are defined here.

## References
- "job_queue_and_channel_io" — job-queue command send/receive used by the write loop (PRINT#15 / GET#15)
- "format_two_digit_str_and_c000_marker" — STR$ subroutine for formatting track/sector strings called from the write loop
- "machine_code_data_and_track_skip_table" — machine code at $C000 executed via SYS from the write loop