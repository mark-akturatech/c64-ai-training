# Read Disk ID Bytes from Drive Buffer (BASIC)

**Summary:** BASIC routine using `PRINT#15, "B-P";2;162` and `GET#2` to read two disk-ID bytes from the drive buffer, normalizes each byte (clears high bit, maps space/zero and non-printable/quote to '?'), builds OLD ID (`ODI$`), prompts for NEW ID (`NDI$`), validates length (1–2 chars), asks confirmation, and pads/truncates `NDI$` to exactly 2 characters using `LEFT$`.

**Description**

This BASIC fragment positions the drive channel pointer to the disk-ID offset with the command `PRINT#15, "B-P";2;162` then performs two `GET#2` reads (channel 2) to fetch the two ID bytes. Each read byte (`B$`) is normalized to a printable form before being appended to `ODI$`:

- Space (ASCII 32) is converted to `CHR$(0)`.
- High bit is cleared (if `ASC(B$) > 127` then subtract 128).
- Non-printable values (ASCII < 32 or > 95) are mapped to 63 ('?').
- Double-quote (ASCII 34) is mapped to 63 ('?').

After building and displaying the old disk ID (`ODI$`), the program prompts for a new disk ID (`NDI$`). It accepts only lengths 1 or 2; otherwise, it loops to an error/exit label (line 690 in the original program flow). If the user confirms with "Y", `NDI$` is padded/truncated to exactly two characters using `LEFT$(NDI$ + CHR$(0), 2)` ready for writing back into the buffer.

This fragment assumes channel 15 and channel 2 are the intended command and data channels already open. Prior to issuing the `B-P` command, the program should perform a DOS version check to ensure compatibility. For details on opening the buffer and confirming the DOS version, refer to the referenced chunk "edit_disk_id_buffer_open_and_dos_version_query".

## Source Code

```basic
360 PRINT#15, "B-P";2;162
370 FOR I = 1 TO 2
380   GET#2, B$
390   IF B$ = " " THEN B$ = CHR$(0)
400   A = ASC(B$)
410   IF A > 127 THEN A = A - 128
420   IF A < 32 OR A > 95 THEN A = 63
430   IF A = 34 THEN A = 63
440   ODI$ = ODI$ + CHR$(A)
450 NEXT I

460 PRINT
470 PRINT "  CURRENT OLD DISK ID: "; ODI$
480 INPUT "  NEW DISK ID"; NDI$
490 IF LEN(NDI$) > 0 AND LEN(NDI$) < 3 THEN 510
500 GOTO 690

510 INPUT "  ARE YOU SURE (Y/N)"; Q$
520 IF Q$ <> "Y" THEN GOTO 690
530 NDI$ = LEFT$(NDI$ + CHR$(0), 2)
```

## Key Registers

- **Channel 15**: Command channel for sending disk commands.
- **Channel 2**: Data channel for reading from the disk buffer.

## References

- "edit_disk_id_buffer_open_and_dos_version_query" — opens the buffer and confirms DOS version before reading the disk ID
- "edit_disk_id_write_and_finish_procedure" — writes the validated/padded new ID back into the buffer and commits the block write