# Recovering an Unclosed File

**Summary:** Unclosed files in a C64 directory are shown with an asterisk (e.g., *SEQ, *PRG). Use the undocumented disk-drive read mode "M" (MODIFY) in the OPEN string (e.g., "file name,B,M" or "file name,P,M") to read an unclosed file; no EOI is returned so the reader must display bytes and stop manually. After recovery, restore PRG BASIC links (see section 8.3 / hard-error recovery) and VALIDATE the disk because scratching an unclosed file poisons the BAM.

## Procedure / Details
- Identification: An unclosed file appears in the directory with an asterisk before its type (examples: *SEQ, *PRG).
- Undocumented mode: The disk-drive supports an undocumented read mode "M" (MODIFY). Substitute M for R in the OPEN command to read an unclosed file.
- Behavior when reading:
  - The drive will not return an EOI (end-of-file) marker when reading in M mode.
  - The last sector written for the unclosed file contains an incorrect forward track/sector pointer; therefore there is no reliable in-band signal from the drive indicating the true end of the file.
  - Because of the missing EOI and bad forward pointer, the reader must display incoming bytes and include an embedded breakpoint or manual stop. Watch the incoming data and stop before reading beyond the actual file contents.
- Saving recovered data:
  - After capturing the correct bytes in RAM, write them to another diskette (a fresh file) to preserve the recovered contents.
- Restoring PRG internals:
  - If the recovered file is a PRG, restore the internal BASIC links (token/line-link chains) using the link-restoration techniques described at the end of section 8.3 (same methods used in hard-error recovery).
- Disk maintenance:
  - VALIDATE the diskette that contains the unclosed file after recovery/repair. Scratching or otherwise manipulating an unclosed file can poison the BAM (block availability map), so validation is required to repair BAM entries.

## Source Code
```basic
REM Normal read (examples)
OPEN 2,8,2,"file name,B,R"   : REM SEQ file
OPEN 2,8,2,"file name,P,R"   : REM PRG file

REM Read unclosed file using MODIFY mode
OPEN 2,8,2,"file name,B,M"   : REM SEQ file (use M instead of R)
OPEN 2,8,2,"file name,P,M"   : REM PRG file (use M instead of R)

REM Notes: When reading in M mode, display incoming bytes and use a breakpoint;
REM no EOI will be returned and the last sector has an erroneous forward T/S pointer.
```

## References
- "recovering_hard_error" — expands on using link-restoration techniques from hard-error recovery to restore internal BASIC links after reading an unclosed PRG (see end of section 8.3)