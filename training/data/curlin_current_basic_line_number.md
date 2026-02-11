# CURLIN ($0039-$003A) — Current BASIC Line Number

**Summary:** CURLIN at $0039-$003A holds the current BASIC line number (LSB/MSB). MSB = $FF ($003A = $FF) denotes immediate (direct) mode; used by illegal-direct-keyword checks, RUN-line updates, BREAK/error reporting, and is copied to/from OLDLIN by STOP/END/BREAK/CONT. Vector $0308 (776) can be diverted to implement a TRACE that prints CURLIN.

## Description
CURLIN is a two-byte zero-page word (LSB at $0039, MSB at $003A) that contains the line number of the BASIC statement currently being executed, in LSB/MSB format.

- Immediate (direct) mode: if $003A contains $FF (255), the interpreted line number becomes 65280 or greater (outside normal program limits), and BASIC treats this as immediate/direct mode. Several BASIC keywords that are illegal in direct mode check $003A to determine the current mode.
- RUN mode: during RUN, CURLIN is updated each time a new BASIC line is fetched for execution, so it always reflects the line currently being processed.
- TRACE/monitoring: the token-execution vector at decimal 776 ($0308) points to the routine that executes the next token. By diverting that vector to a user routine which reads $0039-$003A and prints the line number, a TRACE facility can be implemented. (Listing the entire source line is harder because LIST and related code use many zero-page locations that must be preserved/restored.)
- BREAK and errors: the line number stored in CURLIN is used by BREAK and error routines to report where execution stopped. STOP, END, and the stop-key BREAK copy CURLIN into OLDLIN ($003B), and CONT copies OLDLIN back into CURLIN when resuming.

## Key Registers
- $0039-$003A - Zero Page - CURLIN: current BASIC line number (LSB/MSB)
- $003B - Zero Page - OLDLIN: saved previous BASIC line number (CURLIN copied here by STOP/END/BREAK; restored by CONT)

## References
- "oldlin_previous_basic_line_number" — expands on OLDLIN storing the previous BASIC line number and its copy relationship with CURLIN
- "oldtxt_pointer_to_current_basic_statement" — expands on OLDTXT holding the pointer to the text of the current statement referenced by CURLIN

## Labels
- CURLIN
- OLDLIN
