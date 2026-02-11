# Block C0 — mostly-zero bytes; transition markers D7, 52 (precedes ASCII at C8)

**Summary:** Dump block at offset C0 contains mostly placeholder zero bytes with two non-zero bytes ($D7, $52) at C6–C7 that mark the boundary before ASCII text beginning at C8; searchable terms: C0, C8, $D7, $52, ASCII transition, hex dump.

**Description**
This chunk is an 8-byte sector/block starting at offset C0 (bytes C0..C7). The block is dominated by zero/placeholder bytes; two non-zero bytes appear at the last two offsets and indicate the transition from binary/empty fields into the following ASCII region (which begins at C8).

Observed byte values:
- C0–C5: 00 (placeholder/zero)
- C6: D7 (0xD7) — non-zero marker
- C7: 52 (0x52) — ASCII 'R' (last byte before the ASCII block at C8)

No code or higher-level structure is provided here; this chunk functions as a bridge between the preceding offset-area data and the ASCII string bytes that start at C8.

## Source Code
```text
; Hex dump for offsets C0..C7
C0: 00 00 00 00 00 00 D7 52   ; C6 = $D7, C7 = $52 ('R')

; Offset map
; C0: $00
; C1: $00
; C2: $00
; C3: $00
; C4: $00
; C5: $00
; C6: $D7
; C7: $52  ; ASCII 'R', boundary before ASCII block at C8
```

## References
- "sector_offsets_A8_B0_B8" — expands on the data that precedes C0 in the dump
- "ascii_block_C8_D0_transport" — contains the ASCII text beginning at C8 (and D0:)