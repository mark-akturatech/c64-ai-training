# INDEX ($22-$25) and RESHO ($26-$2A)

**Summary:** Zero-page areas $0022-$0025 (INDEX) and $0026-$002A (RESHO) are temporary storage used by the Commodore 64 BASIC interpreter: INDEX holds miscellaneous temporary pointers and calculation results; RESHO is the floating-point multiplication/division work area and is reused when computing array storage size during DIM.

## Description
- INDEX ($0022-$0025) — 4 bytes of zero-page temporary storage used throughout BASIC for transient pointers and intermediate calculation results. Many BASIC ROM routines save pointers or short results here rather than allocate stack space, so its contents are volatile across BASIC operations.
- RESHO ($0026-$002A) — 5 bytes of zero-page used as the floating-point multiplication/division work area. The same workspace is also used by the routines that calculate the number of bytes required to store an array during the DIM operation (array storage-size computation). Because RESHO is reused, its contents are volatile and must not be relied on across calls to BASIC numeric routines or DIM processing.

Notes:
- Both fields are part of BASIC's zero-page scratch area and are intentionally transient; higher-level code should not assume persistence.
- Address adjacency: RESHO immediately follows INDEX in zero page ($0026 comes after $0025).

## Key Registers
- $0022-$0025 - Zero Page - INDEX: miscellaneous temporary pointers and save area used by BASIC routines
- $0026-$002A - Zero Page - RESHO: floating-point multiplication/division work area; also used to compute array storage size during DIM

## References
- "temporary_string_stack_tempst" — expands on temporary string storage and pointers used elsewhere in BASIC
- "txttab_basic_text_pointer_and_relocation" — expands on the two-byte pointer controlling BASIC program text location

## Labels
- INDEX
- RESHO
