# Load and Store Group

**Summary:** Group for 6502 load/store mnemonics: LDA, LDX, LDY, STA, STX, STY; covers loading accumulator/index registers from memory and storing them back to memory. See individual instruction chunks for addressing modes and opcodes.

## Description
This group collects the 6502 instructions that move data between memory and the CPU registers:
- Loads: LDA, LDX, LDY — transfer a memory byte to A/X/Y and update processor flags (Negative and Zero).
- Stores: STA, STX, STY — write A/X/Y to memory (stores do not modify processor flags).

Each instruction supports multiple addressing modes (immediate, zero page, absolute, indexed forms, indirect/indirect-index where applicable). Opcode encodings, cycle counts, and per-mode behavior are documented in the individual instruction chunks referenced below.

## References
- "lda_instruction" — expands on LDA addressing modes and opcodes  
- "ldx_instruction" — expands on LDX addressing modes and opcodes  
- "ldy_instruction" — expands on LDY addressing modes and opcodes  
- "sta_instruction" — expands on STA addressing modes and opcodes

## Mnemonics
- LDA
- LDX
- LDY
- STA
- STX
- STY
