# MACHINE - Compact 6502 / Commodore 64 instruction mnemonic reference

**Summary:** Compact one-line reference of core 6502/C64 instruction mnemonics and short descriptions (ADC, AND, EOR, ORA, SBC, ASL, LSR, ROL, ROR, branches BCC/BCS/BEQ/... , flag control CLC/SEC/SEI/CLD/SED/CLI/CLV, compares CMP/CPX/CPY, INC/DEC/INX/INY/DEX/DEY, BIT, JMP/JSR/RTS/RTI/BRK, loads/stores LDA/LDX/LDY/STA/STX/STY, stack ops PHA/PHP/PLA/PLP, transfers TAX/TAY/TSX/TXA/TXS/TYA, NOP).

## Instruction Reference
This chunk is a compact listing of 6502 instruction mnemonics with single-line descriptions grouped by function (arithmetic/logical, shifts/rotates, branches, flag control, compares, increments/decrements, bit test, jumps/subroutines, loads/stores, stack operations, transfers, and NOP). The exact original listing is provided in the Source Code section below.

## Source Code
```text
ADC  Add Memory to Accumulator with Carry
AND  "AND" Memory with Accumulator
ASL  Shift Left One Bit (Memory or Accumulator)

BCC  Branch on Carry Clear
BCS  Branch on Carry Set
BEQ  Branch on Result Zero
BIT  Test Bits in Memory with Accumulator
BMI  Branch on Result Minus
BNE  Branch on Result not Zero
BPL  Branch on Result Plus
BRK  Force Break
BVC  Branch on Overflow Clear
BVS  Branch on Overflow Set

CLC  Clear Carry Flag
CLD  Clear Decimal Mode
CLI  Clear Interrupt Disable Bit
CLV  Clear Overflow Flag
CMP  Compare Memory and Accumulator
CPX  Compare Memory and Index X
CPY  Compare Memory and Index Y

DEC  Decrement Memory by One
DEX  Decrement Index X by One
DEY  Decrement Index Y by One

EOR  "Exclusive-OR" Memory with Accumulator

INC  Increment Memory by One
INX  Increment Index X by One
INY  Increment Index Y by One

JMP  Jump to New Location
JSR  Jump to New Location Saving Return Address

LDA  Load Accumulator with Memory
LDX  Load Index X with Memory
LDY  Load Index Y with Memory
LSR  Shift One Bit Right (Memory or Accumulator)

NOP  No Operation

ORA  "OR" Memory with Accumulator

PHA  Push Accumulator on Stack
PHP  Push Processor Status on Stack
PLA  Pull Accumulator from Stack
PLP  Pull Processor Status from Stack

ROL  Rotate One Bit Left (Memory or Accumulator)
ROR  Rotate One Bit Right (Memory or Accumulator)
RTI  Return from Interrupt
RTS  Return from Subroutine

SBC  Subtract Memory from Accumulator with Borrow
SEC  Set Carry Flag
SED  Set Decimal Mode
SEI  Set Interrupt Disable Bit
STA  Store Accumulator in Memory
STX  Store Index X in Memory
STY  Store Index Y in Memory

TAX  Transfer Accumulator to Index X
TAY  Transfer Accumulator to Index Y
TSX  Transfer Stack Pointer to Index X
TXA  Transfer Index X to Accumulator
TXS  Transfer Index X to Stack Pointer
TYA  Transfer Index Y to Accumulator
```

## References
- "programming_model_registers_and_flags" — expands on CPU register layout and processor status flags referenced by many instructions (A, X, Y, PC, S, P)

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
