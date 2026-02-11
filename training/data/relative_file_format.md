# Relative file (REL) format for 1540/1541

**Summary:** Description of REL (relative) file layout on Commodore 1540/1541 disks: DATA BLOCKs with 254 bytes of data, SIDE SECTOR BLOCKs containing side-sector index and record length, track/block pointer chains, empty-record encoding ($FF + $00 pad), and up to 120 data-block pointers per side sector.

## Format overview
A RELATIVE file on 1540/1541 media stores records across linked 256-byte disk sectors (blocks). Each sector is used either as a DATA BLOCK (contains up to 254 bytes of file data plus a 2-byte forward link) or as a SIDE SECTOR BLOCK (contains the side-sector index and a list of block pointers). Records are packed into DATA BLOCKs and are fixed-length as defined by the SIDE SECTOR BLOCK's record-length field.

Important behavior and encodings:
- Each sector is 256 bytes total. The first two bytes are the forward link (track, block) to the next sector in the chain.
- DATA BLOCK: bytes 0-1 = track and block of next data block; bytes 2-255 = 254 bytes of data (records packed here). Empty records are encoded with $FF in the record's first byte followed by $00s to the end of that record; partially filled records are padded with $00 bytes.
- SIDE SECTOR BLOCK: bytes 0-1 = track and block of next side sector block; byte 2 = side sector number (0–5); byte 3 = record length (bytes per record); bytes 4-15 = track/block pairs for side sectors 0–5 (six 2-byte pointers); bytes 16-255 = up to 120 track/block pointers to DATA BLOCKs (240 bytes / 2 = 120 pointers).
- The SIDE SECTOR BLOCK’s record-length defines how to interpret the record entries stored sequentially in DATA BLOCKs pointed to from the side-sector pointers.
- A side-sector chain may span multiple side-sector blocks; the forward link at bytes 0-1 chains them.

**[Note: Source may contain an off-by-one in byte ranges — corrected here to 0–255 inclusive for 256-byte sectors (DATA bytes are 2–255).]**

## Source Code
```text
                    RELATIVE FILE FORMAT
 +---------------------------------------------------------------+
 | DATA BLOCK                                                    |
 +---------------------------------------------------------------+
 | BYTE   | DEFINITION                                           |
 +--------+------------------------------------------------------+
 | 0,1    | Track and block of next data block.                  |
 +--------+------------------------------------------------------+
 | 2-256  | 254 bytes of data. Empty records contain FF (all     |
 |        | binary ones) in the first byte followed by 00        |
 |        | (binary all zeros) to the end of the record.         |
 |        | Partially filled records are padded with nulls (00). |
 +---------------------------------------------------------------+
 | SIDE SECTOR BLOCK                                             |
 +--------+------------------------------------------------------+
 | BYTE   | DEFINITION                                           |
 +--------+------------------------------------------------------+
 | 0,1    | Track and block of next side sector block.           |
 +--------+------------------------------------------------------+
 | 2      | Side sector number. (0-5)                            |
 +--------+------------------------------------------------------+
 | 3      | Record length.                                       |
 +--------+------------------------------------------------------+
 | 4,5    | Track and block of first side sector (number 0)      |
 +--------+------------------------------------------------------+
 | 6,7    | Track and block of second side sector (number 1)     |
 +--------+------------------------------------------------------+
 | 8,9    | Track and block of third side sector (number 2)      |
 +--------+------------------------------------------------------+
 | 10,11  | Track and block of fourth side sector (number 3)     |
 +--------+------------------------------------------------------+
 | 12,13  | Track and block of fifth side sector (number 4)      |
 +--------+------------------------------------------------------+
 | 14,15  | Track and block of sixth side sector (number 5)      |
 +--------+------------------------------------------------------+
 | 16-256 | Track and block pointers to 120 data blocks.         |
 +--------+------------------------------------------------------+
```

## References
- "single_directory_entry_structure" — expands on directory entries containing relative-file pointers and record size
- "block_distribution_by_track" — expands on relative file block allocation respecting per-track block counts
