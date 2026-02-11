# Commodore 64 ROM 'RRBY' signature at $FFF6-$FFF9

**Summary:** ASCII signature "RRBY" stored in C64 ROM at addresses $FFF6-$FFF9 (ROM data/identification). Appears in a fully commented Commodore 64 ROM disassembly (English).

## Description
This chunk documents a four-byte ASCII signature embedded in the C64 ROM image at absolute addresses $FFF6-$FFF9 (within the KERNAL ROM area). The bytes are stored as data used for identification within the ROM rather than executable code. The signature text is "RRBY" (see Source Code for the raw byte line from the disassembly).

## Source Code
```asm
.:FFF6 52 52 42 59              RRBY
```

## References
- "Fully Commented Commodore 64 ROM Disassembly (English)" — original disassembly title containing this data line
