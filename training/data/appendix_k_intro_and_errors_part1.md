# APPENDIX K — ERROR MESSAGES

**Summary:** Commodore‑64 BASIC error-message list with concise causes for each message (BAD DATA, BAD SUBSCRIPT, BREAK, CAN'T CONTINUE, DEVICE NOT PRESENT, DIVISION BY ZERO, EXTRA IGNORED, FILE NOT FOUND, FILE NOT OPEN, FILE OPEN, FORMULA TOO COMPLEX, ILLEGAL DIRECT, ILLEGAL QUANTITY). Use for diagnosing BASIC runtime/input/file/array errors.

## Introduction
Complete list of Commodore‑64 BASIC error messages with short descriptions of typical causes.

## Error Messages
- BAD DATA  
  String data was read from an open file but numeric data was expected by the program.

- BAD SUBSCRIPT  
  An array index referenced a DIM-specified element number outside the allowed range.

- BREAK  
  Program execution was stopped by pressing the STOP key.

- CAN'T CONTINUE  
  CONT will not work because the program has not been RUN, a prior error occurred, or a line has been edited since the last RUN.

- DEVICE NOT PRESENT  
  The requested I/O device was unavailable when attempting OPEN, CLOSE, CMD, PRINT#, INPUT#, or GET#.

- DIVISION BY ZERO  
  A division operation used zero as the divisor (not allowed).

- EXTRA IGNORED  
  More data items were entered in response to an INPUT statement than the statement expects; only the first items were accepted.

- FILE NOT FOUND  
  On tape: an end‑of‑tape marker was encountered while searching; on disk: no file with the specified name exists.

- FILE NOT OPEN  
  A CLOSE, CMD, PRINT#, INPUT#, or GET# referenced a file number that has not been OPENed.

- FILE OPEN  
  An OPEN was attempted using a file number already in use (already open).

- FORMULA TOO COMPLEX  
  A string expression being evaluated is too complex for the parser — split the expression into parts or reduce nested parentheses.

- ILLEGAL DIRECT  
  INPUT may only be used within a program (not in direct mode).

- ILLEGAL QUANTITY  
  A numeric argument supplied to a function or statement is outside the allowable range.

## References
- "basic_syntax_differences_and_examples" — expands on BASIC syntax differences and examples  
- "ignored_page_header" — expands on page/header break within Appendix K  
- "appendix_k_errors_part2" — continuation of the error-message list (LOAD through VERIFY)