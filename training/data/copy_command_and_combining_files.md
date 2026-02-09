# COPY (Section 4.3)

**Summary:** Disk DOS COPY command sent via PRINT#15 (PRINT# 15,"C:...") duplicates a file under a new name or concatenates 2–4 files into one; it does not copy between separate single-drive units (dual drives like the 4040 are an exception).

## COPY command
The COPY command is a drive-side operation invoked by sending a command string to the disk drive command channel (PRINT# 15). It creates a duplicate of an existing disk file under a new filename on the same physical drive, or it concatenates multiple files into a single target file.

- Basic duplication: create a new file name that is a copy of an existing file on the same drive.
- Concatenation: combine two through four existing files into a single new file (order of files in the list is the concatenation order).
- Drive limitation: COPY will not copy between separate single-drive units; copying to another drive is only possible on multi-drive units (e.g., dual-drive 4040).

Syntax is literal: the command string must be sent to channel 15 using PRINT# and the drive command letter ("COPY" or abbreviated "C:").

## Source Code
```basic
PRINT# 15, "COPY:newfile=oldfile"
PRINT# 15, "C:newfile=oldfile"

' Combine 2–4 files into one:
PRINT# 15, "C:newfile=oldfile1,oldfile2,oldfile3,oldfile4"

' Examples:
PRINT# 15, "C:BACKUP=ORIGINAL"
PRINT# 15, "C:MASTERFILE=NAME,ADDRESS,PHONES"
```

## References
- "rename_command" — other directory modification commands (rename/scratch)