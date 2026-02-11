# DSCPNT ($50-$52)

**Summary:** DSCPNT at $50-$52 (decimal 80-82) is a zero-page BASIC interpreter temporary pointer used by string assignment and handling routines; the first two bytes form a temporary pointer to the current string descriptor and the third byte holds the string length.

## Description
DSCPNT is a three-byte zero-page area used internally by the BASIC string handling and assignment code. The two first bytes (at $50 and $51) are used together as a temporary pointer to the current string descriptor; the third byte ($52) stores the length of that string while routines operate on it. This location is transient—its contents are overwritten during string evaluation/assignment.

## Key Registers
- $50-$52 - Zero Page - DSCPNT: Temporary pointer to the current string descriptor (bytes 1-2 = pointer, byte 3 = string length)

## References
- "defpnt_function_descriptor_pointer" — expands on both DEFPNT and DSCPNT as temporary pointers used during evaluation/assignment of functions vs. strings
- "varpnt_pointer_to_current_variable_descriptor" — explains that string descriptors and variable descriptors are managed with temporary page-zero pointers such as VARPNT and DSCPNT

## Labels
- DSCPNT
