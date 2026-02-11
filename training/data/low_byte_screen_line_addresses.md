# KERNAL: Low-byte Table for Screen Line Addresses ($ECF0-$ED08)

**Summary:** Table of low bytes for successive screen line addresses in the C64 KERNAL ROM at $ECF0-$ED08; high byte is derived from the screen base page (VIC-II screen base). Contains 25 entries (one per 40x25 text line). Useful for screen address calculation and KERNAL text output routines.

## Description
This ROM table lists the low (eight-bit) bytes of the starting address for each text screen line (successive 40-column lines). The corresponding full 16‑bit address for a given line is formed by combining the derived high byte (from the screen base page selected for the VIC-II) with the low byte from this table:

  screen_line_address = (screen_base_page << 8) + low_byte_from_table

There are 25 entries (lines 0–24), matching the 40×25 text screen. Fixed-screen PET models used an additional high-byte table (not included here); on the C64 the high byte is computed from the screen base page configured in VIC-II memory setup. This table is referenced by KERNAL text-output routines to compute line start addresses efficiently.

## Source Code
```text
                                *** LOW BYTE SCREEN LINE ADDRESSES
                                This is a table of the low bytes of screen line addresses.
                                The high byte of the addresses is obtained by derivation
                                from the page on which the screen starts. There was an
                                additional table of high byte addresses on the fixed
                                screen PETs.
.:ECF0 00 28 50 78 A0 C8 F0 18
.:ECF8 40 68 90 B8 E0 08 30 58
.:ED00 80 A8 D0 F8 20 48 70 98
.:ED08 C0
```

Alternative view — low byte per screen line (line 0..24):
```text
Line 0:  $00
Line 1:  $28
Line 2:  $50
Line 3:  $78
Line 4:  $A0
Line 5:  $C8
Line 6:  $F0
Line 7:  $18
Line 8:  $40
Line 9:  $68
Line 10: $90
Line 11: $B8
Line 12: $E0
Line 13: $08
Line 14: $30
Line 15: $58
Line 16: $80
Line 17: $A8
Line 18: $D0
Line 19: $F8
Line 20: $20
Line 21: $48
Line 22: $70
Line 23: $98
Line 24: $C0
```

## Key Registers
- $ECF0-$ED08 - KERNAL ROM - Low-byte table for screen line start addresses (25 bytes, lines 0–24)

## References
- "video_chip_setup_table" — expands on VIC memory setup and how screen base page is determined
- "graphics_text_control" — expands on KERNAL screen output routines that use these addresses