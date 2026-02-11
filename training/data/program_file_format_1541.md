# PRG (program) file block format — 1541 Table 5.5

**Summary:** PRG file block layout used by the Commodore 1541: bytes 0–1 contain the track and sector pointer to the next block, bytes 2–256 contain 254 bytes of program data in CBM memory format (tokenized BASIC / PETSCII), and end-of-file is signaled by three zero bytes.

## Description
A PRG (program) file on a 1541-formatted disk is stored as a linked list of 256-byte blocks. Each block is structured so that:
- Byte 0–1: hold the track and sector of the next block in the file (the next-block pointer). When the next-block pointer indicates end-of-file, the EOF marker described below is used.
- Byte 2–256: contain 254 bytes of program data in Commodore memory format (BASIC program text with tokenized keywords and PETSCII character encoding). These are the raw bytes that will be loaded into C64 memory when the program is LOADed.
- End-of-file: signaled by three zero bytes (this is the EOF marker used in PRG blocks).

This block layout differs from the 1541 sequential file format (see references) which uses a different EOF signaling and block usage. PRG blocks are intended for storing tokenized BASIC programs and are chained via the track/sector pointer in bytes 0–1.

(Parenthetical: CBM memory format = PETSCII with BASIC keywords tokenized.)

## Source Code
```text
Table 5.5: PROGRAM FILE FORMAT
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
- "directory_format_and_entry_structure_1541" — expands on Program (PRG) directory entries and shows reference to the first data block described here  
- "sequential_file_format_1541" — expands on Sequential vs. PRG block layouts and EOF signaling differences