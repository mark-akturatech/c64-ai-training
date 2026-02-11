# MACHINE — Chapter 5: Addressing Modes (Recap)

**Summary:** Recap of 6502/C64 addressing modes: implied, accumulator, immediate, absolute, zero-page, indexed (absolute/zero-page), relative (branches), indirect (JMP), indirect-indexed ((zp),Y) and indexed-indirect ((zp,X)). Notes the zero-page requirement for indirect vectors and the limited reach of branch displacements.

## Addressing Modes
- Implied
  - No operand/address. Instruction operates on an implicit target or has no data operand (e.g., CLC, RTS).

- Accumulator
  - Operates directly on the A register. No memory address supplied (e.g., ASL A).

- Immediate
  - Operand is a literal value coded in the instruction stream (e.g., LDA #$10). Not an address.

- Absolute
  - A full 16-bit memory address in the instruction — references a single memory location anywhere ($0000–$FFFF). Used for fixed locations.

- Zero Page
  - A single-byte address referencing $0000–$00FF (high byte implicitly $00). Shorter, faster encodings; used for frequently accessed work locations and small tables.

- Absolute, Indexed / Zero-Page, Indexed
  - The base address is adjusted by X or Y to access a range of up to 256 consecutive bytes. Common for table access and temporary storage.

- Relative (Branches)
  - Used only by branch instructions; displacement is an 8-bit signed offset (about ±127 forward/back from the next instruction). The assembler normally computes the correct displacement.

- Indirect (JMP)
  - JMP uses a 16-bit address loaded from a memory vector; useful for variable jump targets and dispatch tables. Indirect addressing for JMP expects the indirect vector to be in zero page (vector address low/high stored in zero page).

- Indirect, Indexed ((zp),Y)
  - A zero-page pointer (two bytes) supplies a base 16-bit address; Y is added to that base to form the final effective address. Highlighted as the most important method for accessing data anywhere in memory; indirect pointer must be in zero page.

- Indexed, Indirect ((zp,X))
  - The operand is a zero-page base which is first added to X, then the resulting zero-page address is read as a vector (low/high) to form the final address. Rare on Commodore but available.

## References
- "addressing_modes_overview" — expands on summary of all modes and tradeoffs
