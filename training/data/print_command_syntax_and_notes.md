# PRINT# usage to send commands to the 1541 DOS

**Summary:** How to send DOS commands to a Commodore 1541 using BASIC's PRINT# statement (PRINT# file#, "command"); covers syntax rules (no space before #, don't use ?#), the NO: (NEW) command example, disk name (up to 16 chars) and two-character disk ID parameters.

## Sending commands with PRINT#
Use BASIC's PRINT# statement to send textual commands from the C64 to the 1541 DOS command channel. The statement format is:

- file# — the logical file number opened for the command channel.
- command — the disk command string sent to the DOS.

Critical syntax rules (preserve exactly):
- The token is PRINT# (no space before the #). Do not write PRINT #.
- Spaces following the # are optional.
- Do not use the ?# abbreviation. The correct BASIC abbreviation is pR (p then SHIFT+R).

Commands fall into two categories:
1. Disk housekeeping commands (e.g. NEW/RENAME/VERIFY/etc.).
2. Commands to read/write data to disk or the drive's RAM (covered under Direct-Access Programming).

The housekeeping commands are discussed subsequently in the original source; read/write commands are discussed in Chapter 5 (Direct-Access Programming) of the referenced manual.

## NO: (NEW) command — parameters and effect
- Example command string: NO:MY DISKETTE,MD
- Action: Prepares a blank diskette for first-time use (format and write directory/blocks).
- Parameters:
  - Disk name: up to 16 characters.
  - Disk ID: two-character ID (written to each sector).
- In the example given, the printable BASIC line used spacing for readability (PRINT#15,"NO: MY DISKETTE, MD"), but the DOS command sent is "NO:MY DISKETTE,MD" (no extra spaces in the command tokenized by DOS).

## Source Code
```basic
SYNTAX:      PRINT# file#, "command"
EXAMPLE:    PRINT#15,    "NO: MY DISKETTE, MD"

' In the example, the disk command is "NO:MY DISKETTE,MD"
```

## References
- "new_command_syntax_and_parameters" — expands on NEW command example and ID semantics