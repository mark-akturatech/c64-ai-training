# ca65 -U, --auto-import (.AUTOIMPORT)

**Summary:** The ca65 assembler option -U / --auto-import (and the .AUTOIMPORT directive) marks symbols not defined in the assembled sources as imported symbols (external symbols resolved at link time). It defers undefined-symbol errors until the linker and should be used with care.

## Description
-U / --auto-import causes any symbol that is referenced but not defined in the assembled sources to be treated as an imported symbol (external symbol resolved at link time). Instead of reporting undefined-symbol errors during assembly, the assembler emits references that the linker must resolve. This delays error detection (for example, typos in symbol names) until link time.

The ca65-based compiler enables the equivalent behavior for runtime library symbols (via .AUTOIMPORT). The compiler is intended to produce assembly that assembles cleanly without relying on auto-import behavior, but assembler authors may sometimes rely on auto-import and encounter surprising link-time errors.

## Usage
- Command-line: -U, --auto-import
- Assembler directive: .AUTOIMPORT (used internally by the compiler)

## References
- "define_symbol_option" — expands on command-line symbol definitions vs. auto-imported symbols
- "warning_level_option" — expands on warning levels and unused/imported symbol diagnostics