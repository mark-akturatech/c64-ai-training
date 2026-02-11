# 1540/1541 PRG (Program File) Format — 1540/1541

**Summary:** PRG (program) files for Commodore 1540/1541 use 256-byte disk blocks where bytes $00-$01 hold the next-block pointer (track,sector) and bytes $02-$FF contain 254 bytes of tokenized program data (Commodore memory format). End-of-file for a program file is indicated by three zero bytes.

## Program file layout
A program file stored on a 1540/1541 disk is a linked sequence of 256-byte disk sectors (blocks). Each block uses the first two bytes as the pointer to the next block in the chain (track, sector). The remaining 254 bytes contain the program data in the in-memory CBM format used by BASIC programs (PETSCII text with tokenized BASIC keywords). The EOF of a program file is encoded as three zero bytes somewhere within the data stream (the three zero bytes mark the end of tokenized program data).

- Bytes 0-1: two-byte pointer (Track, Sector) to the next block in the file chain.
- Bytes 2-255 ($02-$FF): 254 bytes of program data (Commodore/C64 memory format, keywords tokenized).
- End-of-file: represented by three consecutive zero bytes in the data stream.

This format is used by directory entries which point to the first data block of the program file; subsequent blocks are followed via the track/sector pointers.

## Source Code
```text
                       PROGRAM FILE FORMAT
 +---------+-------------------------------------------------------+
 | BYTE    |              DEFINITION                               |
 +---------+-------------------------------------------------------+
 | 0,1     | Track and sector of next block in program file.       |
 +---------+-------------------------------------------------------+
 | 2-256   | 254 bytes of program info stored in CBM memory format |
 |         | (with key words tokenized).  End of file is marked by |
 |         | three zero bytes.                                     |
 +---------+-------------------------------------------------------+
```

## References
- "sequential_file_format" — Comparison of data region usage and EOF markers
- "directory_format_structure" — Directory entries point to first data block for a program file