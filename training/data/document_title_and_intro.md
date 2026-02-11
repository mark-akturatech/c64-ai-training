# 6502 Addressing Modes

**Summary:** The MOS 6502 supports multiple addressing modes (e.g., Absolute, Zero Page) that determine how an instruction locates operands in memory; different instructions use different subsets of these modes and some instructions are limited to a single mode.

## Overview
The 6502 implements several addressing modes that change how an instruction specifies its operand (immediate value, memory address, register-relative, etc.). Instructions on the 6502 may accept one or more of these modes; some instructions are valid with many modes, while others are defined for only a single mode. Exact behavior, operand size, and instruction encoding vary by mode.

For detailed descriptions of specific modes, see the referenced chunks below (Absolute and Zero Page are covered in separate documents).

## References
- "absolute_addressing" — expands on the Absolute addressing mode  
- "zero_page_addressing" — expands on the Zero Page addressing mode