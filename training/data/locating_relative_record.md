# Locating a Relative Record by Record Number and Fixed Record Length

**Summary:** Procedure to map a relative-record number and fixed record length to disk track/sector and byte offset using 254-byte sector payloads, pointer sets, side-sector pointer tables, and directory pointer bytes. Example works through record 4 with 150-byte records to locate pointer bytes and byte offset within the data block.

**Procedure**

This describes how to find the disk location (track/sector pointer) and byte offset inside a 254-byte data block for a fixed-length relative record number.

Steps (example: record number = 4, record length = 150 bytes):

1. **Compute previous-record bytes:**
   - `previous_records = record_number - 1`
   - `previous_bytes = previous_records * record_length`

2. **Convert previous_bytes to pointer-set index:**
   - `pointer_set_index_float = previous_bytes / 254`
   - `integer_part = INT(pointer_set_index_float)`
   - `pointer_set = integer_part + 1` (pointer sets are 1-based in this layout)

3. **Find which side-sector contains that pointer set:**
   - `side_sector_index_float = pointer_set / 120`  (120 sets of pointers per side sector)
   - `side_sector_index = INT(side_sector_index_float)`

4. **Locate the pointer bytes in the side sector:**
   - `pointer_table_base_byte = 14`  (start of pointer table in a side sector)
   - `pointer_byte_offset = pointer_table_base_byte + (pointer_set * 2)`
   - The two bytes at `pointer_byte_offset` and `pointer_byte_offset+1` are the track and sector of the record's data block

5. **Compute byte offset inside the data block:**
   - `fractional = pointer_set_index_float - INT(pointer_set_index_float)`
   - `data_block_byte = 2 + (fractional * 254)`  (skip first two bytes of the block)
   - Round or take integer as required by implementation; example yields byte 198

Notes:
- The algorithm assumes 254 bytes of usable data per sector and a side-sector pointer table with 120 pointer sets per side sector.
- The two leading bytes of a data block are skipped (they are not part of the record payload in this layout).

## Source Code

```text
Example inputs:
 record_number = 4
 record_length = 150

Step 1: previous bytes
 previous_records = 4 - 1 = 3
 previous_bytes = 3 * 150 = 450   (bytes 0..449 are previous)

Step 2: pointer set index
 pointer_set_index_float = 450 / 254 = 1.7716535
 INT(1.7716535) = 1
 pointer_set = INT(...) + 1 = 2    (pointer sets numbered from 1)

Step 3: side sector containing pointer set
 pointer_set / 120 = 2 / 120 = 0.01666667
 INT(0.01666667) = 0  => side sector 0

Step 4: pointer byte location in side sector
 pointer_table_base_byte = 14
 pointer_byte_offset = 14 + (pointer_set * 2) = 14 + (2 * 2) = 18
 Bytes 18 and 19 contain: track, sector  (pointer to data block)

Step 5: byte offset in data block
 fractional = 1.7716535 - INT(1.7716535) = 0.7716535
 data_block_byte = 2 + (fractional * 254) = 2 + (0.7716535 * 254)
  = 2 + 196 ≈ 198
 => record starts at byte 198 of the data block (counting from 0)
```

## References

- "relative_record_padding_analysis" — expands on example sectors used to validate the location algorithm