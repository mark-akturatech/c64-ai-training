# Removing Instructions (Cycle Optimization)

**Summary:** Remove unnecessary 6502 instructions to save machine cycles in C-64 demos; e.g., CLC (clear Carry flag) can sometimes be omitted when the carry flag is already correct.

## Removing Instructions
All instructions consume machine cycles; eliminating ones that have no effect on program state reduces runtime. Inspect tight or frequently executed code paths (critical sections) and remove instructions that are redundant given the known state of flags or registers.

Example guideline from source:
- CLC (clear Carry flag) can sometimes be removed if the carry flag is already in the required state. (CLC clears the processor Carry flag.)
- Read the critical section and remove instructions that do not change the necessary state for subsequent operations.

This chunk is intentionally brief: it defines the rule of thumb—remove unnecessary instructions—and points to related material on replacing multi-instruction sequences with single faster instructions.

## References
- "substituting_instructions" — expands on replacing sequences with single faster instructions (INC vs LDX/INX/STX)