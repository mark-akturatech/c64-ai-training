# Porting Commodore Macro Assembler Listings to Other Assemblers

**Summary:** Enumerates the assembler commands that may differ from other assemblers and advises that most differences are limited to syntax; many assemblers include a translator to convert Commodore Macro Assembler syntax so listings on the distribution disk require few manual edits.

## Porting notes
- The original listings use Commodore Macro Assembler syntax. The provided list (not included here) contains all commands that are likely to differ between assemblers.
- With that list you can read the program listings and make the necessary syntax changes to assemble them with a different assembler.
- Many assembler packages include a conversion/translation utility that converts Commodore Macro Assembler syntax into the assembler’s native syntax; when available, these utilities minimize manual edits.
- Expect only a small set of differences (pseudo-opcode names, directive formats, or operand syntax); use the translator if present, otherwise edit the few differing commands by hand.

## References
- "using_an_assembler_overview" — expands on overall guidance for adapting the book's examples to other assemblers.
- "pseudo_opcode_dbyte_directive" — expands on example directives and pseudo-opcodes that may need syntax changes.