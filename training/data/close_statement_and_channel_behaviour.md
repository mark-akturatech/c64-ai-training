# CLOSE (BASIC) — close a logical file / command channel

**Summary:** CLOSE file# closes a previously opened logical file/command channel in Commodore BASIC; OPEN uses three parameters (logical file number, device number, channel number) while CLOSE uses only the logical file number. Note: loading/running/editing auto-closes the command channel but aborts data channels (files left not properly closed on disk).

## Usage
After finishing with a command or data channel, issue CLOSE with the logical file number you used when opening it.

- OPEN takes three parameters: logical file number, device number, channel number.
- CLOSE takes one parameter: the logical file number.

You do not need to CLOSE the command channel after every command, but habitually closing files is recommended to avoid leaving data files improperly closed on the drive.

## Behavior and caveats
- Loading, running, or editing a program automatically closes all communication channels.
  - The command channel is closed properly in these cases.
  - Data channels are aborted (not closed) when this happens; an aborted data channel does NOT close the file properly on the disk drive.
- If you forget to CLOSE a channel, the immediate worst-case is a ?FILE OPEN ERROR when attempting to open the same logical file number again.
- To prevent potential data loss on the drive, always CLOSE data files when finished.

## Source Code
```basic
SYNTAX:      CLOSE file#
EXAMPLE:     CLOSE 15
```

## References
- "input_get_syntax_and_usage" — expands on closing after reading error messages