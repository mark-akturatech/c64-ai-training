# RENAME command (DOS R:)

**Summary:** The RENAME command allows renaming files on a Commodore disk drive by sending the command string to the drive via the command channel. The syntax is `PRINT#15,"R0:NEW NAME=OLD NAME"` or the abbreviated form `PRINT#15,"R:NEW NAME=OLD NAME"`. The OLD filename must be spelled exactly as it appears in the directory; the NEW name can be up to 16 characters long. The drive number is optional on the 1541. Files that are currently open cannot be renamed.

**Description**

To rename a file on a Commodore disk drive, open the command channel (device 8) and send the RENAME command string to the drive. The command formats are:

- **Long form:** `R0:NEW NAME=OLD NAME` — the "0" indicates drive 0 (drive number may be omitted on a 1541).
- **Short form:** `R:NEW NAME=OLD NAME` — equivalent when drive defaulting is acceptable.

**Rules and details:**

- Open the command channel with `OPEN 15,8,15` and close with `CLOSE 15`.
- The NEW name is placed before the equals sign (`=`); the OLD name follows it.
- File names may be up to 16 characters long.
- Disallowed characters: asterisks (`*`), colons (`:`), quotation marks (`"`), question marks (`?`), and commas (`,`).
- The OLD filename must match exactly as it appears in the directory; wildcards are not allowed.
- If the OLD name is misspelled or not present in the directory, the rename operation fails safely (no damage to the disk).
- You cannot rename a file that is currently open for reading or writing.
- On DOS 5.1, the drive-prompt syntax equivalents are: `>ro:new name=old name` or `>r:new name=old name`.

**Example:**

The command `R0:DISPLAY T&S=DTS` renames the file named `DTS` to `DISPLAY T&S`. Note that the NEW name length, allowed characters, and exact spelling of OLD still apply.

## Source Code

```basic
10 OPEN 15,8,15
20 PRINT#15,"R0:NEW NAME=OLD NAME"
30 CLOSE 15
```

**Alternate (drive omitted / short form):**

```basic
OPEN 15,8,15
PRINT#15,"R:NEW=OLD"
CLOSE 15
```

**Example (rename `DTS` to `DISPLAY T&S`):**

```basic
OPEN 15,8,15
PRINT#15,"R0:DISPLAY T&S=DTS"
CLOSE 15
```

**DOS 5.1 prompt examples (drive's command line):**

```text
>ro:new name=old name
>r:new name=old name
```

## References

- "scratch_command_wildcards_unclosed_files_and_consequences" — expands on effects of unclosed files on directory operations
