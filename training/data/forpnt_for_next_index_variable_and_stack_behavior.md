# FORPNT ($0049-$004A) - Temporary pointer to FOR index variable

**Summary:** $0049-$004A (zero page) hold a two-byte pointer to the BASIC variable used as the FOR/NEXT loop index; the address is stored here then pushed onto the FOR stack at $0100, freeing $0049-$004A for use as scratch by statements such as INPUT, GET, READ, LIST, WAIT, CLOSE, LOAD, SAVE, RETURN, and GOSUB.

## Description
FORPNT is a two-byte zero-page temporary pointer that initially receives the address of the BASIC variable which is the subject of a FOR/NEXT loop (stored as the variable descriptor/address). That two-byte pointer (low byte at $0049, high byte at $004A) is subsequently pushed onto the FOR stack (stack area starting at $0100). Once pushed, $0049-$004A are available as general-purpose scratch locations and are used by many BASIC statements and routines, for example: INPUT, GET, READ, LIST, WAIT, CLOSE, LOAD, SAVE, RETURN, and GOSUB.

For the precise FOR stack entry format and how the pointer is stored on the stack, see the FOR stack description at location $0100.

## Key Registers
- $0049-$004A - Zero Page - Temporary pointer to the BASIC FOR/NEXT index variable (address first stored here, then pushed onto FOR stack at $0100)

## References
- "varpnt_pointer_to_current_variable_descriptor" — covers VARPNT and FORPNT relation to variable descriptors/addresses  
- "opptr_math_operator_table_displacement" — covers OPPTR (another zero-page temporary pointer used during expression evaluation)

## Labels
- FORPNT
