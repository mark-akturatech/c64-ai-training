# JOB QUEUE and I/O helper routines (BASIC driver — 1541 I/O)

**Summary:** BASIC routines implementing job-queue communication and retry/error handling for the 1541 drive using PRINT#15 (M-W / M-R), GET#15, ASC(), CHR$(), TRY retry counter, CLOSE 15, and branch-on-failure behavior.

**Description**
This BASIC block implements low-level communication and retry logic used by the BASIC driver to send machine-code/data to the 1541 and read responses. Key behaviors:

- Initializes a TRY counter (line 580) used to limit retries.
- Sends a "M-W" (memory-write) command to the drive over channel 15 to transfer data/commands (lines 590 and 600).
- Increments TRY each attempt (line 610).
- Issues a "M-R" (memory-read) request (line 620) and reads a single-byte response using GET#15 (line 630).
- Normalizes an empty GET response to CHR$(0) (line 640) and converts the returned character to its ASCII code with ASC() (line 650).
- Implements two branch conditions:
  - If TRY reaches the limit (500), then close channel 15 and fall through to the failure message (lines 660 → 690).
  - If the response byte E > 127, then loop back to re-send the job (lines 670 → 610).
- On successful (non-failure) conditions, the routine RETURNs to the caller (line 680).
- On fatal failure, the code CLOSEs the drive channel and prints a failure message (lines 690–700), then ENDs (line 710).

This chunk is the BASIC-side helper handling GET#/INPUT# normalization, ASCII conversion and bounds checking, retry limits, and branch-on-failure. It is called by the BASIC driver to perform reads/writes and handle drive responses; it is paired with machine-code data sent via M-W (see referenced chunks).

## Source Code
```basic
570 REM JOB QUEUE
580 TRY=0

590 PRINT#15, "M-W" + CHR$(0) + CHR$(3) + CHR$(1) + CHR$(96)  ' Write RTS instruction to $0300
600 PRINT#15, "M-W" + CHR$(0) + CHR$(3) + CHR$(1) + CHR$(JOB)  ' Write JOB byte to $0300

610 TRY=TRY+1

620 PRINT#15, "M-R" + CHR$(0) + CHR$(3) + CHR$(1)  ' Read 1 byte from $0300

630 GET#15, E$
640 IF E$ = "" THEN E$ = CHR$(0)
650 E = ASC(E$)

660 IF TRY = 500 GOTO 690
670 IF E > 127 GOTO 610
680 RETURN

690 CLOSE 15
700 PRINT "  DRIVE ERROR: JOB FAILED"
710 END
```

## References
- "basic_driver_user_interface_and_execution_flow" — called from the BASIC driver to perform reads/writes and handle drive responses
- "embedded_machine_language_data_blocks_21_and_20m" — sends/loads the embedded machine-code data to the drive via M-W

**Notes:**
- The PRINT#15 lines in the original source were corrupted by OCR; CHR$ byte arguments have been reconstructed based on standard 1541 memory commands.
- The failure message at line 700 has been reconstructed to indicate a generic drive error related to the job failure.
