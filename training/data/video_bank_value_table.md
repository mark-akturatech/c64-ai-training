# VIC-II Video Bank Mapping (A = 0..3)

**Summary:** 2-bit value A (00..11) selects the VIC‑II 16KB video bank (bank 0–3) and maps the VIC‑II chip to one of four starting addresses ($0000, $4000, $8000, $C000); character set availability depends on the chosen bank.

## Overview
The VIC‑II views RAM/ROM in 16 KB banks selected by a 2‑bit value A (values 0..3). Each A value corresponds to a two‑bit pattern, a bank number, and a 16 KB starting address that the VIC‑II uses for character data, screen RAM, sprites, etc. Changing the bank changes which memory the VIC‑II fetches from, so character sets and graphics data must reside in the active VIC bank.

## Source Code
```text
+-------+------+-------+----------+-------------------------------------+
| VALUE | BITS |  BANK | STARTING |  VIC-II CHIP RANGE                  |
|  OF A |      |       | LOCATION |                                     |
+-------+------+-------+----------+-------------------------------------+
|   0   |  00  |   3   |   49152  | ($C000-$FFFF)*                      |
|   1   |  01  |   2   |   32768  | ($8000-$BFFF)                       |
|   2   |  10  |   1   |   16384  | ($4000-$7FFF)*                      |
|   3   |  11  |   0   |       0  | ($0000-$3FFF) (DEFAULT VALUE)       |
+-------+------+-------+----------+-------------------------------------+
```

## References
- "video_bank_selection_cia2_ports" — how to set these values via CIA2 POKEs