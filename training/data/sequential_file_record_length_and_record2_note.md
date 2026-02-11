# Relative file — sequential portion: Record sizing example (Record #2 spans blocks)

**Summary:** Example illustrating a fixed record length of 150 bytes in the sequential portion of a relative file, where record #2 starts at byte 152 ($98) and crosses a sector boundary, necessitating two reads; the continuation is in TRACK 17 - SECTOR 14.

**Record layout example**

- **Context:** In the sequential-data portion of a relative file, the record length is constant; in this example, each record is 150 bytes long.
- **Record start:** Record number 2 begins at byte 152 (decimal) — $98 (hex).
- **Block/sector boundary:** Since the record starts partway through the current data block, it extends into the next data block and requires two reads to fetch completely.
- **Byte arithmetic (assuming 256-byte data blocks/sectors):**
  - Bytes remaining in current block = 256 - 152 = 104 bytes (decimal) = $68 (hex).
  - Remaining bytes of the 150-byte record after those 104 = 150 - 104 = 46 bytes (decimal) = $2E (hex).
- **Practical result:** The first read supplies the 104 bytes found in the current block; a second read of the next data block (TRACK 17 - SECTOR 14) supplies the remaining 46 bytes.

## Source Code

```text
; ASCII representation of the data block structure

+-------------------------------+-------------------------------+
| Current Data Block            | Next Data Block               |
+-------------------------------+-------------------------------+
| ...                           | ...                           |
| Byte 152 ($98): Start of      | Byte 0: Continuation of       |
| Record #2                     | Record #2                     |
| ...                           | ...                           |
| Byte 255: End of block        | Byte 45 ($2E): End of         |
|                               | Record #2                     |
+-------------------------------+-------------------------------+
```

## References

- "sequential_file_management_info_list" — expands on context for record layout
- "track_17_sector_14_continued_record_dump" — contains the remaining 46 bytes of record #2
