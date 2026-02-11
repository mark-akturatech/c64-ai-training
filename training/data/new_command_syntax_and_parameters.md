# The NEW Command (NO: / N:)

**Summary:** Use OPEN 15,8,15; PRINT#15,"NO:DISK NAME,ID"; CLOSE 15 to issue the DOS NEW/format command to a 1541 (also accepted as the short form N:). Parameters are NO: (N = NEW, optional 0 = drive number), a cosmetic disk name (up to 16 chars), and a two-character disk ID written to every sector (prevents accidental overwrites). A full NEW formats all tracks (≈2–3 minutes).

## The New Command
The DOS NEW (NO: or N:) command prepares a fresh 1541 diskette for use by having the drive write tracks/sectors and create a directory structure. It is sent to the drive via a channel opened to device 15 (the command channel) and terminated by the PRINT# statement.

The colon (:) after N or NO terminates the DOS command token. The DOS accepts the optional drive number 0 as a legacy from dual-drive systems; on a single 1541 the 0 may be omitted.

DOS also supports a short-form command (N:...), documented in later DOS versions (e.g. DOS 5.1), which behaves equivalently for NEW.

## Parameters and behavior
- NO: / N:
  - N stands for NEW. The following 0 (NO:) is an optional drive-number holdover; it can be omitted on a 1541.
  - The colon terminates the command token.
- Disk name
  - Up to 16 characters.
  - Cosmetic only — shown in the directory; not written elsewhere on the disk.
- Disk ID
  - Exactly two alphanumeric characters.
  - Written to every sector/block on the disk and repeatedly checked by DOS before write operations.
  - Use a unique ID per diskette to prevent accidental overwriting when two diskettes have the same directory contents.
- Full vs short NEW
  - A “full” NEW (format) writes all tracks/blocks and sets up the directory; on a 1541 this takes roughly 2–3 minutes.
  - The short syntax (N:...) / short-new behavior is documented elsewhere (see References) — it can behave as an erase/new variant in some DOS versions.

## Source Code
```basic
REM Full NEW (format) example
OPEN 15,8,15
PRINT#15,"NO:MY DISKETTE,MD"
CLOSE 15

REM Short-form NEW (accepted by some DOS versions, e.g. DOS 5.1)
OPEN 15,8,15
PRINT#15,"N:MY DISKETTE,MD"
CLOSE 15
```

## References
- "dos_support_short_syntax_note" — expands on alternate short syntax in DOS SUPPORT
- "short_new_vs_full_new_and_notes" — expands on short-new (erase) behavior versus full formatting
