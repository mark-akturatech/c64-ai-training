# GCR 4→5 Packing and Recorded Byte Counts (1541 DOS)

**Summary:** Explains Commodore 1541 DOS GCR encoding where every four 8-bit data bytes are written as five 8-bit GCR bytes (4→5 packing), and gives the formula to calculate on-disk GCR byte counts for sectors and blocks.

## GCR 4→5 packing and recorded byte counts
The 1541 DOS always expands groups of four 8-bit data bytes into five 8-bit GCR bytes when writing to disk; on read the DOS converts each five GCR bytes back into the original four 8-bit data bytes (the decode steps are the reverse of the write steps). This GCR expansion increases the number of bytes physically recorded on the disk.

Formula (as stated in the source):
Number of 8-bit GCR Bytes Recorded = (Number of 8-bit Data Bytes / 4) * 5

Notes and implications:
- The expansion factor is 5/4 = 1.25, so any block recorded on disk will occupy 25% more bytes in GCR form than its raw data byte count.
- Example from source: a header block of eight 8-bit bytes (excluding header gap) is recorded on disk as ten 8-bit GCR bytes (8 * 5/4 = 10).
- The appendix (referenced in the source) contains mathematical conversion routines for converting between data bytes and GCR bytes; use the above formula for quick calculations.

## References
- "gcr_packing_four_bytes_into_five_gcr_bytes_example" — practical example demonstrating the 4→5 byte packing that leads to the formula
- "sector_byte_expansion_examples_and_block_byte_counts" — applies the formula to header/data blocks to compute actual on-disk sizes