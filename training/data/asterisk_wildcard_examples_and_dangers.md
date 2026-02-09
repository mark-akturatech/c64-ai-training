# Scratch Command Wildcards — "SO:*" catastrophic example (DOS 5.1)

**Summary:** Demonstrates DOS 5.1 scratch wildcard behavior: using a pattern like "T*" scratches every file whose name begins with T; using "SO:*" (scratch with wildcard *) will scratch every file on the diskette (equivalent to a short NEW). Shows the BASIC OPEN/PRINT#/CLOSE method of sending the command to device 15.

## Behavior and example
In the example all files beginning with the letter T, regardless of file type, will be scratched. If no file starts with the letter T, none will be affected. Careless use of a wildcard can have catastrophic results: issuing "SO:*" to the disk drive scratches every file on the diskette (equivalent to performing a short NEW on the disk).

**[Note: Source may contain an OCR error — 'OPEN 15, B, 15' likely should be 'OPEN 15,8,15'.]**

## Source Code
```basic
OPEN 15, B, 15
PRINT#15, "SO:*"
CLOSE 15
```

```text
DOS 5.1:    >SO: *
```

## References
- "wildcards_in_scratch_commands" — expands on general wildcard explanation and cautions
- "multiple_wildcards_and_priority_rules" — expands on combining wildcards and how '*' takes priority over '?'