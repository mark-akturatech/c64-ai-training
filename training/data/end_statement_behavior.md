# END ($A831) — Perform END

**Summary:** $A831 END — preserves current line number and text pointers for a possible CONT, prints the READY prompt, and prints a BREAK message first if the STOP key caused a break. Keywords: $A831, END, CONT, STOP key, BREAK, READY prompt, BASIC pointers.

## Description
Performs the BASIC END operation at ROM address $A831. Behavior:
- Preserves the current BASIC line number and text pointers so a subsequent CONT can resume execution from the same point.
- Prints the READY prompt.
- If execution was interrupted by the STOP key, the BREAK message is printed before the READY prompt.

Interaction notes (cross-references):
- CONT restores the pointers saved by END to continue execution (see cont_continue_statement).
- The STOP-key break condition causes END to emit a BREAK message (see stop_key_break_test).

## References
- "cont_continue_statement" — CONT restores pointers saved by END
- "stop_key_break_test" — END prints the BREAK message when STOP caused break

## Labels
- END
