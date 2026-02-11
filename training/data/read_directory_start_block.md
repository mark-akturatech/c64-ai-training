# DOS "M-R" Memory-Read via Channel 15 — Capture T and S (BASIC)

**Summary:** This BASIC routine utilizes `PRINT#15`, `GET#15`, and `INPUT#15` to issue a DOS "M-R" (memory-read) command on device channel 15. It reads two returned bytes (T and S) using `GET#15` and `ASC(... + CHR$(0))`, closes the file channel with `CLOSE 2`, and reads the DOS command status into variables EN, EM, ET, and ES. The program branches based on the value of EN.

**Description**

This Commodore BASIC routine performs the following steps:

- Sends the DOS "M-R" (memory-read) command on channel 15, passing a 3-byte parameter string: `CHR$(24)`, `CHR$(0)`, `CHR$(2)`. The final `CHR$(2)` selects channel 2 (the file previously opened on channel 2).
- Reads two single-character response bytes with `GET#15` into string buffers (`T$` and `S$`).
- Converts those single-character strings to numeric byte values using `ASC(T$ + CHR$(0))` and `ASC(S$ + CHR$(0))`. The concatenation with `CHR$(0)` ensures that `ASC` always receives at least one character, guarding against empty-string cases.
- Closes channel 2 with `CLOSE 2`.
- Reads the command status returned by the drive via `INPUT#15` into numeric variables EN, EM, ET, and ES.
- Tests EN (error number); if EN = 0, the code branches to line 490 (success path); otherwise, execution proceeds to the error handling path.

## Source Code

```basic
400 PRINT#15, "M-R" + CHR$(24) + CHR$(0) + CHR$(2)
410 GET#15, T$
420 T = ASC(T$ + CHR$(0))
430 GET#15, S$
440 S = ASC(S$ + CHR$(0))
450 CLOSE 2
460 INPUT#15, EN, EM, ET, ES
470 IF EN = 0 THEN GOTO 490
480 REM Error handling code here
490 REM Success handling code here
```

## References

- "filename_input_and_file_open" — expands on operations on the file opened in channel 2.
- "load_disk_block_into_buffer_and_read_bytes" — expands on using the returned start track/sector to open a scratch buffer and fetch the disk block.
