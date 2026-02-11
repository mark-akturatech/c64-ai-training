# 1541 Sequential File Data Block Format (SEQ)

**Summary:** SEQ (sequential) file data blocks on the 1541 contain a 2‑byte pointer (track, sector) in bytes $00–$01 and 254 bytes of file data in bytes $02–$FF where ASCII carriage return (CR, $0D) acts as the record terminator.

## Format
Each sequential data block is 256 bytes long:
- Bytes 0–1: pointer to the next sequential data block (track then sector).
- Bytes 2–256: 254 bytes of file data; records within the block are terminated by carriage returns (CR, $0D).

Blocks are chained via the 2‑byte pointer so that directory entries reference the first data block of a SEQ file and the chain continues until the pointer indicates the end of the chain (see cross-references).

## Source Code
```text
                 Table 5.4: SEQUENTIAL FORMAT
 +---------+-------------------------------------------------------+
 | BYTE    |              DEFINITION                               |
 +---------+-------------------------------------------------------+
 | 0,1     | Track and sector of next sequential data block.       |
 +---------+-------------------------------------------------------+
 | 2-256   | 254 bytes of data with carriage returns as record     |
 |         | terminators.                                          |
 +---------+-------------------------------------------------------+
```

## References
- "directory_format_and_entry_structure_1541" — expands on SEQ file entries, first-data-block in directory entries and block chaining format
- "program_file_format_1541" — contrast with PRG program-file format (tokenized CBM memory layout and EOF marker)