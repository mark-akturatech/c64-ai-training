# Header and per-sector label rows for a padding hex dump

**Summary:** Per-sector labeled rows for a padding hex dump covering offsets B0/B8..F8 that summarize padding-byte classification using three marker slots (legend: XX XM FF). Contains the literal labeled rows (values like 00 or 00). Source text uses letter "O" in several places which may be OCR artifacts for the digit zero.

**Description**
This chunk is a compact legend and row map used to summarize how padding bytes are classified at ten offsets across a sector (B0/B8, C0/C8, D0/D8, E0/E8, F0/F8). The top legend line lists the three marker column headings: XX, XM, FF. Each subsequent labeled row shows the three marker values for that offset; values appear as either "00" or "00" in the source.

The listing is intended as a per-sector visual summary (one row per offset), not a linear byte-by-byte dump. It is useful as an index into a fuller "sector_padding_byte_sequence_dump," which contains the concrete linear sequence that corresponds to these labeled rows.

Note: the source contains ambiguous characters that may be OCR artifacts:
- Offsets are written as BO/CO/DO/etc. in the source but likely refer to the hex offsets B0/C0/D0/etc.
- Some marker values appear as "00" (capital letter O) and others as "00" (zero-zero); their intended equivalence is not specified in the source.

## Source Code
```text
.  B0:  XX  XM  FF 

.  B8:  00  00  00 

.  C0:  00  00  00 

.  C8:  00  00  00 

.  D0:  00  00  00 

.  D8:  00  00  00 

.  E0:  00  00  00 

.  E8:  00  00  00 

.  F0:  00  00  00 

.  F8:  00  00  00 
```

## References
- "sector_padding_byte_sequence_dump" — expands on the concrete byte-by-byte padding pattern that corresponds to these labeled rows.
