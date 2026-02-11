# MAIN1 ($A49C) — Add or Replace a Line of Program Text

**Summary:** MAIN1 at $A49C processes a BASIC program line by retrieving the line number, tokenizing the input, searching for an existing line with the same number, deleting it if found, and inserting the new tokenized line. This routine invokes CLR, which clears all current program variables, resulting in the loss of their values.

**Description**

- **Entry:** Fetches the line number using a subsidiary routine and tokenizes the input text.
- **Search:** Calls a line-search routine to locate any existing line with the same line number.
- **Replace/Delete:** If an existing line is found, deletes it by moving all higher program text and variable storage downward to remove the old line.
- **Insert:** Inserts the newly tokenized line into the program text.
- **Side Effects:** Invokes CLR, clearing all current program variables and resulting in the loss of their values.
- **Interaction:** Delegates parsing/tokenization and line-search to separate subroutines; performs memory moves to remove or make room for the stored tokenized line.

## Labels
- MAIN1
