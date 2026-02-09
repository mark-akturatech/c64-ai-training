# Zero Page Addressing (6502 / C64)

**Summary:** Zero page addressing is a 6502/C64 addressing mode that assumes the high-order byte is $00 so addresses are $0000–$00FF; it uses a single-byte operand (low byte only) in instructions and is a special, faster addressing mode.

## Zero Page Addressing
Absolute addresses on the 6502 are two bytes: a high-order (page) byte and a low-order byte. The high-order byte denotes the memory page (for example, $1637 is in page $16; $0277 is in page $02).

Zero page addressing is the mode that targets page $00 only. Instructions that use zero page addressing supply just a single byte (the low-order byte); the processor implicitly assumes the high-order byte is $00. Therefore zero page addressing can reference addresses in the range $0000–$00FF. Because the operand is one byte instead of two, zero page forms are encoded more compactly and are treated as a special (generally faster) addressing mode.

## References
- "machine_code_and_registers_overview" — Zero page is part of the memory map and interacts with registers
- "indexed_addressing_and_indexing" — Zero page also has indexed variants