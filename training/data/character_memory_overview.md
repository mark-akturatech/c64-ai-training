# Character memory / VIC-II ($D018) — 2K-aligned character sets

**Summary:** VIC-II character memory start is selected by bits 3–1 of $D018 (53272); character sets are 256 chars × 8 bytes = 2K and must start on one of eight 2K-aligned locations within the 16K VIC window. Use POKE 53272,(PEEK(53272) AND 240) OR A to change the character base (remember to add the current bank base).

## Character memory
The VIC-II fetches character bitmaps (8 bytes per character, 256 characters = 2K) from a 2K-aligned start address inside the 16K video window. Because the VIC-II views 16K at a time, there are exactly eight possible 2K-aligned starting locations for a full character set.

Control:
- Register: $D018 (decimal 53272). Bits 3, 2 and 1 select which 2K block is used for character memory. Bit 0 is ignored.
- Changing $D018 also affects screen memory selection (same register). Preserve screen-memory bits when altering the character-memory bits.
- The numeric value A (see table) encodes the bits for character memory selection; when writing with BASIC, mask off the upper nibble to avoid clobbering unrelated bits:
  POKE 53272,(PEEK(53272) AND 240) OR A

Important:
- The table of A → start addresses gives offsets inside the current memory bank/window; you must add the bank base (video bank) to compute the full physical address. See video bank mapping documentation for the bank base value.
- Some listed entries refer to the character ROM image when the appropriate bank configuration is active (e.g., A=4/6 references ROM image in the default bank configuration).

## Source Code
```basic
100 REM Change character memory without disturbing high nibble:
110 POKE 53272,(PEEK(53272) AND 240) OR A
```

```text
Table: A values → character memory start (2K blocks)
+-----+----------+-------+-----------------------------+
|VALUE|   BITS   | DEC   |           HEX               |
+-----+----------+-------+-----------------------------+
|   0 | XXXX000X |     0 | $0000-$07FF                 |
|   2 | XXXX001X |  2048 | $0800-$0FFF                 |
|   4 | XXXX010X |  4096 | $1000-$17FF ROM IMAGE in   |
|     |          |       | BANK 0 & 2 (default)        |
|   6 | XXXX011X |  6144 | $1800-$1FFF ROM IMAGE in    |
|     |          |       | BANK 0 & 2                  |
|   8 | XXXX100X |  8192 | $2000-$27FF                 |
|  10 | XXXX101X | 10240 | $2800-$2FFF                 |
|  12 | XXXX110X | 12288 | $3000-$37FF                 |
|  14 | XXXX111X | 14336 | $3800-$3FFF                 |
+-----+----------+-------+-----------------------------+
* Remember to add in the BANK address (video bank base) to get full physical address.
```

## Key Registers
- $D018 - VIC-II - Character and screen memory control (bits 3–1 select character memory start in 2K blocks; bit 0 ignored). Use mask (PEEK(53272) AND 240) to preserve upper bits.

## References
- "video_bank_value_table" — expands on adding bank base when computing full character addresses
- "switching_io_and_character_rom_access" — how to access/copy character ROM (switch out I/O), including interrupt handling