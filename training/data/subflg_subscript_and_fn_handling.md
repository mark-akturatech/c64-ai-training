# SUBFLG ($10) — Subscript Reference / FN Call Flag

**Summary:** Flag $10 (decimal 16), named SUBFLG, is set by the PTRGET routine when an opening parenthesis '(' immediately follows a variable name to indicate an array subscript reference or a user-defined function (FN) call. Relevant terms: PTRGET, tokenization flags, FN, array.

## Description
SUBFLG is a tokenization/parse-time flag used during variable lookup and creation. When PTRGET scans a variable name and finds an opening parenthesis directly after the name, it sets SUBFLG to mark that the identifier is being used either as:
- an array reference (e.g., A(1)), or
- a user-defined function call (FNname(...)).

Behavioral notes preserved from the source:
- It is legal for a user-defined function name to be identical to a floating-point variable name; the name may represent either depending on context (presence of '(').
- Redefinition of a user-defined function is permitted; redefining a function replaces the previous definition (the new definition is used).

SUBFLG is one of a group of tokenization flags used while locating/creating variables; see related flags for interactions and additional parsing details.

## References
- "array_and_tokenization_flags_dimflg_valtyp_intflg_garbfl" — expands on related flags used while locating/creating variables
- "inpflg_input_get_read_flag" — expands on the next flag group describing input-command distinctions

## Labels
- SUBFLG
