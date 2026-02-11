# ca65 pseudo-functions: .DEFINEDMACRO, .HIBYTE/.LOBYTE, .HIWORD/.LOWORD, .IDENT, .ISMNEMONIC, .LEFT

**Summary:** ca65 assembler pseudo-functions for macro and expression handling: .DEFINEDMACRO (test macro existence), byte/word extraction (.HIBYTE/.LOBYTE/.HIWORD/.LOWORD — equivalents of >/< and high/low-word extraction), .IDENT (convert string to identifier), .ISMNEMONIC/.ISMNEM (test for recognized instruction mnemonic), and .LEFT (token-list substring helper used in macros). Includes usage examples (macro contexts) from the ca65 manual.

## .DEFINEDMACRO
Builtin function. Usage: .DEFINEDMACRO(identifier). Evaluates the identifier and yields true if an assembler macro with that name has already been defined; otherwise yields false. Typical use is to provide fallbacks or alternative code paths depending on whether a macro exists.

See Source Code for a usage example.

## .HIBYTE / .LOBYTE
.HIBYTE returns bits 8–15 (the high byte) of its argument; it is identical to the '>' operator.  
.LOBYTE returns bits 0–7 (the low byte) of its argument; it is identical to the '<' operator.

See also: .BANKBYTE (referenced in source).

## .HIWORD / .LOWORD
.HIWORD returns bits 16–31 (the high word) of its argument.  
.LOWORD returns bits 0–15 (the low word) of its argument.

## .IDENT
.EXPECTS: a string argument. Converts the string into an identifier. If the string starts with the current .LOCALCHAR it produces a local identifier; otherwise it produces a normal (global) identifier.

Typical use: build labels from macro arguments (see Source Code example).

## .ISMNEM / .ISMNEMONIC
Builtin function. Usage: .ISMNEMONIC(identifier) (also seen as .ISMNEM). Evaluates the identifier and yields true if it is defined as an instruction mnemonic recognized by the assembler. Useful for macros that need different behavior when the supplied token is an opcode versus something else.

See Source Code for a usage example.

## .LEFT
Builtin function to extract the leftmost tokens from a token list.

Syntax:
.LEFT (<int expr>, <token list>)

- The first argument is the number of tokens to extract (integer expression).
- The second argument is the token list; it may optionally be enclosed in curly braces to allow tokens that would otherwise terminate the list (for example, a closing parenthesis).

Common macro use: detect if the first token is the immediate-prefix '#' by comparing .LEFT(1, {arg}) to '#', often together with .MATCH. See Source Code example that shows this pattern inside a macro.

See also: .MID and .RIGHT (documented elsewhere in the manual).

## Source Code
```asm
        .macro add foo
                clc
                adc foo
        .endmacro

        .if     .definedmacro(add)
                add #$01
        .else
                clc
                adc #$01
        .endif

        .macro  makelabel       arg1, arg2
                .ident (.concat (arg1, arg2)):
        .endmacro

                makelabel       "foo", "bar"

                .word           foobar          ; Valid label

        .if     .not .ismnemonic(ina)
                .macro ina
                        clc
                        adc #$01
                .endmacro
        .endif

        .macro  ldax    arg
                ...
                .if (.match (.left (1, {arg}), #))

                ; ldax called with immediate operand
                ...

                .endif
                ...
        .endmacro
```

## References
- "expressions_evaluation_and_operators" — expands on corresponding operators and their operator equivalents  
- "macros_overview" — expands on token-list manipulation in macros
