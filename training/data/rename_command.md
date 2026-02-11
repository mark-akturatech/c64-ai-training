# RENAME (R:) — change a file name in the disk directory

**Summary:** Use the drive command channel (PRINT#15) to rename a directory entry: PRINT#15,"RENAME:newname=oldname" (abbrev. PRINT#15,"R:newname=oldname"). This is a fast directory-only operation; the file must not be OPEN.

## Description
RENAME changes only the filename entry in the disk directory — the operation is fast because the file data is not moved or rewritten. The command is sent to the disk drive via channel 15 (the drive command channel). The target file must be closed; RENAME will fail for any file currently OPEN.

## Format
Full form:
PRINT#15,"RENAME:newname=oldname"

Abbreviated form:
PRINT#15,"R:newname=oldname"

(newname and oldname are the filename strings used in the directory entry)

## Source Code
```basic
PRINT#15,"RENAME:MYRA=MYRON"
```

Alternate (abbreviated) form:
```basic
PRINT#15,"R:MYRA=MYRON"
```

## References
- "scratch_command_erasing_files_and_pattern_matching" — related directory operations such as SCRATCH to delete files