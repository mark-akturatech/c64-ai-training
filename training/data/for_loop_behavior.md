# FOR (BASIC statement) — behavior and interpreter handling

**Summary:** The FOR statement in Commodore 64 BASIC manages loop control by pushing relevant information onto the interpreter stack at $0100. This includes the evaluated TO value, ensuring the loop operates correctly. The TO expression is evaluated once upon FOR execution, and the loop control variable must be a non-array floating-point variable. Reusing a FOR variable within an active loop cancels the current and any intervening loops.

**Operation**

- Upon executing a FOR statement, the interpreter saves all necessary information for the corresponding NEXT statement onto the interpreter stack at $0100. This information includes:
  - Pointer to the next instruction.
  - Current line number.
  - TO termination value.
  - STEP value (default is 1).
  - Name of the loop variable.
  - FOR token.
- The TO expression is evaluated once when the FOR statement executes, and the resulting numeric value is stored for the loop's duration.
  - Modifying the variable used in the TO expression inside the loop does not affect the loop's termination, as the stored termination value remains unchanged.
  - However, increasing the FOR loop variable within the loop can cause an early termination, since NEXT compares the loop variable to the stored TO value.
- The loop's terminating condition is checked when NEXT executes, ensuring the loop body runs at least once.
- The loop control variable must be a non-array floating-point variable.
- Reusing the same FOR variable in another FOR statement while the first is active cancels the previous FOR and any intervening loops.

## Source Code

The FOR statement's handling in the BASIC interpreter involves pushing 18 bytes onto the stack at $0100. This process is managed by the routine at address $A742 in the BASIC ROM. The stack layout for a FOR loop is as follows:

```text
Offset  Size  Description
------  ----  -----------
+00     2     Pointer to the next instruction
+02     2     Current line number
+04     5     TO termination value (floating-point)
+09     5     STEP value (floating-point)
+14     1     Length of the variable name
+15     1     First character of the variable name
+16     1     Second character of the variable name (if applicable)
+17     1     FOR token
```

This structure allows the NEXT statement to retrieve the necessary information to manage loop control effectively.

The assembly routine at $A742 handles the FOR statement by performing the following steps:

1. Set the FNX flag to indicate a FOR loop is being processed.
2. Call the LET routine to assign the initial value to the loop variable.
3. Search the stack for existing FOR or GOSUB activities related to the loop variable.
4. If an existing FOR loop with the same variable is found, remove it from the stack.
5. Push the new FOR loop information onto the stack, including the next instruction pointer, line number, TO value, STEP value, variable name, and FOR token.

This process ensures that each FOR loop is properly managed and that nested or reused loop variables are handled correctly.

## References

- "main_loop" — expands on FOR as one of the statements executed when no line number is present
- "runc_reset_text_pointer" — expands on execution uses the program text pointer set by RUNC
