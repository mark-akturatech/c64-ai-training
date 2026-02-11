# ca65 — Number formats and conditional assembly

**Summary:** ca65 accepts hex ($prefix or trailing h), binary (%prefix), and decimal (bare) numeric literals; octal and floating-point literals are not supported. Conditional assembly (.IF/.ELSE/.ENDIF and friends) still tokenizes all input (including unassembled branches), so tokens in skipped branches must be valid assembler tokens.

## Number formats
Accepted literal formats:
- Hexadecimal: leading '$' or trailing 'h' (e.g. $FF or FFh).
- Binary: leading '%' (e.g. %10101010).
- Decimal: bare integer (no prefix/suffix).

Unsupported formats:
- No octal literals.
- No floating-point literals.

## Conditional assembly
- All input is lexically tokenized even inside .IF/.ELSE branches that are not assembled. (tokens = assembler lexical units)
- The assembler tokenizes to be able to find directive terminators such as .ENDIF, so unassembled branches still must contain syntactically valid assembler tokens.
- Consequence: conditional assembly cannot be used to hide arbitrary text (for example, plain comments or non-assembler text) inside unassembled branches to prevent it from being tokenized/parsed.

## References
- "input_format_and_syntax" — expands on tokenization rules and examples
