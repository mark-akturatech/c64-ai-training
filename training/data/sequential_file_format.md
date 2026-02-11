# Sequential file block format (1540/1541)

**Summary:** Layout of a single sequential data sector on Commodore 1540/1541 disks: bytes $00-$01 contain the link to the next track/sector, bytes $02-$FF contain 254 bytes of file data with records terminated by CR (0x0D).

## Sequential format
A sequential file block is a single-sector data format used by the 1540/1541 DOS for plain (un-tokenized) sequential files. Each sector contains a 2-byte forward link and a contiguous data area used to store ASCII records terminated with carriage return bytes.

- Bytes $00 (offset 0) and $01 (offset 1) form the forward link: the track byte followed by the sector byte of the next sequential data block. Follow this link to continue reading the file.
- Bytes $02-$FF (offsets 2 through 255) provide 254 bytes of payload data (records). Records within the stream are delimited by ASCII CR (0x0D).
- The CR byte is the record terminator (ASCII 13, 0x0D).

**[Note: Source may contain an error — original text listed "bytes 2-256 = 254 bytes". The correct inclusive range for 254 bytes is bytes $02-$FF (offsets 2–255).]**

## Source Code
```text
SEQUENTIAL FORMAT (single sector)

+---------+-------------------------------------------------------+
| BYTE    | DEFINITION                                            |
+---------+-------------------------------------------------------+
| $00     | Track of next sequential data block                   |
+---------+-------------------------------------------------------+
| $01     | Sector of next sequential data block                  |
+---------+-------------------------------------------------------+
| $02-$FF | 254 bytes of data (records terminated with CR 0x0D)   |
+---------+-------------------------------------------------------+
```

## References
- "sector_format_single_sector_1541" — expands on using the sector data area of 254 bytes
- "program_file_format" — contrasts: sequential uses CR record terminators; program files use tokenized CBM format