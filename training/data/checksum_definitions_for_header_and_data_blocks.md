# DOS Checksums (Header and Data Blocks)

**Summary:** Describes how Commodore DOS computes header and data block checksums using EOR (bitwise XOR) on 8-bit bytes; specifies which bytes are combined and that EOR is performed prior to GCR conversion.

## Checksum rules
- Header block checksum: the EOR of four bytes — the sector number, the track number, the ID LO, and the ID HI. These four bytes differentiate sectors on the diskette.
- Data block checksum: the EOR of all 256 8-bit data bytes in the sector. A typical data block layout is a forward track/sector pointer followed by 254 data bytes (total 256 bytes to EOR).
- Important: all bytes are EORed by DOS before their GCR conversion (EOR is performed on raw 8-bit byte values).

## Source Code
(omitted — no code or tables in the original chunk)

## Key Registers
(omitted — this chunk does not reference specific memory-mapped registers)

## References
- "checksums_intro_and_eor_truth_table" — expands on Fundamental EOR operation used to compute these checksums  
- "header_checksum_example_step_by_step" — expands on Step-by-step computation of a header checksum using these rules