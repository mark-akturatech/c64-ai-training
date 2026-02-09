# ARYTAB ($2F-$30) — Pointer to Start of BASIC Array Storage Area

**Summary:** $2F-$30 (ARYTAB) holds a two-byte pointer to the start of BASIC array storage (the end of nonarray variable storage). Array storage format: 2‑byte name, 2‑byte next-array offset (low-byte first), 1‑byte dimension count, pairs of bytes for each (dimension+1), then element values (5 bytes float, 2 bytes integer, 3 bytes string descriptor). String contents live in the FREETOP string area.

## Format and layout
ARYTAB is a two‑byte pointer to the first array entry — i.e., the address immediately after all nonarray variable storage and the beginning of the array block.

Array entry layout (in order):
- 2 bytes: array name (same encoding and high-bit/type patterns as nonarray variable names; no function definitions).
- 2 bytes: offset to the start of the next array (little-endian: low byte first).
- 1 byte: number of dimensions (e.g., 2 for A(x,y)).
- For each dimension: 2 bytes (a pair) holding the value of (dimension + 1). DIM reserves index 0, so the stored bound is actual_size+1.
- Following the dimension descriptors: array elements laid out sequentially. Each element uses the same BASIC storage formats as nonarray variables:
  - Floating point element: 5 bytes
  - Integer element: 2 bytes
  - String element: 3‑byte descriptor (actual string bytes are stored elsewhere, in the string-text area pointed to by FREETOP)

Notes:
- Dimension counts are stored as 16‑bit values (pairs of bytes).
- Next-array offsets are stored low-byte first.
- The array name encoding uses the same high-bit/type flags as nonarray variables (see vartab details).

## Source Code
```text
Register:
47-48    $2F-$30    ARYTAB
Pointer to the start of the BASIC array storage area (end of nonarray variable storage).

Array entry byte layout (sequential):

+0..+1 : 2 bytes - Array name (high-bit/type patterns same as nonarray variables)
+2..+3 : 2 bytes - Offset to next array (low byte first, little-endian)
+4     : 1 byte  - Dimension count (N)
+5..   : For i = 1..N: 2 bytes each - (dimension_i + 1) as 16-bit value (low byte first)
...    : Array element data follows, element count = product_of((dimension_i + 1))
         - Floating point element size: 5 bytes each
         - Integer element size: 2 bytes each
         - String element descriptor size: 3 bytes each (string text stored in FREETOP area)
```

## Key Registers
- $2F-$30 - BASIC - pointer to start of array variable storage (ARYTAB)

## References
- "vartab_variable_storage_pointer_and_variable_format" — variable name encoding and high-bit type flags
- "strend_array_free_ram" — STREND marks end of array storage and start of free RAM
- "freetop_string_text_pointer" — FREETOP points to string-text area where string bytes are stored