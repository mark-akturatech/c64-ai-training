# VERIFY

**Summary:** VERIFY ["<file-name>"][,<device>] — BASIC command to compare a program in memory with a program on tape (Datassette, device 1) or disk (device 8); used after SAVE to confirm data integrity. On mismatch prints ?VERIFY ERROR; tape prompts include PRESS PLAY ON TAPE, SEARCHING, FOUND, VERIFYING.

## Action / Behavior
The VERIFY command compares the contents of the BASIC program currently in RAM with a stored BASIC program on tape or disk:

- Can be used in direct mode or from within a BASIC program.
- Default device: device 1 (Datassette) when the <device> parameter is omitted.
- Tape behavior:
  - If <file-name> is omitted, VERIFY will locate and compare the next program found on the tape.
  - Common tape prompts: the system may display PRESS PLAY ON TAPE, then SEARCHING, FOUND <FILENAME>, VERIFYING.
- Disk behavior:
  - For disk devices (commonly device 8), a filename must be supplied — VERIFY "NAME",8.
- Filename may be provided either as a quoted string or as a string variable.
- Typical use: run immediately after SAVE to ensure the stored program matches memory and to position tape just past the last stored program (so a subsequent SAVE won't overwrite another program).
- Failure: if any differences in program text are detected, BASIC displays ?VERIFY ERROR.

## Source Code
```basic
VERIFY ["<file-name>"][,<device>]

Examples:

VERIFY                      (Checks 1st program on tape)
(Prompt sequence:)
PRESS PLAY ON TAPE
OK
SEARCHING
FOUND <FILENAME>
VERIFYING

9000 SAVE "ME",8:
9010 VERIFY "ME",8          (Looks at device 8 for the program)
```

## References
- "save_command" — expands on VERIFY typically used right after SAVE to confirm written program