# Commodore 64 Memory: BASIC Program Area and Cartridge Space ($0800-$9FFF)

**Summary:** Memory layout and cartridge vector details for the BASIC program area ($0800-$9FFF) and optional cartridge ROM ($8000-$9FFF). Includes link byte at $0800, BASIC program start at $0801, total BASIC storage size, and cartridge vectors/signature at $8000-$8008.

## BASIC Program Area ($0800-$9FFF)
The BASIC program region begins at $0801 (the link byte at $0800 must be 0 for RUN). The contiguous BASIC program storage area runs from $0801 up through $9FFF (reported usable size 38,911 bytes). The zero-page BASIC start pointer is at $002B-$002C (points to $0801) — see cross-reference for details.

The C64 can optionally map an 8 KB cartridge ROM into $8000-$9FFF; when present this region overlays the same address range and contains cartridge vector entries and a signature field required by the cartridge header.

Cartridge structure (within $8000-$9FFF):
- $8000-$8001 — Cold reset entry point (vector)
- $8002-$8003 — Non-maskable interrupt (NMI) handler vector
- $8004-$8008 — Signature string "CBM80" (5 ASCII bytes)

## Source Code
```text
Memory map (excerpt):

$0800        Link Area               ; must contain 0 for RUN
$0801-$9FFF  BASIC Program           ; Program storage area (38,911 bytes)

Cartridge ROM (optional, 8K):
$8000-$9FFF  Cartridge ROM           ; Optional external ROM (8192 bytes)

Cartridge header / vectors (within $8000-$9FFF):
$8000-$8001  Cold reset entry point  ; 2-byte vector (low/high)
$8002-$8003  NMI handler vector      ; 2-byte vector (low/high)
$8004-$8008  Signature "CBM80"       ; ASCII signature (5 bytes)
```

## Key Registers
- $0800 - Link Area (single-byte; must be 0 to allow RUN)
- $0801-$9FFF - BASIC Program Area (main BASIC program storage)
- $8000-$9FFF - Cartridge ROM (optional 8 KB external ROM)
- $8000-$8008 - Cartridge vectors/signature (cold reset, NMI, "CBM80")

## References
- "zero_page_basic_pointers_and_arrays" — covers BASIC start pointer ($002B-$002C) referencing $0801
- "cartridge_structure" — expands on cartridge cold reset/NMI entries and signature