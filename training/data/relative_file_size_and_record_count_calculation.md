# Calculating Record Count from Directory Block Total — "MAG FILE" Example

**Summary:** This document explains how to convert a directory entry's block count into the number of side sectors, data bytes, and the final record count for a Commodore 64 relative file. It utilizes disk-block arithmetic, including calculations for total blocks, side sectors, usable bytes per data block, and record length.

**Explanation**

This example demonstrates the process of converting a directory entry that encodes the file length as two bytes (low and high) into the number of logical records stored in the file.

**Steps and Formulas Used:**

1. **Total Blocks from Directory Low/High Bytes:**
   - `total_blocks = low_byte + 256 * high_byte`
   - *Example:* If `low_byte = 180` and `high_byte = 1`, then:
     - `total_blocks = 180 + 256 * 1 = 436`

2. **Side Sectors:**
   - Each side sector tracks pointers for 120 data blocks.
   - `side_sectors = ceil(total_blocks / 120)`
   - *Example:* `ceil(436 / 120) = ceil(3.6333...) = 4 side sectors`

3. **Data Blocks:**
   - `data_blocks = total_blocks - side_sectors`
   - *Example:* `436 - 4 = 432 data blocks`

4. **Usable Bytes per Data Block:**
   - Each data block is 256 bytes on disk; the first two bytes are forward track/sector pointers, so usable data = 256 - 2 = 254 bytes per data block.
   - `total_data_bytes = data_blocks * 254`
   - *Example:* `432 * 254 = 109,728 bytes`

5. **Record Count (Fixed-Length Records):**
   - `records = floor(total_data_bytes / record_length)`
   - *Example:* If `record_length = 150`, then:
     - `records = floor(109,728 / 150) = floor(731.52) = 731 records`

**Result for the "MAG FILE" Sample:** 731 records currently in the file.

## Source Code

The following is the raw directory entry byte dump for the "MAG FILE" example:

```text
78: 04 01 0B 4D 41 47 20 46 49 4C 45 A0 A0 A0 A0 A0
88: A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0
98: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
A8: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
B8: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
C8: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
D8: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
E8: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
F8: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
```

**Explanation of Key Fields:**

- **Bytes 0–1:** Track and sector of the first data block.
  - In this example: `04 01`
- **Bytes 2–17:** File name, padded with shifted spaces (`$A0`).
  - Here: `"MAG FILE"` followed by padding.
- **Bytes 19–20:** For relative files, this indicates the track and sector of the first side sector block.
  - In this case: `00 00` (not used).
- **Byte 21:** Record length.
  - Here: `00` (not specified in this entry).
- **Bytes 28–29:** Number of blocks in the file, stored as a two-byte integer in low byte, high byte order.
  - In this example: `B4 01`
  - Interpreted as: `180 + 256 * 1 = 436` blocks.

*Note:* The record length (150) is not explicitly stored in the directory entry. It is typically defined by the application or inferred from the data structure.

## References

- "side_sector_block_format" — details on each side sector holding pointers for 120 data blocks.
- "directory_entry_analysis_mag_file" — analysis of source directory values (file length, record length, side sector start).
