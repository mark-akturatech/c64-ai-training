# COPY command

**Summary:** The Commodore 64 DOS COPY command, invoked via the disk channel (e.g., `OPEN 15,8,15: PRINT#15,"C:...": CLOSE 15`), duplicates an existing file on the diskette. The destination file must have a different name, the command does not work on relative files, and sufficient free disk space is required. On single-drive setups, specifying the drive number is optional; the short form uses "C:" instead of "CO:".

**The COPY command**

The COPY command is sent to the disk drive through the serial channel (usually channel 15). It duplicates an existing file on the diskette, subject to three restrictions:

- The destination (new) file must have a different name from the source file.
- COPY will not operate on relative files.
- There must be enough free space on the diskette for the new file.

The command string may use "CO:" or the short form "C:". In systems with two drives, the drive number is often supplied twice (a DOS legacy from dual-drive configurations); supplying the drive number is optional on single-drive setups.

The same filename restrictions that apply to the RENAME command also apply to COPY: file name length (16 characters), restricted characters, etc.

**Syntax**

- **Full form (explicit command name):**
  - `PRINT#15,"CO:BACKUP=0:ORIGINAL"`
- **Short form:**
  - `PRINT#15,"C:BACKUP=ORIGINAL"`

The usual channel open/close wrapper:

- `OPEN 15,8,15`
- `PRINT#15,"C:DEST=SOURCE"`
- `CLOSE 15`

"DEST" is the new filename (must differ from SOURCE). The "=0" in the examples specifies the drive number. In single-drive systems, this is typically "0" and can often be omitted. In dual-drive systems, specifying the drive number ensures the correct drive is used. ([manualzilla.com](https://manualzilla.com/doc/7392668/commodore-computer-commodore-64-user-s-manual?utm_source=openai))

**Examples**

- **Backup with explicit CO: and parameter:**
  - `OPEN 15,8,15`
  - `PRINT#15,"CO:BACKUP=0:ORIGINAL"`
  - `CLOSE 15`

- **Alternate (short) form:**
  - `OPEN 15,8,15`
  - `PRINT#15,"C:BACKUP=ORIGINAL"`
  - `CLOSE 15`

- **Example creating a file named "MY PROGRAM B/U" from "MY PROGRAM":**
  - `OPEN 15,8,15`
  - `PRINT#15,"CO:MY PROGRAM B/U=0:MY PROGRAM"`
  - `CLOSE 15`

## Source Code

```basic
OPEN 15,8,15
PRINT#15,"CO:BACKUP=0:ORIGINAL"
CLOSE 15

' Alternate short form:
OPEN 15,8,15
PRINT#15,"C:BACKUP=ORIGINAL"
CLOSE 15

' Example:
OPEN 15,8,15
PRINT#15,"CO:MY PROGRAM B/U=0:MY PROGRAM"
CLOSE 15
```

## References

- "copy_command_append_multiple_files" — expands on COPY combining sequential files