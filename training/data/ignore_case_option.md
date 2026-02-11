# ca65: -i, --ignore-case

**Summary:** The -i, --ignore-case assembler option makes ca65 case-insensitive for identifiers and labels, overriding the assembler default; the setting can be overridden inside source by the .CASE control command.

## Description
The -i (or --ignore-case) command-line option causes the ca65 assembler to treat identifiers and labels without case significance. When supplied, it overrides the assembler's default case behavior. If a source file contains a .CASE control command, that directive takes precedence and can re-enable case sensitivity or otherwise change case handling for the following assembly.

## References
- "define_symbol_option" — expands on case sensitivity implications for command-line defined symbols
