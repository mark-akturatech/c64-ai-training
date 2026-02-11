# END (BASIC statement) and EXP (function)

**Summary:** The `END` statement in BASIC terminates program execution and displays the `READY` prompt; it contrasts with `STOP`, which displays `BREAK IN LINE XX`. Both allow resumption with the `CONT` command. The `EXP(number)` function returns e raised to the power of `number` (e ≈ 2.71828183); inputs greater than 88.0296919 cause an overflow error.

**END statement**

**Type:** Statement  
**Format:** `END`

**Action:** Ends program execution and displays the `READY` message, returning control to the user. Multiple `END` statements can exist in a program. While a program may run out of lines without an `END`, it's recommended to conclude programs with one.

**Behavioral details:**
- `END` displays the `READY` prompt; `STOP` displays `BREAK IN LINE XX`.
- Both `END` and `STOP` allow resuming execution with the `CONT` command.
- `END` takes no arguments.

Example usage is shown in the Source Code section.

**EXP function**

**Signature:** `EXP(number)`

**Description:** Numeric function that returns e raised to the power of `number`, where e ≈ 2.71828183.  
**Overflow:** Values greater than 88.0296919 will cause an overflow error.

**Examples:**

1. **Simple Exponential Calculation:**
   This example calculates e raised to the power of 2.

2. **Compound Interest Calculation:**
   Here, `EXP` is used in the formula for continuous compound interest to calculate the final amount after 10 years.

## Source Code

   ```basic
   10 X = 2
   20 Y = EXP(X) : REM Y stores the value of e^2
   30 PRINT Y    : REM Output: approximately 7.389
   ```

   ```basic
   10 P = 1000   : REM Principal amount
   20 R = 0.05   : REM Annual interest rate
   30 T = 10     : REM Number of years
   40 A = P * EXP(R * T)  : REM A stores the final amount
   50 PRINT "Final amount: "; A
   ```


```basic
10 PRINT "DO YOU REALLY WANT TO RUN THIS PROGRAM"
20 INPUT A$
30 IF A$ = "NO" THEN END
40 REM REST OF PROGRAM . . .
999 END
```

## References

- "cont_command_usage" — CONT behavior after END or STOP