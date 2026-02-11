# GOSUB ($A883) — Perform GOSUB

**Summary:** At $A883 (decimal 43139), GOSUB pushes the current text-character pointer and current-line pointer plus a block-type identifier 141 ($8D) onto the stack to mark a GOSUB return point, then invokes the GOTO mechanism to jump to the subroutine line.

## Operation
GOSUB saves return information on the BASIC stack and then transfers control to the target line using the same jump mechanism as GOTO.

- Location: $A883 (decimal 43139).
- Saved values: the pointers for the current text character and the current source-line, and the constant byte 141 ($8D) that identifies the saved block as a GOSUB record for RETURN to recognize.
- After pushing these values, GOSUB invokes the GOTO routine to perform the actual jump to the subroutine line.
- RETURN later scans the stack for a saved block with the identifier 141 ($8D) to restore the saved pointers and resume execution after the GOSUB.

## References
- "return_statement" — expands on how RETURN finds and uses GOSUB data saved on the stack  
- "goto_statement" — expands on how GOSUB uses the GOTO mechanism to jump to the subroutine line

## Labels
- GOSUB
