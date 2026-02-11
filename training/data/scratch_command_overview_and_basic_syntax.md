# Scratch command (OPEN 15,8,15 / PRINT# / PRINT*)

**Summary:** How to scratch (delete) files on a Commodore disk drive using the command channel (OPEN 15,8,15), the file-scratch command strings (PRINT#15,"SO:..."/PRINT* 15,"S:..."), and how unclosed files appear in the directory (zero blocks, file-type preceded by *). Includes BASIC examples and DOS 5.1 prompt forms.

## Overview
The Scratch command deletes a file from disk by sending a scratch (S or SO) command to the drive command channel. Before issuing the command, remove the disk's write-protect tab and insert the disk (key in). The only exception to successful scratching is an unclosed file: it appears in the directory with zero blocks and its file-type is shown preceded by an asterisk (for example, *PRG, *SEQ). Unclosed files cannot be scratched by the normal scratch command (see referenced cross-link for recovery details).

(OPEN 15,8,15 uses channel 15 to device 8 — the drive command channel.)

## Syntax
- OPEN 15,8,15
- PRINT#15,"SO:FILE NAME"
- CLOSE 15

Alternate shorthand:
- PRINT* 15,"S:FILE NAME"

Notes on the strings:
- "S:" or "SO:" is the scratch command prefix sent to the drive; include the exact filename as it appears in the directory.
- Use the same quoting/spacing as BASIC requires (example below).

## Examples
BASIC example (scratch file named "TESTING 123"):
- OPEN 15,8,15
- PRINT#15,"SO: TESTING 123"
- CLOSE 15

Alternate form using PRINT*:
- PRINT* 15,"S:FILE NAME"

DOS 5.1 prompt examples (drive command-line forms):
- >so:file name
- >s:file name

## Source Code
```basic
OPEN 15,8,15
PRINT#15,"SO: TESTING 123"
CLOSE 15
```

```basic
PRINT* 15,"S:FILE NAME"
```

```text
dos 5.1:
>so:file name
>s:file name
```

## References
- "wildcards_in_scratch_commands" — expands on wildcard usage and cautions when scratching multiple files
- "unclosed_file_definition_and_causes" — formal definition of an unclosed file, causes and recovery methods