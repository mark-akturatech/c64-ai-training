# Commodore 64 System Area $0200-$02FF (Input/IO Tables)

**Summary:** Memory map of the System Area $0200-$02FF including the input buffer/screen data ($0200-$0258), file logical-number, device-number, and secondary-address tables ($0259-$0276), keyboard buffer ($0277-$0280) and the BASIC start test vector ($0281-$0282).

## Region overview
This C64 RAM region (system area) holds runtime I/O/loader tables used by BASIC and KERNAL routines. Entries are fixed-size tables for up to 10 logical file channels and short input buffers used by the screen/input routines. The BASIC start vector at $0281-$0282 is a two-byte word storing the address BASIC should use after the built-in memory test (default $0800).

Layout and sizes:
- $0200-$0258: Input Buffer — screen/input data buffer, 89 bytes.
- $0259-$0262: Logical Numbers — logical (file) numbers table, 10 bytes (one per logical channel).
- $0263-$026C: Device Numbers — device numbers table, 10 bytes.
- $026D-$0276: Secondary Addresses — secondary address table, 10 bytes.
- $0277-$0280: Keyboard Buffer — keyboard input buffer, 10 bytes.
- $0281-$0282: BASIC Start Test — two-byte start address used after memory test (word, default $0800).

Notes:
- Tables for logical/device/secondary entries are indexed 0–9 for the standard 10 BASIC logical channels (one byte per entry).
- BASIC Start Test is a 16-bit little-endian word ($0281 = low, $0282 = high).

## Source Code
```text
System Area ($0200-$02FF)

$0200-$0258  Input Buffer       Screen data input buffer (89 bytes)
$0259-$0262  Logical Numbers    File logical numbers table (10 bytes)
$0263-$026C  Device Numbers     File device numbers table (10 bytes)
$026D-$0276  Secondary Addrs    File secondary addresses table (10 bytes)
$0277-$0280  Keyboard Buffer    Keyboard input buffer (10 bytes)
$0281-$0282  BASIC Start Test   BASIC start after memory test (default: $0800)
```

## Key Registers
- $0200-$0258 - C64 RAM - Input buffer / screen data (89 bytes)
- $0259-$0262 - C64 RAM - Logical file numbers table (10 bytes)
- $0263-$026C - C64 RAM - Device numbers table (10 bytes)
- $026D-$0276 - C64 RAM - Secondary addresses table (10 bytes)
- $0277-$0280 - C64 RAM - Keyboard buffer (10 bytes)
- $0281-$0282 - C64 RAM - BASIC start test vector (word, default $0800)

## References
- "zero_page_basic_pointers_and_arrays" — expands on link between BASIC start vector and system-area pointers used by BASIC/KERNAL routines