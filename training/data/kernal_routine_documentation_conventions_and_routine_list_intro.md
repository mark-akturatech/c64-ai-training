# KERNAL Routine Documentation Conventions

**Summary:** Documentation conventions for Commodore 64 KERNAL routines: each entry lists FUNCTION NAME, CALL ADDRESS (hex), COMMUNICATION REGISTERS, PREPARATORY ROUTINES, ERROR RETURNS (carry set; A = error number), STACK REQUIREMENTS, REGISTERS AFFECTED, and DESCRIPTION.

## Conventions
- FUNCTION NAME: The routine's name (identifier used in documentation).
- CALL ADDRESS: The KERNAL entry point address given in hexadecimal.
- COMMUNICATION REGISTERS: CPU registers used to pass parameters to and from the routine (registers listed here are the routine's API).
- PREPARATORY ROUTINES: Any other KERNAL routines or setup that must be called or performed before using this routine.
- ERROR RETURNS: A return with the CARRY flag set indicates an error; the accumulator (A) contains the error number.
- STACK REQUIREMENTS: The actual number of stack bytes used by the routine.
- REGISTERS AFFECTED: All CPU registers the routine uses or modifies (explicitly listed).
- DESCRIPTION: A concise functional description of what the routine does and any important behavioral details.

## Usage note
Entries conclude with the lead-in sentence: "The list of the KERNAL routines follows."

## References
- "using_kernal_routines_and_calling_conventions" — expands on how the documented conventions map to practical use when calling routines
- "user_callable_kernal_routines_table_part1" — start of the user-callable KERNAL routine table that follows these conventions