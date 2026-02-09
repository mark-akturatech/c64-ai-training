# Commodore 64 BASIC — Appendix: Error messages (LOAD, NEXT WITHOUT FOR, NOT INPUT/OUTPUT FILE, OUT OF DATA, OUT OF MEMORY, OVERFLOW, REDIM'D ARRAY, REDO FROM START, RETURN WITHOUT GOSUB, STRING TOO LONG, ?SYNTAX ERROR, TYPE MISMATCH, UNDEF'D FUNCTION, UNDEF'D STATEMENT, VERIFY)

**Summary:** Short explanations and typical causes for common C64 BASIC error messages (LOAD, VERIFY, NEXT WITHOUT FOR, OUT OF DATA, OUT OF MEMORY, OVERFLOW, REDIM'D ARRAY, etc.), with concise checks/corrections. Includes exact numeric limits where given (e.g., numeric overflow limit, max string length, automatic DIM behavior).

## Error messages, causes and suggested checks/corrections

- LOAD  
  Cause: There is a problem with the program on tape.  
  Checks/corrections: verify the tape contents and position, ensure proper loading device and commands, retry load or re-record the program if tape data is corrupted.

- NEXT WITHOUT FOR  
  Cause: Incorrect FOR/NEXT pairing — either incorrect nesting of loops or a NEXT specifying a variable that does not match any active FOR.  
  Checks/corrections: inspect loop nesting and matching variable names; ensure each FOR has a corresponding NEXT and that any variable named in NEXT matches the FOR.

- NOT INPUT FILE  
  Cause: Attempted INPUT or GET from a file that was opened or specified for output only.  
  Checks/corrections: confirm the file was opened in the correct mode (input vs output) and that the file/device number used by INPUT/GET matches the OPEN specification.

- NOT OUTPUT FILE  
  Cause: Attempted PRINT (or other output) to a file specified for input only.  
  Checks/corrections: confirm file open mode and file/device number; reopen or re-specify the file for output if required.

- OUT OF DATA  
  Cause: A READ executed when there are no remaining unread DATA items.  
  Checks/corrections: add the missing DATA items or adjust READs, or use RESTORE to reposition the DATA pointer (if appropriate) so READs match available DATA.

- OUT OF MEMORY  
  Cause: No more RAM available for program text or variables; can also occur due to excessive nesting (too many FOR loops) or too many active GOSUBs.  
  Checks/corrections: reduce program size or variable usage, simplify or unnest loops, reduce GOSUB depth, or free memory (delete arrays/variables) and reload.

- OVERFLOW  
  Cause: A numeric computation exceeded the largest allowed number.  
  Details: Largest allowed numeric value is 1.70141884E+38.  
  Checks/corrections: scale down operands, use different algorithms to avoid huge intermediate values, or check for unintended exponential growth.

- REDIM'D ARRAY  
  Cause: An array may be DIMensioned only once. If an array variable is used before an explicit DIM, an automatic DIM of 10 elements is performed; any subsequent DIM of that array triggers this error.  
  Checks/corrections: ensure arrays are DIM'd once before use with the correct size; avoid relying on automatic DIM if you will explicitly DIM later.

- REDO FROM START  
  Cause: Character (text) data typed during an INPUT expecting numeric data.  
  Checks/corrections: retype the entry using numeric input; the program will continue automatically once correct numeric data is entered.

- RETURN WITHOUT GOSUB  
  Cause: A RETURN was executed when there was no matching GOSUB in effect.  
  Checks/corrections: verify program flow to ensure each RETURN corresponds to a prior GOSUB; remove stray RETURN or add matching GOSUBs as appropriate.

- STRING TOO LONG  
  Cause: A string exceeds allowed length.  
  Details: Maximum string length is 255 characters.  
  Checks/corrections: truncate strings to ≤255 characters or split into multiple strings.

- ?SYNTAX ERROR  
  Cause: The statement is unrecognizable to C64 BASIC (syntax/token error). Typical reasons: missing or extra parenthesis, misspelled keywords, malformed expressions.  
  Checks/corrections: inspect the statement for typographical errors, unmatched parentheses, incorrect punctuation, and misspellings of BASIC keywords; correct and re-run.

- TYPE MISMATCH  
  Cause: A value of the wrong type was used (number used where a string was expected, or vice versa).  
  Checks/corrections: verify variable usage and literals (use quotes for strings), ensure functions and operations receive correct types.

- UNDEF'D FUNCTION  
  Cause: A user-defined function (DEF FN...) was referenced but never defined.  
  Checks/corrections: add the appropriate DEF FN definition before use or correct the function name to an existing DEF FN.

- UNDEF'D STATEMENT  
  Cause: Attempted to GOTO, GOSUB, or RUN a line number that does not exist in the program.  
  Checks/corrections: LIST the program to confirm existing line numbers, correct the target line number or add the missing line.

- VERIFY  
  Cause: The program on tape or disk does not match the program currently in memory.  
  Checks/corrections: re-save or re-verify the program on the storage medium, re-load the correct version into memory, and ensure recording/transfer completed successfully.

## References
- "appendix_k_intro_and_errors_part1" — first portion of the BASIC error-message list  
- "ignored_page_footer_after_appendix_k" — trailing page footer following Appendix K content