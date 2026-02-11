# PRG file — first sector layout (directory type $82)

**Summary:** PRG (program) files are the common disk file type (directory filetype $82). The first 256-byte sector of a PRG contains a 2‑byte link (track, sector), a 2‑byte load address (lo, hi), and the first 252 bytes of program data (bytes 4–255).

**First-sector structure**

PRG files are identified in the directory by a filetype byte of $82. The first sector (block) of a PRG is 256 bytes long and begins with a forward pointer to the next block in the file: byte 0 holds the track number, and byte 1 the sector number. Bytes 2–3 are the two-byte load address (low byte first, then high byte). Bytes 4–255 contain the first 252 bytes of program data.

Byte offsets are sector-local (0–255). The diagrammatic layout for the first sector:

- Byte 0: Track of the next block in this file
- Byte 1: Sector of the next block in this file
- Byte 2: Lo‑byte of the load address
- Byte 3: Hi‑byte of the load address
- Bytes 4–255: The first 252 bytes of the program

## Source Code

```text
Diagram: First sector (bytes 0-255)

Byte  Purpose
0     Track of the next block in this file
1     Sector of the next block in this file
2     Lo-byte of the load address
3     Hi-byte of the load address
4-255 The first 252 bytes of the program
```

## References

- "file_entry_start_pointer_to_first_sector" — directory start pointer directs to this first sector structure
