# Data Block (Sector) Layout — SYNC MARK, $07, 256 data bytes, checksum, OFF bytes, inter-sector gap

**Summary:** Describes the layout and byte-level contents of a diskette data block (sector): sync mark (>=10 one-bits), Data Block ID (normally $07), 256 data bytes (DOS uses first two as forward track/sector pointer), data checksum (EOR of all 256 bytes), two $00 OFF bytes (padding), and the inter-sector (tail) gap (typically 4–12 bytes, up to ~100 before sector 0).

## Data Block Layout
A data block (sector) on a Commodore-formatted disk contains the following fields in order:

- Sync mark
  - 10 or more consecutive 1-bits (used by the disk controller/DOS to detect the start of a block).
- Data Block ID
  - One byte identifying the block type. Normally $07 for a data block. Header blocks use $08.
- 256 Data Bytes
  - The sector payload. On Commodore DOS-formatted disks the first two bytes are treated as a forward track/sector pointer (used to chain sectors) rather than raw user data.
- Data Block Checksum
  - One byte computed by EORing (bitwise exclusive-OR) all 256 data bytes together. DOS verifies this to detect read errors.
- Two $00 OFF Bytes
  - Two padding bytes (value $00). These OFF bytes are written as padding and are not read/used by DOS.
- Inter-sector Gap (tail gap)
  - A padding gap between the end of this sector and the start of the next sector. Typical length between consecutive sectors is 4–12 bytes (varies by track zone and drive). The gap between the last sector on a track and sector 0 is commonly much longer (up to ~100 bytes) to allow for drive speed variances. DOS never reads the gap bytes.

Additional notes:
- The entire data block, including the preceding sync mark, is rewritten whenever data is recorded to that sector.
- The inter-sector gap length varies by zone (see referenced disk low-level formatting charts) and by drive; it exists to prevent overwriting the next sector if spindle speed fluctuates.

## Source Code
```text
ASCII diagram (data block layout):

[ SYNC MARK ] [ DATA BLOCK ID ] [ 256 DATA BYTES ] [ DATA BLOCK CHECKSUM ] [ $00 ] [ $00 ] [ INTER-SECTOR GAP ]

Fields (byte counts / description):
- Sync mark:   10+ one-bits (bit pattern used to signal start of block)
- Block ID:    1 byte (normally $07 for data block; $08 indicates header block)
- Data:        256 bytes (DOS uses bytes 0-1 of these as forward track/sector pointer)
- Checksum:    1 byte (EOR of all 256 data bytes)
- OFF bytes:   2 bytes (both $00, padding)
- Gap:         N bytes (inter-sector gap, typically 4–12; up to ~100 before sector 0)

Checksum formula:
CHECKSUM = data[0] EOR data[1] EOR ... EOR data[255]
```

## References
- "header_block_structure_and_fields" — expands on differences between header and data blocks
