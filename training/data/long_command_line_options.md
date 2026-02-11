# ca65 Users Guide — Long command-line options

**Summary:** List of ca65 long command-line options and short descriptions (examples: --cpu, --include-dir, --debug-info, --create-dep, --warnings-as-errors). Covers options for input/search paths, listing/output, debugging, target/memory configuration, and diagnostic output (color, verbosity).

## Options overview
This chunk enumerates ca65 long-form command-line options and gives a one-line description for each. Options are grouped by purpose:

- Input / include paths:
  - --include-dir, --bin-include-dir — add search paths for assembly includes and binary includes.
- Target / CPU / memory configuration:
  - --cpu, --memory-model, --target, --feature — select CPU type, memory model, target system, or enable emulation features.
- Listing / output files:
  - --listing, --list-bytes, --pagelength, --segment-list — control creation and format of assembly listings.
  - --create-dep, --create-full-dep — write make dependency files.
- Debug / diagnostic:
  - --debug, --debug-info, --expand-macros — enable debug mode, emit debug info in object file, or expand macros in listings (repeat to increase expansion).
- Symbol handling / parsing:
  - --auto-import, --ignore-case, --relax-checks, --smart, --large-alignment — control unresolved-symbol import behavior, case sensitivity, checking strictness, and alignment warnings.
- Diagnostics / UI:
  - --color [on|auto|off], --no-utf8, --verbose, --version, --help — control colored output, UTF-8 use, verbosity, and print version/help.
- Warnings / errors:
  - --warn-align-waste, --warnings-as-errors — report bytes wasted by alignment and optionally treat warnings as errors.

Refer to the Source Code section for the exact option names and the original one-line descriptions.

## Source Code
```text
Long options:
  --auto-import                 Mark unresolved symbols as import
  --bin-include-dir dir         Set a search path for binary includes
  --color [on|auto|off]         Color diagnostics (default: auto)
  --cpu type                    Set cpu type
  --create-dep name             Create a make dependency file
  --create-full-dep name        Create a full make dependency file
  --debug                       Debug mode
  --debug-info                  Add debug info to object file
  --expand-macros               Expand macros in listing
                                Repeat to get full expansion
  --feature name                Set an emulation feature
  --help                        Help (this text)
  --ignore-case                 Ignore case of symbols
  --include-dir dir             Set an include directory search path
  --large-alignment             Don't warn about large alignments
  --listing name                Create a listing file if assembly was ok
  --list-bytes n                Maximum number of bytes per listing line
  --memory-model model          Set the memory model
  --no-utf8                     Disable use of UTF-8 in diagnostics
  --pagelength n                Set the page length for the listing
  --relax-checks                Relax some checks (see docs)
  --segment-list                Generate segment offsets in listing
  --smart                       Enable smart mode
  --target sys                  Set the target system
  --verbose                     Increase verbosity
  --version                     Print the assembler version
  --warn-align-waste            Print bytes "wasted" for alignment
  --warnings-as-errors          Treat warnings as errors
---------------------------------------------------------------------------

---
Additional information can be found by searching:
- "short_command_line_options" which expands on short option equivalents
- "detailed_command_line_options" which expands on full option descriptions
```

## References
- "short_command_line_options" — short-option equivalents and mappings
- "detailed_command_line_options" — expanded, full descriptions of each option