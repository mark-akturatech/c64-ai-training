# Assembler: Symbolic Names for Memory, Registers and Program Locations

**Summary:** Assemblers let you assign symbolic names (labels, EQU constants) to memory addresses, hardware registers, and program locations so source listings use meaningful identifiers instead of raw addresses; this makes assembled listings far more readable than disassemblies, which show addresses only.

**Concept**
An assembler feature permits naming:
- memory locations (data and buffers),
- hardware registers (e.g., named register constants instead of $D020-style literals),
- program locations (labels for branches and subroutines).

Using meaningful names (even if meaningful only to the author) replaces hard-to-read numeric addresses with descriptive identifiers, reducing the cognitive load of remembering long address lists. Named references in the assembled listing show the intent of code and data layout; a disassembly cannot recover those names and thus usually contains only numeric addresses and is much harder to understand.

**Readability vs Disassembly**
- Assembled source with symbol definitions produces listings where labels and EQU constants reveal structure (entry points, variable names, register uses).
- Disassembly shows raw addresses and instruction mnemonics without symbolic context; it is commonly mistaken for the original source but lacks the semantic names that explain program purpose.
- Therefore, keeping comprehensive symbol definitions and complete listings is essential for maintainability and for conveying program structure to others.

## References
- "assembler_benefits_and_branch_resolution" — expands on basic assembler benefits and branch distance calculation  
- "macros_definition_example_and_benefits" — expands on macros as another assembler feature