# COPY command — combining sequential data files (PRINT#15 "CO:")

**Summary:** CBM DOS COPY syntax for combining multiple sequential data files via the serial device (PRINT#15 "CO:..." / "C:...") using COMBINED= or COMBINED=0 parameters; shows examples (device 8, channel 15) and documents that this cannot append a subroutine into a BASIC program — use third-party merge tools (POWER™, SYSRES™, BASIC AID™).

**Description**
The disk drive COPY facility can merge (append) two or more sequential data files into a single target file by sending a command string to the drive via channel 15 (the command channel). Two syntactic forms appear in the source:

- `CO:COMBINED=0:FILE1,0:FILE2,0:FILE3`
  - This form uses `COMBINED=0` followed by a colon-separated list of source files, each prefixed with `0:` (indicating drive 0). The `0:` prefix is a holdover from Commodore's dual-drive systems and is optional on the 1541 disk drive. ([datassette.s3.us-west-004.backblazeb2.com](https://datassette.s3.us-west-004.backblazeb2.com/manuais/1541_users_guide.pdf?utm_source=openai))

- `C:COMBINED=FILE1,FILE2,FILE3`
  - This alternate form uses `C:` and lists files directly after `COMBINED=` without the `0:` prefix.

Typical usage sequence:
- `OPEN 15,8,15` — open command channel to device 8
- `PRINT#15,"CO:COMBINED=0:FILE1,0:FILE2,0:FILE3"` — send copy/combined command
- `CLOSE 15` — close command channel

Behavioral notes:
- The resulting file on disk is the concatenation of the specified sequential data files.
- This feature is rarely used; most programming techniques do not require it.
- The drive cannot merge a subroutine into an existing BASIC program file (i.e., you cannot append a machine-code/BASIC subroutine and have it integrated into the BASIC program structure on disk). Use a programmer's aid or utilities (POWER™, SYSRES™, BASIC AID™ for the C64) to merge code into BASIC programs.

No register addresses are involved in this command (operation occurs via the serial/drive command channel).

## Source Code
```basic
OPEN 15,8,15
PRINT#15,"CO:COMBINED=0:FILE1,0:FILE2,0:FILE3"
CLOSE 15

' Alternate example (compact form)
OPEN 15,8,15
PRINT#15,"C:COMBINED=FILE1,FILE2,FILE3"
CLOSE 15

' Example shown in source (mailfile example)
OPEN 15,8,15
PRINT#15,"CO:MAILFILE=0:NAME,0:ADDRESS,0:CITY"
CLOSE 15
```

## References
- "copy_command_syntax_and_restrictions" — expands on basic copy usage and restrictions
- Commodore 1541 User's Guide, Chapter 4.7 — Combining Two or More Files ([datassette.s3.us-west-004.backblazeb2.com](https://datassette.s3.us-west-004.backblazeb2.com/manuais/1541_users_guide.pdf?utm_source=openai))