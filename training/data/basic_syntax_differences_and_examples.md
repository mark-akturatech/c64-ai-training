# Commodore 64 BASIC: Syntax differences and conversion notes

**Summary:** Notes on Commodore 64 BASIC syntax: the second equal sign is treated as a logical/relational operator (can set a variable to -1 for true), use a colon (:) to separate multiple statements on one line, and replace MAT functions with FOR...NEXT loops for compatibility.

## Equal-sign ambiguity
Commodore 64 BASIC interprets a second equal sign as a logical/relational operator and can assign a value of -1 to indicate true. Example conversion: use an explicit assignment rather than relying on chained/ambiguous equals — for example:
10 C=0:B=0
(Use of the second '=' may yield B = -1 if C = 0.) **[Note: do not rely on chained assignment semantics from other BASICs.]**

## Multiple statements on one line
Separate multiple statements with a colon (:) on the Commodore 64. Do not use backslash or other separators used by some other BASIC dialects. Example:
10 C=0:B=0

## MAT functions
Code that uses MAT ... (matrix) functions available in some BASIC dialects must be rewritten to use explicit loops on the C64. Replace MAT operations with FOR...NEXT loops that perform the same element-wise operations.

## Key Registers
(omitted — this chunk is about BASIC syntax, not hardware registers)

## References
- "ignored_page_footer_before_appendix_k" — expands on page break/footer preceding Appendix K  
- "appendix_k_intro_and_errors_part1" — begins the Appendix K error-message list