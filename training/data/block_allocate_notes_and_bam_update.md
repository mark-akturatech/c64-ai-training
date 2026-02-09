# B-A (block-allocate), BAM updates, and direct-access open/close discipline

**Summary:** Explains the alternate B-A block-allocate command syntax (`PRINT#15, "B-a: " ; O; T; s`), the reason for opening/closing a direct-access channel (BAM rewritten on close), erratic on-the-fly BAM updates, odd disk-full error behavior (Error 72 vs Error 67 with track 36), and that allocated blocks persist until a VALIDATE; directory sectors once allocated are never deallocated automatically.

**Block-allocate sequence and B-A syntax**

The program sequence around the block-allocate operation is:

- Open a direct-access channel.
- Initialize track to 1.
- Initialize sector to 0.
- Issue the block-allocate command.
- Query the error channel to obtain DOS’s response (NO BLOCK information).
- If the returned track is 0 then all 683 blocks are allocated.
- Do not allocate the directory (avoid allocating directory sectors).
- Otherwise, allocate the next available track and sector returned by DOS.
- Close the direct-access channel.
- Handle errors in a dedicated handler (lines 330–370).

The alternate format of the block-allocate command used in the program (line 180) is:

`PRINT#15, "B-a: " ; O; T; s`

Opening and closing the direct-access data channel (e.g., channel 15) is the standard form because traditionally the BAM (Block Availability Map) is rewritten to the diskette when a direct-access data channel is closed (line 290).

**BAM updating, validation, and disk-full behavior**

- The BAM is updated on-the-fly by DOS but very erratically; therefore opening and closing direct-access channels around disk modifications is recommended to ensure the BAM on disk is correct.
- Writing to a full disk can produce surprising errors:
  - Normal (sequential) save/write mode: typically returns Error 72, DISK FULL.
  - Direct-access or certain write situations: may return Error 67, ILLEGAL TRACK OR SECTOR with a track in the 36 range (example shown as 36,01). This occurs because Error 72 is only produced under normal write mode when at least one free block existed at the outset or when the directory is physically full (144 active file entries).
- Block allocation persistence:
  - A block remains marked allocated in the BAM until the diskette is validated (VALIDATE command). During validation, blocks that chain to directory entries remain allocated; others may be freed.
  - Special caution: once a sector has been allocated for the directory, DOS never deallocates that directory sector automatically—even during a validate. Allocated directory sectors can only be freed under explicit software control.
- Practical rule: avoid using block-allocate in a way that assigns unused sectors inside the directory area (see program’s line 260: “Don't allocate the directory”).

## Source Code

```basic
10 REM Block-allocate program outline (descriptive lines from source)
150 REM Open a direct-access channel.
160 REM Initialize track to 1.
170 REM Initialize sector to 0.
180 REM Block-allocate command.
190 REM Query error channel.
200 REM The track and sector were not allocated.
210 REM Something is amiss so bail out.
220 REM Counter representing number of sectors allocated (from line 170).
230 REM Print track, sector, counter.
240 REM The sector just allocated already was in use; DOS returns next available (65, NO BLOCK, track, sector).
250 REM If next available track = 0 then all 683 blocks allocated.
260 REM Don't allocate the directory.
270 REM DOS returns next available sector in error message (65, NO BLOCK, track, sector).
280 REM Allocate the next available track and sector.
290 REM Close the direct-access channel.
330 REM-370 REM Error handler.

REM Alternate format of block-allocate command (line 180):
PRINT#15, "B-a: " ; O; T; s

REM Note in text: "The following program makes use of the block-allocate command to certify a formatted diskette..."
REM (The full certification program that writes a worst-case binary pattern to unused sectors is referenced but not included here.)
```

## References

- "block_allocate_program" — expands on why the program opens/closes the direct-access channel repeatedly
- "bam_and_bam_handling_notes" — expands on persistence of allocated directory sectors and validation