# LOAD command format (LOAD name$, device#, command#)

**Summary:** Describes the BASIC LOAD syntax for disk and tape devices on the Commodore (LOAD name$, device#, command#), including string name rules, device number behavior (default device 8 for drives, but omitted device implies tape), and command# semantics (0 normal BASIC load, 1 load to original memory for machine language/charsets).

## Description
The LOAD command for disk drives requires an explicit program name (string) and a device number when loading from disk. Unlike the DATASSETTE (tape), where omitting the name loads the first cassette program, disks can contain many programs so the name must be supplied.

- name$: A string specifying the program filename. It may be a quoted literal or the contents of a string variable already defined. Examples of valid names: "HELLO", "PROGRAM #1", A$, NAME$.
- device#: The device number of the peripheral to load from. Disk drives are typically hard‑wired (preset) to device number 8 on the drive's circuit board. If you have multiple drives, their device numbers must be set appropriately (see disk configuration). If no device number is listed in the LOAD statement, the computer assumes tape (DATASSETTE).
- command#: Optional. If omitted or zero, the file is LOADed normally — BASIC is loaded beginning at the standard start of BASIC memory for the current machine. If command# is 1, the file is loaded to the exact memory addresses from which it was saved (useful for machine language programs, character sets, and other memory‑dependent data). Command# 0 is appropriate for most BASIC programs; command# 1 preserves original load addresses.

Variables may be used for the name string, the device number, and the command number, provided those variables have been defined earlier in your BASIC program.

## Source Code
```basic
REM FORMAT
REM   LOAD name$, device#, command#

REM EXAMPLES
LOAD "TEST",8
LOAD "Program # 1",8
LOAD A$,J,K
LOAD "Mach Lang",8,1
```

## References
- "save_command_and_process" — expands on SAVE command syntax and DOS behavior during save
- "directory_bam_and_listing" — explains directory interaction with LOAD and the Disk Operating System (DOS)