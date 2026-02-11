# FOR ... TO ... [STEP ...]

**Summary:** FOR...TO...[STEP] is a Commodore 64 BASIC loop counter statement that initializes a floating-point variable with a start value, increments it at NEXT (default STEP +1), compares it to the limit (comparison direction depends on STEP sign), and repeats by jumping back to the statement after the FOR until the limit is passed.

## Description
Type: Statement  
Format: FOR <variable> = <start> TO <limit> [ STEP <increment> ]

Action:
- The FOR statement sets the specified floating-point <variable> to the <start> value when executed.
- The loop body executes at least once (the NEXT that closes a FOR is always reached once even if the start already exceeds the limit).
- When a NEXT statement corresponding to the FOR is executed:
  - The <increment> (STEP) value is added to the <variable>. If STEP is omitted, the increment defaults to +1.
  - The new value is compared to the <limit>.
    - If STEP is positive, continuation requires the variable NOT to have exceeded the limit (variable must be <= limit to continue). When the variable exceeds the limit, the loop ends.
    - If STEP is negative, the comparison is reversed (the variable must be >= limit to continue). When the variable becomes less than the limit, the loop ends.
  - If the loop continues, execution transfers to the line after the original FOR statement (i.e., the first statement of the loop body).
- Start, limit and step may be expressions (see operator precedence details in referenced material).

Note: The variable used for the loop counter must be a BASIC floating-point variable name.

## Source Code
```basic
100 L = 1
110 PRINT L
120 L = 1 + 1
130 IF L <= 10 THEN 110
140 END
```

```basic
100 FOR L = 1 TO 10
110 PRINT L
120 NEXT L
130 END
```

```basic
100 FOR L = 100 TO 0 STEP -1
```

## References
- "operator_precedence_hierarchy" — expression rules for start/limit/step
- "next_and_for_structure" — closing FOR with NEXT and related behavior