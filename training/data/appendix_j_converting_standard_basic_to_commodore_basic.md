# Converting BASIC programs to Commodore 64 BASIC

**Summary:** Guidelines for converting non-Commodore BASIC code: remove explicit string-length DIMs, use DIM A$(J), convert string concatenation to '+', rewrite substring forms A$(I) / A$(I,J) using LEFT$/MID$/RIGHT$, convert multiple assignment forms into separate statements with ':' separators, replace backslash separators with ':' and rewrite MAT functions using FOR...NEXT loops.

## String dimensions
Delete statements that explicitly declare string lengths. Convert dimensioned string arrays that specify length and count into Commodore BASIC form that only specifies the element count.

- Convert: DIM A$(I,J)  ->  DIM A$(J)

## String concatenation
Some BASIC dialects use comma or ampersand for string concatenation. Replace those operators with the Commodore-64 string-concatenation operator '+'.

## Substring (character) access
Commodore BASIC uses LEFT$, MID$, RIGHT$ for substrings. Replace single-character or substring assignment forms with LEFT$/MID$ combinations:

- A$(I)=X$  becomes  A$ = LEFT$(A$,I-1) + X$ + MID$(A$,I+1)
- A$(I,J)=X$  becomes  A$ = LEFT$(A$,I-1) + X$ + MID$(A$,J+1)

(LEFT$/MID$ positions are 1-based as in Commodore BASIC.)

## Multiple assignments
Some BASICs allow chained assignments like LET B=C=0. Convert chained assignments into separate assignments joined by ':' (statement separator).

- 10 LET B=C=0  becomes  C=0 : B=0

## Statement separators
If source BASIC uses backslash (\) to separate statements on a line, replace with the Commodore BASIC statement separator ':'.

## MAT functions
Rewrite MAT operations (matrix/array assignment/functions) as explicit FOR...NEXT loops that copy or compute elements. Replace any MAT A = B / MAT A = f(B) constructs with indexed loops over the array bounds.

## Source Code
```basic
REM String-dimension example
DIM A$(I,J)    ->    DIM A$(J)

REM Substring replacement examples
A$(I)=X$       ->    A$=LEFT$(A$,I-1)+X$+MID$(A$,I+1)
A$(I,J)=X$     ->    A$=LEFT$(A$,I-1)+X$+MID$(A$,J+1)

REM Multiple-assignment example
10 LET B=C=0   ->    C=0:B=0

REM Statement-separator example
A=1\B=2        ->    A=1:B=2

REM MAT to FOR...NEXT template (replace N with array length)
REM MAT A=B     ->    FOR I=1 TO N
REM                     A(I)=B(I)
REM                  NEXT I
```

## References
- "appendix_a_basic_abbreviations" — Use of abbreviated BASIC keywords when editing converted programs