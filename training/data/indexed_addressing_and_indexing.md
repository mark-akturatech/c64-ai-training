# Indexing (6510)

**Summary:** Indexing creates an actual address by adding the X or Y index register to a base address (e.g. LDA $9000,X → $9000 + X). Covers absolute indexed, zero page indexed, indirect-indexed (indirect), and indexed-indirect addressing with mnemonic syntax using ,X or ,Y on the 6510/6502 family.

## Indexing
Indexing is the process of forming a memory address by adding the contents of an index register (X or Y) to a base address supplied in an instruction.

- Basic rule: effective_address = base_address + (X or Y).
  - Example: if X = $05 then LDA $9000,X loads from $9000 + $05 = $9005.
- Mnemonic syntax: append ",X" or ",Y" to the operand (same syntax as absolute forms).
  - Example: LDA $9000,X

Addressing mode variants:
- Absolute indexed
  - A full 16-bit base address is supplied; X or Y is added to that base.
  - Mnemonics: LDA $1234,X or LDA $1234,Y
- Zero page indexed
  - Base address lies in zero page (addresses $00-$FF); X or Y is added to that byte (zero-page wrap behavior implied).
  - Mnemonics: LDA $80,X or LDA $80,Y
- Indirect-indexed (indirect), commonly written (addr),Y
  - The operand is a zero-page address whose 16-bit pointer is fetched; Y is added to the fetched pointer to form the final address.
  - Mnemonic: LDA ($20),Y
- Indexed-indirect, commonly written (addr,X)
  - The operand is a zero-page base; X is added to that byte to form a zero-page pointer which is read as a 16-bit address for the final access.
  - Mnemonic: LDA ($20,X)

(“Zero page” = $0000–$00FF)

## References
- "addressing_mode_zero_page" — expands on Zero page relevant to zero-page indexed modes
- "indirect_indexed_mode" — expands on detailed indirect-indexed (Y) example
- "indexed_indirect_mode" — expands on detailed indexed-indirect (X) example