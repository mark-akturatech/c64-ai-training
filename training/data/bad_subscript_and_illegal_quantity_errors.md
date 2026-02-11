# BSERR ($B245) and FCERR ($B248) — error-printing routines

**Summary:** Two small 6502 routines at $B245 and $B248 that print fixed error messages: BSERR prints "BAD SUBSCRIPT" and FCERR prints "ILLEGAL QUANTITY". These labels are often invoked by ISARY (array subscript validation) and AYINT (integer conversion range checks).

## Description
- $B245 (label BSERR): Entry point that prints the error message "BAD SUBSCRIPT".
- $B248 (label FCERR): Entry point that prints the error message "ILLEGAL QUANTITY".
- Both routines are small, dedicated printing/error-reporting helpers used by higher-level system code. They are commonly called when a runtime validation fails (for example, array-subscript checks or numeric-range checks).
- Known call sites:
  - ISARY (array_lookup_and_creation_isary) may call BSERR when subscript validation fails.
  - AYINT (ayint_fp_to_signed_integer) may call FCERR when a conversion produces a value outside the legal range.

## References
- "array_lookup_and_creation_isary" — expands on ISARY; may call BSERR when subscript validation fails  
- "ayint_fp_to_signed_integer" — expands on AYINT; may call FCERR when conversion is out of legal range
