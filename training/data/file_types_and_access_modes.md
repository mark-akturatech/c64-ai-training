# Commodore IEC Serial Bus — DOS file types and access modes

**Summary:** Lists C64/IEC DOS sequential file types (SEQ, PRG, USR) and DOS access modes (R, M, W, A) used with device commands and OPEN/LOAD/SAVE operations on the IEC serial bus.

## File types
Sequential files support three types:
- SEQ — Sequential data storage
- PRG — Executable programs
- USR — User-defined data

(These are DOS-level file type labels used by the IEC serial bus and CBM DOS implementations.)

## Access modes
DOS access modes for sequential files:
- R — Read
- M — Recovery mode
- W — Write
- A — Append

## References
- "relative_files_rel" — contrast with REL (relative) files and record-based access