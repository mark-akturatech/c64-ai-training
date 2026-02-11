# DATLIN ($003F-$0040) — Current DATA Line Number

**Summary:** DATLIN at $003F-$0040 stores the line number of the DATA statement currently being READ. It is not used to find the next DATA item (that is DATPTR at $0041-$0042); DATLIN is copied to CURLIN ($0039) so error messages refer to the DATA line rather than the READ line.

## Description
DATLIN holds the BASIC source line number of the DATA statement from which the BASIC interpreter is currently consuming values. This value is strictly for reporting and error purposes: the interpreter uses DATPTR ($0041-$0042) as the pointer to the next DATA item in the BASIC text (DATPTR points into the BASIC program text).

When an error involving DATA occurs, DATLIN is moved to CURLIN (at $0039 / decimal 57). Copying DATLIN to CURLIN ensures that any error message references the DATA statement's line number (where the bad DATA resides), not the line containing the READ statement.

## Key Registers
- $0039 - BASIC workspace - CURLIN: line number shown in error messages (receives DATLIN on DATA errors)
- $003F-$0040 - BASIC workspace - DATLIN: current DATA statement line number being READ
- $0041-$0042 - BASIC workspace - DATPTR: pointer to the address within the BASIC text where the current DATA item is read

## References
- "datptr_pointer_to_current_data_item_and_sample_program" — expands on DATPTR (pointer to the current DATA item address in BASIC text)

## Labels
- DATLIN
- CURLIN
- DATPTR
