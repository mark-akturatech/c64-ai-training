# Relative file record layout — record 2 (management) and record 3 example

**Summary:** Describes relative-file usage where record 2 stores management info (record length), blank fields are stored as '.' (0x2E), carriage return separators are $0D, record 3 begins at byte 48 and contains the first data fields; notes that a fixed record length of 150 bytes spans two sectors and that the maximum relative-record length is 254.

## Record 2 — management information
Record number 2 is reused by the database for management information and contains the fixed record length. The number of carriage returns (byte value $0D) indicates how many fields are populated versus how many were established by the main program (example: 6 fields in use, 21 established). Blank fields in this database are stored as a period (hex $2E, CHR$(46), ".").

## Record 3 — first data record
Record number 3 begins at byte 48 and contains the first actual data fields. The example shown uses textual field labels followed by values (some fields may be the literal string "(none)" for empty comments).

Fixed-record-length and sector spanning:
- The example uses a fixed record length of 150 bytes, which causes the stored record to span two sectors (hence examining the last two sectors of the sequential file chain).
- The text notes that certain fixed lengths (1, 2, 127, or 254) would not span a given sector. The maximum length of a relative record is 254 bytes.

(Note: the original text references bytes 156–159 of side sector 3 when inspecting the last two sectors of the sequential file chain.)

## Source Code
```text
Record metadata (values noted in text):
  - Carriage return: $0D
  - Blank-field marker: $2E  (CHR$(46) = ".")

Example of Record 3 contents (begins at byte 48):
Title:         Sound Synthesis
Computer:      All
Magazine:      Compute (sic)
Issue:         Jan 83
Page:          26
Comment:       (none)

Notes from text:
  - Fixed record length used in example: 150 bytes (spans two sectors)
  - Maximum relative-record length: 254 bytes
  - Reference: last two sectors reported in bytes 156-159 of side sector 3
```

## References
- "hex_dump_relative_file_example_part1" — expands on hex dump showing the fields referenced
- "hex_dump_relative_file_example_part2" — expands on further sector dumps and record overflow discussion
