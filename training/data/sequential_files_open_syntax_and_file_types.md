# Sequential files overview and OPEN syntax (OPEN file#, device#, channel#, "0:name,type,direction")

**Summary:** Sequential files on the C64 are streamed byte-by-byte through a buffer to the disk drive; use the OPEN statement format `OPEN file#, device#, channel#, "0:name,type,direction"` with file type codes PRG/SEQ/USR/REL and the replace option `@0:`. Common device# is $08 (8) and valid data channels are 2–14.

**Sequential files (behavior)**
SEQuential files must be read or written from beginning to end; data is transferred byte-by-byte through a buffer to the drive. To the disk drive, file types (SEQuential, PRG, USR) are treated the same — only PRG files support LOAD as a program. The directory is read-only and behaves like a file.

Relative (REL) files differ from SEQ files in that they allow direct access to fixed-length records anywhere in the file without reading through preceding data. This is achieved through an index (side sectors) that maps record numbers to their positions on the disk. Each record in a REL file has a fixed size, up to a maximum of 254 bytes, due to the disk's sector size limitation. This structure enables efficient random access, making REL files suitable for applications like databases where quick access to specific records is necessary. ([retrogamecoders.com](https://retrogamecoders.com/c64-dos-commands/?utm_source=openai))

**OPEN statement format and rules**
Format:
OPEN file#, device#, channel#, "0:name,type,direction"

- file# — program-side file number used to refer to the open file.
- device# — DOS device number (commonly 8 for the first drive).
- channel# — hardware/data channel on the drive; valid data channels are 2 through 14. Many programmers use the same value for file# and channel# for convenience.
- "0:" — prefix required before the filename (see note below about buffers).
- name — filename (when creating a write file, do not use wildcards or pattern matching).
- type — file type; you may use the full name or at least the first letter (e.g., P for PRG, S for SEQ).
- direction — READ or WRITE (or at least the first letter R or W).

Replace semantics:
- To open and replace an existing file, prefix the file specifier with `@0:` (example: `@0:DATA,S,W`). This forces the drive to replace the file at creation.
- The `0:` (or `@0:`) should always precede the filename; otherwise the drive may restrict available buffers (source: warns drive will only allow use of 2 buffers if omitted).

File type codes (acceptable values for type field)
- PRG — Program
- SEQ — Sequential
- USR — User
- REL — Relative

Notes on syntax flexibility:
- File type and direction accept at least the first letter (e.g., "P" or "PRG", "R" or "READ").
- The filename may be constructed dynamically (string concatenation) in BASIC (example shown below).

## Source Code
```basic
OPEN 2,8,2,"0:DATA,S,W"
OPEN 8,8,8,"0:Program,P,R"
OPEN A,B,C,"0:"+A$+"U,W"

OPEN 2,8,2,"@0:DATA,S,W"
```

## References
- "print_input_to_disk_formatting_and_examples" — expands on using PRINT#/INPUT# to write/read sequential files and formatting examples
