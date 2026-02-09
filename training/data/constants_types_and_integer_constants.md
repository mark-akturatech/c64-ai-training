# CBM BASIC — Integer constants (whole numbers)

**Summary:** CBM BASIC integer constants are whole numbers (no decimal point) in the range -32768..+32767, stored as two-byte binary values; do not include commas, leading zeros are ignored but discouraged, and a leading plus (+) is optional.

## Integer constants
Integer constants in CBM (Commodore) BASIC are whole numbers without decimal points. Rules and behavior:

- Range: -32768 to +32767 (inclusive).
- Format: No decimal point and no commas between digits. A leading plus sign (+) may be used; omitting it implies a positive value.
- Leading zeros: Zeros placed before a constant are ignored by the interpreter; they are allowed but waste memory and can slow the program and therefore should be avoided.
- Storage: Integers are stored as two-byte (16-bit) binary numbers in memory.
- Examples (valid integer constants): see Source Code section for literal examples.

## Source Code
```text
Examples of integer constants:
  -12
  8765
  -32768
  +44
  0
  -32767

Notes:
- Do not use commas inside numbers (e.g., use 1000, not 1,000).
- Do not include a decimal point for integers.
- Range: -32768..+32767
- Storage: 2 bytes (two-byte binary)
```

## References
- "floating_point_constants_and_storage" — expands on floating-point representation and precision in CBM BASIC.