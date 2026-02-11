# PRG first-sector load address (bytes 2-3) and the LOAD relocation flag

**Summary:** Explains the PRG file first-sector format emphasizing the load address in bytes 2-3 (lo-byte/hi-byte), example $01/$08 => $0801 (decimal 2049), and how the LOAD relocation flag (LOAD "name",8,1 vs LOAD "name",8) determines whether that embedded load address is respected.

## First sector layout and the "forward pointer"
PRG files on Commodore disk use a chained-sector layout. Each sector starts with a two-byte forward pointer (track, sector) that locates the next block in the file; this is present in every sector.

In the first sector specifically:
- Bytes 0-1: forward pointer (track, sector) to the next block.
- Bytes 2-3: two-byte load address in lo-byte / hi-byte order (little-endian). This is the address the file was intended to be loaded at.
- Bytes 4-255: the first chunk of file data (252 bytes).

A common example: BASIC programs saved from a C64 have bytes 2-3 equal to $01 $08 (lo=$01, hi=$08), which forms the 16-bit address $0801 (decimal 2049) — the standard BASIC program start on a C64.

## Effect of the LOAD relocation flag (",1")
The optional numeric third parameter in the BASIC LOAD command controls whether the embedded load address is used:
- LOAD "name",8,1 (with the ,1 relocation flag): the drive/C64 will respect the two-byte load address in bytes 2-3 of the PRG and load the file at that address.
- LOAD "name",8 (without the ,1): the system ignores the file's embedded load address and loads the file at the default BASIC start ($0801 on C64), effectively relocating the file to that default instead of the address stored in the PRG header.

This behavior applies to disk/device loads on C64 (and similarly on VIC-20). The presence or absence of the relocation flag therefore determines whether a program is loaded at its intended address or placed at the BASIC default.

## Source Code
```text
First sector (PRG):
Byte 0   - Track of next block (forward pointer)
Byte 1   - Sector of next block (forward pointer)
Byte 2   - Load address (lo byte)
Byte 3   - Load address (hi byte)
Byte 4-255 - First 252 bytes of program data

Example:
Bytes 2-3: $01 $08  -> load address = $0801 (lo=$01, hi=$08) = decimal 2049

Remaining (non-first) sectors:
Byte 0   - Track of next block
Byte 1   - Sector of next block
Byte 2-255 - Next 254 bytes of program data
```

```basic
' BASIC examples showing relocation flag usage:
LOAD "PROGRAM",8      ' ignores embedded load address; loads at $0801
LOAD "PROGRAM",8,1    ' respects embedded load address in bytes 2-3 of PRG
```

## References
- "program_file_storage_introduction_4_5" — expands on first sector layout and file-chaining details