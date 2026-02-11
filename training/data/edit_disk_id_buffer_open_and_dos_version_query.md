# 1541 DOS version check via buffer pointer (OPEN 2,8,2,"#"; U1; B-P; GET#2, ASC)

**Summary:** This BASIC program checks the DOS version of a Commodore 1541 disk drive by opening a direct-access channel, issuing a block-read command, and reading the buffer pointer byte. The DOS version is determined by the ASCII value of the buffer pointer byte, with 65 (ASCII 'A') indicating CBM DOS v2.6. If the DOS value is not 65, it prints a failure message and branches to the failure/cleanup handler.

**Drive DOS check and buffer read — operation summary**

This BASIC fragment performs a DOS-version check on a CBM 1541 drive by:

- **Opening logical channel 2 to device 8** with the file name "#" so the drive assigns a buffer (`OPEN 2,8,2,"#"`).
- **Sending a block-read (U1) command** to the drive via the command channel (`PRINT#15,"U1",2,0,18,0`). The U1 command requests the drive to return a data block from the drive buffer.
- **Reading the drive response bytes** from the command channel (`INPUT#15,EN,EM$,ET,ES`). These are the normal 5-byte error/status response values returned by the 1541 for disk commands (error number, error message bytes, etc.).
- **Requesting the buffer pointer byte** via the "B-P" (buffer-pointer) command to the drive (`PRINT#15,"B-P";2;2`). This returns a single byte pointer into the buffer on channel 2.
- **Reading that pointer byte** from logical channel 2 with `GET#2,B$` and converting it to a numeric DOS identifier with `DOS = ASC(B$)`. The code expects `DOS = 65` (ASCII 'A' value 65), which here represents CBM DOS v2.6 on the 1541.
- **Conditional branching** based on the DOS value:
  - If `DOS = 65`, the code proceeds (`GOTO 360`).
  - If not, it prints a "FAILED" message and jumps to the failure/cleanup handler (`GOTO 690`).

**Notes and assumptions in source:**

- The listing uses `PRINT#15` and `INPUT#15` (command channel), so it assumes the drive command channel (channel 15) is open elsewhere prior to these lines.
- The code branches to line numbers (360, 690) that are not present in this chunk — they are part of the surrounding program.
- The buffer pointer is read from logical channel 2 (the same channel opened with "#").

## Source Code
```basic
250  OPEN 2,8,2,"#"

260  PRINT#15,"U1";2;0;18;0

270  INPUT#15,EN,EM$,ET,ES

280  PRINT#15,"B-P";2;2

290  GET#2,B$

300  IF B$="" THEN B$=CHR$(0)

310  DOS=ASC(B$)

320  IF DOS=65 THEN GOTO 360

330  PRINT "DOWN> 73, CBM DOS V2.6 1541,00,00"

340  PRINT "DOWN>FAILED<ROFF>"

350  GOTO 690
```

## References
- "edit_disk_id_initialization_and_drive_check" — required prior drive status check before opening buffers
- "edit_disk_id_read_and_edit_disk_id_bytes" — reading the disk ID bytes from the buffer after the DOS check passes