# Datassette 192-byte Header Block Format

**Summary:** Describes the 192-byte Datassette header block format used by C64 tape images: byte layout (start/end addresses, 16-byte displayed filename, padding), and header type values $01-$05 (relocatable BASIC, ASCII/data, machine code, ASCII header, EOT).

## Header Block Structure
The header block is exactly 192 bytes and identifies the following for the following data block on tape:

- Byte 1: Header Type (one of $01-$05)
- Bytes 2-3: Start address (little-endian: low, high)
- Bytes 4-5: End address (little-endian: low, high)
- Bytes 6-21: 16-byte filename (this is the filename shown/displayed)
- Bytes 22-192: 171 bytes of filename area not displayed; padded with ASCII space ($20)

Filenames shorter than 16 characters are padded with ASCII $20 (space) in the displayed field; the remainder of the header (bytes 22-192) is filled with $20.

Header type values control how the following data block is interpreted (BASIC relocation, sequential ASCII data, machine code, etc.).

## Source Code
```text
Header Block (192 bytes)

    Byte    Length  Content
    1       1       Header Type
    2-3     2       Start address (low/high)
    4-5     2       End address (low/high)
    6-21    16      Filename (displayed)
    22-192  171     Filename (not displayed, padded with spaces $20)

Header Types:

    $01 - Relocatable BASIC program
    $02 - Data block for sequential ASCII file
    $03 - Non-relocatable program (machine language)
    $04 - ASCII file header
    $05 - End-of-tape marker (EOT)

Notes:
- Filenames shorter than 16 characters are padded with ASCII $20 (space).
- Start/End addresses are stored little-endian (low byte first).
```

## References
- "data_block_structure" — expands on header block as one type of 192-byte block
