# C64 RAM Map: $0300-$0301 IERROR (BASIC error vector)

**Summary:** $0300-$0301 (IERROR) is a 16-bit BASIC indirect vector holding the address of the Print BASIC Error Message routine; in standard C64 ROMs it points to $E38B (decimal 58251). The vector is stored little-endian (low byte at $0300, high byte at $0301).

## Description
IERROR is the BASIC indirect vector located at addresses $0300-$0301 in RAM. It contains the 16-bit entry point used by BASIC to invoke the routine that prints BASIC error messages. On an unmodified C64 this vector contains the address $E38B (decimal 58251), which is the ERROR routine in the BASIC/KERNAL ROM.

Storage format:
- $0300 = low byte of the target address
- $0301 = high byte of the target address

This vector is part of the BASIC indirect vector table (search "basic_indirect_vector_table" for the complete table and context).

## Key Registers
- $0300-$0301 - BASIC - IERROR vector to Print BASIC Error Message Routine (points to $E38B / 58251)

## References
- "basic_indirect_vector_table" — BASIC indirect vectors overview

## Labels
- IERROR
