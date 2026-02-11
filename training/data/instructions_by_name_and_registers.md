# 6502 Instruction Set — Mnemonics and CPU Registers

**Summary:** List of 6502 instruction mnemonics (ADC, LDA, STA, JSR, RTS, BRK, RTI, etc.) with one-line descriptions and a brief CPU registers summary (PC, A/Accumulator, X, Y, SR, SP). Searchable terms: mnemonics, ADC, LDA, STA, JSR, RTS, BRK, RTI, PC, Accumulator, SR (status register), SP (stack pointer).

**Instruction Mnemonics**
ADC — add with carry  
AND — and (with accumulator)  
ASL — arithmetic shift left  
BCC — branch on carry clear  
BCS — branch on carry set  
BEQ — branch on equal (zero set)  
BIT — bit test  
BMI — branch on minus (negative set)  
BNE — branch on not equal (zero clear)  
BPL — branch on plus (negative clear)  
BRK — break / interrupt  
BVC — branch on overflow clear  
BVS — branch on overflow set  
CLC — clear carry  
CLD — clear decimal  
CLI — clear interrupt disable  
CLV — clear overflow  
CMP — compare (with accumulator)  
CPX — compare with X  
CPY — compare with Y  
DEC — decrement  
DEX — decrement X  
DEY — decrement Y  
EOR — exclusive or (with accumulator)  
INC — increment  
INX — increment X  
INY — increment Y  
JMP — jump  
JSR — jump subroutine  
LDA — load accumulator  
LDX — load X  
LDY — load Y  
LSR — logical shift right  
NOP — no operation  
ORA — or with accumulator  
PHA — push accumulator  
PHP — push processor status (SR)  
PLA — pull accumulator  
PLP — pull processor status (SR)  
ROL — rotate left  
ROR — rotate right  
RTI — return from interrupt  
RTS — return from subroutine  
SBC — subtract with carry  
SEC — set carry  
SED — set decimal  
SEI — set interrupt disable  
STA — store accumulator  
STX — store X  
STY — store Y  
TAX — transfer accumulator to X  
TAY — transfer accumulator to Y  
TSX — transfer stack pointer to X  
TXA — transfer X to accumulator  
TXS — transfer X to stack pointer  
TYA — transfer Y to accumulator

**Registers**
- **PC (Program Counter):** 16-bit register that points to the next instruction to be executed.
- **A (Accumulator):** 8-bit register used for arithmetic and logic operations.
- **X (Index Register X):** 8-bit register used for indexed addressing and loop counters.
- **Y (Index Register Y):** 8-bit register used for indexed addressing and loop counters.
- **SR (Status Register):** 8-bit register containing processor status flags:
  - **N (Negative):** Set if the result of the last operation was negative.
  - **V (Overflow):** Set if the last operation resulted in a signed overflow.
  - **B (Break):** Set when a BRK instruction is executed.
  - **D (Decimal):** Set to enable Binary-Coded Decimal (BCD) mode for arithmetic operations.
  - **I (Interrupt Disable):** Set to disable maskable interrupts.
  - **Z (Zero):** Set if the result of the last operation was zero.
  - **C (Carry):** Set if the last operation resulted in a carry out or borrow into the high bit.
- **SP (Stack Pointer):** 8-bit register that points to the current position in the stack, which is fixed in page 1 of memory ($0100–$01FF).

## Source Code
```text
+------------------+------------------+------------------+
|                  |                  |                  |
|    Control       |    Instruction   |    Addressing    |
|    Logic         |    Decoder       |    Logic         |
|                  |                  |                  |
+------------------+------------------+------------------+
|                  |                  |                  |
|    Accumulator   |    X Register    |    Y Register    |
|    (A)           |    (X)           |    (Y)           |
|                  |                  |                  |
+------------------+------------------+------------------+
|                  |                  |                  |
|    Arithmetic    |    Stack Pointer |    Status        |
|    Logic Unit    |    (SP)          |    Register (SR) |
|    (ALU)         |                  |                  |
|                  |                  |                  |
+------------------+------------------+------------------+
|                  |                  |                  |
|    Program       |    Data Bus      |    Address Bus   |
|    Counter (PC)  |                  |                  |
|                  |                  |                  |
+------------------+------------------+------------------+
```
*Block diagram of the NMOS 6502 CPU.*

## References
- "status_register_and_flags" — expands on status register flags and meanings  
- "address_modes_details" — expands on addressing modes referenced by instruction forms

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
