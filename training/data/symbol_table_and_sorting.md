# Symbol table (assembler listings)

**Summary:** A symbol table is an assembler-generated list of symbol names and their corresponding addresses; printable symbol tables aid verification and navigation. For usefulness the listing must present resolved absolute addresses and is best sorted alphabetically.

## What a symbol table is
A symbol table is produced by an assembler and records every symbol (labels, equates, etc.) used in the program alongside the address the symbol represents. It is a compact index of program locations and named constants that the assembler resolved during assembly.

## Why a printed symbol table is useful
- Verification: A printout lets you confirm the assembler resolved symbols correctly and placed code/data where expected.  
- Navigation: The table provides a quick reference to any location used by the program without scanning raw listings or source.  
- Debugging: When stepping through code or inspecting memory, the table maps human-readable names to addresses so you can correlate behavior with source.

## Requirements for a useful listing
- Resolved absolute addresses: The assembler must print final, absolute addresses (not internal/relocatable placeholders or unresolved forward references). If the listing contains only symbol names and the assembler's internal address representations, the printout is generally useless.  
- Alphabetical sorting: Sorting the table alphabetically before printing makes lookups fast and predictable; unsorted lists are harder to use as an index.  
- Completeness: All symbols that the source expects to exist (labels, equates, external references once resolved) should appear with their final addresses.

## References
- "printout_items_and_what_to_look_for" — expands on symbol table as a key printout item  
- "absolute_addresses_in_listings" — expands on importance of resolved absolute addresses throughout listings