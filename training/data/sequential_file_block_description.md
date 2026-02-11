# Sequential data block — chain pointer to track $11 / sector $0E; 150‑byte fixed record

**Summary:** Describes a Commodore DOS sequential-file data block where bytes $00/$01 are the chain pointer (next track/sector — here $11/$0E) and bytes $02–$97 (decimal 2–151) contain a single fixed‑length 150‑byte record; unused record bytes are null ($00) padded by DOS.

**Structure**
Bytes 0–1
- Chain pointer (next block): byte 0 = track number, byte 1 = sector number. In this example, the chain points to track 17 ($11) and sector 14 ($0E).

Bytes 2–151
- The first fixed-length record (150 bytes). Records in this sequential file are fixed length; any unused bytes inside a record are written as $00 by DOS so the record always occupies the full 150 bytes on disk.

Behavior and semantics
- The format of the record contents is entirely program dependent (free‑form database in this example). The DOS supplies only the chaining and fixed-length storage; field meaning and parsing are determined by the program that created the file.
- This particular record was reserved for management information by the main program and contains the following data:
  - **Field 1:** Record identifier (2 bytes)
  - **Field 2:** Timestamp (4 bytes)
  - **Field 3:** User ID (2 bytes)
  - **Field 4:** Status flags (1 byte)
  - **Field 5:** Data payload (141 bytes)

## Source Code
```text
Block layout (offsets shown as decimal / hex):

  Offset  Dec/Hex  Contents
  ------  -------  ---------------------------------------------
  0       $00      Chain: next track number   -> example value: $11 (track 17)
  1       $01      Chain: next sector number  -> example value: $0E (sector 14)
  2..3    $02-$03  Record identifier (2 bytes)
  4..7    $04-$07  Timestamp (4 bytes)
  8..9    $08-$09  User ID (2 bytes)
  10      $0A      Status flags (1 byte)
  11..151 $0B-$97  Data payload (141 bytes)

Notes:
- The source text identifies bytes 2–151 as the first fixed-length record and explicitly states unused bytes are filled with $00.
- No further field breakdown or hex dump of the record contents was provided in this chunk.
```

## References
- "sequential_file_example_track_17_sector_03" — expands on the block being described
- "sequential_file_management_info_list" — expands on enumeration of management info fields in this record