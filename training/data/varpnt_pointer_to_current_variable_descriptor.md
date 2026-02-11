# VARPNT ($47-$48) — Pointer to the Current BASIC Variable Descriptor

**Summary:** VARPNT at $47-$48 (decimal offsets 71–72) is a BASIC-interpreter pointer to the descriptor of the current BASIC variable; it points to the byte immediately after the two-character variable name and does not reference FN-dependent variables during FN calls.

## Description
VARPNT holds a two-byte pointer to the address of the descriptor for the "current" BASIC variable. The pointer targets the byte immediately following the two-character variable name in the variable descriptor (see location 45 / $2D for descriptor format). 

Behavioral note: During an FN call, VARPNT does not point to the dependent variable (the A in FN A). This prevents a real variable that shares the same name from being modified inadvertently by the FN evaluation.

Additional identifying info from the original map:
- Decimal offsets: 71–72
- Hex addresses: $47–$48
- Label: VARPNT

## Key Registers
- $0047-$0048 - BASIC interpreter (zero page) - Pointer to current BASIC variable descriptor (points to the byte immediately after the two-character variable name)

## References
- "location_45_$2D" — variable descriptor format (format of a BASIC variable descriptor)
- "varnam_current_basic_variable_name" — expansion on VARNAM two-byte variable-name format used at VARPNT's descriptor
- "forpnt_for_next_index_variable_and_stack_behavior" — FOR/NEXT loop pointer areas and interaction with variable storage and stack

## Labels
- VARPNT
