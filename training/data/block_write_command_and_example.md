# BLOCK-WRITE (Section 6.4)

**Summary:** Describes the DOS BLOCK-WRITE (PRINT# file, "BLOCK-WRITE:" / "B-W:") command for writing a filled DOS data buffer to a disk block; discusses the DOS buffer pointer behavior and shows a BASIC sample program that writes to a block (track 1, sector 1).

**Command format and behavior**

BLOCK-WRITE writes the current DOS data buffer to a specified disk block. You must first fill the buffer (via PRINT# to a random-access channel), and DOS keeps an internal pointer counting how many characters are in the buffer. When you perform the BLOCK-WRITE operation, that pointer is recorded on disk (the recorded length controls the valid data in the written record).

Accepted command formats:

- `PRINT#file#, "BLOCK-WRITE:" channel; drive; track; block`
- Abbreviated: `PRINT#file#, "B-W:" channel; drive; track; block`

**Notes:**

- The DOS buffer pointer becomes the recorded length on disk when BLOCK-WRITE executes.
- The `ST` system variable will become non-zero when you try to read past the end-of-file marker within the record, indicating an attempt to read beyond the recorded length.

**Parameter details:**

- **channel**: The channel number used for the direct access file (same as the secondary address used when opening the file).
- **drive**: The drive number (typically 0 for single-drive systems).
- **track**: The track number on the disk (ranges from 1 to 35 on a standard 1541 disk).
- **block**: The sector number within the track (ranges from 0 to the maximum sectors per track, which varies by track).

**Sequence:**

1. OPEN a command channel to the drive (commonly channel 15).
2. OPEN a random-access data channel to DOS (example uses channel 5).
3. Use PRINT# on the data channel to fill the buffer.
4. Send the BLOCK-WRITE command on the command channel with `channel;drive;track;block` parameters.
5. CLOSE channels.

## Source Code

```basic
10 OPEN 15,8,15
20 OPEN 5,8,5,"#":REM OPEN A RANDOM ACCESS CHANNEL
30 FOR L=1 TO 50
40 PRINT#5,"TEST"
50 NEXT
60 PRINT#15,"B-W:";5;0;1;1
70 CLOSE 5:CLOSE 15
```

**Explanation:**

- **Line 10**: Opens the command channel to the disk drive.
- **Line 20**: Opens a random-access data channel.
- **Lines 30-50**: Writes the string "TEST" 50 times to the buffer.
- **Line 60**: Issues the BLOCK-WRITE command to write the buffer to track 1, sector 1.
- **Line 70**: Closes the data and command channels.

## Key Registers

- **ST (STATUS)**: System variable that reflects the status of the last I/O operation. A non-zero value indicates an error or special condition, such as attempting to read past the end of a record.

## References

- "block_allocate_and_error_handling" — expands on the importance of allocating blocks before writing with BLOCK-WRITE and related error handling.