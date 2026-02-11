# SAVE-and-replace mechanism using @0: (Section 3.6)

**Summary:** The SAVE "@0:..." convention tells CBM DOS on the drive to locate an existing directory entry with that filename, mark the old entry deleted, and create a new entry with the same name; syntax uses device numbers (device#) and the leading "@0:" is for multi-drive compatibility.

## SAVE-and-replace behavior
If a file with the target name already exists on the disk, prefixing the filename with "@0:" when issuing SAVE causes the drive DOS to:
- Search the directory for a matching filename.
- Mark the existing directory entry as deleted.
- Create a new directory entry with the same name.
- Store the new file normally.

Required syntax: the filename must begin with the characters @0: exactly (an at-sign, the digit 0, and a colon). The 0 (or 1 on some multi-drive units) refers to the internal drive number on multi-drive Commodore units — it is included to remain compatible with those drives that address the internal subdrive by number. (DOS here means the CBM DOS firmware in the disk drive.)

The device number in the SAVE command is the usual drive address (e.g., 8 for an external 1541). Using the @0: prefix does not change the device# parameter; it only affects how the drive handles an existing directory entry with the same name.

## Source Code
```basic
REM Format for SAVE with replace
REM SAVE "@0:" + name$, device#, command#

REM Examples:
SAVE "@0:TEST",8
A$ = "TEST"
SAVE "@0:" + A$,8
```

## References
- "open_and_print_command_channel" — expands on OPEN/PRINT# command channel usage for similar @0: replace behavior when opening files for write
