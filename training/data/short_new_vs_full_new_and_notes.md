# Short NEW (omit ID): PRINT#15,"NO:DISK NAME" / PRINT#15,"N:DISK NAME"

**Summary:** Short NEW (omit ID) invoked with OPEN 15,8,15 / PRINT#15,"NO:name" or "N:name" (DOS 5.1) erases only the first directory sector and writes an empty BAM (track 18 sectors 0-1) on an already-formatted C64 disk—faster than a full reformat but does not repair physical sector errors.

## Description
A "short" NEW is a quick erase for a disk that has already been formatted. It is performed by opening the device channel to the disk drive and sending a NEW command that omits the two-byte disk ID (i.e., no comma and no ID after the name). The command only updates the directory root and the BAM; it does not reformat the entire disk.

Behavior details:
- Requires a previously formatted disk (will not format an unformatted disk).
- Erases the first directory sector and writes a fresh (empty) BAM to indicate a blank disk to DOS.
- Implements the change by rewriting only track 18, sectors 0 and 1.
- Does NOT scan or rewrite other tracks/sectors and therefore will not correct read/write errors or physically damaged sectors.

## Usage / Syntax
- Open the disk device and send the NEW without an ID:
  - OPEN 15,8,15
  - PRINT#15,"NO:DISK NAME"   (or PRINT#15,"N:DISK NAME")
  - CLOSE 15

- Example:
  - OPEN 15,8,15
  - PRINT#15,"NO: TEST DISKETTE"
  - CLOSE 15

- DOS 5.1 display format examples:
  - >NO:DISK NAME
  - .>N:DISK NAME

## Effects
- Writes an empty Directory sector (first directory sector).
- Writes an empty BAM (Block Availability Map).
- Physical layout impact: only track 18, sectors 0 and 1 are rewritten.
- Time: effectively near-instant compared to a "full" NEW (full reformat takes ~2–3 minutes).

## Recovery Advice / Caveats
- If a disk exhibits read/write errors, copy files to another disk first before attempting a full NEW (reformat).
- A short NEW will not repair physical sector errors; use a full NEW (reformat) to attempt to recover sectors after saving data.
- See recovery procedures for handling accidental short NEW or full NEW (referenced chapter).

## Source Code
```basic
OPEN 15,8,15
PRINT#15,"NO: TEST DISKETTE"
CLOSE 15

' Alternate short form
OPEN 15,8,15
PRINT#15,"N:TEST DISKETTE"
CLOSE 15
```

```text
DOS 5.1 examples:
>NO:DISK NAME
.>N:DISK NAME
```

```text
Disk areas modified by short NEW:
- Track 18, Sector 0  -> Directory: first sector rewritten (directory root cleared)
- Track 18, Sector 1  -> BAM: Block Availability Map rewritten (marked empty)
```

## References
- "new_command_syntax_and_parameters" — expands on NEW command syntax, ID semantics and full-N EW behavior
- "getting_out_of_trouble_recovery_methods" — recovery procedures (see Chapter 8) for short/new-related problems