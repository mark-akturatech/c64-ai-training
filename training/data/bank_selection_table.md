# VIC-II Memory Banking and CIA-2 $DD00 Bank Selection

**Summary:** CIA-2 register $DD00 bits 0-1 select the VIC-II memory bank (addresses $0000-$FFFF) and determine whether the ROM character set is visible (charset shadow) in that bank; banks 0 and 2 provide a ROM charset shadow at the ranges shown.

## Bank Selection
Bits 0-1 of CIA-2 register $DD00 (lowest two bits) select the VIC-II memory bank. Only these two bits matter for the bank selection (other bits are don't-cares in this context). The mapping is:

- $DD00 & %00000011 = 3 (binary 11) -> Bank 0 -> $0000-$3FFF — ROM charset visible at $1000-$1FFF
- $DD00 & %00000011 = 2 (binary 10) -> Bank 1 -> $4000-$7FFF — no ROM charset shadow
- $DD00 & %00000011 = 1 (binary 01) -> Bank 2 -> $8000-$BFFF — ROM charset visible at $9000-$9FFF
- $DD00 & %00000011 = 0 (binary 00) -> Bank 3 -> $C000-$FFFF — no ROM charset shadow

Use the low two bits (bit 0 = LSB) of $DD00 to select the active VIC-II bank; the pattern may be expressed as xxxxxx11, xxxxxx10, xxxxxx01, xxxxxx00 in the full byte.

## Source Code
```text
Bank Selection Table

  Bank | Bit Pattern at $DD00 | Address Range        | ROM Charset Available
  -----|----------------------|----------------------|----------------------
    0  | xxxxxx11             | $0000-$3FFF (0-16383)     | Yes, at $1000-$1FFF (4096-8191)
    1  | xxxxxx10             | $4000-$7FFF (16384-32767) | No
    2  | xxxxxx01             | $8000-$BFFF (32768-49151) | Yes, at $9000-$9FFF (36864-40959)
    3  | xxxxxx00             | $C000-$FFFF (49152-65535) | No
```

## Key Registers
- $DD00 - CIA-2 - Bank select (bits 0-1): VIC-II memory bank selection and ROM charset shadow presence

## References
- "vic_bank_overview" — VIC bank addressing summary
- "rom_charset_shadows" — effects of ROM charset in banks 0 and 2

## Labels
- DD00
