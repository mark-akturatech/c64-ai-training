# VARNAM ($45-$46)

**Summary:** VARNAM at $0045-$0046 holds the current BASIC variable name being searched; stored in a two-byte variable-descriptor format (see variable descriptor description at location 45 ($2D)). Searchable terms: $0045, $0046, VARNAM, variable descriptor, BASIC variable name, varpnt.

## Description
VARNAM is a two-byte field that contains the current BASIC variable name being searched for by the interpreter. The format of these two bytes is the same as the two-byte format used in variable descriptors and the variable value storage area. For the explicit format and interpretation, see the variable descriptor description referenced at location 45 ($2D) (the address pointed to by that location contains the variable value storage pointer).

This field is used when the interpreter looks up or matches variable names; the pointer VARPNT (see referenced chunk) points to the corresponding variable descriptor/value storage for the name stored in VARNAM.

## Key Registers
- $0045-$0046 - Zero page (RAM) - VARNAM: current BASIC variable name being searched, stored in the same two-byte format as variable descriptors (see variable descriptor description at location 45 ($2D) for format details)

## References
- "varpnt_pointer_to_current_variable_descriptor" — expands on VARPNT pointing to the descriptor (value storage) corresponding to the name in VARNAM

## Labels
- VARNAM
