# USR() return value — floating accumulator

**Summary:** The BASIC USR() function returns the value left in the floating-point accumulator (the BASIC floating accumulator). If the called machine code routine does not change that accumulator, USR(arg) will return the argument value (e.g., PRINT USR(5) prints 5).

## Behavior
USR() is the BASIC function that yields whatever numeric value is currently stored in the BASIC floating-point accumulator when control returns from the machine code routine invoked by USR. If the machine code does not modify the floating accumulator, the accumulator still contains the numeric argument passed to USR, so the call returns that same argument.

Example use (behavioral note): calling USR with an argument places that argument into the floating accumulator; machine code may alter the accumulator to return a different numeric result; if it leaves it unchanged, USR returns the original argument.

## Source Code
```basic
10 PRINT USR(5)   : REM if the called machine code does not change the floating accumulator, this prints 5
```

## References
- "usr_and_sys_contrast" — expands on USR vs SYS usage