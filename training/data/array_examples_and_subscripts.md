# Arrays: string, integer and floating-point examples; subscript rules

**Summary:** Examples of Commodore 64 BASIC array declarations and element assignments showing string arrays ($), integer arrays (%) and floating-point arrays (no suffix); subscript rules (integer constants, variables or expressions yielding integers) and the BAD SUBSCRIPT error.

## Description
- Array element types are indicated by BASIC variable suffixes: string = $, integer = %, floating-point = (no suffix).
- Subscripts (indices) must be integer values provided as integer constants, integer variables, or expressions that evaluate to integers. An invalid or out-of-range subscript produces a BAD SUBSCRIPT error.
- Multi-dimensional arrays are supported; elements are referenced with comma-separated subscripts: A(n), B(r,c), C(x,y,z).
- Subscripts may be computed expressions (for example, 12*K%), and may use integer-typed array values as indices (e.g., CNT%(G2%(X))).
- **[Note: Source may contain an error — the token `FP^K%` in one example is ambiguous; likely intended `FP(K%)` or similar.]**

## Source Code
```basic
MTH$(K%) = "JAN"          ' string array element assignment
G2%(X) = 5                ' integer array element assignment
CNT%(G2%(X)) = CNT%(1) - 2  ' integer array indexed by an integer-array value
FP(12*K%) = 24.8          ' floating-point array indexed by an expression involving an integer variable
SUM(CNT%(1)) = FP^K%     ' [Ambiguous in source; caret likely an error]
    
A(5) = 0     ' 1-dimensional array: set 5th element to 0
B(5,6) = 0   ' 2-dimensional array: row 5, column 6 set to 0
C(1,2,3) = 0 ' 3-dimensional array: positions 1,2,3 set to 0
```

## Key Registers
- (none)

## References
- "arrays_overview_and_dimensions" — expands on array dimension limits and storage calculation