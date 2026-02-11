# GCR size accounting for a single Commodore sector (header + data + gaps)

**Summary:** Shows GCR expansion and recorded byte counts for a single disk sector: header block (8→10 GCR bytes), data block (260→325 GCR bytes), sync characters ($FF ×5), and the non-GCR header gap ($55 ×8); total recorded sector bytes = 353 (excluding inter-sector tail gap).

## Description
This chunk documents how Commodore 1541-style GCR encoding expands stored sector components on disk and how the recorded byte count for one sector is computed.

- GCR conversion uses a 4→5 mapping (4 data bits → 5 disk bits). Practically this causes 4-byte groups to become 5 GCR bytes, so data sizes that are multiples of 4 expand by a factor of 5/4.
- Header block: 8 data bytes are GCR-encoded to 10 bytes (8 * 5/4 = 10).
- Data block: 260 data bytes (the sector payload plus any checksum bytes used by the format) are GCR-encoded to 325 bytes (260 * 5/4 = 325).
- Sync marks: each sync character is a run of five raw $FF bytes (these are written as five 8-bit bytes, not GCR-encoded).
- Header gap: eight bytes of $55 separate header and data; these gap bytes are not converted to GCR form and are stored directly as $55 values.
- Total per-sector recorded bytes (excluding tail/inter-sector gap) = sync (5) + header block GCR (10) + header gap (8) + sync (5) + data block GCR (325) = 353 bytes.

The header gap is intentionally left unconverted to provide a clear separator between the header block and the data block; tail gaps and inter-sector gaps are handled separately and are not included in this per-sector tally.

## Source Code
```text
Data Bytes  → GCR Bytes
--------------------------------
Sync Character ($FF)   : 5 bytes  (written as five raw $FF bytes)
Header Block           : 8 data bytes → 10 GCR bytes  (8 * 5/4 = 10)
Header Gap ($55)       : 8 bytes  (written raw $55, NOT GCR-encoded)
Sync Character ($FF)   : 5 bytes  (written as five raw $FF bytes)
Data Block             : 260 data bytes → 325 GCR bytes (260 * 5/4 = 325)

Total recorded bytes (per sector, excluding tail/inter-sector gap):
  5 (sync) + 10 (header GCR) + 8 (header gap) + 5 (sync) + 325 (data GCR)
  = 353 bytes
```

## References
- "gcr_conversion_storage_considerations_and_recorded_byte_formula" — expands on Uses the 4→5 conversion formula to compute recorded sizes
- "tail_gap_calculation_and_formatting_algorithm_with_zone_table" — explains why tail gaps are handled separately and not included in the sector byte counts
