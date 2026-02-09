# Communicating with the 1541 — three methods

**Summary:** C64/VIC-20 ↔ 1541 communication occurs via BASIC LOAD/SAVE/VERIFY commands, the 1541 command channel (channel 15), or data communication channels for file I/O; this chunk introduces and focuses on the command channel.

## Overview
The computer and the 1541 disk drive communicate over the serial bus in three distinct ways: (1) BASIC file commands intended for user convenience, (2) the command channel for drive control/housekeeping and status messages, and (3) data channels used for reading and writing file contents. The remainder of the manual concentrates on the command channel.

## LOAD, SAVE, and VERIFY (BASIC commands)
LOAD, SAVE, and VERIFY are BASIC-level commands (for tape and disk) that the BASIC interpreter translates into serial-bus requests sent to the drive. They are intended for ease of use and hide the low-level protocol from the user.

## Command channel (channel 15)
The command channel is used to send control/housekeeping messages to the 1541 and to receive DOS-generated status or error messages. Typical uses include:
- Formatting a blank disk
- Erasing a file
- Renaming a file
- Querying current error/status from the drive

The command channel is channel number 15 on the 1541. (Channel 15 is reserved for drive command and status I/O.)

## Data communication channels (file I/O)
The 1541 DOS exposes multiple file types and uses data channels to transfer file contents. Supported file kinds include:
- Program files
- Sequential files
- Relative files
- User files
- Direct-access files

This manual limits I/O discussion to direct-access programming (see Chapter 5) and does not attempt to teach general file-handling program development.

## References
- "command_channel_functions" — expands on what the command channel is used for  
- "direct_access_programming_overview" — expands on data channels and direct-access programming (Chapter 5)