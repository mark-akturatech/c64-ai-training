# ACPTR — Get data from the serial bus ($FFA5)

**Summary:** KERNAL routine ACPTR at $FFA5 (65445) reads one byte from the IEC serial bus into the accumulator (A). Preparatory routines: TALK, TKSA; error handling via READST; affects registers A and X.

## Description
- Function name: ACPTR
- Purpose: Get data from the serial bus (IEC)
- Call address: $FFA5 (hex) / 65445 (decimal) — call via JSR $FFA5
- Communication register: A (data returned in the accumulator)
- Preparatory routines: TALK, TKSA (must be used before calling ACPTR)
- Error returns: See READST (use READST to obtain error/status information)
- Stack requirements: 13
- Registers affected: A, X

## Key Registers
- $FFA5 - KERNAL - ACPTR entry point (Get data from serial bus)

## References
- "user_callable_kernal_routines_table_part1" — expands on ACPTR as the first routine listed in the user-callable KERNAL routines table  
- "kernal_routine_documentation_conventions_and_routine_list_intro" — explains the convention fields used in this entry (FUNCTION NAME, CALL ADDRESS, etc.)  
- "user_callable_kernal_routines_table_part2" — other user-callable KERNAL routines for serial, I/O and timing

## Labels
- ACPTR
