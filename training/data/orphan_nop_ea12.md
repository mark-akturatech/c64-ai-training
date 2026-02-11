# Orphan single-byte NOP at $EA12 (ROM disassembly)

**Summary:** Single-byte NOP opcode ($EA) found at ROM address $EA12; marked as an unused/orphan byte immediately before the routine "print_and_store_char_and_colour_at_cursor". No functional effect—likely ROM padding/alignment.

## Details
The disassembly shows a lone NOP (opcode $EA) at absolute address $EA12 with the comment "unused" / "orphan byte". It does not form part of any instruction stream or labelled routine in this snippet and has no functional effect on program flow. The NOP sits immediately before the print/save character routine ("print_and_store_char_and_colour_at_cursor"), so it is likely padding or alignment inserted in the ROM.

(Clarification: $EA is the 6502 single-byte NOP opcode.)

## Source Code
```asm
.,EA12 EA       NOP             unused    ; orphan byte in ROM
```

## References
- "print_and_store_char_and_colour_at_cursor" — routine immediately following this NOP (expand for full context)

## Mnemonics
- NOP
