# Datasette 192‑byte File Header (PRG)

**Summary:** Description of the 192‑byte datasette file header used for PRG files on the C64, recorded with leader and countdown; lists offsets for File Type ($01/$03), little‑endian Start and End addresses, and 16‑byte filename.

## Header Format
A 192‑byte header immediately precedes each file on tape. The header itself is encoded and recorded exactly like any 192‑byte file: it is written with a leader and a countdown and then the 192 header bytes.

Fields are byte offsets inside the 192‑byte header (addresses are little‑endian where indicated):

- Offset 0 (1 byte): File Type — $01 for relocatable BASIC PRG, $03 for non‑relocatable machine language PRG.
- Offset 1..2 (2 bytes): Start Address (low/high) — two‑byte little‑endian load address for the file data.
- Offset 3..4 (2 bytes): End Address (low/high) — two‑byte little‑endian end address (inclusive or exclusive as used by loader; see loader docs).
- Offset 5..20 (16 bytes): Filename — 16‑byte filename as displayed by the system.
- Offset 21..191 (171 bytes): Unused/reserved — typically zero or filler; ignored by loaders.

Header Types:
- $01 — Relocatable BASIC program (PRG).
- $03 — Non‑relocatable program (machine language PRG).

Behavioral note: The header is treated as a 192‑byte data block on tape (so checksum/encoding and tape timing follow the same format as any recorded 192‑byte file, and it is followed immediately by the file data block).

## Source Code
```text
Header layout (192 bytes recorded as a 192-byte file with leader+countdown)

Offset  Length  Description
0       1       File Type ($01 = relocatable BASIC, $03 = ML PRG)
1       2       Start Address (low/high)       ; little-endian
3       2       End Address (low/high)         ; little-endian
5       16      Filename (displayed, 16 bytes)
21      171     Unused / reserved (filler to 192 bytes)

Header Type values:
$01 - Relocatable BASIC program
$03 - Non-relocatable program (machine language)
```

## References
- "get_countdown" — expands on header being preceded by leader and countdown
- "read_192_byte_header" — explains how the loader reads the 192‑byte header
- "load_program_data_loop" — explains using the Start Address from the header to place program data on load