# Z-80 → 6510 Address Translation (Commodore 64 Z-80 Cartridge)

**Summary:** Mapping table and rule for translating Z-80 addresses on the C64 Z-80 cartridge into the 6510 (Commodore 64) address space by adding $1000 (4096 decimal) with 16-bit wrap-around; includes full decimal and hex ranges and the note that the Z-80 environment provides 48K of RAM on the cartridge.

**Address translation rule**
The Z-80 cartridge performs a fixed translation: add $1000 (4096 decimal) to a Z-80 16-bit address to obtain the corresponding 6510 (C64) address, using 16-bit wrap-around (mod $10000).

- Formula: 6510_addr = (Z80_addr + $1000) & $FFFF
- Example: Z-80 $0000 → 6510 $1000; Z-80 $F000 → 6510 $0000 (wrap-around).
- Note from source: The Z-80 environment on the cartridge exposes 48K bytes of RAM to the Z-80 processor (the mapping table below shows the address translation performed by the cartridge across the 16-bit address space).

**[Note: Source contained an OCR typo "SFFF" which has been corrected to "8FFF".]**

## Source Code
```text
Z-80 ADDRESSES           6510 ADDRESSES
DECIMAL       HEX        DECIMAL       HEX
0000-4095     0000-0FFF  4096-8191     1000-1FFF
4096-8191     1000-1FFF  8192-12287    2000-2FFF
8192-12287    2000-2FFF  12288-16383   3000-3FFF
12288-16383   3000-3FFF  16384-20479   4000-4FFF
16384-20479   4000-4FFF  20480-24575   5000-5FFF
20480-24575   5000-5FFF  24576-28671   6000-6FFF
24576-28671   6000-6FFF  28672-32767   7000-7FFF
28672-32767   7000-7FFF  32768-36863   8000-8FFF
32768-36863   8000-8FFF  36864-40959   9000-9FFF
36864-40959   9000-9FFF  40960-45055   A000-AFFF
45056-49151   B000-BFFF  49152-53247   C000-CFFF
49152-53247   C000-CFFF  53248-57343   D000-DFFF
53248-57343   D000-DFFF  57344-61439   E000-EFFF
57344-61439   E000-EFFF  61440-65535   F000-FFFF
61440-65535   F000-FFFF  0000-4095     0000-0FFF
```

## References
- "running_commodore_cpm_steps" — expands on how to start CP/M using this mapping
- "z80_enable_basic_program" — explains storing Z-80 code at $1000 (Z-80 $0000) and its relation to the address translation table
