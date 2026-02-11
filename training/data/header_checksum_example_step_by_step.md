# Header block checksum example — Sector $00, Track $12, ID LO $58, ID HI $5A

**Summary:** Demonstrates the header-block checksum algorithm used by Commodore DOS: checksum = sector ⊕ track ⊕ ID‑LO ⊕ ID‑HI (EOR). Example uses bytes $00 (sector), $12 (track), $58 (ID‑LO), $5A (ID‑HI) producing checksum $10 for track 18 sector 0.

## Checksum algorithm
The header-block checksum is computed by bitwise exclusive-OR (EOR) of four bytes in this order:
- Initialize accumulator with the Sector Number.
- EOR the accumulator with the Track Number.
- EOR with ID LO.
- EOR with ID HI.
Resulting single byte is the header checksum. (Data-block checksums use the same operation on a longer sequence of bytes.)

Formula: checksum = sector ⊕ track ⊕ id_lo ⊕ id_hi

## Worked example
Bytes used (hex and binary):
- Sector Number = $00 = 00000000
- Track Number  = $12 = 00010010 (18 decimal)
- ID LO         = $58 = 01011000 (88 decimal)
- ID HI         = $5A = 01011010 (90 decimal)

Step-by-step EOR (binary shown for clarity):

1. Initialization
- Acc = Sector ($00) = 00000000

2. EOR with Track ($12)
- 00000000
EOR 00010010
= 00010010

3. EOR with ID LO ($58)
- 00010010
EOR 01011000
= 01001010

4. EOR with ID HI ($5A)
- 01001010
EOR 01011010
= 00010000

5. Binary → Hex
- 00010000 = $10 (16 decimal)

Therefore the checksum for $00, $12, $58, $5A is $10. This example corresponds to track 18, sector 0 on the referenced 1541TE disk; the earlier GCR packing example covered the first four bytes of the same header block.

## Source Code
```text
Hex    Binary      Field
$00    00000000    Sector Number
$12    00010010    Track Number
$58    01011000    ID LO
$5A    01011010    ID HI

STEP 1 - Initialization
Acc = $00 = 00000000

STEP 2 - EOR with Track ($12)
00000000
EOR 00010010
=   00010010

STEP 3 - EOR with ID LO ($58)
00010010
EOR 01011000
=   01001010

STEP 4 - EOR with ID HI ($5A)
01001010
EOR 01011010
=   00010000

STEP 5 - Binary to Hex
00010000 = $10
Checksum = $10
```

## References
- "checksum_definitions_for_header_and_data_blocks" — explains which bytes to include when computing this checksum
- "gcr_packing_four_bytes_into_five_gcr_bytes_example" — shows GCR conversion for the first four bytes ($08 $10 $00 $12) of the same header block
- "dos_read_error_evaluation_table_intro" — explains how DOS uses checksums when evaluating read errors