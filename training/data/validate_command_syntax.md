# VALIDATE (DOS) command

**Summary:** VALIDATE (abbrev. V) reconstructs the BAM (block availability map) on a Commodore DOS disk by freeing all blocks, tracing each directory file and marking blocks in use, then writing the rebuilt BAM (track 18, sector 0) to disk; invoked from BASIC via OPEN 15,8,15 / PRINT#15,"VO" (or "V"), CLOSE 15, or from the DOS prompt as V0 (1541 drive number 0 optional).

**Description**
VALIDATE instructs the disk DOS to rebuild its disk map so it matches the actual files listed in the directory. It is commonly used to recover or "decorrupt" disks whose BAM has become inconsistent with directory entries.

Operation summary:
- The command frees all blocks in the BAM.
- It scans/traces every file entry in the directory and marks the blocks those files occupy.
- After marking used blocks, it writes the new BAM back to disk (BAM resides on track 18, sector 0 on 1541-format disks).
- The command may be invoked from BASIC (through the serial bus device channel) or from the drive's DOS prompt.

Caveats:
- VALIDATE is not a failsafe recovery tool; it can fix many inconsistencies but cannot guarantee full recovery of corrupted data.
- The single-digit drive number 0 is optional when addressing a lone 1541 drive.

**BAM Sector Layout**
The Block Availability Map (BAM) is stored on track 18, sector 0 of a 1541 disk. Its structure is as follows:

- **Bytes 0–1:** Track and sector of the first directory block (typically 18/1).
- **Byte 2:** DOS version number (usually ASCII 'A' or $41).
- **Byte 3:** Unused (reserved for future use).
- **Bytes 4–143:** BAM entries for each track (4 bytes per track):
  - **Byte 0:** Number of free sectors on the track.
  - **Bytes 1–3:** Bitmap indicating free (1) and used (0) sectors.
- **Bytes 144–161:** Disk name (16 characters, padded with $A0 if shorter).
- **Bytes 162–163:** Disk ID (2 characters).
- **Byte 164:** Unused (typically $A0).
- **Bytes 165–166:** DOS type (usually '2A').
- **Bytes 167–255:** Unused (reserved for future use).

**Example BAM Sector Dump:**
In this example:
- **Bytes 0–1:** `12 01` (Track 18, Sector 1).
- **Byte 2:** `41` (ASCII 'A').
- **Bytes 4–7:** BAM entry for Track 1:
  - **Byte 4:** `12` (18 free sectors).
  - **Bytes 5–7:** `FF F9 17` (bitmap indicating sector usage).

*Note: The BAM structure and sector dump are based on standard 1541 disk formatting.*

## Source Code

```text
00: 12 01 41 00 12 FF F9 17 15 FF FF 1F 15 FF FF 1F
10: 15 FF FF 1F 15 FF FF 1F 12 FF F9 17 00 00 00 00
20: 00 00 00 00 0E FF 74 03 15 FF FF 1F 15 FF FF 1F
30: 0E 3F FC 11 07 E1 80 01 15 FF FF 1F 15 FF FF 1F
40: 15 FF FF 1F 15 FF FF 1F 0D C0 FF 07 13 FF FF 07
50: 13 FF FF 07 11 FF CF 07 13 FF FF 07 12 7F FF 07
60: 13 FF FF 07 0A 75 55 01 00 00 00 00 00 00 00 00
70: 00 00 00 00 00 00 00 00 01 08 00 00 03 02 48 00
80: 11 FF FF 01 11 FF FF 01 11 FF FF 01 11 FF FF 01
90: 53 48 41 52 45 57 41 52 45 20 31 20 20 A0 A0 A0
A0: A0 A0 56 54 A0 32 41 A0 A0 A0 A0 00 00 00 00 00
B0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
C0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
D0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
E0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
F0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
```

```basic
OPEN 15,8,15
PRINT#15,"VO"
CLOSE 15
```

Alternate short form:
```basic
OPEN 15,8,15
PRINT#15,"V"
CLOSE 15
```

DOS prompt example (DOS 5.1):
```text
>V0
```

## References
- "bam_sector_dump_and_overview" — expands on the BAM layout and shows the BAM on track 18 sector 0 being rebuilt by VALIDATE
