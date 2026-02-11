# .MATCH (ca65 builtin)

**Summary:** .MATCH(<token list #1>, <token list #2>) — ca65 builtin that compares two token lists (used mainly inside macros). Token lists cannot contain terminator tokens (comma or right parenthesis) or end-of-line/file unless wrapped in curly braces; use .XMATCH to compare token attributes.

## Syntax and usage
Syntax:
.MATCH(<token list #1>, <token list #2>)

- Both token lists may contain arbitrary tokens except:
  - the terminator token (comma or right parenthesis), and
  - end-of-line or end-of-file.
- Either token list may optionally be enclosed in curly braces ({ ... }) to allow inclusion of tokens that would otherwise terminate the list (for example, a closing parenthesis).
- Typical use is inside macros (macro parameters are often passed as one of the token lists).

## Behavior
- The function matches tokens only; it does not compare token attributes.
  - Any numeric token equals any other numeric token regardless of numeric value.
  - Any string token equals any other string token regardless of content.
- Use .XMATCH when you need to compare tokens plus their attributes (token values, quoting, numeric formats, etc.).
- The function evaluates to true when the two token lists match (used in conditional expressions, e.g. .if .match(...)).

## Source Code
```asm
.macro  asr     arg

        .if (.not .blank(arg)) .and (.not .match ({arg}, a))
        .error "Syntax error"
        .endif

        cmp     #$80            ; Bit 7 into carry
        lsr     a               ; Shift carry into bit 7

.endmacro
```

## References
- ".XMATCH" — compares tokens and token attributes (use when attribute-aware comparison is required)