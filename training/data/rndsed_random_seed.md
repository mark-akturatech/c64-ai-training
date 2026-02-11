# RNDSED: RANDOM SEED FOR ZEROPAGE ($008B-$008F)

**Summary:** RNDSED is the KERNAL-stored initial seed for the BASIC random-number generator,held in Microsoft-style 5-byte floating-point format and copied into zero page RAM at $008B-$008F during initialization; ROM bytes shown at $E3BA correspond to the fltp value 0.811635157.

## Description
This entry documents the initial random-seed constant named RNDSED in the Commodore 64 KERNAL. The seed is a 5-byte BASIC floating-point value (Microsoft/BASIC 5-byte format) representing 0.811635157. During system initialization the KERNAL copies this 5-byte seed from ROM into zero page RAM addresses $008B-$008F so BASIC's RNG starts from a known value.

- Purpose: initialize BASIC's RND function seed.
- Format: 5-byte BASIC floating-point ("fltp") value (exponent + 4-byte mantissa).
- ROM location (disassembly): shown at $E3BA in the provided KERNAL listing.
- RAM destination: copied to $008B-$008F (inclusive) by the initialization routines.

## Source Code
```asm
.; RNDSED bytes in KERNAL ROM (disassembly)
.:E3BA 80 4F C7 52 58
```

## References
- "initat_chrget_for_zeropage" — expands on CHRGET and RNDSED being copied into zero page RAM during initialization
- "initcz_initialize_basic_ram" — routine that copies this seed into RAM

## Labels
- RNDSED
