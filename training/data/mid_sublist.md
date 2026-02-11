# .MID (ca65 builtin function)

**Summary:** .MID extracts a sublist of tokens from a token list in ca65 macros: .MID(<start>, <count>, <token list>). Uses 0-based indexing, accepts curly-braced token lists to include terminator-like tokens, and is commonly combined with .MATCH to inspect tokens (example: detect immediate '#' token). Related: .LEFT, .RIGHT.

## Description
.MID is a builtin ca65 function that returns a contiguous subset of tokens from a token list.

- Syntax: .MID(<int expr>, <int expr>, <token list>)
- The first integer expression is the starting token index (0-based).
- The second integer expression is the number of tokens to extract.
- The third argument is the token list to extract from. The token list may optionally be enclosed in curly braces ({ }) — this allows inclusion of tokens that would otherwise terminate the list (for example, a closing parenthesis).

Typical use is inside macros to inspect or manipulate parts of a macro argument list. .MID is often combined with .MATCH to compare the extracted token(s) against a specific token (e.g., '#').

## Source Code
```asm
; Syntax example (illustrative):
; .MID (<int expr>, <int expr>, <token list>)

.macro  ldax    arg
        ...
        .if (.match (.mid (0, 1, {arg}), #))

        ; ldax called with immediate operand
        ...

        .endif
        ...
.endmacro
```

## References
- "right_token_list" — expands on related function to extract the right part of a token list (.RIGHT)
- ".LEFT" — extracts the left part of a token list
- ".RIGHT" — extracts the right part of a token list
