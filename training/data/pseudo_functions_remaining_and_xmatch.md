# ca65 pseudo-functions: .STRAT / .STRING / .STRLEN / .TCOUNT / .XMATCH

**Summary:** Descriptions and exact behavior of ca65 builtin pseudo-functions .STRAT (zero-based char access), .STRING (convert identifier/number to string constant), .STRLEN (string length), .TCOUNT (token-count; optional curly-brace enclosure), and .XMATCH (token-list matching for macros). Mentions relation to .MATCH and token-list syntax.

## .STRAT
.strat(string, index) returns the integer value of the character at the given position in the string. The index is zero-based.

- Input: a string and an index (zero-based).
- Output: integer code of character at that index.
- Common use: macros that inspect the first or other specific characters of macro arguments.

(Example moved to Source Code.)

## .STRING
.string(arg) converts its argument into a string constant. The argument may be an identifier or a numeric constant.

- Useful where the argument is not originally a literal string (for example inside macros).
- The function returns a string constant (suitable for use with .segment, .byte, etc.).

(Example moved to Source Code.)

## .STRLEN
.strlen(string) returns the length of the given string.

- Returns integer length (number of characters).
- Useful for building Pascal-style strings or embedding lengths before string data.

(Example moved to Source Code.)

## .TCOUNT
.tcount(token-list) returns the number of tokens in the given token list.

- token-list may optionally be enclosed in curly braces { } — the braces are not counted.
- Curly-brace enclosure allows inclusion of tokens that would otherwise terminate the list (for example a closing parenthesis).
- Typical use: macros that need to know how many tokens were passed, or to strip tokens (see example for handling '#' immediate token).

(Example moved to Source Code.)

## .XMATCH
.XMATCH(token-list-1, token-list-2) compares two token lists against each other. Intended for use inside macros because macro parameters are token lists, not strings.

- Both token lists may contain arbitrary tokens except:
  - the terminator token (comma or right parenthesis)
  - end-of-line and end-of-file
- Both token lists may optionally be enclosed in curly braces (useful to include tokens that would otherwise terminate the list).
- .XMATCH compares tokens and token values (exact match of token content).
- If only token types should be compared, use .MATCH instead (see .MATCH).

Syntax:
.XMATCH(<token list #1>, <token list #2>)

(Brief examples and usage snippets moved to Source Code.)

## Source Code
```asm
; Example for .STRAT
.macro  M       Arg
        ; Check if the argument string starts with '#'
        .if (.strat (Arg, 0) = '#')
        ...
        .endif
.endmacro
```

```asm
; Example for .STRING
; Emulate other assemblers:
.macro  section name
        .segment        .string(name)
.endmacro
```

```asm
; Example for .STRLEN
; The following macro encodes a string as a pascal style string with a leading length byte.
.macro  PString Arg
        .byte   .strlen(Arg), Arg
.endmacro
```

```asm
; Example for .TCOUNT usage (ldax macro)
.macro  ldax    arg
        .if (.match (.mid (0, 1, {arg}), #))
        ; ldax called with immediate operand
        lda     #<(.right (.tcount ({arg})-1, {arg}))
        ldx     #>(.right (.tcount ({arg})-1, {arg}))
        .else
        ...
        .endif
.endmacro
```

```text
; .XMATCH syntax
.XMATCH(<token list #1>, <token list #2>)
; Both token lists may be enclosed in { } to allow including tokens that would otherwise terminate the list.
```

## References
- "pseudo_functions_size_and_format" — expands on related string and token helpers
- "control_commands_overview" — expands on start of control commands reference
- ".MATCH" — token-type comparison function (see for difference from .XMATCH)
