# Assembler data-definition features (tables, byte order, text storage)

**Summary:** Describes assembler support for defining named data areas and tables, numeric expressions, one- and two‑byte values with selectable high/low byte order, and text storage options such as setting the high bit (bit 7) to mark string ends. Also states the basic requirement that an assembler accept assembly language commands.

## Data areas and named tables
- Assemblers must provide a mechanism to define data areas and to create tables of data that the assembler stores and references by name.
- Tables and data blocks should be addressable by symbol names so code can reference them (labels for data storage).

## Numeric data: expressions, sizes, and byte order
- A good assembler allows data to be defined using mathematical expressions (constant arithmetic evaluated at assemble time).
- Data should be definable as one-byte (8-bit) or two-byte (16-bit) values.
- For two-byte values the assembler should provide an option to specify whether the high byte or the low byte is emitted first (choice of byte order).

## Text storage options
- Assemblers commonly offer options for storing text (string data) in data areas for later printing.
- One option is to store characters with the high bit set (bit 7 = 1) on the final character of a string so the end of the string can be found by testing the high bit (useful for simple string terminators).

## Assembler command requirement
- The assembler must accept and assemble assembly language commands (mnemonics, directives, labels) — this is the fundamental purpose of the tool.

## Source Code
(omitted — no code listings or register maps provided in source)

## Key Registers
- (none)

## References
- "code_reuse_and_library_practices" — reuse practices and where to store commonly used routines