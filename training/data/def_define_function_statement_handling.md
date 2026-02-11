# DEF — implementation (routine $B3B3)

**Summary:** Routine at $B3B3 implements the BASIC DEF statement: it performs syntax checking for DEF/FN, creates/locates the dependent variable (the X in FN(X)), and pushes five bytes onto the stack containing the function descriptor and a pointer into the program text.

## Operation
DEF (entry $B3B3) validates the syntax of a DEF function statement and stores the information needed later for FN evaluation. On success it pushes five bytes onto the 6502 stack in this sequence:
- the first byte of the function statement,
- a two-byte pointer to the dependent-variable descriptor (the X in FN(X)),
- a two-byte address pointing to the first character of the function definition in the program text.

Total pushed = 1 + 2 + 2 = 5 bytes. The DEF statement itself must fit entirely on one BASIC source line; longer or more complex behavior is achieved by calling/nesting additional functions (one function calling another).

## References
- "getfnm_def_and_fn_syntax_check" — expands on GETFNM usage to validate FN/DEF syntax and to locate/create the dependent variable
- "fndoer_fn_evaluation" — expands on how FN evaluation uses the information stored by DEF

## Labels
- DEF
