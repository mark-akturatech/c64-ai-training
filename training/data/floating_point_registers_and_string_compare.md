# Zero Page $0066-$0072 — FAC sign, ARG, string/array pointers

**Summary:** Zero page layout for $0066-$0072: FAC sign ($0066), polynomial degree counter ($0067), temporary byte ($0068), ARG register ($0069-$006D) plus ARG sign ($006E), string-compare pointer ($006F-$0070) and array/polynomial table pointer ($0071-$0072). Searchable terms: $0066, $0069-$006D, FAC, ARG, zero page, string pointer.

## Description
This zero-page region holds small, frequently accessed fields used by BASIC and runtime routines:

- $0066 — FAC Sign: single-byte sign for the floating-point accumulator (FAC). Used alongside the FAC numeric bytes elsewhere in zero page.
- $0067 — Polynomial Deg: counter holding the polynomial degree for polynomial routines (a small integer).
- $0068 — Temp Area: one-byte general-purpose temporary storage used by string/number routines.
- $0069-$006D — ARG: five-byte second arithmetic register (ARG), used for numeric operations that require a second floating-point value. Stored as five consecutive bytes.
- $006E — ARG Sign: sign byte for ARG (single byte).
- $006F-$0070 — String Compare Pointer: two-byte pointer to the first string in a comparison (16-bit pointer — low, high).
- $0071-$0072 — Array/Polynomial Pointer: two-byte pointer used for array access or to point at polynomial tables (16-bit pointer — low, high).

These bytes are placed in zero page for fast addressing by the 6502 and by BASIC arithmetic/string primitives.

## Key Registers
- $0066 - Zero Page - FAC sign (single byte)
- $0067 - Zero Page - Polynomial degree counter (single byte)
- $0068 - Zero Page - Temporary area (single byte)
- $0069-$006D - Zero Page - ARG register (5 bytes)
- $006E - Zero Page - ARG sign (single byte)
- $006F-$0070 - Zero Page - String compare pointer (2 bytes, 16-bit pointer low/high)
- $0071-$0072 - Zero Page - Array/polynomial pointer (2 bytes, 16-bit pointer low/high)

## References
- "zero_page_string_stack_and_temps" — expands on string stack and temp areas

## Labels
- FAC
- ARG
- ARG_SIGN
