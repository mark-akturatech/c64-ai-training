# 1541 GCR 4-bit-to-5-bit Lookup Table

**Summary:** Commodore 1541 binary-to-GCR lookup table mapping 4-bit nybbles (hex $0–$F) to 5-bit GCR codes used for disk encoding. Searchable terms: 1541, GCR, nybble, hex $F, 4→5-bit mapping.

**Mapping**

This table is the 1541 (Commodore floppy) Group Code Recording (GCR) mapping from 4-bit nybbles (hex $0–$F) to their corresponding 5-bit on-disk codes. Each row shows: hexadecimal nybble, 4-bit binary representation, and 5-bit GCR code. The table is the standard 4→5-bit GCR used by the CBM 1541 controller.

## Source Code

```text
Hex   Binary  GCR
$0    0000    01010
$1    0001    01011
$2    0010    10010
$3    0011    10011
$4    0100    01110
$5    0101    01111
$6    0110    10110
$7    0111    10111
$8    1000    01001
$9    1001    11001
$A    1010    11010
$B    1011    11011
$C    1100    01101
$D    1101    11101
$E    1110    11110
$F    1111    10101
```

## References

- "gcr_conversion_example_single_byte_0x12" — shows how to use this lookup table to convert a byte to GCR
- "gcr_design_constraints_no_sync_confusion_and_max_zero_runs" — explains reasons behind the table's design constraints