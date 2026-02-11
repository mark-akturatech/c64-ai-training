# Machine: Ranges for Unsigned and Signed Numbers by Byte Length

**Summary:** Table of numeric ranges for unsigned and two's-complement signed integers by byte length (1–4 bytes). Useful for sizing values, memory fields, and binary formats.

## Ranges
Choose the smallest byte width that covers the required numeric range. Signed ranges assume two's-complement representation (standard for 6502/C64 environments).

## Source Code
```text
           Unsigned:                       Signed:
-----------------------------------------------------------
1 byte     0 to 255                     -128 to +127
2 bytes    0 to 65,535               -32,768 to +32,767
3 bytes    0 to 16,777,215        -8,388,608 to +8,388,607
4 bytes    0 to over 4 billion    -2 billion to +2 billion
```

## References
- "multi_byte_numbers_intro" — expands on choosing number size based on required range