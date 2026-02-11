# The Accumulator (A)

**Summary:** The 6502 Accumulator (A) is the CPU's primary data register (A); used by load/store and modifying instructions and is the only register with dedicated arithmetic instructions — common mnemonics: LDA, STA, ADC, SBC, AND, ORA, EOR, CMP, ASL (A), LSR (A), ROL (A), ROR (A).

## Description
The Accumulator is the microprocessor's central data register. Machine instructions copy memory into A, copy A into memory, modify A in place, or transfer A to other CPU registers without touching memory. A is the operand for the 6502's arithmetic and many logical operations (see mnemonics above).

## Operations
- Load/Store
  - LDA loads a value into A from memory or immediate operand.
  - STA stores A to a memory location.
- Arithmetic (A is the primary operand)
  - ADC (add with carry), SBC (subtract with carry) — A is both source and destination for results.
- Logical and bitwise
  - AND, ORA, EOR operate on A and set processor flags from the result.
- Compare
  - CMP compares A with a memory operand (affects flags only).
- Shifts and rotates (Accumulator addressing)
  - ASL A, LSR A, ROL A, ROR A operate directly on A (accumulator addressing mode).
- Register transfers (modify other registers directly from A)
  - Examples: TAX, TAY transfer A to X or Y respectively (no memory access).

## References
- "instruction_alphabetic_sequence" — expands on list of instructions that operate on the accumulator

## Mnemonics
- LDA
- STA
- ADC
- SBC
- AND
- ORA
- EOR
- CMP
- ASL
- LSR
- ROL
- ROR
- TAX
- TAY
