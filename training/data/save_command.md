# SAVE (BASIC)

**Summary:** The `SAVE` command in Commodore 64 BASIC stores the current program in memory as a "prg" file to cassette (default device 1) or disk (device 8). It supports optional parameters for filename, device number, and secondary address flags (1, 2, 3) that control load address and end-of-tape markers.

**Description**

**FORMAT:** `SAVE ["<file-name>"][,<device-number>][,<address>]`

**TYPE:** Command

**Action:**

- `SAVE` writes the program currently in memory to tape or disk as a "prg" (program) file. The in-memory program remains unchanged after the operation.
- If `<device-number>` is omitted, the Commodore 64 defaults to cassette device 1. Specifying `<device-number>` as 8 directs the program to be saved to disk.
- When saving to tape, the data is written twice to allow the Commodore 64 to check for errors during loading.
- For tape saves, both `<file-name>` and the secondary `<address>` parameter are optional. However, omitting the filename prevents loading by name later.
- The secondary address parameter controls special tape behaviors:
  - `1` — Instructs the KERNAL to load the tape later at the program's original memory address instead of the default $0800 (2048 decimal).
  - `2` — Writes an end-of-tape marker after the program.
  - `3` — Combines both effects (load at original address and write end-of-tape marker).
- When saving to disk, a filename must be provided.
- `SAVE` can be used within programs; execution continues with the next statement after the `SAVE` completes.

## Source Code

```basic
REM FORMAT and EXAMPLES for SAVE command

REM FORMAT
PRINT "SAVE [""<file-name>""][,<device-number>][,<address>]"

REM EXAMPLES
SAVE               : REM Write to tape without a name
SAVE"ALPHA",1      : REM Store on tape as file-name "ALPHA"
SAVE"ALPHA",1,2    : REM Store "ALPHA" with end-of-tape marker
SAVE"FUN.DISK",8   : REM Save on disk (device 8 is disk)
SAVE A$            : REM Store on tape with the name in string A$
10 SAVE"HI"        : REM Save program then continue to next program line
SAVE"ME",1,3       : REM Store at same memory location and put end-of-tape marker
```

## References

- "load_command" — complementary `LOAD` behavior and address handling
- "verify_command" — `VERIFY` to check saved files
