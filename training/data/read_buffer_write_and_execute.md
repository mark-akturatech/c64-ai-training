# Drive upload + execute (BASIC — M-W / M-R to device channel 15)

**Summary:** C64 BASIC routine that reads sectors into string buffers (`D$(J)`), streams those buffers to the disk drive via `PRINT#15 "M-W"` block writes, writes an execute vector, then issues an "M-R" to request execution, polls the drive with `GET#15` and `ASC()`, and closes channel 15. Uses device channel 15, `CHR$()`, `GET#15`/`PRINT#15`, and `ASC()`.

**Description**
This BASIC program performs a two-phase operation:

- **Read phase:**
  - Sets `JOB=128` and calls a read subroutine (`GOSUB 570`) to fetch sectors from the drive.
  - Nested `FOR` loops concatenate bytes read (via `READ D`) into string buffers `D$(J)` using `CHR$(D)`. Each `D$(J)` collects 8 bytes (`FOR I=0 TO 7` and `FOR J=0 TO 7` in the listing).

- **Upload phase:**
  - Iterates over `D$(J)` and sends each buffer to the drive with the device command "M-W" on channel 15. The command string is assembled with `CHR$()` bytes (address/length bytes) followed by `D$(J)`, streaming the machine-code payload into the drive's RAM (block write).
  - After all blocks are written, it writes an execute vector into the drive memory (another "M-W" with specific `CHR$()` bytes).
  - Sends an "M-R" (memory-read) request to trigger or poll execution, then uses `GET#15` to read the drive's response into `E$`.
  - Normalizes empty reads (`IF E$="" THEN E$=CHR$(0)`), converts response byte to numeric with `E=ASC(E$)`, and loops while `E>127` (drive still busy or returning high-bit status).
  - Closes channel 15 and prints a final completion message, then `END`s.

Caveats and assumptions:
- The actual read subroutine (lines called by `GOSUB 570`) and the `DATA` statements supplying the embedded machine-code bytes are not present in this chunk.
- Several lines in the provided source showed OCR corruption; the code below is a corrected/normalized reconstruction of the BASIC listing.

## Source Code
```basic
320 REM READ
330 JOB=128
340 GOSUB 570
350 FOR J=0 TO 7
360 FOR I=0 TO 7
370 READ D
380 D$(J)=D$(J)+CHR$(D)
390 NEXT I
400 NEXT J
410 I=0
420 FOR J=0 TO 7
430 PRINT#15,"M-W";CHR$(I);CHR$(5);CHR$(8);D$(J)
440 I=I+8
450 NEXT J
460 REM EXECUTE
470 PRINT#15,"M-W";CHR$(2);CHR$(0);CHR$(1);CHR$(224)
480 PRINT#15,"M-R";CHR$(2);CHR$(0)
490 GET#15,E$
500 IF E$="" THEN E$=CHR$(0)
510 E=ASC(E$)
520 IF E>127 GOTO 480
530 CLOSE 15
540 PRINT "UPDOWN - DONE!"
550 END
```

Notes on the source reconstruction:
- `READ D` and the subsequent `DATA` statements (the machine-code bytes that populate `D$(J)`) are missing from this chunk.
- The `CHR$` bytes used in the `M-W`/`M-R` commands are left as in the source (e.g., `CHR$(I);CHR$(5);CHR$(8)` and `CHR$(2);CHR$(0);CHR$(1);CHR$(224)`). Their exact meaning depends on the drive DOS protocol and the intended in-drive memory addresses; the original text was partially corrupted, so these bytes were retained as best-guess corrections.

## References
- "seek_operation_job_submission" — expands on the read phase following a successful seek
- "job_queue_handling_subroutine" — expands on how read/write jobs are submitted and polled on the drive
- "embedded_destroy_routine_data" — expands on the machine-code bytes that are uploaded and executed on the drive
