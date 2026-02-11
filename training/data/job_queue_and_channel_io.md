# BASIC job-queue routines for communicating with the 1541 (lines 1180–1280)

**Summary:** This BASIC routine queues a read/write job with the 1541 disk drive using the `PRINT#15` command to send `M-W` (Memory Write) packets and an `M-R` (Memory Read) request. It reads the response with `GET#15` and `ASC`, tracks retries with the `TRY` variable, handles error codes (where `E > 127` indicates an error), and implements a retry timeout (`TRY > 500`).

**Routine overview**

This BASIC fragment implements job-queue interaction with the 1541 drive on file channel #15. It:

- Initializes a `TRY` counter.
- Sends two `M-W` (Memory Write) packets to the drive with specific control bytes, track/sector (`T`, `S`), and job number (`JOB`).
- Increments `TRY` and sends an `M-R` (Memory Read) request.
- Reads the drive's response into a string (`E$`) via `GET#15`, converts the first character to a numeric code using `ASC(E$ + CHR$(0))`, and stores it in `E`.
- If `TRY` exceeds 500, the routine times out (goes to `RETURN`). If the returned code `E > 127`, it loops back to retry the read (increments `TRY` and repeats the `M-R`/`GET` sequence).
- Returns to the caller when a non-error response is received or a timeout occurs.

**Operation details**

- Packet contents are sent as raw bytes using `CHR$()` appended to the `"M-W"` and `"M-R"` command strings.
- The second `M-W` packet includes a `CHR$(JOB)` byte to identify the job.
- `GET#15` reads a string response into `E$`. The conversion `E = ASC(E$ + CHR$(0))` converts the first byte of the response into its numeric ASCII code.
- Error handling:
  - If `E > 127`, the code branches to retry (line 1220), which increments `TRY` and issues another `M-R`/`GET`.
  - If `TRY > 500`, it branches to `RETURN` (timeout).
- The routine is compact and relies on numeric comparisons and `GOTO` statements for flow control.

**Control byte meanings**

The `M-W` and `M-R` commands are used to write to and read from the 1541's internal memory. The control bytes in these commands specify the memory address, the number of bytes to transfer, and the data to be written. In this routine:

- The first `M-W` command:
  - `CHR$(8)` and `CHR$(0)` specify the low and high bytes of the memory address, respectively.
  - `CHR$(2)` indicates the number of bytes to write.
  - `CHR$(T)` and `CHR$(S)` are the track and sector numbers.
- The second `M-W` command:
  - `CHR$(1)` and `CHR$(0)` specify the memory address.
  - `CHR$(1)` indicates one byte to write.
  - `CHR$(JOB)` is the job number.
- The `M-R` command:
  - `CHR$(1)` and `CHR$(0)` specify the memory address to read from.

These commands interact with the 1541's job queue and memory to perform disk operations. ([scribd.com](https://www.scribd.com/document/40438/The-Commodore-1541-Disk-Drive-User-s-Guide?utm_source=openai))

## Source Code

```basic
1180 REM JOB QUEUE
1190 TRY=0

1200 PRINT#15,"M-W"CHR$(8)CHR$(0)CHR$(2)CHR$(T)CHR$(S)

1210 PRINT#15,"M-W"CHR$(1)CHR$(0)CHR$(1)CHR$(JOB)

1220 TRY=TRY+1

1230 PRINT#15,"M-R"CHR$(1)CHR$(0)

1240 GET#15,E$

1250 E=ASC(E$+CHR$(0))

1260 IF TRY>500 GO TO 1280

1270 IF E>127 GO TO 1220

1280 RETURN
```

## References

- "basic_write_loop_and_completion" — expands on Called by the write loop to queue read/write jobs to the drive
- "disk_commands_and_mr_entry" — expands on Corresponding assembly M-R/M-W command formats and entry points used by the drive-side code