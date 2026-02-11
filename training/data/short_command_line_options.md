# ca65 short command-line options

**Summary:** Short command-line options for ca65 assembler: single-letter flags and their one-line meanings (e.g. -D, -I, -U, -V, -W, -d, -g, -x, -h, -i, -l, -mm, -o, -s, -S, -t, -v). Use these flags to define symbols, set include paths, control debugging/listing, choose memory model and target system, and adjust verbosity/warnings.

## Short options
- -D name[=value] — Define a symbol
- -I dir — Set an include directory search path
- -U — Mark unresolved symbols as import
- -V — Print the assembler version
- -W n — Set warning level n
- -d — Debug mode
- -g — Add debug info to object file
- -x — Expand macros in the listing (repeat -x for full expansion)
- -h — Help (this text)
- -i — Ignore case of symbols
- -l name — Create a listing file if assembly was ok
- -mm model — Set the memory model
- -o name — Name the output file
- -s — Enable smart mode
- -S — Generate segment offsets in listing
- -t sys — Set the target system
- -v — Increase verbosity

## References
- "usage_command_summary" — expands on usage synopsis
- "long_command_line_options" — expands on detailed equivalents