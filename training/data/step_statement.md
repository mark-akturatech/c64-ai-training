# STEP (FOR statement)

**Summary:** STEP is the optional increment clause for a BASIC FOR...NEXT loop on the Commodore 64. Format: [STEP <expression>] — default increment is +1, any numeric value allowed (STEP 0 causes an infinite loop); the STEP value is fixed for the duration of the loop.

## Description
TYPE: Statement  
FORMAT: [STEP <expression>]

Action: The optional STEP keyword follows the <end-value> expression in a FOR statement and defines the increment applied to the loop counter. When the NEXT statement is reached, the STEP increment is applied to the loop variable, and then the counter is tested against the end-value to determine whether the loop continues. If STEP is omitted the increment is +1. Any numeric value may be used; a STEP of 0 will never advance the counter and thus loop forever.

NOTE: The STEP value cannot be changed once the FOR loop has started.

Examples illustrate positive and negative increments and their iteration counts.

## Source Code
```basic
25 FOR XX=2 TO 20 STEP 2             (Loop repeats 10 times)
35 FOR ZZ=0 TO -20 STEP -2           (Loop repeats 11 times)
```

## References
- "for_to_step_statement" — expands on FOR uses STEP when looping