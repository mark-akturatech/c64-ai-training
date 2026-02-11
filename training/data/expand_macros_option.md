# ca65 -x, --expand-macros

**Summary:** ca65 assembler option -x / --expand-macros causes the listing file to show exactly how macros were expanded (macro expansion trace). Repeat the option twice (-xx) for more verbose macro-expansion output.

## Description
Shows macro expansions in the assembler listing output. When enabled, the listing file contains the expanded text for each macro invocation so you can inspect how arguments and nested macros were resolved. The option has two forms: short (-x) and long (--expand-macros). Supplying the option twice increases verbosity (e.g., -xx for more detailed expansion information).

This option affects only the assembler listing output; it does not change generated object code, symbol files, or other outputs.

## References
- "listing_option" — expands on macro expansion details in assembler listings