# BAM final $11 rows and blocks-free discrepancy

**Summary:** Final rows from a Commodore BAM (Block Availability Map) showing repeated hex $11 entries and a summed total of 574 blocks free; explains the 574 vs directory-reported 558 discrepancy caused by DOS reserving track 18 (16 sectors reserved). Searchable terms: BAM, $11, blocks free, track 18, DOS reserve.

## Final BAM rows and explanation
The listing shows the final BAM table rows containing repeated "$11" entries followed by numeric values, a summed "+ 17" line and the total "574  BLOCKS  FREE". The accompanying note explains the difference between the raw calculated free-block total (574) and the number reported by the directory (558): DOS reserves track 18 for its own use, so 16 sectors on that track remain physically free but are not reported as available to the user (574 − 16 = 558).

## Source Code
```text
$11  17  128  32
$11  17  132  33
$11  17  136  34
$11  17  140  35
$11
+  17
574  BLOCKS  FREE

Wait a minute! We calculated 574 blocks free but the directory shows 558. How do we
explain this discrepancy? Easy. Remember that the DOS reserves track 18 for its own
use. Therefore the blocks free on that particular track are not returned to us (574 -
16 = 558). Sixteen sectors on track 18 are still free, but available only to the DOS.
```

## Key Registers
(omitted — this chunk documents BAM table rows and a DOS reservation note, not hardware registers)

## References
- "bam_entries_12_zone_and_garbled_rows" — expands on the BAM rows that precede these final $11 rows
- "bam_table_zone_1f_entries" — expands on the BAM table entries beginning with $1F earlier in the listing