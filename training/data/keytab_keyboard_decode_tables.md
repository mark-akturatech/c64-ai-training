# KEYTAB ($F5-$F6) — Keyboard Decode Table Vector

**Summary:** $F5-$F6 (KEYTAB) is the two‑byte vector that points to the active 64‑byte keyboard decode table used to map the 64 keyboard matrix indexes to ASCII values depending on modifier state (unshifted, shifted, Commodore-logo, CTRL). Distinct from the VIC-II character set selection (register $D018).

## Description
KEYTAB is a vector (two bytes at $F5-$F6) containing the address of the keyboard matrix lookup table currently in use. Each table is 64 bytes long and provides an ASCII code for each of the 64 matrix positions — one table per modifier state. A single physical key can therefore produce up to four different ASCII values depending on whether it is pressed alone or with SHIFT, CTRL, or the Commodore logo key.

The CPU/OS uses the table pointed to by KEYTAB when converting a scanned matrix index to the character code to place into screen memory or to send to routines that print characters. This lookup is purely the logical mapping of matrix index → ASCII; it does not affect how that ASCII/screen code is rendered on the display.

Do not confuse these keyboard decode tables with the VIC-II character set tables (which define glyph bitmaps). The VIC-II character base is selected by register $D018 (location 53272) and determines how screen codes are drawn as pixels; KEYTAB determines which code is produced for a keypress.

## Source Code
```text
Keyboard decode tables (each 64 bytes)

60289 ($EB81) = default uppercase/graphics characters (unshifted)
60354 ($EBC2) = shifted characters
60419 ($EC03) = Commodore-logo key characters
60536 ($EC78) = CTRL characters
```

## Key Registers
- $F5-$F6 - Vector - Keyboard decode table pointer (points to one 64‑byte table mapping 64 matrix positions to ASCII)

## References
- "sfdx_keyscan_matrix_coordinate_and_keymap" — expands on matrix indexes converted to characters using the tables pointed to by KEYTAB
- "rvs_reverse_print_flag" — expands on printing/display behavior that may alter printed character codes (e.g., reversed)

## Labels
- KEYTAB
