# GCR conversion: four 8-bit → five 8-bit example ($08 $10 $00 $12 → $52 $56 $A5 $29 $72)

**Summary:** Shows how 1541 DOS converts four 8-bit data bytes into four 10-bit GCR words (nybble→5‑bit lookup), concatenates the 40 resulting GCR bits, and subdivides them into five 8‑bit bytes for storage; includes full bit-level worked example and final recorded bytes ($52 $56 $A5 $29 $72).

## Overview
The 1541 DOS encodes data using a 4-bit→5-bit GCR (Group Code Recording) lookup per nybble. Each 8‑bit data byte is split into a high and low nybble; each nybble maps to a 5‑bit GCR code and the pair (high-code then low-code) forms a 10‑bit GCR word for that data byte. Because RAM on the floppy controller is 8‑bit, 10‑bit GCR words cannot be stored in single bytes. Grouping four 10‑bit words produces 40 bits, which are evenly divisible into five 8‑bit storage bytes — this is why DOS converts four data bytes at a time.

This chunk explains the algorithmic steps (split, lookup, concatenate, re-slice) and provides a complete worked example for input bytes $08 $10 $00 $12, producing five recorded bytes $52 $56 $A5 $29 $72.

## Worked example (process summary)
1. Split each input byte into high nybble and low nybble.
2. Map each nybble to its 5‑bit GCR code (nybble→5‑bit lookup).
3. Form a 10‑bit GCR word per data byte by concatenating the high-nybble 5‑bit code followed by the low-nybble 5‑bit code (MSB to LSB).
4. Concatenate the four 10‑bit words into a 40‑bit stream (preserving the per-byte 10-bit order).
5. Re-slice the 40‑bit stream into five 8‑bit bytes, MSB first.
6. Convert each of those five 8‑bit bytes to hexadecimal — these are the bytes recorded on disk.

The final recorded bytes for the sample input are: $52 $56 $A5 $29 $72. See the Source Code section for the full bit-level derivation.

## Source Code
```text
STEP 1. Four 8-bit Data Bytes
$08      $10      $00      $12

STEP 2. Hexadecimal to Binary Conversion
$08         $10         $00         $12
00001000  00010000  00000000  00010010

STEP 3. Binary to GCR Conversion
1. Four 8-bit Data Bytes
00001000  00010000  00000000  00010010

2. High and Low Nybbles
0000  1000  0001  0000  0000  0000  0001  0010

3. High and Low Nybble GCR Equivalents (5-bit codes, in same order)
01010  01001  01011  01010  01010  01010  01011  10010

(Each pair corresponds to high-nybble-code then low-nybble-code for each data byte)

4. Four 10-bit GCR Bytes (high-code then low-code)
0101001001  0101101010  0101001010  0101110010

STEP 4. 10-bit GCR to 8-bit GCR Conversion
1. Concatenate Four 10-bit GCR Bytes (40 bits)
0101001001010110101001010010100101110010

2. Five 8-bit Subdivisions (MSB first)
01010010  01010110  10100101  00101001  01110010

STEP 5. Binary to Hexadecimal Conversion
01010010  01010110  10100101  00101001  01110010
$52         $56         $A5        $29  $72

STEP 6. Final recorded bytes
Input:  $08  $10  $00  $12
Recorded: $52  $56  $A5  $29  $72
```

## References
- "gcr_lookup_table_mapping_nybbles_to_5bit_codes" — expands on the nybble→5‑bit lookup table used above
- "gcr_sync_mark_and_ff_write_behavior" — contrasts normal GCR conversion with sync‑mode $FF writes
- "gcr_conversion_storage_considerations_and_recorded_byte_formula" — explains implications for on‑disk recorded byte counts
