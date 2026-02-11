# 1540/1541 Single-Density Sector — Expanded Sector Layout

**Summary:** Expanded on-disk layout for a single 1540/1541 single-density sector: SYNC, header (0x08 ID bytes, TK, BL, header checksum), GAP 1, then data area (0x07 data mark, two auxiliary bytes, 254 data bytes, data checksum, GAP). Searchable terms: 1541, 1540, single-density, sector format, 0x08, 0x07, 254 bytes.

**Sector layout and field sequence**

This chunk documents the canonical on-disk ordering of fields for a single 1540/1541 single-density sector as shown by the expanded diagram. The sector is composed of a header block followed (after GAP 1) by the data block.

- **Header area (precedes data area):**
  - **SYNC** — A synchronization pattern consisting of 5 to 10 bytes of the value 0xFF, used to align the disk reader.
  - **0x08** — Header/ID field mark (special marker byte).
  - **ID 1, ID 2** — Two ID bytes that serve as the disk identifier, typically matching the disk's ID assigned during formatting.
  - **TK** — Track number (1–35).
  - **BL** — Block/sector number within the track.
  - **CHECKSUM** — Header checksum, calculated as the bitwise XOR of the ID1, ID2, TK, and BL fields.
  - **GAP 1** — Inter-block gap before the data field, typically 9 bytes of the value 0x55.
  - [Optional SYNC before data field in practice]

- **Data area (continued after GAP 1):**
  - **0x07** — Data field mark (special marker byte).
  - **BYTE 0, BYTE 1** — Two auxiliary bytes; BYTE 0 is often used for error detection or status, while BYTE 1's use can vary depending on the disk format.
  - **254 BYTES OF DATA** — Main payload (254 bytes).
  - **CHECKSUM** — Data checksum, calculated as the bitwise XOR of all 256 data bytes (BYTE 0, BYTE 1, and the 254 data bytes).
  - **GAP** — Trailing gap until the next sector/header, typically 9 bytes of the value 0x55.

**Notes:**

- The 0x08 and 0x07 bytes are marker bytes used on-disk to denote the header (ID) and data fields, respectively.
- The diagram reflects the single-density (GCR variant used by 1540/1541) on-disk sector structure and the sequence and components within one physical sector.
- This chunk does not expand on per-track block counts or file-format specifics (see References).

## Source Code

```text
1540/1541 Format: Expanded View of a Single Sector

 +------+----+------+------+----+----+-------+-------+------+-+
 | SYNC | 08 | ID 1 | ID 2 | TK | BL | CHECK | GAP 1 | SYNC | |
 |      |    |      |      |    |    |  SUM  |       |      | | <-+
 +------+----+------+------+----+----+-------+-------+------+-+  |
                                                                  |
 +----------------------- (CONTINUED) ----------------------------+
 |
 |  -+----+------+------+-----------+-------+-----+
 |   | 07 | BYTE | BYTE | 254 BYTES | CHECK | GAP |
 +-> |    |  0   |  1   |  OF DATA  |  SUM  |     |
    -+----+------+------+-----------+-------+-----+
```

## References

- "block_distribution_by_track" — Expands on sector size combined with per-track block counts to compute disk capacity.
- "sequential_file_format" — Expands on Data area (254 bytes) format used by sequential files.
