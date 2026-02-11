# Opening Random-Access Disk Channels (command channel 15 and data channel "#")

**Summary:** Explains opening the two channels required for random-access disk I/O on C64 DOS: the command channel (channel $0F / 15) and the data channel opened with the filename "#" or "#buffer#" using the BASIC OPEN statement.

## How it works
C64 DOS random-access operations require two open channels to the disk device:
- Command channel: always opened on channel 15 and used to send DOS commands (e.g., block-read, block-write, allocation checks).
- Data channel: opened separately to read or write the data blocks referenced by the commands; the data channel is opened by specifying the filename "#" (or "#buffer#" to select a buffer number).

You must open both channels: send DOS commands through channel 15, then read or write block data through the opened data channel.

FORMAT FOR OPEN STATEMENT FOR RANDOM ACCESS DATA
- OPEN file#, device#, channel#, "#"
- or optionally:
- OPEN file#, device#, channel#, "#buffer#"

(Here "buffer" is a decimal buffer number. The device# is typically 8 for the first floppy drive.)

## Source Code
```basic
REM Format examples for opening random-access data channels
OPEN file#, device#, channel#, "#"
OPEN file#, device#, channel#, "#buffer#"

REM Explicit examples from source:
OPEN 5,8,5,"#"
OPEN A,B,C,"#2"
```

## References
- "block_read_command_and_example" — expands on use of the opened random-access data channel together with BLOCK-READ