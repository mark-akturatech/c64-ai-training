# VIC-series USER commands — jump locations and memory-execute example (start)

**Summary:** The VIC-series User's Manual documents seven USER commands that perform jumps to specific RAM addresses; this chunk notes those jump locations are simpler than they look and begins a modified memory-execute BASIC example using OPEN 15,8,15. Searchable terms: USER commands, jump addresses, memory-execute, OPEN 15,8,15, BASIC, VIC (VIC-II).

**Notes**

The original manual itemizes seven USER commands and their corresponding jump addresses. These commands are:

- **U1 or UA**: Jump to $0500
- **U2 or UB**: Jump to $0503
- **U3 or UC**: Jump to $0506
- **U4 or UD**: Jump to $0509
- **U5 or UE**: Jump to $050C
- **U6 or UF**: Jump to $050F
- **U7 or UG**: Jump to $FFF A

([commodore.ca](https://www.commodore.ca/wp-content/uploads/2018/11/commodore_vic_1541_floppy_drive_users_manual.pdf?utm_source=openai))

These addresses are less “mystifying” than they appear, as they correspond to specific locations in the disk drive's RAM memory. By loading these locations with another jump command, like `JMP $0520`, you can create longer routines that operate in the disk's memory along with an easy-to-use jump table—even from BASIC.

The following is a modified memory-execute program intended to demonstrate using a USER command:

## Source Code

```basic
100 REM U3
110 OPEN 15,8,15
120 PRINT#15, "M-E:" CHR$(6) CHR$(5)
130 CLOSE 15
```

In this program:

- Line 100: `REM U3` is a BASIC remark labeling the program example.
- Line 110: `OPEN 15,8,15` opens the command channel to the disk drive (device 8).
- Line 120: `PRINT#15, "M-E:" CHR$(6) CHR$(5)` sends the memory-execute command to the disk drive, instructing it to execute the code at memory location $0506 (6 + 5*256).
- Line 130: `CLOSE 15` closes the command channel.

This example demonstrates how to invoke a USER command by sending a memory-execute command to the disk drive, which then jumps to the specified memory location and executes the code found there.

## References

- "uj_and_ui_warm_reset_quirks_and_recovery" — expands on USER-command discussion (UJ/UI-) and why USER commands are notable
- "block_write_behavior_and_demo_program" — expands on related I/O/memory-execute techniques referenced earlier in the disk-utility discussion