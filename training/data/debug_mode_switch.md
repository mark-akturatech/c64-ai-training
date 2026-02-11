# ca65 -d, --debug option

**Summary:** ca65 assembler option -d / --debug enables assembler debug mode (internal diagnostics useful for debugging the assembler itself). Not the same as generating program debug information (-g).

## Description
Enables assembler debug mode: the assembler emits internal diagnostics intended to help diagnose or debug the assembler implementation. This mode is intended for developers of ca65 or for deep troubleshooting of the assembler; it is not required for normal assembly of source code.

This option does not generate the debug information used by debuggers for assembled programs (see the -g option and the referenced documentation for debug-info generation).

## References
- "debug_info_option" — expands on debug mode vs. generating debug info with -g