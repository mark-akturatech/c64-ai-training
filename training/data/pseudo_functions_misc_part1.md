# ca65 pseudo-functions: .BANKBYTE, .BLANK, .CAP/.CAPABILITY, .CONCAT, .CONST, .DEF/.DEFINED

**Summary:** Descriptions and exact behavior of ca65 pseudo-functions .BANKBYTE (bank byte / bits 16–23, same as '^'), .BLANK (tests presence/absence of an argument), .CAP/.CAPABILITY (test target/CPU feature flags like CPU_HAS_PUSHXY, CPU_HAS_STZ), .CONCAT (string concatenation), .CONST (is expression constant at assembly time?), and .DEF/.DEFINED (is an identifier already defined?). Includes capability identifiers and semantic rules (case-insensitive, comma-separated lists, return semantics).

**.BANKBYTE**
Returns the bank byte (bits 16–23) of its argument. Functionally identical to the '^' operator in ca65 expression syntax.

See also: .HIBYTE, .LOBYTE

**.BLANK**
Builtin function that evaluates its parenthesized argument and yields:
- false (0) if the argument is non-blank (there is at least one token in the argument list),
- true (non-zero) if there is no argument.

Notes on token lists:
- The token list argument may optionally be enclosed in curly braces { } to allow inclusion of tokens that would otherwise terminate the list (for example, a closing parenthesis).
- The curly braces are not considered part of the list.
- A list consisting only of curly braces ({}) is considered empty (blank).

Typical use: replace .IFBLANK with .if .blank({arg})

**.CAP / .CAPABILITY**
Builtin function to check capabilities of the currently selected CPU/target. Call with a comma-separated list of identifiers; the function returns non-zero if and only if all listed capabilities are available, otherwise zero.

Behavioral details:
- Identifiers are compared case-insensitively.
- The function is intended as a higher-level convenience compared to testing .cpu directly.
- Use for conditional assembly when instruction/addressing-mode support varies by CPU/target.

Known capability identifiers and brief meanings:
- CPU_HAS_BITIMM — availability of the "bit #imm" instruction
- CPU_HAS_BRA8 — availability of a short (8-bit) branch
- CPU_HAS_INA — availability of accumulator increment/decrement instructions
- CPU_HAS_PUSHXY — ability to push and pop X and Y registers
- CPU_HAS_ZPIND — availability of zeropage-indirect addressing as in 65SC02
- CPU_HAS_STZ — availability of the "store zero" instruction as in 65SC02

For fine-grained queries about instruction sets use .cpu; .cap is intended as an easier, capability-focused test.

**.CONCAT**
Builtin string function. Concatenates a comma-separated list of string constants and yields a single string constant result. Can be used anywhere a string constant is expected (for example, in .include or other directives that take filenames).

Typical use: build filenames in macros or combine string literals programmatically.

**.CONST**
Builtin function. Evaluates its parenthesized argument and yields true if the argument is a constant expression (i.e., computes to a constant value at assembly time), false otherwise. Useful to test whether an expression can be resolved at assembly time.

**.DEF / .DEFINED**
Builtin function expecting an identifier as its parenthesized argument. The function yields true if the identifier is a symbol that is already defined somewhere earlier in the source file (up to the current assembly position), otherwise false. Equivalent in purpose to .IFDEF in conditional assembly.

**.DEFINEDMACRO**
Builtin function that checks if a macro is defined. Expects a macro name as its parenthesized argument and returns true if the macro is defined, otherwise false. This is particularly useful for preventing multiple inclusions of macro packages.

Example usage:
In this example, the `.macpack generic` directive is only included if the `add` macro is not already defined, preventing redefinition errors. ([retrocomputing.stackexchange.com](https://retrocomputing.stackexchange.com/questions/25232/how-to-avoid-error-when-a-macro-package-is-included-multiple-times-in-ca65-assem?utm_source=openai))

**.HIBYTE**
Returns the high byte (bits 8–15) of its argument. Functionally identical to the '>' operator in ca65 expression syntax.

See also: .LOBYTE, .BANKBYTE

**.LOBYTE**
Returns the low byte (bits 0–7) of its argument. Functionally identical to the '<' operator in ca65 expression syntax.

See also: .HIBYTE, .BANKBYTE

## Source Code

```asm
.if .not .definedmacro(add)
    .macpack generic
.endif
```

```asm
; .BLANK example
.if     .blank({arg})
; (body...)
.endif

; .CAP / .CAPABILITY example
.if     .cap(CPU_HAS_BRA, CPU_HAS_PUSHXY)
        phx
        bra     L1
.else
        txa
        pha
        jmp     L1
.endif

; .CONCAT example
.include        .concat ("myheader", ".", "inc")
; Equivalent to:
.include        "myheader.inc"

; .CONST example
.if     .const(a + 3)
; (body...)
.endif

; .DEF / .DEFINED example
.if     .defined(a)
; (body...)
.endif

; .DEFINEDMACRO example
.if     .not .definedmacro(add)
        .macpack generic
.endif

; .HIBYTE and .LOBYTE examples
lda     #.HIBYTE($1234)  ; Loads #$12
lda     #.LOBYTE($1234)  ; Loads #$34
```

## References
- "pseudo_functions_addrsize_and_bank" — expands on bank-related functions and addressing-size helpers
- "macros_overview" — expands on using .DEFINEDMACRO in macro-aware code
- ca65 Users Guide: Pseudo Functions — provides detailed descriptions of .HIBYTE, .LOBYTE, and other pseudo-functions. ([cc65.github.io](https://cc65.github.io/doc/ca65.html?utm_source=openai))