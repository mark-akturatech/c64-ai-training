# SCRATCH (S) command — wildcards and example

**Summary:** Describes the SCRATCH (S) command syntax for Commodore DOS (send via OPEN/PRINT#), the wildcard characters asterisk (*) and question mark (?), and a BASIC example sending the drive command (OPEN 15,8,15 / PRINT#15). Warns that wildcards can remove multiple files.

## Usage
The SCRATCH command requires a single parameter: the file name to remove, preceded by the letter S or the word SCRATCH. The drive/device number is optional when issuing the command (the device is normally selected by the OPEN statement used to send the command).

Wildcards allowed in the file name:
- * (asterisk) — matches zero or more characters
- ? (question mark) — matches exactly one character

Use wildcards with extreme caution: a single scratch command with a wildcard can delete multiple files at once.

**[Note: Source contained an OCR artifact 'SO:T»'; corrected here to 'S0:T*' which matches the intended drive command syntax sent over channel 15.]**

## Example
The common pattern to send a drive command from BASIC is:
- OPEN a command channel to the device (usually channel 15)
- PRINT# the SCRATCH command string to that channel
- CLOSE the channel

The example below scratches all files beginning with the letter T on the selected device (wildcard *).

## Source Code
```basic
OPEN 15,8,15
PRINT#15,"S0:T*"
CLOSE 15
```

```text
DOS 5.1: >S0:T*
```

## References
- "scratch_command_overview_and_basic_syntax" — core OPEN/PRINT# syntax examples
- "asterisk_wildcard_examples_and_dangers" — examples and warnings about asterisk wildcard misuse