# BASIC: Small optimizations for Commodore 64 programs

**Summary:** Quick Commodore 64 BASIC optimizations: reuse code with GOSUB, use TAB and SPC for screen positioning instead of many cursor-movement commands, and apply other small, local optimizations to reduce program size and improve clarity.

## Optimization tips
- Use GOSUB/RETURN to factor repeated sequences of BASIC statements (reusable routines), avoiding copy-paste of code blocks.
- Use TAB and SPC for screen positioning and spacing instead of issuing many cursor-control or print-without-newline constructs; this reduces tokens and line length.
- Apply other small optimizations (local token and whitespace reduction, consolidating PRINT statements) to lower program token count and improve maintainability.

## References
- "for_loop_statement" — expands on using loops effectively to reduce repeated code