# 6502 Instruction Addressing Modes and Related Execution Times (clock cycles)

**Summary:** Per-addressing-mode cycle counts for 6502 instructions, including zero page/absolute/indexed/indirect/relative modes, plus notes on page-crossing (+1 cycle) and branch penalties (taken +1, crossing page +1). Tables use column-letter headings (see References for mnemonic mapping).

**Description**
This chunk contains the classic 6502 instruction timing tables: rows are addressing modes (Accumulator, Immediate, Zero Page, Zero Page,X, Zero Page,Y, Absolute, Absolute,X, Absolute,Y, Implied, Relative, (Indirect,X), (Indirect),Y, Absolute Indirect) and columns are grouped by instruction (indicated by letter headers). Footnotes indicate timing exceptions:

- * : Add one cycle if indexing crosses a page boundary.
- **: For branches: add one cycle if branch is taken; add one additional cycle if the branch crosses a page boundary.

The column-letter to mnemonic mapping is not included here (see References). Use the tables in Source Code for exact per-mode cycle counts.

## Source Code
