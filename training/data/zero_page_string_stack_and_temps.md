# Commodore 64 Complete Memory Map — Zero Page $0016-$0029

**Summary:** Zero-page layout for $0016-$0029 on the Commodore 64: string stack pointer ($0016), previous pointer ($0017-$0018), string stack temporary area ($0019-$0021), general-purpose temp area ($0022-$0025), and auxiliary arithmetic register for division/multiplication ($0026-$0029).

## Zero Page Layout ($0016-$0029)
This chunk documents the zero-page areas used for expression/string processing and auxiliary arithmetic:

- $0016 — String Stack Pointer: holds the current string-stack pointer.
- $0017-$0018 — Previous Pointer: previous string-stack pointer (2 bytes).
- $0019-$0021 — String Stack Temporary Area (9 bytes): temporary workspace used while processing string expressions.
- $0022-$0025 — Temp Area (4 bytes): general-purpose temporary storage for various routines.
- $0026-$0029 — Aux Arithmetic Register (4 bytes): auxiliary register used by integer division/multiplication routines.

These addresses are part of the standard C64 zero page allocation used by BASIC/ROM routines for expression evaluation and arithmetic helpers.

## Source Code
```text
Zero Page map (C64) - addresses and sizes

$0016       1 byte   String Stack Pointer
$0017-$0018 2 bytes  Previous Pointer (string stack previous pointer)
$0019-$0021 9 bytes  String Stack Temporary Area (temporary expression processing)
$0022-$0025 4 bytes  Temp Area (general-purpose temporary storage)
$0026-$0029 4 bytes  Aux Arithmetic Register (division/multiplication register)
```

## Key Registers
- $0016 - Zero Page - String stack pointer (1 byte)
- $0017-$0018 - Zero Page - Previous pointer (2 bytes)
- $0019-$0021 - Zero Page - String stack temporary area (9 bytes)
- $0022-$0025 - Zero Page - General-purpose temporary storage (4 bytes)
- $0026-$0029 - Zero Page - Auxiliary arithmetic register (4 bytes) — used for division/multiplication

## References
- "floating_point_registers" — expands on FAC and arithmetic registers in $0061-$0065 and $0069-$006D

## Labels
- STRING_STACK_POINTER
- PREVIOUS_POINTER
- STRING_STACK_TEMP
- TEMP_AREA
- AUX_ARITHMETIC_REGISTER
