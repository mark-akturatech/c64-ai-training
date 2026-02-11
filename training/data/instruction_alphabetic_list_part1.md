# MACHINE - Alphabetical List of 6502 Instructions

**Summary:** Provides an alphabetical list of 6502 instruction mnemonics along with brief descriptions of their functions.

**Overview**

This document presents concise definitions of several 6502 addressing modes and an alphabetical listing of 6502 instruction mnemonics with their corresponding descriptions.

**Addressing Modes**

**Indexed Absolute Addressing (Absolute,X and Absolute,Y):**
- The effective 16-bit address is formed by adding the contents of the X (Absolute,X) or Y (Absolute,Y) register to the 16-bit base address specified in the instruction. This mode allows for efficient access to sequential data structures.

**Implied Addressing:**
- The operand is implicitly specified by the opcode; no additional operand bytes are required.

**Relative Addressing:**
- Used exclusively by branch instructions. The operand is an 8-bit signed offset (-128 to +127) added to the program counter, determining the branch target address.

**Indexed Indirect Addressing (Indirect,X):**
- The zero-page address specified in the instruction is offset by the X register. The resulting address points to a two-byte memory location containing the effective address.

**Indirect Indexed Addressing (Indirect,Y):**
- The zero-page address specified in the instruction points to a two-byte memory location. The Y register is added to the value retrieved from this location to form the effective address.

**Absolute Indirect (JMP (addr)):**
- The instruction specifies a 16-bit address pointing to another 16-bit address in memory. The program counter is set to this second address.

**Instruction List (Alphabetical)**

- **ADC (Add with Carry):** Adds the contents of a memory location to the accumulator with the carry bit.
- **AND (Logical AND):** Performs a bitwise AND between the accumulator and a memory location.
- **ASL (Arithmetic Shift Left):** Shifts all bits in the accumulator or a memory location one position to the left.
- **BCC (Branch if Carry Clear):** Branches to a specified address if the carry flag is clear.
- **BCS (Branch if Carry Set):** Branches to a specified address if the carry flag is set.
- **BEQ (Branch if Equal):** Branches to a specified address if the zero flag is set.
- **BIT (Bit Test):** Tests specified bits in a memory location against the accumulator.
- **BMI (Branch if Minus):** Branches to a specified address if the negative flag is set.
- **BNE (Branch if Not Equal):** Branches to a specified address if the zero flag is clear.
- **BPL (Branch if Positive):** Branches to a specified address if the negative flag is clear.
- **BRK (Break):** Forces the processor to execute a software interrupt.
- **BVC (Branch if Overflow Clear):** Branches to a specified address if the overflow flag is clear.
- **BVS (Branch if Overflow Set):** Branches to a specified address if the overflow flag is set.
- **CLC (Clear Carry Flag):** Clears the carry flag.
- **CLD (Clear Decimal Mode):** Clears the decimal mode flag.
- **CLI (Clear Interrupt Disable):** Clears the interrupt disable flag.
- **CLV (Clear Overflow Flag):** Clears the overflow flag.
- **CMP (Compare Accumulator):** Compares the accumulator with a memory location.
- **CPX (Compare X Register):** Compares the X register with a memory location.
- **CPY (Compare Y Register):** Compares the Y register with a memory location.
- **DEC (Decrement Memory):** Decrements the value in a memory location by one.
- **DEX (Decrement X Register):** Decrements the X register by one.
- **DEY (Decrement Y Register):** Decrements the Y register by one.
- **EOR (Exclusive OR):** Performs a bitwise exclusive OR between the accumulator and a memory location.
- **INC (Increment Memory):** Increments the value in a memory location by one.
- **INX (Increment X Register):** Increments the X register by one.
- **INY (Increment Y Register):** Increments the Y register by one.
- **JMP (Jump):** Sets the program counter to a specified address.
- **JSR (Jump to Subroutine):** Pushes the address of the next instruction onto the stack and sets the program counter to a specified address.
- **LDA (Load Accumulator):** Loads a value from memory into the accumulator.
- **LDX (Load X Register):** Loads a value from memory into the X register.
- **LDY (Load Y Register):** Loads a value from memory into the Y register.
- **LSR (Logical Shift Right):** Shifts all bits in the accumulator or a memory location one position to the right.
- **NOP (No Operation):** Performs no operation.
- **ORA (Logical Inclusive OR):** Performs a bitwise OR between the accumulator and a memory location.
- **PHA (Push Accumulator):** Pushes the accumulator onto the stack.
- **PHP (Push Processor Status):** Pushes the processor status register onto the stack.
- **PLA (Pull Accumulator):** Pulls the top value from the stack into the accumulator.
- **PLP (Pull Processor Status):** Pulls the top value from the stack into the processor status register.
- **ROL (Rotate Left):** Rotates all bits in the accumulator or a memory location one position to the left through the carry flag.
- **ROR (Rotate Right):** Rotates all bits in the accumulator or a memory location one position to the right through the carry flag.
- **RTI (Return from Interrupt):** Returns from an interrupt by pulling the processor status and program counter from the stack.
- **RTS (Return from Subroutine):** Returns from a subroutine by pulling the program counter from the stack.
- **SBC (Subtract with Carry):** Subtracts the contents of a memory location from the accumulator with the carry bit.
- **SEC (Set Carry Flag):** Sets the carry flag.
- **SED (Set Decimal Flag):** Sets the decimal mode flag.
- **SEI (Set Interrupt Disable):** Sets the interrupt disable flag.
- **STA (Store Accumulator):** Stores the contents of the accumulator into a memory location.
- **STX (Store X Register):** Stores the contents of the X register into a memory location.
- **STY (Store Y Register):** Stores the contents of the Y register into a memory location.
- **TAX (Transfer Accumulator to X):** Copies the contents of the accumulator into the X register.
- **TAY (Transfer Accumulator to Y):** Copies the contents of the accumulator into the Y register.
- **TSX (Transfer Stack Pointer to X):** Copies the contents of the stack pointer into the X register.
- **TXA (Transfer X to Accumulator):** Copies the contents of the X register into the accumulator.
- **TXS (Transfer X to Stack Pointer):** Copies the contents of the X register into the stack pointer.
- **TYA (Transfer Y to Accumulator):** Copies the contents of the Y register into the accumulator.

## References

- "6502 Instruction Set" — Detailed descriptions of 6502 instructions and addressing modes.

## Mnemonics
- ADC
- AND
- ASL
- BCC
- BCS
- BEQ
- BIT
- BMI
- BNE
- BPL
- BRK
- BVC
- BVS
- CLC
- CLD
- CLI
- CLV
- CMP
- CPX
- CPY
- DEC
- DEX
- DEY
- EOR
- INC
- INX
- INY
- JMP
- JSR
- LDA
- LDX
- LDY
- LSR
- NOP
- ORA
- PHA
- PHP
- PLA
- PLP
- ROL
- ROR
- RTI
- RTS
- SBC
- SEC
- SED
- SEI
- STA
- STX
- STY
- TAX
- TAY
- TSX
- TXA
- TXS
- TYA
