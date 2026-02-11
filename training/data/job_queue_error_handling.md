# JOB QUEUE (duplication routine — job-queue subroutine)

**Summary:** BASIC subroutine that implements a job-queue exchange over channel 15 using PRINT#15/GET#15 with "M-W" (write) and "M-R" (read) command packets, CHR$ byte composition, response normalization (empty -> CHR$(0)), conversion with ASC, retry counting via TRY (increment, IF TRY=500 -> timeout), conditional branches for response values (>127 -> retry), and an error-timeout path that sends an error packet, CLOSE 15 and prints a failure message.

**Description**
This chunk is a Commodore BASIC job-queue subroutine used by a duplication routine to send and confirm drive commands over channel 15. Key behaviors:

- **Initialization:** `TRY` is set to 0 at entry to track retry attempts.
- **Packet composition:** One or more `PRINT#15` "M-W" (write) sequences are used to compose and send a job packet. Byte values are constructed with `CHR$(n)` and some bytes are variables (`T`, `S`, `JOB`).
- **Read/response:** A `PRINT#15` "M-R" (read) is sent to request a response, then `GET#15` reads a single-character response into a string (`E$`).
- **Normalization:** If `GET#15` returns an empty string (`E$ = ""`), `E$` is normalized to `CHR$(0)` to represent a zero byte.
- **Conversion:** The response byte string is converted to a numeric code with `E = ASC(E$)`.
- **Retry loop:** `TRY` is incremented each attempt. If `TRY` reaches 500, control branches to the timeout/error path (line ~660).
- **Conditional branching:** If `E > 127`, the code treats this as a sign that the request should be retried and jumps back to resend the write sequence (`GOTO 580`). Otherwise, the subroutine succeeds and executes `RETURN`.
- **Timeout / error path:** On `TRY=500`, the routine sends an "M-W" error/abort packet (constructed with `CHR$` bytes), closes channel 15, prints a failure message, and ends the program (`END`).
- **Flow control:** The routine returns to the caller with `RETURN` on success; the timeout path issues `CLOSE 15` and `END` to terminate.

## Source Code
```basic
540 REM JOB QUEUE
550 TRY = 0

560 PRINT#15, "M-W" + CHR$(8) + CHR$(0) + CHR$(2) + CHR$(T) + CHR$(S)
570 PRINT#15, "M-W" + CHR$(1) + CHR$(0) + CHR$(JOB)

580 TRY = TRY + 1

590 PRINT#15, "M-R" + CHR$(1) + CHR$(0)

600 GET#15, E$
610 IF E$ = "" THEN E$ = CHR$(0)

620 E = ASC(E$)
630 IF TRY = 500 THEN GOTO 660
640 IF E > 127 THEN GOTO 580
650 RETURN

660 PRINT#15, "M-W" + CHR$(7) + CHR$(0) + CHR$(1) + CHR$(7)
670 CLOSE 15
680 PRINT "DOWNLOAD COPY FAILED"
690 END
```

## References
- "duplicate_single_sector_clone_routine" — expands on called-by flow that sends and confirms drive commands
- "multiple_id_formatting_subroutines_delay_and_job_queue" — expands on shared job-queue logic and retry behavior used elsewhere
