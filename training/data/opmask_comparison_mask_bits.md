# OPMASK ($4D) - Comparison Operation Mask

**Summary:** OPMASK at $004D is a zero-page mask used by the BASIC/expression evaluation routine to record the current comparison type: less-than ($01), equals ($02), or greater-than ($04). It is used together with OPPTR to track operator location and comparison semantics.

## Description
OPMASK is a single-byte mask created by the expression evaluator to indicate which comparison operation is active for the current expression. The bits represent comparison types as discrete flags so the evaluator can test for one or multiple comparison conditions if required.

Bit assignments:
- $01 — less-than
- $02 — equals
- $04 — greater-than

The evaluator writes the appropriate bit(s) into $004D when parsing or evaluating comparison operators. OPMASK is referenced alongside OPPTR (operator pointer) to determine both operator location and comparison type during expression processing.

## Key Registers
- $004D - Zero Page (BASIC/expression evaluator) - OPMASK: mask for comparison operation (bits: less-than=$01, equals=$02, greater-than=$04)

## References
- "opptr_math_operator_table_displacement" — expands on OPPTR and OPMASK usage by the expression evaluator to track operator location and comparison type

## Labels
- OPMASK
