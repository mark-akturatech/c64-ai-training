# ca65: -t option — character translation timing in macros

**Summary:** With ca65's -t option (translate to target character set, e.g. PETSCII), character translation is deferred: .BYTE/.ASCIIZ string data are translated when emitted, while single-character constants are translated when evaluated in expressions. This deferred timing can change behavior inside macros — be careful when comparing character constants against numeric values.

## Character translation timing
When assembling with -t, ca65 converts character literals into the current target character set as late as possible:

- Strings used directly in data directives (.BYTE, .ASCIIZ) are translated at emission time (the assembler emits the bytes in the target character set).
- Single character constants are translated when they are evaluated as part of an expression (for example in arithmetic, comparisons, or when used to form other expressions).

This distinction is usually transparent outside of macros, but macros can delay or rearrange expression evaluation. As a result, comparisons or arithmetic that mix character constants and numeric literals inside macros may compare untranslated (source) codepoints against numeric values, or vice versa, depending on when the macro expands and when translation is applied. Therefore, when writing macros that test or compute with character constants, explicitly account for translation timing (e.g., avoid assuming character constants already match target numeric codes).

## References
- "c_style_macros" — expands on string constants and .DEFINE usage for textual macros
