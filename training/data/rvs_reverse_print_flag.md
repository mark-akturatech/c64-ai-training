# RVS ($C7) — Reverse-print flag

**Summary:** System variable $00C7 (decimal 199) — RVS — controls reverse-printing of characters. CHR$(18) (CTRL+RVS-ON) sets this byte to $12 (18); print routines add $80 to the screen code while the flag is nonzero; it is cleared by CHR$(146) (CTRL+RVS-OFF) or on every carriage return.

## Description
- Name: RVS — "Print Reverse Characters? 0=No".
- Address: $00C7 (decimal 199).
- Behavior:
  - When the CTRL+RVS-ON control character (CHR$(18)) is printed, this location is set to $12 (decimal 18).
  - While nonzero, the print routines add $80 (decimal 128) to the screen code of each printed character so the character appears on-screen with reversed colors (screen code + $80).
  - POKEing $00C7 with any nonzero value has the same effect (enables reversed printing).
  - The flag is reset to zero either when CTRL+RVS-OFF (CHR$(146)) is received or on every carriage return; characters printed thereafter use normal color combination.

## Key Registers
- $00C7 - KERNAL - RVS (Print Reverse Characters flag): set to $12 by CHR$(18); print routines add $80 to printed screen codes while nonzero; cleared by CHR$(146) or on carriage return.

## References
- "keytab_keyboard_decode_tables" — expands on character printing and how printed character codes interact with display routines

## Labels
- RVS
