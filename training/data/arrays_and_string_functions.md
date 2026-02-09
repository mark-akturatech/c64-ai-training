# COMMODORE 64 — Arrays and Strings (DIM, LEN, STR$, VAL, CHR$, ASC, LEFT$, RIGHT$, MID$)

**Summary:** DIM array sizing and string/number helper functions for C64 BASIC: DIM A(X,Y,Z) reserves (X+1)*(Y+1)*(Z+1) elements starting at A(0,...); LEN, STR$, VAL, CHR$, ASC, LEFT$, RIGHT$, MID$ operate on string length, conversion, ASCII codes/chars, and substring extraction.

## Array dimensions
DIM A(X,Y,Z)
- Sets the maximum subscripts for array A.
- Reserves space for (X+1)*(Y+1)*(Z+1) elements, starting at A(0,0,0) (zero-based array origin).

## String and conversion functions
- LEN(X$)  
  Returns the number of characters in X$.

- STR$(X)  
  Returns the numeric value X converted to a string.

- VAL(X$)  
  Returns the numeric value represented by X$, parsing from the left up to the first non-numeric character.

- CHR$(X)  
  Returns the ASCII character whose code is X.

- ASC(X$)  
  Returns the ASCII code of the first character of X$.

- LEFT$(A$,X)  
  Returns the leftmost X characters of A$.

- RIGHT$(A$,X)  
  Returns the rightmost X characters of A$.

- MID$(A$,X,Y)  
  Returns Y characters of A$ starting at character X (1-based index).

## References
- "array_variables" — expands on array DIM and sizing rules  
- "input_output_commands" — expands on functions often used with PRINT/INPUT and I/O operations