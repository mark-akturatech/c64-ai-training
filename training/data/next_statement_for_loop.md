# NEXT ($AD1E) — Perform NEXT

**Summary:** Token $AD1E (NEXT) locates the matching FOR stack entry, adds the FOR entry's STEP to the FOR variable, compares the updated variable to the TO limit, and either removes the FOR stack entries if the loop is finished or restores statement/text pointers so execution continues after the FOR statement.

## Operation
NEXT behavior:
- Locate the appropriate FOR data on the FOR stack (matching the FOR variable).
- Add the STEP value (from the FOR stack entry) to the FOR variable (the variable update is treated like an assignment).
- Compare the updated FOR variable to the TO value (numeric evaluation and type checking apply).
- If the comparison indicates the loop has completed, remove that FOR command's stack entries from the FOR stack.
- If the loop has not completed, restore the saved statement pointer and text-character pointer from the FOR stack entry so execution continues with the statement following the FOR statement.

## References
- "frmnum_numeric_evaluation_and_type_check" — expands on numeric evaluation used in FOR/NEXT variable checks
- "let_statement_variable_assignment" — expands on FOR variable updates being handled like LET (assignment)
