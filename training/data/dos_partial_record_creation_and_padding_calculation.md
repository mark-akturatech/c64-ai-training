# DOS pre-creates partial record — $FF at byte 178 ($B2) instead of $00

**Summary:** Explains why a $FF appears at byte 178 ($B2) in a sector dump (start-of-record marker) instead of $00: DOS pre-creates a partial record to simplify later expansion and computes null padding using 255 - byte_count and Total_Record_Length - Bytes_in_Existence.

## Explanation
A sector dump that otherwise shows trailing nulls ($00) contains an $FF at byte 178 (decimal) / $B2 (hex). That $FF is the start-of-record marker for a newly created (partial) record: the DOS has already allocated the record header/marker before filling the remainder with null padding so future expansion is simpler.

The DOS computes how many bytes of the record are already present by subtracting the current byte count from 255:
255 - byte_count = bytes already in existence

In the example:
255 - 177 = 78 bytes already in existence

The amount of null padding that must be written to complete the record is then:
Nulls_to_add = Total_Record_Length - Bytes_in_Existence

Using the example Total_Record_Length = 150:
150 - 78 = 72 nulls to add

Practical effect: instead of leaving the sector entirely zeroed until a record expansion occurs, DOS writes the $FF marker and a partial record layout immediately and pads the remainder with the calculated number of $00 bytes so the record can be expanded later without reallocating or rewriting the initial marker.

## Source Code
```text
Example: observed bytes near offset 178 ($B2)
... (offsets omitted) ...
$B0: 00 00 00 00    ; bytes before the marker
$B2: FF            ; start-of-record marker observed instead of 00
$B3: 00 00 00 ...  ; null padding follows

Math shown in source:
255 - 177 = 78    ; bytes already in existence
Total_Record_Length - Bytes_in_Existence = Nulls_to_Go
150 - 78 = 72     ; 72 nulls to pad the partial record
```

## References
- "relative_record_overflow_and_empty_record_description" — expands on record boundaries and byte counts used in the calculation
- "sector_padding_hex_dump_example" — actual sector data illustrating the $FF marker and subsequent padding
