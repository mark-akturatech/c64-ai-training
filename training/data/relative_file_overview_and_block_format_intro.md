# Relative (random-access) file storage (Commodore DOS)

**Summary:** Relative files (random-access) in Commodore DOS consist of a sequential data file of fixed-length records and a side-sector file of track/sector pointers; the side-sector file is about 1/120th the sequential file (min 1 block, max 6 blocks). One side-sector read locates the data block for a given record; up to two additional data-block reads may be required if the record spans two blocks. Sequential data blocks use bytes 0-1 as the forward pointer and bytes 2-255 as 254 bytes of data.

## Relative file structure
A relative (random-access) file is implemented as two linked files:

1. A sequential data file containing fixed-length records. The record length (record size) is fixed so the DOS can calculate the position of any record and read or write it in place without disturbing other records.

2. A side-sector file that stores track/sector pointers (track/sector numbers). The side-sector file contains two pointer lists:
   - The list of track/sector numbers of the blocks that hold the sequential data file (the data file chain).
   - The list of track/sector numbers of the blocks that hold the side-sector file itself (the side-sector file chain).

The side-sector file size depends on the length of the sequential file. In general it is approximately 1/120th of the sequential file length, with a minimum of 1 block and a maximum of 6 blocks. Each block in the side-sector file is called a side sector.

## Record access and reads required
Because records are fixed-length, the DOS can compute which data block contains a given record. Accessing a particular record requires:
- One side-sector read to find the track/sector of the data block containing that record.
- Up to two additional reads of data blocks if the record spans the boundary between two data blocks (the record may start in one data block and continue into the next).

## Source Code
```text
Sequential data block format (Commodore DOS)

Byte  Purpose
0     Track of the next block in this file
1     Sector of the next block in this file
2-255 254 bytes of data
```

## References
- "side_sector_block_format" — expands on layout of a side sector block
- "relative_file_directory_entry_dump_part1" — expands on example relative-file directory entry