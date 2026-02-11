# IF ($A928)

**Summary:** BASIC V2 token IF at $A928 (decimal 43304) — uses the expression evaluator FRMEVL at $AD9E (decimal 44446) to reduce the IF expression to a single term; if the result is zero, execution falls through to REM (skip), otherwise GOTO or the statement after THEN is executed.

**Description**

The IF token handler at $A928 processes the IF statement in BASIC V2. It evaluates the Boolean/numeric expression following the IF keyword by invoking the FRMEVL routine at $AD9E. This routine reduces the expression to a single term (the evaluated result).

- **Zero Result:** If FRMEVL returns 0 (indicating the expression is false), the interpreter skips the subsequent statements by falling through to the REM token, effectively ignoring the rest of the line.
- **Non-Zero Result:** If FRMEVL returns a non-zero value (indicating the expression is true), execution continues by:
  - Performing a GOTO if the IF statement is in the form `IF ... GOTO`.
  - Executing the statement that follows the THEN token.

## Source Code

```assembly
; IF token handler at $A928
A928  20 9E AD  JSR $AD9E    ; Call FRMEVL to evaluate the expression
A92B  20 4B A7  JSR $A74B    ; Call routine to check for syntax errors
A92E  A5 61     LDA $61      ; Load the result of FRMEVL
A930  D0 0B     BNE $A93D    ; If result is non-zero, branch to execute THEN or GOTO
A932  A9 8F     LDA #$8F     ; Load token for REM
A934  85 6F     STA $6F      ; Set current token to REM
A936  4C 5A A7  JMP $A75A    ; Jump to routine that handles REM (skip rest of line)
A93D  20 4B A7  JSR $A74B    ; Call routine to check for syntax errors
A940  A5 6F     LDA $6F      ; Load current token
A942  C9 89     CMP #$89     ; Compare with token for GOTO
A944  F0 0A     BEQ $A950    ; If GOTO, branch to handle GOTO
A946  C9 8A     CMP #$8A     ; Compare with token for THEN
A948  F0 0C     BEQ $A956    ; If THEN, branch to handle THEN
A94A  4C 5A A7  JMP $A75A    ; Otherwise, jump to routine that handles REM (skip rest of line)
A950  4C 7E A9  JMP $A97E    ; Jump to GOTO handler
A956  20 4B A7  JSR $A74B    ; Call routine to check for syntax errors
A959  4C 5A A7  JMP $A75A    ; Jump to routine that handles REM (skip rest of line)
```

```assembly
; FRMEVL routine at $AD9E
AD9E  20 0B B1  JSR $B10B    ; Call routine to evaluate expression
ADA1  20 4B A7  JSR $A74B    ; Call routine to check for syntax errors
ADA4  A5 61     LDA $61      ; Load result of expression evaluation
ADA6  60        RTS          ; Return
```

## Key Registers

- **$61:** Stores the result of the expression evaluation by FRMEVL.
- **$6F:** Holds the current BASIC token being processed.

## References

- "frmeval_expression_evaluation" — expands on FRMEVL reducing the IF expression to a single term.
- "rem_statement" — expands on IF falling through to REM when false.