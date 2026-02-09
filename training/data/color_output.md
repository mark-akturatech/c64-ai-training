# ca65 --color option

**Summary:** The --color option for the ca65 assembler controls whether colored diagnostics are emitted; default is "auto", which enables color when output is a terminal (not redirected to a file). Searchable terms: --color, ca65, assembler, diagnostics, auto, terminal.

## Description
This option controls if the assembler will use colors when printing diagnostic messages (errors, warnings, informational output). The documented default behavior is "auto": colors are enabled only when the assembler's output is a terminal device rather than being redirected to a file or pipe.

## Notes
- "auto" behavior: enable color when stdout/stderr are terminals (useful for readable console diagnostics).
- The source text does not enumerate alternative explicit values (e.g., "always"/"never" or "on"/"off"); only "auto" and its behavior are described.

## References
- "verbose_option" — expands on verbosity and diagnostic output options