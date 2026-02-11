# RELative files — side sectors, pointers, capacity (Chapter 7.1)

**Summary:** RELative files (REL) provide record/field structured data on Commodore DOS by using side sectors (pointer sectors) that contain start-pointers for records; DOS tracks the blocks used and allows records to span blocks. Capacity: up to 6 side sectors × 120 pointers = 720 records, each record up to 254 characters.

## Introduction
RELative files let software address individual records directly rather than scanning sequentially. Files are organized as records (and fields within records) so programs can read or write a single record by record number. The DOS provides the filesystem support needed to map records to physical blocks on the disk.

## How DOS organizes side sectors and data blocks for relative access
- Side sectors: The DOS creates dedicated sectors that hold pointers (start addresses) for records. Each side sector can contain up to 120 record pointers. A file may have up to 6 side sectors, giving a maximum of 720 record pointers per relative file.
- Record pointers: Pointers in side sectors point to the beginning of each record in the data area. These pointers let the DOS locate a record quickly without scanning the file sequentially.
- Records and blocks: Records may begin in one block and continue (overlap) into subsequent blocks. The DOS keeps track of which tracks and blocks are used by the file so it can follow a record that spans multiple blocks and update allocations.
- Record size and capacity: Each record may be up to 254 characters long. With 720 records of up to 254 bytes each, a relative file can grow to occupy the entire diskette if needed.
- File metadata: The DOS maintains the mapping from record numbers to physical locations via the side sectors; application programs operate in terms of record numbers and record lengths (set at file creation).

## References
- "creating_relative_files_open_syntax_and_format_table" — how to create REL files, OPEN syntax, and record length specification