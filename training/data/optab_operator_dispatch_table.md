# OPTAB — Operator Dispatch Vector Table ($A080-$A09D)

**Summary:** OPTAB is the BASIC operator dispatch vector table at $A080-$A09D (41088–41117). It maps operator tokens (170–179 / $AA–$B3) to two-byte vectors (pointing one byte before the operator routine) and stores a one‑byte precedence value per entry used by the BASIC expression evaluator (FRMEVAL/EVAL).

**Operator Dispatch Vector Table**
This table contains 2-byte vectors, each pointing to an address one byte before the start of a routine that implements a BASIC math or logical operation. Each table entry also includes a one‑byte precedence value; operations with higher precedence are evaluated before lower-precedence operations during expression evaluation.

The table's ordering and the evaluator's precedence rules (highest first) are:
1. Expressions in parentheses
2. Exponentiation (^, up‑arrow)
3. Negation (unary minus)
4. Multiplication and division
5. Addition and subtraction
6. Relation tests (=, <>, <, >, <=, >=) — same precedence for relations
7. NOT (logical)
8. AND (logical)
9. OR (logical)

The table entries are used by FRMEVAL/EVAL routines to dispatch the appropriate operation handlers while parsing/evaluating expressions. Each vector in OPTAB points to one byte before the actual routine entry; see the comment for location $A00C (40972) for the rationale behind the one‑byte offset.

## Source Code
```text
OPTAB (41088-41117 / $A080-$A09D): Operator token -> routine address mapping

Token #   Token $   Operator              Routine Address (dec)   Routine Address (hex)   Precedence
170       $AA       + (ADD)               47210                   $B86A                   5
171       $AB       - (SUBTRACT)          47187                   $B853                   5
172       $AC       * (MULTIPLY)          47659                   $BA2B                   4
173       $AD       / (DIVIDE)            47890                   $BB12                   4
174       $AE       ^ (EXPONENTIATE)      49019                   $BF7B                   2
175       $AF       AND (LOGICAL AND)     45033                   $AFE9                   8
176       $B0       OR (LOGICAL OR)       45030                   $AFE6                   9
177       $B1       > (GREATER THAN)      49076                   $BFB4                   6
178       $B2       = (EQUAL TO)          44756                   $AED4                   6
179       $B3       < (LESS THAN)         45078                   $B016                   6
```

## References
- "frmeval_evaluate_expression" — expands on OPTAB usage by FRMEVAL/EVAL routines to compute expressions.