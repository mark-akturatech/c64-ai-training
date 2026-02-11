# Table 7-3 — Row 1 Address Block ($0140–$017F) Continuation

**Summary:** Continuation of Table 7-3, detailing the Row 1 per-byte to screen-address mapping for addresses in the $0140–$017F range and the corresponding high-range addresses (examples $0278–$027F). This section provides a cleaned, searchable address list extracted from the source, the original OCR snippet, and notes about corrupted/missing entries.

**Row 1 Mapping (Cleaned Extract and Notes)**

This section aims to reconstruct the Row 1 block listing byte addresses starting at $0140 and their corresponding high-range examples in $0278–$027F. Due to OCR corruption, the entries below are a cleaned interpretation based on the available data. This may not represent the complete $0140–$017F block; only the entries present in the supplied text are included.

Observed primary addresses (from the source):

- $0140
- $0141
- $0142
- $0143
- $0144
- $0145
- $0146
- $0147
- $0148
- $0149
- $014A
- $014D
- $014F
- $0150
- $0151
- $0152
- $0153
- $0154
- $0155
- $0156
- $0157

Observed high-range examples (from the source):

- $0278
- $0279
- $027A
- $027B
- $027C
- $027D
- $027E
- $027F

Observed OCR artifacts / ambiguous tokens reported inline:

- "5158" — likely OCR corruption (unknown intended value)
- "SUB", "SHE" — garbled text within the table (not valid addresses)
- "S14F" — probable OCR of $014F or $14F
- ". - -" — filler or corrupted table separators

Notes on pattern (only what can be directly observed):

- The cleaned extract shows a set of low-range addresses in the $0140–$0157 span and a matching set of high-range examples in $0278–$027F.
- The source implies an 8-entry high-range mirror ($0278–$027F) corresponding to sub-columns of the Row 1 block; however, the exact per-address pairing in the source text is ambiguous due to OCR errors.

## Source Code

```text
-- Original OCR snippet (verbatim) --

ROW 1 $140 

$148 

$150 ! 

5158 . - - $278 

$141 

$149 

$151 

$279 

$142 

$14A 

$152 

$27A 

$143 

SUB 

$153 

$27B 

$144 

$140 

$154 

$27C 

$145 

$14D 

$155 

$27D 

$146 

SHE 

$156 

$27E 

$147 

S14F 

$157 

$27F 

-- CLEANED INTERPRETATION (addresses recovered from OCR) --

Primary addresses observed in source:
$0140, $0141, $0142, $0143, $0144, $0145, $0146, $0147,
$0148, $0149, $014A, $014D, $014F, $0150, $0151, $0152,
$0153, $0154, $0155, $0156, $0157

High-range addresses observed in source:
$0278, $0279, $027A, $027B, $027C, $027D, $027E, $027F

-- End of snippet --
```

## References

- "graphics_memory_table_introduction" — expands on table purpose and heading
- "graphics_memory_row0_to_row7_byte_mapping" — preceding address block for ROW0 and the first set of sub-rows