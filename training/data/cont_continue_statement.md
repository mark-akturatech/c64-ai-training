# CONT ($A857) — Perform CONT

**Summary:** CONT (routine at $A857) restores saved pointers (current statement and current text character pointers) to resume BASIC execution; if no saved pointers are available it prints the error "CAN'T CONTINUE".

## Description
The CONT statement implementation restores previously saved execution pointers by moving those saved pointers back into the interpreter's current-statement and current-text-character pointer locations so program execution can continue from where it was saved. If the interpreter cannot retrieve valid saved pointers, the error message CAN'T CONTINUE is printed and execution does not resume.

## References
- "end_statement_behavior" — expands on END saves pointers that CONT attempts to restore