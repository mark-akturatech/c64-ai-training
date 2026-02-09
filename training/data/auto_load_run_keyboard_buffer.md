# Keyboard buffer for auto LOAD/RUN at $ECE7

**Summary:** Keyboard buffer bytes in the C64 ROM at $ECE7 contain the ASCII/token sequence 'LOAD<CR>RUN<CR>' used for automatic LOAD/ RUN processing. The bytes are shown in hex with printable ASCII interpretation.

## Keyboard buffer contents
This ROM data is the keyboard buffer used during automatic LOAD/ RUN processing in the Commodore 64 ROM. The sequence begins at $ECE7 and contains the characters "LOAD" followed by carriage return, then "RUN" followed by carriage return. The source shows overlapping byte listings (second line repeats part of the first); interpret the full intended sequence as bytes from $ECE7 through $ECEF.

Note: the dump labels the bytes as "ASCII/token" (printable bytes shown as ASCII where applicable). Additional ROM interactions can cause overlaps (for example, a VIC-II initialization byte can overlap the first character — see referenced chunk).

## Source Code
```text
                                *** keyboard buffer for auto load/run
.:ECE7 4C 4F 41 44 0D 52 55 4E  'load (cr) run (cr)'
.:ECEA 44 0D 52 55 4E 0D
```

Interpreting the contiguous bytes at $ECE7..$ECEF:
```text
$ECE7: 4C  ; 'L'
$ECE8: 4F  ; 'O'
$ECE9: 41  ; 'A'
$ECEA: 44  ; 'D'
$ECEB: 0D  ; <CR>
$ECEC: 52  ; 'R'
$ECED: 55  ; 'U'
$ECEE: 4E  ; 'N'
$ECEF: 0D  ; <CR>
```

## References
- "vicii_initialization_values" — expands on sprite 7 colour byte overlaps the first character of the 'LOAD' buffer
- "control_keyboard_table" — expands on control-key decoding that can influence automatic keyboard sequences