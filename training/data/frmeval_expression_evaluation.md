# FRMEVAL ($AD9E) — Evaluate expressions

**Summary:** FRMEVAL at $AD9E is the main BASIC expression-evaluation entry point; it tokenizes ASCII expression text, separates operators and terms, performs error checking and operations, handles string and numeric types (variables and constants), and produces a single resulting value. It sets result-type flags at byte 13 ($0D) (string vs numeric) and byte 14 ($0E) (if numeric: integer vs floating-point).

**Evaluate Expression**
FRMEVAL is the top-level routine (and family of subroutines) used throughout BASIC to convert an ASCII expression into one final value the interpreter can use. Responsibilities described by the source:

- Tokenize ASCII expression text and separate operators and terms.
- Perform syntactic and semantic error checking on the expression.
- Evaluate terms (variables, constants, expressions) and perform the indicated operations to combine them according to BASIC’s rules (operator handling and precedence handled by the subroutine group).
- Support both string and numeric expression types; subroutines handle type-specific behavior and conversions as needed.
- Produce a single resulting value for the calling BASIC statement.
- Set result-type flags:
  - Byte 13 ($0D) — flag set to indicate whether the resulting value is a string or numeric.
  - Byte 14 ($0E) — if the result is numeric, this flag indicates whether the numeric result is an integer or a floating-point number.

FRMEVAL is invoked by many BASIC constructs that require expression evaluation (for example, the right-hand side of LET statements and conditional expressions in IF). It cooperates with other routines such as the numeric-type checking/evaluation helpers (e.g., FRMNUM).

## References
- "let_statement_variable_assignment" — how LET uses FRMEVAL to compute right-hand expressions  
- "if_statement" — how IF uses FRMEVAL to evaluate its conditional expression  
- "frmnum_numeric_evaluation_and_type_check" — routines that work with FRMEVAL to perform numeric evaluation and type checking

## Labels
- FRMEVAL
