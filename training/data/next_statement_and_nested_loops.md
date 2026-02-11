# NEXT (BASIC statement)

**Summary:** NEXT ends a FOR...NEXT loop in Commodore 64 BASIC; syntax NEXT[<counter>][,<counter>]... lets a single NEXT increment/terminate multiple nested loop counters (inner-most first). NEXT increments by the loop's STEP and compares to the FOR end-value; loops may be nested up to 9 levels.

**Description**
TYPE: Statement  
FORMAT: NEXT[<counter>][,<counter>]...

- **Purpose:** The NEXT statement marks the logical end of a FOR...NEXT loop. It need not be physically the last statement inside the loop block, but it is always the last statement executed for that loop iteration.
- **Single-counter use:** If a counter variable is specified, NEXT increments that counter by the STEP value (default 1 if none given in the FOR) and then tests it against the FOR end-value to decide whether to repeat the loop.
- **Multiple counters:** A single NEXT may terminate several nested loops by listing each loop's counter variable, separated by commas. When providing multiple counters, they must appear in order from the inner-most nested loop to the outer-most loop.
- **Omitted counter(s):** If no counter is specified on NEXT, the counter associated with the FOR at the current nesting level (the innermost active loop) is incremented.
- **Nesting limit:** FOR loops can be nested to a maximum depth of 9 levels.
- **Termination condition:** After NEXT increments the counter by STEP, the counter is compared to the FOR end-value. The sign of STEP determines the comparison direction:
  - For positive STEP: loop continues while counter ≤ end-value; stops when counter > end-value.
  - For negative STEP: loop continues while counter ≥ end-value; stops when counter < end-value.

## Source Code
```basic
10 FOR J=1 TO 5: FOR K=10 TO 20: FOR N=5 TO -5 STEP -1
20 NEXT N,K,J            (Stopping Nested Loops)

10 FOR L=1 TO 100
20 FOR M=1 TO 10
30 NEXT M
40 NEXT L               (Note how the loops do NOT cross each other)

10 FOR A=1 TO 10
20 FOR B=1 TO 20
30 NEXT
40 NEXT                  (Notice that no variable names are needed)
```

## References
- "for_to_step_statement" — expands on FOR statement details and interaction with NEXT
