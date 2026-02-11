# DIM (BASIC)

**Summary:** DIM declares arrays/matrices and sizes in Commodore 64 BASIC; lowest index is 0, highest is the value in DIM (max $32767). Covers syntax, automatic (implicit) DIM to 11 elements, re-DIM error (REDIM'D ARRAY), type suffixes ($/%), multi-dimensional limits, and memory usage calculation.

## Syntax and behavior
DIM <variable>(<subscripts>) [ , <variable>(<subscripts>) ... ]

- Defines an array (one or more dimensions). Subscripts index elements; the lowest index is 0 and the highest index is the number given in the DIM statement (maximum 32767).
- The DIM statement must be executed once and only once for each array at runtime; re-executing a DIM for the same array causes a REDIM'D ARRAY error.
- There may be any number of dimensions and 255 subscripts in an array, limited only by available RAM.
- Use type suffixes to declare element types:
  - No suffix: normal numeric (floating-point)
  - % after name: integer elements
  - $ after name: string elements
- If an array is referenced without a prior DIM, BASIC implicitly dimensions it to 11 elements in each dimension used in that first reference (automatic dimensioning).
  - Example: assigning F(4)=9 will implicitly DIM F(10) (elements 0..10).

## Memory usage rules
When DIM sets up an array, memory required is calculated as:
- 5 bytes for the array name (overhead)
- 2 bytes for each dimension descriptor
- Per-element storage:
  - 2 bytes per element for integer (%) arrays
  - 5 bytes per element for normal numeric (floating-point) arrays
  - 3 bytes per element for string ($) array element descriptors, plus 1 byte for each character stored in each string element

## Examples and notes
- Max element index: 32767
- Implicit DIM size: 11 elements per referenced dimension when first used without explicit DIM
- REDIM'D ARRAY error if a DIM for the same array is executed again

## Source Code
```basic
10 DIM A(100)
20 DIM Z(5,7), Y(3,4,5)
30 DIM Y7%(Q)
40 DIM PH$(1000)
50 F(4)=9 : REM AUTOMATICALLY PERFORMS DIM F(10)
```

```basic
10 DIM S(1,5), T$(1)
20 INPUT "TEAM NAMES"; T$(0), T$(1)
30 FOR Q=1 TO 5: FOR T=0 TO 1
40 PRINT T$(T), "SCORE IN QUARTER" Q
50 INPUT S(T,Q): S(T,0)= S(T,0) + S(T,Q)
60 NEXT T,Q
70 PRINT CHR$(147) "SCOREBOARD"
80 PRINT "QUARTER"
90 FOR Q=1 TO 5
100 PRINT TAB(Q*2+9) Q;
110 NEXT: PRINT TAB(15) "TOTAL"
120 FOR T=0 TO 1: PRINT T$(T);
130 FOR Q=1 TO 5
140 PRINT TAB(Q*2+9) S(T,Q);
150 NEXT: PRINT TAB(15) S(T,0)
160 NEXT
```

```text
CALCULATING MEMORY USED BY DIM:
- 5 bytes for the array name
- 2 bytes for each dimension
- 2 bytes/element for integer variables
- 5 bytes/element for normal numeric variables
- 3 bytes/element for string variables
- 1 byte for each character in each string element
```

## References
- "arrays_overview_and_dimensions" — expands on array structure and implicit DIM behavior