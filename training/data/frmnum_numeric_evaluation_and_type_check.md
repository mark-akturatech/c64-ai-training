# FRMNUM ($AD8A) — Evaluate Numeric Expression and Check for Data Type Mismatch

**Summary:** FRMNUM at $AD8A is a BASIC runtime routine that evaluates a numeric expression and verifies that the result is numeric. If the result is not numeric, it triggers a TYPE MISMATCH error.

**Description**

The FRMNUM routine is invoked to:

- Evaluate a numeric expression.
- Ensure the evaluated result is numeric.

If the result is not numeric, FRMNUM triggers a TYPE MISMATCH error. This routine is commonly used in the evaluation of expressions and during variable assignments to ensure type compatibility.

## Source Code

The following is the disassembly of the FRMNUM routine at $AD8A:

```assembly
AD8A  20 9E AD  JSR $AD9E  ; Call FRMEVL to evaluate the expression
AD8D  20 8D AD  JSR $AD8D  ; Call CHKNUM to check if the result is numeric
AD90  60        RTS         ; Return from subroutine
```

This routine calls FRMEVL at $AD9E to evaluate the expression and CHKNUM at $AD8D to verify that the result is numeric.

## Key Registers

- **Accumulator (A):** Used during the evaluation and type checking processes.
- **X Register:** May be used within the called routines.
- **Y Register:** May be used within the called routines.
- **Processor Status Register (P):** Flags may be affected based on the operations performed within the called routines.

## References

- "frmeval_expression_evaluation" — Details on FRMEVL routines related to expression evaluation.
- "let_statement_variable_assignment" — Information on type checking during variable assignment.

## Labels
- FRMNUM
