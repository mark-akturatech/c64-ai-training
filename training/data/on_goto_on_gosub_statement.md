# ONGOTO ($A94B)

**Summary:** Implements ON GOTO / ON GOSUB at $A94B: evaluates the selector expression to an integer, decrements it while skipping comma-separated targets, and executes the corresponding GOTO or GOSUB target if present.

## Description
- Evaluates the ON selector expression by converting its value to an integer.
- The integer is used as a 1-based index: the implementation decrements the integer once per comma-separated target, skipping each target as it decrements, until the integer reaches 0.
- When the integer reaches 0, the current comma-separated entry is examined; if the next token is GOTO or GOSUB, that statement is executed for the selected entry (GOTO transfers control, GOSUB performs a subroutine call).
- If the list of comma-separated targets is exhausted before the integer reaches 0, the ON GOTO / ON GOSUB statement has no effect and execution continues with the next statement.

## References
- "linget_parse_line_number" — expands on line-number parsing for ON ... GOTO/GOSUB targets  
- "gosub_statement" — expands on how ON GOSUB executes a GOSUB target

## Labels
- ONGOTO
