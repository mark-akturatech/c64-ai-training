# ca65: Detecting macro parameter types with .MATCH / token-list helpers (ldax example)

**Summary:** ca65 macro parameter type detection using .MATCH/.XMATCH, .left, .right, .tcount and curly-brace token lists; example .macro ldax decides between immediate (#...) and memory operands and emits appropriate lda/ldx sequences.

## Detecting parameter types
This example shows how a ca65 macro can inspect its token-list argument and choose different code paths depending on the first token.

Key points:
- .match (or .xmatch) lets you compare a token (or token-list fragment) against a pattern (here the hash mark # for immediate).
- .left(1, {arg}) extracts the first token; .tcount({arg}) returns the number of tokens; .right(n, {arg}) returns the rightmost tokens (used to obtain the numeric immediate value).
- Curly braces { } are required when passing token lists to these pseudo-functions so commas/parentheses inside the token list are not treated as assembler argument separators.
- In the example, if the argument begins with # the macro emits immediate loads (lda/ldx with #< and #>), otherwise it assumes an absolute/zero-page 16-bit word in memory and emits lda arg / ldx 1+(arg) (1+(arg) yields the high byte address).

This pattern is useful for writing a single mnemonic (e.g., ldax) that accepts either an immediate 16-bit constant or a memory label holding a 16-bit word.

## Source Code
```asm
.macro  ldax    arg
        .if (.match (.left (1, {arg}), #))
            ; immediate mode
            lda     #<(.right (.tcount ({arg})-1, {arg}))
            ldx     #>(.right (.tcount ({arg})-1, {arg}))
        .else
            ; assume absolute or zero page
            lda     arg
            ldx     1+(arg)
        .endif
.endmacro
```

Usage examples:
```asm
foo:    .word   $5678
...
        ldax    #$1234          ; X=$12, A=$34
...
        ldax    foo             ; X=$56, A=$78
```

## References
- "macro_parameters_and_curly_braces" — token lists and curly braces affect macro/function parameters