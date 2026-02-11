# Assembler printout features to compare

**Summary:** Checklist of assembler listing/printout features: sorted symbol table with absolute addresses, macro expansion, data expansion (evaluated values), absolute addresses for all code, and absolute addresses for RAM/register definitions — useful when comparing assembler diagnostics, debugging output, and linkability.

## Overview
When evaluating assemblers for use on 6502/C64 development, compare their listing/printout capabilities. Good printouts make debugging, verification, and cross-tool workflows much faster: they should show final absolute addresses (not just expressions or relative offsets), expand macros and data expressions so the programmer can confirm generated code and constants, and provide a sorted symbol table with resolved addresses for quick lookup.

## Sorted symbol table with absolute addresses
- Definition: a post-assembly table of symbols (labels, equates, constants) sorted (usually alphabetically) with each symbol shown alongside its final absolute address or value as assembled.
- Why it matters: enables fast cross-referencing, helps detect duplicate/undefined symbols, and is required when comparing assembled output to memory dumps or linker map files.
- What to look for:
  - Symbols listed alphabetically (or by address with an option to sort).
  - Final resolved absolute addresses/values (not just expressions or relative locations).
  - Distinction between code/ROM symbols and data/zero-page symbols where applicable.
  - Option to include size/type (code/data/constant) is helpful but not required by this checklist.

## Macro expansion on listings
- Definition: the assembler emits the expanded instructions or directives produced by macros into the listing, showing what source macros generate in place.
- Why it matters: reveals the concrete sequence produced by macros so the programmer can verify calling conventions, register usage, stack depth implications, and embedded constants.
- What to look for:
  - Fully expanded macro body inline in listing, with original macro invocation commented or annotated.
  - Option to show macro nesting/levels or suppress expansion for readability.
  - Ability to correlate expanded lines with source file/line numbers.

## Data expression expansion in listings
- Definition: the assembler prints evaluated values for data directives (e.g., .byte/.db/.word, .ascii, EQU expressions) instead of or in addition to the original expressions.
- Why it matters: confirms immediate values, computed offsets, pointer tables, and padding bytes are as intended; catches arithmetic/precedence errors in expressions.
- What to look for:
  - Each data item shows its assembled numeric value(s) in hex (and optionally decimal).
  - Expressions used to compute data are printed alongside their evaluated results.
  - When data expands into multiple bytes (tables, strings), the listing shows the byte-level output.

## Absolute addresses for all code in listings
- Definition: every assembled instruction in the listing is prefixed with the final absolute memory address it will occupy at runtime (not just a section-relative offset).
- Why it matters: essential for verifying control-flow, branch targets, interrupt vectors, and for correlating with memory dumps and emulators.
- What to look for:
  - Listings show absolute addresses even for relocatable/organizable sections (assembler should resolve ORG/segments).
  - Branch and jump targets are resolved and shown as absolute addresses where possible.
  - Warnings if absolute placement cannot be determined (e.g., unresolved externals or incomplete linking).

## Absolute addresses for RAM registers / I/O
- Definition: assembler resolves and prints absolute addresses when labels or equates refer to RAM locations or memory-mapped I/O registers, rather than leaving symbolic names unresolved in listings.
- Why it matters: confirms that uses of RAM-mapped registers and zero-page locations map to the intended addresses; avoids confusion between symbolic names and actual addresses used in code.
- What to look for:
  - Equates or labels for hardware registers print the resolved numeric address.
  - Listings show load/stores that target register symbols with the concrete address baked into the listing.
  - Clear differentiation between RAM addresses, zero page, and memory-mapped I/O in the symbol output.

## Quick comparison checklist
- Sorted symbol table with absolute addresses: present / absent
- Macro expansion in listing: present / absent / partial
- Data expression expansion (evaluated values): present / absent
- Absolute addresses shown for every instruction: present / absent
- Absolute addresses shown for RAM/I/O register symbols: present / absent

## References
- "assembly_speed_and_printouts_intro" — importance of assembler printouts and speed trade-offs
- "symbol_table_and_sorting" — details on symbol tables and sorting
- "macro_expansion_on_listings" — how macro expansion appears and why it helps debugging
- "data_expression_expansion_listings" — data expansion and printed calculated values
- "absolute_addresses_in_listings" — importance of absolute addresses in printouts