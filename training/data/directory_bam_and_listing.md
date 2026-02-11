# BAM and Directory Layout (Disk DOS)

**Summary:** Explains the Block Availability Map (BAM) and disk directory layout for Commodore 1541-style DOS: 683 disk blocks, 144 directory entries, track 18 as the BAM/directory track, why the BAM is updated only on CLOSE, and how to LOAD "$",8 then LIST or print the directory (OPEN/CMD/PRINT#).

## Overview
The Commodore disk drive (1541-style DOS) is a random-access device organized by the drive's on-board Disk Operating System (DOS). DOS manages disk space with two on-disk structures:

- The Block Availability Map (BAM) — a checklist of all blocks (sectors) on the disk.
- The directory — a list of files and metadata (name, type, blocks used, starting block).

A single standard 1541-format single-sided diskette contains 683 user-addressable blocks (sectors). The BAM and the directory are stored in the disk's middle track (track 18, the physical track halfway between the hub and the outer rim).

## BAM (Block Availability Map)
- Purpose: Records which of the 683 blocks are free or used; used by DOS when allocating blocks for SAVEs and file writes.
- Location: Track 18 (the middle track) in the directory/BAM area.
- Update rule: DOS updates the BAM only when a file is CLOSED. During writes, the directory entry may change immediately, but the BAM (the authoritative free-block map) is not written back until the file is properly closed.
- Failure mode: If a file is not CLOSED properly (power loss, drive reset, removing disk), the directory can show the file but the BAM may not reflect the blocks as used — causing data loss, corrupted free-space information, and potential overwrites.

## Directory
- Capacity: 144 directory entries (standard 1541 format).
- Contents of an entry: file name, file type, blocks used/list, starting block (and other DOS-managed metadata).
- Update behavior:
  - The directory is updated automatically when a file is SAVEd or when a file is OPENed for writing (so you may see directory changes immediately).
  - The BAM is not updated until the file is CLOSED — this is why CLOSE is required to finalize allocation and ensure consistency between directory and BAM.

## Why files must be CLOSED to update the BAM
- During a write session DOS reserves blocks and updates the directory entry so the file appears in the directory.
- The final block allocation (and the BAM write) is deferred until CLOSE so DOS can finalize all allocation bookkeeping and write the BAM back to disk in a controlled manner.
- Closing is the atomic commit step: without it the disk may contain an inconsistent directory versus BAM mapping, risking lost or overwritten blocks.

## Viewing and printing the directory
- To load the disk directory into the C64's memory (it is loaded like a BASIC program), insert the disk and run:
  - LOAD "$",8
- Typical device responses:
  - SEARCHING FOR $
  - FOUND $
  - LOADING
  - READY.
- After LOAD "$",8 the directory is resident in memory and can be displayed with LIST.
- To print the directory directly to a printer device (example uses device #4), use the DOS command redirection approach:
  - OPEN 4,4:CMD 4:LIST
  - When using CMD the printer file must be closed afterward (see next section).

## Printing cleanup (printer closing)
- When sending LIST via CMD to a printer device, close the device after printing to flush and finalize the print job:
  - PRINT#4
  - CLOSE 4
- Refer to VIC 1525 / 1515 printer manual for device-specific behavior and required control codes.

## Accessing the directory without LOAD and from BASIC
- DOS provides a support program and commands that allow directory examination without loading it as a BASIC program — see the DOS Support Program section for those commands.
- From within a BASIC program, directory data can be examined using GET# on the device (see chapter/section covering GET# usage in BASIC).

## Source Code
```basic
LOAD "$",8
```

```text
Device responses (example):
 SEARCHING FOR $
 FOUND $
 LOADING
 READY.
```

```basic
REM Example: print directory to printer on device 4
OPEN 4,4:CMD 4:LIST
REM After printing:
PRINT#4
CLOSE 4
```

## References
- "bAm_directory_and_file_format_tables" — low-level BAM and directory header/table formats (appendix/tables)
- "dos_support_wedge_and_shortcuts" — alternative ways to view the directory without LOAD via the DOS support program
