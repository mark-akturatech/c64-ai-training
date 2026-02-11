# FOR...NEXT (Commodore 64 BASIC)

**Summary:** Describes Commodore 64 BASIC FOR...NEXT loop semantics: FOR initialization, default STEP (+1), how NEXT increments the loop variable, positive/negative STEP behavior, fractional STEP allowed, and the guarantee that the loop body runs at least once.

## Semantics
- FOR var = start TO limit [STEP step]
  - The FOR statement assigns the loop variable to the evaluated start value and stores the evaluated limit and (optional) step.
  - If STEP is omitted the step value is +1.
  - STEP may be positive, negative, or fractional (decimal); numeric expressions are allowed.
- Execution model
  - The body of the loop executes, then a NEXT (matching the FOR) increments the loop variable by the stored step.
  - After incrementing, the variable is compared to the stored limit:
    - If step > 0: loop continues while variable <= limit.
    - If step < 0: loop continues while variable >= limit.
    - Otherwise execution proceeds past the NEXT (loop ends).
  - Because the comparison is performed after the first iteration's increment cycle, the loop body executes at least once (even if start already lies beyond limit).
- Notes
  - Numeric values may be fractional (e.g., STEP .01) and negative; behavior follows the above comparison rules.
  - (Subject to BASIC’s floating-point precision.)

## Source Code
```basic
100 FOR L = PI TO 6*PI STEP .01
100 FOR AA = 3 TO 3
```

## References
- "next_statement" — pairs NEXT with FOR and handling of nested loops
- "step_statement" — details about STEP usage and constraints