# OPEN ... ,"L," + CHR$(record length) — Creating and on-disk layout of RELative files

**Summary:** Describes the OPEN syntax to create a RELative file on the C64 (OPEN file#,device#,channel#,"name,L,"+CHR$(record length)), examples, and the on-disk RELative file format (Table 7.1) including DATA BLOCK and SIDE SECTOR BLOCK layouts, record length, side-sector pointers to data blocks, and padding rules (FF/00 empty record marker, 00 padding for partial records).

**Creating a RELative file (OPEN syntax)**

- To create a new relative file, use:
  OPEN file#, device#, channel#, "name,L," + CHR$(record length)
  where record length is supplied as CHR$(n) and defines the fixed record size for that RELative file.
- Once created, subsequent OPENs without the replace option use the existing file. The source text states that the replace option (with the @ sign) does not erase and re-create the file.
- A RELative file may be expanded, read, and written after creation.
- Record length is stored on-disk in the side sector block (see Table 7.1).

Notes:
- The descriptive material omits the POSITION usage; see referenced chunk for positioning and record-numbering details.

**On-disk structure overview**

- A RELative file uses two primary block types on disk:
  - DATA BLOCK: holds up to 254 bytes of file data plus a 2-byte next-block pointer.
  - SIDE SECTOR BLOCK: contains file metadata used to index records (side sector number, record length) and a table of track/block pointers to data blocks (one pointer per data-block slot).
- Track/block pointers are stored as two bytes (track, then block) throughout the block formats.
- The side sector pointers area contains entries for 120 data blocks (pairs of bytes from byte 16 onward).
- Empty records are represented in a data block by a first byte of $FF followed by $00 to the end of the record. Partially filled records are padded with $00 (nulls).

## Source Code
```basic
REM Examples of OPEN statements creating RELative files
OPEN 2,8,2,"FILE,L," + CHR$(100)
OPEN F,8,F,A$ + ",L," + CHR$(Q)
OPEN A,B,C,"TEST,L," + CHR$(33)
```

```text
Table 7.1: RELATIVE FILE FORMAT

+---------------------------------------------------------------+
| DATA BLOCK                                                    |
+---------------------------------------------------------------+
| BYTE   | DEFINITION                                           |
+--------+------------------------------------------------------+
| 0,1    | Track and block of next data block.                  |
+--------+------------------------------------------------------+
| 2-255  | 254 bytes of data. Empty records contain FF (all     |
|        | binary ones) in the first byte followed by 00        |
|        | (binary all zeros) to the end of the record.         |
|        | Partially filled records are padded with nulls (00). |
+--------+------------------------------------------------------+

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
| 16-255 | Track and block pointers to 120 data blocks.         |
+--------+------------------------------------------------------+
```

## References
- "using_relative_files_position_command_and_record_numbering" — expands on opening, positioning within, and numbering records in existing relative files.
