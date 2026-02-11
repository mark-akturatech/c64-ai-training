# .PARAMCOUNT

**Summary:** .PARAMCOUNT (used as .paramcount) is a ca65 macro-only pseudo variable replaced by the actual number of parameters passed to the macro invocation; use it to validate argument count and emit errors (e.g. with .error).

## Description
.PARAMCOUNT is available only inside macros. When evaluated, it is replaced by the integer count of parameters that were supplied in the current macro invocation. Common use is to check the argument count and trigger assembler diagnostics or conditional assembly when the count is incorrect.

Example behavior shown in the source: a macro named foo declares three formal parameters and checks `.paramcount <> 3`; if the check fails the macro emits an `.error` with a diagnostic message.

(See the Macros section of the ca65 manual for full macro semantics.)

## Source Code
```asm
.macro  foo     arg1, arg2, arg3
.if     .paramcount <> 3
.error  "Too few parameters for macro foo"
.endif
...
.endmacro
```

## References
- "pseudo_variables_overview" — general pseudo variables introduction
- "asize_pseudo_variable" — expands on example usage patterns (.ASIZE macro example)