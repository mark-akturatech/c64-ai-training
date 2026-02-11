# KERNAL: Keyboard Decode Table — SHIFTED (keyboard 2)

**Summary:** Shifted keyboard decode table used by the C64 KERNAL; matrix indexed by writing a row value to $DC00 (CIA1) and reading a column value from $DC01 (CIA1). Contains 8x8 shifted-character values (ASCII/CBM) plus one trailing free byte $FF.

## Description
This chunk is the KERNAL's "Keyboard 2 - SHIFTED" decode table (the second of four keyboard tables). The keyboard matrix is organized as a 8×8 table of codes: the row is selected by writing to $DC00, and the column is sampled by reading $DC01— the byte read is the code at the row/column intersection. The table holds shifted-character values (ASCII and Commodore-specific symbols). The table is 64 bytes (8 rows × 8 columns) followed by a single free byte $FF.

Usage pattern:
- Write a row selector to $DC00 (CIA1 port A).
- Read $DC01 (CIA1 port B) to get the column value; the returned byte is the shifted character code for that key intersection.

This table complements:
- the unshifted keyboard table (normal key states),
- the Commodore-key map (alternate symbols),
- keyboard vectors that point to the table for selection/routing.

## Source Code
```text
                                *** KEYBOARD 2 - SHIFTED
                                This is the second of four keyboard decode tables. The
                                ASCII code for the key pressed is at the intersection of
                                the row (written to $dc00) and the column (read from
                                $dc01). The matrix values are shown below.
.:EBC2 94 8D 9D 8C 89 8A 8B 91
.:EBCA 23 D7 C1 24 DA D3 C5 01
.:EBD2 25 D2 C4 26 C3 C6 D4 D8
.:EBDA 27 D9 C7 28 C2 C8 D5 D6
.:EBE2 29 C9 CA 30 CD CB CF CE
.:EBEA DB D0 CC DD 3E 5B BA 3C
.:EBF2 A9 C0 5D 93 01 3D DE 3F
.:EBFA 21 5F 04 22 A0 02 D1 83
.:EC02 FF                       free byte
```

## Key Registers
- $DC00 - CIA1 - keyboard matrix row select (write row)
- $DC01 - CIA1 - keyboard matrix column read (read column / return code)

## References
- "keyboard_select_vectors" — vectors that point to keyboard tables and selection code
- "keyboard_table_unshifted" — unshifted keyboard decode table (normal key states)
- "keyboard_table_commodore" — Commodore-key map with alternate symbols

## Labels
- CIAPRA
- CIAPRB
