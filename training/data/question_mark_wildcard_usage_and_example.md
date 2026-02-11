# Question-mark wildcard (?) as a single-character mask — scratch example for ".C64" filenames

**Summary:** The question-mark wildcard (?) matches exactly one character. This example demonstrates using "????.C64" (four ? plus ".C64") sent to device channel 8 via OPEN/PRINT# to SCRATCH all eight-character filenames whose characters 5–8 are ".C64".

**Description**

The ? wildcard masks a single character position. Using four question marks followed by the literal ".C64" requires an exact match of ".C64" in character positions 5–8 of the filename (an eight-character name total). Because ? matches one character each, only filenames with arbitrary characters in positions 1–4 and the literal ".C64" in positions 5–8 will match and be scratched.

The example uses the IEC command channel to send a SCRATCH (S0:) command to the disk drive:

- If filenames on disk include (for example) 154L.C64 and C100.C64 (each eight characters with ".C64" in positions 5–8), both will be scratched by S0:????.C64.
- BACKUP.C64 will not be affected because the literal ".C64" does not appear in positions 5–8 of an eight-character filename (the name is longer).

Note: The sentence "We could not use .C64* to scratch them" is ambiguous. Typically, one might use "*.C64" to match filenames ending with ".C64". However, the Commodore DOS does not support the asterisk (*) wildcard in the middle or at the beginning of a filename pattern. Therefore, using ".C64*" would not function as intended. The correct approach is to use "????.C64" to match eight-character filenames where the last four characters are ".C64".

## Source Code

```basic
OPEN 15,8,15
PRINT#15,"S0:????.C64"
CLOSE 15
```

```text
DOS 5.1: >S0:????.C64
```

Example filenames (matched):
- 154L.C64
- C100.C64

Example filename (not matched):
- BACKUP.C64

## References

- "asterisk_wildcard_examples_and_dangers" — expands on how '*' behaves and why caution is needed
- "multiple_wildcards_and_priority_rules" — expands on examples combining ? and * and discusses priority rules