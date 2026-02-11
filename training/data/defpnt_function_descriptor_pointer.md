# DEFPNT ($4E-$4F) — Pointer to Current FN Descriptor

**Summary:** DEFPNT at $004E-$004F is a 16-bit pointer (little-endian) used by the BASIC interpreter to reference the current user-defined function (FN) descriptor; it is updated during DEF FN and used during FN execution to select where the evaluation result is stored.

## Description
DEFPNT is a 2-byte pointer in the BASIC interpreter workspace:
- During a DEF FN statement this pointer is set to the newly created FN descriptor so the interpreter can initialize its fields.
- During execution of an FN expression the pointer is set to the FN descriptor whose evaluation result should be written (the descriptor contains storage/metadata for that function).

Implementation notes:
- Stored as a 16-bit little-endian address: low byte at $004E, high byte at $004F.
- Interacts with BASIC descriptor areas (function descriptors and variable descriptors) during FN definition and evaluation.

## Key Registers
- $004E-$004F - BASIC - Pointer to current FN descriptor (16-bit little-endian: low=$004E, high=$004F)

## References
- "varpnt_pointer_to_current_variable_descriptor" — expands on interaction between function descriptors and variable descriptors during FN evaluation

## Labels
- DEFPNT
