# INITIALIZE (PRINT#15,"INITIALIZE" or "I")

**Summary:** Disk drive command to return the drive to its power-up state via the command channel (PRINT#15). Use PRINT# 15, "INITIALIZE" or the abbreviation "I"; this clears the drive's internal state and requires re-matching the drive to the computer.

**Usage**
The INITIALIZE command forces the disk drive back to the same internal state it has immediately after power-up. It is used when a disk error or drive condition prevents normal operations.

- **Effect:** Resets the drive's internal state, including:
  - Command buffers
  - File/DOS state
  - Current track/sector pointers
  - Disk ID in memory
  - Error status
  - Block Availability Map (BAM) in memory
  - Closes all open files
  - Moves the read/write head to track 18 (directory track)
  
  ([scribd.com](https://www.scribd.com/doc/24664640/1541-Users-Guide?utm_source=openai))

- **Caution:** After INITIALIZE, you must re-match the drive to the computer before attempting further file or directory operations. This involves reopening the command channel to the drive.

- **Invocation:** Sent via the command channel (device channel 15).

## Source Code
```basic
PRINT# 15, "INITIALIZE"
' or abbreviated:
PRINT# 15, "I"
```

## Key Registers
- **Command Channel (15):** Used to send commands like INITIALIZE to the disk drive.

## References
- "open_and_print_command_channel" — expands on invoking commands via the command channel (15)
- "chapter_2" — covers re-matching the drive to the computer (OPEN/CHANNEL procedure)