# 6502/6510 Instruction Set — Alphabetical Mnemonics

**Summary:** Alphabetical list of 6502/6510 mnemonics with concise operation summaries (e.g. ADC, STA, BNE, JSR). Useful for quick lookup of instruction names and their short semantics.

## Instruction Summaries
- ADC — Add Memory to Accumulator with Carry
- AND — AND Memory with Accumulator
- ASL — Arithmetic Shift Left one bit (Memory or Accumulator)

- BCC — Branch on Carry Clear
- BCS — Branch on Carry Set
- BEQ — Branch on Result Zero
- BIT — Test Bits in Memory with Accumulator
- BMI — Branch on Result Minus (negative)
- BNE — Branch on Result not Zero
- BPL — Branch on Result Plus (non-negative)
- BRK — Force Break (software interrupt)
- BVC — Branch on Overflow Clear
- BVS — Branch on Overflow Set

- CLC — Clear Carry Flag
- CLD — Clear Decimal Mode
- CLI — Clear Interrupt Disable Flag
- CLV — Clear Overflow Flag
- CMP — Compare Memory and Accumulator
- CPX — Compare Memory and Index X
- CPY — Compare Memory and Index Y

- DEC — Decrement Memory by One
- DEX — Decrement Index X by One
- DEY — Decrement Index Y by One

- EOR — Exclusive-OR Memory with Accumulator

- INC — Increment Memory by One
- INX — Increment Index X by One
- INY — Increment Index Y by One

- JMP — Jump to New Location
- JSR — Jump to New Location, Saving Return Address

- LDA — Load Accumulator with Memory
- LDX — Load Index X with Memory
- LDY — Load Index Y with Memory
- LSR — Logical Shift Right one bit (Memory or Accumulator)

- NOP — No Operation

- ORA — OR Memory with Accumulator

- PHA — Push Accumulator on Stack
- PHP — Push Processor Status on Stack
- PLA — Pull Accumulator from Stack
- PLP — Pull Processor Status from Stack

- ROL — Rotate One Bit Left (Memory or Accumulator)
- ROR — Rotate One Bit Right (Memory or Accumulator)
- RTI — Return from Interrupt
- RTS — Return from Subroutine

- SBC — Subtract Memory from Accumulator with Borrow (A = A - M - (1-C))
- SEC — Set Carry Flag
- SED — Set Decimal Mode
- SEI — Set Interrupt Disable Flag
- STA — Store Accumulator in Memory
- STX — Store Index X in Memory
- STY — Store Index Y in Memory

- TAX — Transfer Accumulator to Index X
- TAY — Transfer Accumulator to Index Y
- TSX — Transfer Stack Pointer to Index X
- TXA — Transfer Index X to Accumulator
- TXS — Transfer Index X to Stack Pointer
- TYA — Transfer Index Y to Accumulator

## References
- "addressing_modes" — expands on Addressing modes used with many of these instructions
- "programming_model_registers_and_flags" — expands on registers and flags manipulated by the listed instructions (A, X, Y, P, S, PC)

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
