# .RIGHT (ca65 builtin function)

**Summary:** Extracts the rightmost N tokens from a token list in ca65 assembler source; syntax is .RIGHT (<int expr>, <token list>) and the token list may be enclosed in curly braces to include terminator-like tokens (e.g. a closing right parenthesis).

## Description
.RIGHT is a built-in ca65 assembler function that returns the rightmost portion of a token list.

- First argument: an integer expression specifying the number of tokens to extract (counting tokens, not characters).
- Second argument: the token list to extract from. The token list may optionally be wrapped in curly braces { } to allow inclusion of tokens that would otherwise terminate the list (for example, a literal closing parenthesis that would end the argument parsing).

The function returns the extracted token sublist (the rightmost N tokens). Use .LEFT and .MID for analogous operations on the leftmost tokens or a middle sublist.

## References
- "mid_sublist" — expands on related function to extract a middle sublist of tokens (.MID)