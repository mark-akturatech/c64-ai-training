# ca65 -D option (define symbols on the command line)

**Summary:** The ca65 assembler -D option defines symbols from the command line; a symbol without an explicit value is assigned zero, and values may use the '$' prefix for hexadecimal (may require shell quoting). Use -D to inject compile-time constants into assembly.

## Description
The -D option lets you define assembler symbols when invoking ca65. If the symbol is provided without an explicit value, the assembler defines it with value zero. When supplying a value, the '$' character may be used as a hexadecimal prefix (e.g., $FF); however, on some operating systems or shells '$' has special meaning and the expression may need to be quoted to prevent shell expansion.

## References
- "auto_import_option" — expands on symbol handling differences and auto-imported symbols
