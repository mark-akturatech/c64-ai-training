# GONE ($A7E4) — Read and Execute the Next Statement

**Summary:** Routine at $A7E4 that fetches the next statement token and vectors execution through a RAM vector at $0308; interacts with CHRGET, consults the statement-token table at $A00C, triggers implied LET for ASCII < $80, and signals SYNTAX ERROR on invalid tokens.

## Operation
- Purpose: Dispatch and execute the next statement token. This routine is vectored through RAM at $0308 so additional/alternate statement token handlers can be installed in RAM.
- Entry behavior: Expects the text pointer (current statement position) to be set up (see "newstt_set_up_next_statement" for pointer preparation).
- Token detection:
  - The routine checks the first character (token) at the current text pointer.
  - If the byte is a valid statement token (usually a token value ≥ $80), it pushes the address of the statement handler onto the stack so that a subsequent call to CHRGET will return into that handler (CHRGET: token/character-get routine).
  - The statement-token dispatch table is located at $A00C (see the table of statement tokens).
- Invalid token handling: If the first character is not a recognized token, the routine signals a SYNTAX ERROR.
- Implied LET handling: If the first character's ASCII value is less than 128 (ASCII < $80), the routine treats the statement as an implied LET (variable assignment) and transfers control to the LET handler (see "let_statement_variable_assignment" for implied-LET semantics).
- Rationale: Vectoring via $0308 permits extension or replacement of statement handlers without changing ROM code addresses.

## References
- "newstt_set_up_next_statement" — preparation of text pointer for statement execution
- "let_statement_variable_assignment" — implied LET execution and variable assignment behavior

## Labels
- GONE
