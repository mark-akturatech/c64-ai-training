# KERNAL keyboard select vectors ($EB79-$EB7F)

**Summary:** Table of four 16-bit little-endian KERNAL vectors at $EB79-$EB7F that point to the start addresses of the four keyboard decode tables: unshifted ($EB81), shifted ($EBC2), Commodore ($EC03) and control ($EC78). Contains raw vector bytes and target table addresses used by the keyboard decode routine.

## Keyboard Select Vectors
These four vectors are stored in the KERNAL ROM and are read as 16-bit little-endian addresses (low byte first, high byte second) by the keyboard decode routine to select the appropriate decode table for the current modifier state.

- Vector addresses: $EB79, $EB7B, $EB7D, $EB7F
- Target tables:
  - Unshifted keyboard table starts at $EB81
  - Shifted keyboard table starts at $EBC2
  - Commodore-key keyboard table starts at $EC03
  - Control-key keyboard table starts at $EC78

The vectors contain the low byte followed by the high byte (e.g., bytes 81 EB → $EB81). These pointers allow the keyboard scanning/decoding code to branch into the correct table for key->PETSCII (or control/CBM variants) mapping.

## Source Code
```asm
.:EB79 81 EB                    vector to unshifted keyboard, $eb81
.:EB7B C2 EB                    vector to shifted keyboard, $ebc2
.:EB7D 03 EC                    vector to cbm keyboard, $ec03
.:EB7F 78 EC                    vector to ctrl keyboard, $ec78
```

## Key Registers
- $EB79-$EB7F - KERNAL ROM - keyboard decode table vectors (4 little-endian 16-bit vectors pointing at $EB81, $EBC2, $EC03, $EC78)

## References
- "keyboard_table_unshifted" — expands on unshifted keyboard decode table (starts at $EB81)
- "keyboard_table_shifted" — expands on shifted keyboard decode table (starts at $EBC2)
- "keyboard_table_commodore" — expands on Commodore keyboard decode table (starts at $EC03)
- "keyboard_table_control" — expands on control keyboard decode table (starts at $EC78)