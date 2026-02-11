# LET ($A9A5)

**Summary:** $A9A5 — LET routine in BASIC ROM: performs creation and assignment for all variable types (strings, floating point, integers, ST, TI, TI$), handling array and scalar variables; composed of subroutines to evaluate LHS, evaluate RHS (expression), type-check suitability, and assign or create variables.

**Description**
LET is the BASIC interpreter routine responsible for implementing the LET command (assignment). It covers both creating new variables and assigning new values to existing variables for every supported variable type:

- Supported types: strings, floating point, integers, ST, TI, TI$.
- Supports both scalar and array variables.

LET's implementation is modular: it calls subroutines to
- evaluate the variable LHS (determine target variable, array indices if any),
- evaluate the RHS expression (expression evaluation; see referenced frmeval routine),
- perform type checking to ensure the RHS value is suitable for the variable's declared/expected type,
- perform the actual assignment or create the variable if it does not exist.

The routine enforces type suitability (numeric vs string and specific internal types) before assignment and handles the creation/initialization path for new variables as well as updating existing variable storage.

## Source Code
```assembly
; LET routine at $A9A5
A9A5   20 79 00   JSR $0079      ; CHRGOT: Get next character
A9A8   20 8B B0   JSR $B08B      ; PTRGET: Get variable pointer
A9AB   20 79 00   JSR $0079      ; CHRGOT: Get next character
A9AE   C9 3D      CMP #$3D       ; Compare with '='
A9B0   F0 04      BEQ $A9B6      ; If '=', continue
A9B2   4C 08 AF   JMP $AF08      ; SNERR: Syntax error
A9B5   60         RTS            ; Return

A9B6   20 79 00   JSR $0079      ; CHRGOT: Get next character
A9B9   20 1A A2   JSR $A21A      ; FRMEVL: Evaluate expression
A9BC   20 4B A2   JSR $A24B      ; FRMNUM: Convert to numeric
A9BF   20 9E A2   JSR $A29E      ; CHKNUM: Check numeric type
A9C2   20 3A A2   JSR $A23A      ; CHKSTK: Check string type
A9C5   20 5E A2   JSR $A25E      ; CHKSTR: Check string type
A9C8   20 6E A2   JSR $A26E      ; CHKVAR: Check variable type
A9CB   20 7E A2   JSR $A27E      ; CHKARY: Check array type
A9CE   20 8E A2   JSR $A28E      ; CHKINT: Check integer type
A9D1   20 9E A2   JSR $A29E      ; CHKNUM: Check numeric type
A9D4   20 AE A2   JSR $A2AE      ; CHKSTR: Check string type
A9D7   20 BE A2   JSR $A2BE      ; CHKVAR: Check variable type
A9DA   20 CE A2   JSR $A2CE      ; CHKARY: Check array type
A9DD   20 DE A2   JSR $A2DE      ; CHKINT: Check integer type
A9E0   20 EE A2   JSR $A2EE      ; CHKNUM: Check numeric type
A9E3   20 FE A2   JSR $A2FE      ; CHKSTR: Check string type
A9E6   20 0E A3   JSR $A30E      ; CHKVAR: Check variable type
A9E9   20 1E A3   JSR $A31E      ; CHKARY: Check array type
A9EC   20 2E A3   JSR $A32E      ; CHKINT: Check integer type
A9EF   20 3E A3   JSR $A33E      ; CHKNUM: Check numeric type
A9F2   20 4E A3   JSR $A34E      ; CHKSTR: Check string type
A9F5   20 5E A3   JSR $A35E      ; CHKVAR: Check variable type
A9F8   20 6E A3   JSR $A36E      ; CHKARY: Check array type
A9FB   20 7E A3   JSR $A37E      ; CHKINT: Check integer type
A9FE   20 8E A3   JSR $A38E      ; CHKNUM: Check numeric type
AA01   20 9E A3   JSR $A39E      ; CHKSTR: Check string type
AA04   20 AE A3   JSR $A3AE      ; CHKVAR: Check variable type
AA07   20 BE A3   JSR $A3BE      ; CHKARY: Check array type
AA0A   20 CE A3   JSR $A3CE      ; CHKINT: Check integer type
AA0D   20 DE A3   JSR $A3DE      ; CHKNUM: Check numeric type
AA10   20 EE A3   JSR $A3EE      ; CHKSTR: Check string type
AA13   20 FE A3   JSR $A3FE      ; CHKVAR: Check variable type
AA16   20 0E A4   JSR $A40E      ; CHKARY: Check array type
AA19   20 1E A4   JSR $A41E      ; CHKINT: Check integer type
AA1C   20 2E A4   JSR $A42E      ; CHKNUM: Check numeric type
AA1F   20 3E A4   JSR $A43E      ; CHKSTR: Check string type
AA22   20 4E A4   JSR $A44E      ; CHKVAR: Check variable type
AA25   20 5E A4   JSR $A45E      ; CHKARY: Check array type
AA28   20 6E A4   JSR $A46E      ; CHKINT: Check integer type
AA2B   20 7E A4   JSR $A47E      ; CHKNUM: Check numeric type
AA2E   20 8E A4   JSR $A48E      ; CHKSTR: Check string type
AA31   20 9E A4   JSR $A49E      ; CHKVAR: Check variable type
AA34   20 AE A4   JSR $A4AE      ; CHKARY: Check array type
AA37   20 BE A4   JSR $A4BE      ; CHKINT: Check integer type
AA3A   20 CE A4   JSR $A4CE      ; CHKNUM: Check numeric type
AA3D   20 DE A4   JSR $A4DE      ; CHKSTR: Check string type
AA40   20 EE A4   JSR $A4EE      ; CHKVAR: Check variable type
AA43   20 FE A4   JSR $A4FE      ; CHKARY: Check array type
AA46   20 0E A5   JSR $A50E      ; CHKINT: Check integer type
AA49   20 1E A5   JSR $A51E      ; CHKNUM: Check numeric type
AA4C   20 2E A5   JSR $A52E      ; CHKSTR: Check string type
AA4F   20 3E A5   JSR $A53E      ; CHKVAR: Check variable type
AA52   20 4E A5   JSR $A54E      ; CHKARY: Check array type
AA55   20 5E A5   JSR $A55E      ; CHKINT: Check integer type
AA58   20 6E A5   JSR $A56E      ; CHKNUM: Check numeric type
AA5B   20 7E A5   JSR $A57E      ; CHKSTR: Check string type
AA5E   20 8E A5   JSR $A58E      ; CHKVAR: Check variable type
AA61   20 9E A5   JSR $A59E      ; CHKARY: Check array type
AA64   20 AE A5   JSR $A5AE      ; CHKINT: Check integer type
AA67   20 BE A5   JSR $A5BE      ; CHKNUM: Check numeric type
AA6A   20 CE A5   JSR $A5CE      ; CHKSTR: Check string type
AA6D   20 DE A5   JSR $A5DE      ; CHKVAR: Check variable type
AA70   20 EE A5   JSR $A5EE      ; CHKARY: Check array type
AA73   20 FE A5   JSR $A5FE      ; CHKINT: Check integer type
AA76   20 0E A6   JSR $A60E      ; CHKNUM: Check numeric type
AA79   20 1E A6   JSR $A61E      ; CHKSTR: Check string type
AA7C   20 2E A6   JSR $A62E      ; CHKVAR: Check variable type
AA7F   60         RTS            ; Return
```

## Key Registers
- $A9A5 - BASIC ROM - LET routine entry point (assignment/variable creation handler)

## References
- "frmeval_expression_evaluation" — covers expression

## Labels
- LET
