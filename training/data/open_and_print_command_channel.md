# OPEN and PRINT# usage for disk drives and the command channel

**Summary:** OPEN file#, device#, channel#, text$ and PRINT# are BASIC I/O primitives used to create data channels and the disk command channel (channel 15) on Commodore drives. Parameters: file# (1–255), device# (usually 8), channel# (2–15; 15 = command channel), and optional text$ (sends an immediate command).

## Description
OPEN creates a logical channel between the computer and a device (typically the disk drive). The full OPEN syntax is:
OPEN file#, device#, channel#, text$

- file# — identifier for the file/channel inside the BASIC program (1–255). Avoid file# > 127 (see Notes).
- device# — device number of the peripheral; the disk drive is normally 8.
- channel# — logical channel number used to communicate with the device. Channels 0 and 1 are reserved by the OS for LOAD/SAVE. Valid application channels are 2–15. Channels 2–14 are used for data files; channel 15 is the command/status channel.
- text$ — optional string provided at OPEN time; the string is delivered to the device as if PRINT# had been used (useful for sending a single command immediately).

The command channel (channel 15) is used to send drive commands (open/directory/format/status) and to retrieve status or error messages (INPUT# is used to read responses from channel 15). Data channels (2–14) are used for file data transfers.

## Behavior
- OPEN with text$ performs an immediate send of text$ to the selected channel (convenient for single commands).
- PRINT# behaves like PRINT but directs output to the opened channel:
  - When used on a data channel, PRINT# sends data into the drive buffer for writing to disk.
  - When used on the command channel (15), PRINT# sends commands to the drive (e.g., "OPEN", "SAVE", "CMD", directory requests).
- File numbers greater than 127: PRINT# will generate a linefeed after the return character; therefore such file numbers are intended for non-standard printers and are best avoided for disk file work.
- For reading error or status information returned by the drive, use INPUT# on the command channel (15).

## Source Code
```basic
REM FORMAT EXAMPLES (BASIC)
OPEN file#, device#, channel#, text$
OPEN 15,8,15
OPEN 2,8,2

REM ALTERNATE: send command after OPEN via PRINT#
OPEN 15,8,15
PRINT#15, command$

REM OR: send command at OPEN time (text$ parameter)
OPEN 15,8,15, command$
```

```text
REM PARAMETER DIAGRAM (original layout)
   +-------------- FILE#
   |  +----------- DEVICE#
   |  |  +-------- COMMAND CHANNEL#
   |  |  |
   OPEN A, B, C, Z$
            |
            +----- COMMAND$(text$)
```

## References
- "reading_error_channel_example_and_error_fields" — expands on using command channel (15) and INPUT# to read error information
- "disk_command_summary" — summary of common PRINT# command strings
