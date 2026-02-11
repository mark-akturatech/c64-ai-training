# ca65 -l, --listing option

**Summary:** -l name, --listing name — ca65 option to generate an assembler listing file with the provided name; no listing file is produced if assembly terminates with errors.

## Description
-l name, --listing name
Generate an assembler listing with the given name. The option accepts a single filename argument (name). A listing file will never be generated in case of assembly errors.

This option controls only whether a textual listing is emitted and where it is written; formatting and verbosity of the listing are controlled by other options (see References).

## References
- "pagelength_option" — listing page length and formatting options  
- "expand_macros_option" — macro expansion verbosity in listings
