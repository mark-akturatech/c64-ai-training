# 6502 ADDRESSING MODES — Indirect addressing

**Summary:** Indirect addressing (pointer) — the operand is an address that points to a memory location which itself contains the address of the data item; used by instructions such as JMP (aaaa) and zero-page indirect variants (see references).

## Indirect addressing
The operand is the address of a memory location which contains the address of the data item (a pointer).  
This instruction will load the data item 44 into the accumulator register.  

(Note: "pointer" = address containing the low/high bytes of the target address.)

## References
- "indirect_absolute_addressing" — expands on JMP (aaaa) indirect variant  
- "indexed_indirect_x" — expands on zero-page indirect variants
