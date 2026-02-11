# MULTIPLE ID FORMATTING (section start — ID collection)

**Summary:** C64 BASIC routine for the 1541 that prompts for the master (RVS) disk, opens device 15, initializes arrays T(), H$(), L$(), then loops tracks 1–35 sending drive commands (JOB=176, PRINT#15 "M-R" with CHR$(22)/CHR$(23)) and GET#15 to read embedded ID bytes, normalizing blank reads to CHR$(0), and finally closes the drive.

**Description**
This program header and initialization perform the ID-collection pass from a master (RVS) disk on a 1541 drive (device 15). Key actions and behavior:

- **User interface:** Displays a title/prompt asking the user to insert the RVS master and calls a display/delay subroutine (GOSUB 910).
- **Drive setup:** Opens the serial channel to the drive with `OPEN 15,8,15` and sets `JOB=176` to use low-level drive commands (drive job value used to communicate with the 1541).
- **Array initialization:** The arrays `T(1..35)`, `H$(1..35)`, `L$(1..35)` are prepared; each `T(I)` is initialized to 1 in the provided listing (this appears to be a flag array used later).
- **Per-track ID reads:** For each track `T = 1 to 35` the routine issues a read-ID sequence:
  - `PRINT#15,"M-R" + CHR$(22) + CHR$(0)` then `GET#15,H$(T)` — reads one byte (high ID byte).
  - If the returned `H$(T)` was a blank/space, it is normalized to `CHR$(0)`.
  - `PRINT#15,"M-R" + CHR$(23) + CHR$(0)` then `GET#15,L$(T)` — reads one byte (low ID byte).
  - If `L$(T)` is a blank, it is normalized to `CHR$(0)`.
- **Post-pass actions:** After the track loop the program sets `T = 18` and calls `GOSUB 970` (likely to position or show progress), then `CLOSE 15` to release the drive.
- The arrays populated here (`T()`, `H$()`, `L$()`) are used by a later routine to prepare per-track format parameters and to execute the write-format pass.

**Notes:**
- `CHR$(22)` and `CHR$(23)` are used in the `PRINT#15` command string to request the drive's embedded ID bytes (the program sends "M-R" plus these control characters and a zero terminator).
- Blank or missing reads are normalized into `CHR$(0)` so downstream code can treat missing ID bytes uniformly.
- The listing as provided contains OCR/artifact errors which have been corrected where possible. The program flow and intent are clear (open device, read ID bytes per track, store into arrays, close), but some conditional lines are garbled and should be verified against an original source or tested on a drive emulator before relying on exact branching behavior.

## Source Code
```basic
100  REM  FORMAT  A  DISKETTE  -  1541
110  DIM T(35), H$(35), L$(35)
120  PRINT "  {CLR}  FORMAT  A  DISKETTE  -  1541"
130  PRINT "  {DOWN}  INSERT  {RVS} MASTER {ROFF} IN  DRIVE"
140  GOSUB 910
150  PRINT " {DOWN}{RVS}FETCHING{ROFF} FORMATTING  ID"
160  OPEN 15,8,15
170  FOR I = 1 TO 35
180  T(I) = 1
190  NEXT I
200  JOB = 176
210  FOR T = 1 TO 35
220  IF T(T) >= 0 THEN GOTO 340
230  GOSUB 970
240  IF E = 1 THEN GOTO 280
250  H$(T) = CHR$(0)
260  L$(T) = CHR$(0)
270  GOTO 340
280  PRINT#15, "M-R" + CHR$(22) + CHR$(0)
290  GET#15, H$(T)
300  IF H$(T) = " " THEN H$(T) = CHR$(0)
310  PRINT#15, "M-R" + CHR$(23) + CHR$(0)
320  GET#15, L$(T)
330  IF L$(T) = " " THEN L$(T) = CHR$(0)
340  NEXT T
350  T = 18
360  GOSUB 970
370  CLOSE 15
```

## References
- "multiple_id_formatting_write_parameters_and_execute" — expands on using the arrays populated here to prepare per-track format parameters and to execute the format
- "multiple_id_formatting_subroutines_delay_and_job_queue" — expands on calls to the common job-queue/GOSUB routines for drive communication and user delays
