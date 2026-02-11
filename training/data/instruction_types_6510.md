# 6510 Instruction Classes

**Summary:** Describes the four 6510 instruction classes used on the C64 / 6502 family: Data movement (loads, stores, transfers and addressing modes), Arithmetic (ADC, SBC, logical ops, shifts/rotates), Testing (CMP and other nondestructive tests that set STATUS flags), and Flow of control (conditional branches, JMP, JSR).

**Instruction Types**
There are four classes of instructions in the 6510:

- **Data movement**  
  Data movement instructions load a byte from memory, store a byte to memory, or transfer a value between registers. Addressing modes determine which memory byte is accessed; for example, LDA (load accumulator) supports eight addressing modes to select the source byte (immediate, zero page, zero page,X, absolute, absolute,X, absolute,Y, (indirect,X), (indirect),Y). Transfers between registers (e.g., between A, X, Y, and the stack pointer) are part of this class.

- **Arithmetic**  
  Arithmetic instructions modify data: addition and subtraction (ADC, SBC), logical operations (AND, ORA, EOR), and bit-manipulation instructions such as shifts and rotates (ASL, LSR, ROL, ROR). Most arithmetic instructions accept the same addressing modes available to data movement instructions.

- **Testing**  
  Testing instructions perform nondestructive comparisons and bit tests that affect the STATUS register without changing the tested operand. For example, CMP compares the contents of the ACCUMULATOR to a memory value; the ACCUMULATOR is unchanged, but STATUS flags are set as if the memory value had been subtracted from A (affecting N, Z, and C). Test instructions are typically used to set up branching decisions.

- **Flow of control**  
  Flow-control includes conditional branches and unconditional jumps/subroutines. Conditional branch instructions check a single STATUS bit (for example, BEQ checks Z, BNE checks Z, BCS checks C, BCC checks C, BMI/BPL check N, etc.) and either branch to the target operand or continue with the next sequential instruction. JMP and JSR are absolute (unconditional) transfer-of-control instructions that do not test STATUS bits before transferring execution.

## References
- "addressing_modes_overview" — expands on addressing modes available to instructions  
- "implied_addressing" — examples of implied data movement instructions and transfers (e.g., register transfers)

## Mnemonics
- LDA
- ADC
- SBC
- AND
- ORA
- EOR
- ASL
- LSR
- ROL
- ROR
- CMP
- BEQ
- BNE
- BCS
- BCC
- BMI
- BPL
- JMP
- JSR
