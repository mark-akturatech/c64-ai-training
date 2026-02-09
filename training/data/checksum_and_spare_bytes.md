# ROM: Non-code Data Area and Padding at $BF52-$BF70

**Summary:** Contains a single checksum byte at $BF52 ($EC) followed by 30 spare/padding bytes $AA from $BF53-$BF70; marked "not referenced" in the disassembly and sits between jiffy_count_constants and the SQR code entry (sqr_entry_unpack_fac1).

## Description
This ROM region is non-executable data and padding:

- $BF52 — checksum byte, value $EC, annotated "not referenced".
- $BF53-$BF70 — contiguous spare bytes filled with the pattern $AA (30 bytes total). These bytes are unused by any referenced routines in the disassembly and act as padding/reserved space in the ROM image.
- Location context: the jiffy_count_constants block immediately precedes $BF52; executable code for SQR (sqr_entry_unpack_fac1) begins immediately after $BF70.

No references to these bytes are present in the annotated disassembly (labelled "not referenced"), so they appear safe for use as padding/reserved ROM space or for checksum/storage purposes.

## Source Code
```asm
                                *** not referenced
.:BF52 EC                       checksum byte

                                *** spare bytes, not referenced
.:BF53 AA AA AA AA AA
.:BF58 AA AA AA AA AA AA AA AA
.:BF60 AA AA AA AA AA AA AA AA
.:BF68 AA AA AA AA AA AA AA AA
.:BF70 AA
```

## References
- "jiffy_count_constants" — jiffy constants immediately precede this area  
- "sqr_entry_unpack_fac1" — executable code for SQR begins after this data/padding area