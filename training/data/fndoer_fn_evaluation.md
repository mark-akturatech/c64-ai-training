# FNDOER ($B3F4) — Perform FN (user-defined function evaluation)

**Summary:** Routine FNDOER at $B3F4 evaluates a user-defined FN expression by evaluating the FN argument expression (e.g. FN(A+B*C/D)) and then continuing parsing using the text of the DEF FN statement; it uses the function variable descriptor area as temporary workspace and does not permanently alter the dependent variable. Related to GETFNM (sets up syntax and variable pointers) and DEF (pushes descriptor/stack info).

## Function evaluation
FNDOER implements evaluation of a user-defined function call. Operation proceeds in two main steps:
- Evaluate the FN argument expression present at the call site (for example, evaluate A+B*C/D when calling FN(A+B*C/D)).
- After the argument value is computed, obtain the remainder of the expression from the text of the function definition statement (the DEF FN text) and continue parsing/evaluating using that text as the function body.

(Uses syntax checks and variable pointers by GETFNM.)

## Workspace and variable handling
- The function variable descriptor area (the descriptor block allocated for the user function) is used as working space during evaluation.
- The dependent variable (the variable named in the DEF FN statement) is used temporarily but is not permanently modified by the call. Therefore, invoking FN(X) inside a caller does not change the caller's X value after the FN returns.
- Descriptor/stack information required for evaluation is supplied by DEF (descriptor area and pointers already pushed/organized by DEF).

(Descriptor info pushed by DEF.)

## Behavior notes
- FNDOER relies on the setup previously done when the function was defined: DEF must have created the variable descriptors and any stack/descriptor context, and GETFNM must have established syntax validity and pointers into the function text.
- The routine continues parsing/executing from the stored function definition text rather than from the call-site text after the argument is evaluated.

## References
- "def_define_function_statement_handling" — expands on uses of the stack/descriptor information pushed by DEF when evaluating user-defined functions  
- "getfnm_def_and_fn_syntax_check" — expands on reliance on syntax checks and variable pointers established by GETFNM

## Labels
- FNDOER
