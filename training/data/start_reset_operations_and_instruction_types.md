# 6502 Instruction Set — Transfers, Stack, Inc/Dec, Arithmetic, Logic, Shifts, Comparisons, BIT, Branches

**Summary:** Concise reference for 6502 instruction groups: transfer instructions (LDA/LDX/LDY/STA/STX/STY/TAX/TAY/TSX/TXA/TXS/TYA), stack operations (PHA/PHP/PLA/PLP with SP semantics), increment/decrement group (DEC/DEX/DEY/INC/INX/INY), arithmetic (ADC/SBC) and logical (AND/EOR/ORA), shifts/rotates (ASL/LSR/ROL/ROR preserves shifted-out bit in Carry), flag set/clear instructions, CMP/CPX/CPY semantics, BIT behavior, and conditional branch rules (relative 8-bit offsets).

## Transfer instructions
- Load/store and register transfers move values without affecting memory or altering the source register (except STA/STX/STY which write memory).
- Typical mnemonics: LDA, LDX, LDY, STA, STX, STY, TAX, TAY, TSX, TXA, TXS, TYA.
- Transfer instructions set processor flags as specified by the instruction (loads affect Z and N; transfers between registers follow standard behavior per opcode).

## Stack instructions and stack behavior
- PHA / PHP — push accumulator / push processor status: push sequence decrements the stack pointer (SP) then stores the byte at ($0100 + SP).
- PLA / PLP — pull accumulator / pull processor status: pull sequence increments SP then loads the byte from ($0100 + SP).
- Stack grows downward in page $01; push: SP ← SP − 1, memory[ $0100 + SP ] ← value; pull: SP ← SP + 1, value ← memory[ $0100 + SP ].
- Pulling PLP restores the full processor status byte (except the unused/reserved bit behavior per implementation).

## Decrement / Increment group
- DEC / DEX / DEY — decrement memory or register by 1 (DEC affects memory; DEX/DEY affect registers). Result sets Z and N flags.
- INC / INX / INY — increment memory or register by 1 (INC affects memory; INX/INY affect registers). Result sets Z and N flags.

## Arithmetic and logical operations
- ADC (Add with Carry) and SBC (Subtract with Carry) perform addition/subtraction including the Carry flag; ADC/SBC interact with C and V flags and are affected by Decimal Flag (D) when BCD mode is enabled.
- Logical operations operate on the accumulator and set flags:
  - AND — bitwise AND (accumulator & operand)
  - EOR — bitwise exclusive OR
  - ORA — bitwise inclusive OR
- For full ADC/SBC multi-byte and decimal behavior, see the arithmetic primer (referenced).

## Shift & Rotate instructions
- All shift/rotate instructions preserve the bit shifted out in the Carry flag.
  - ASL — arithmetic shift left: shifts bits left, bit0 filled with 0, MSB shifted into Carry.
  - LSR — logical shift right: shifts bits right, MSB filled with 0, LSB shifted into Carry.
  - ROL — rotate left through Carry: Carry shifts into bit0, MSB shifts into Carry.
  - ROR — rotate right through Carry: Carry shifts into MSB, LSB shifts into Carry.
- These instructions set Z and N (N from result's MSB where applicable) and update C with the shifted-out bit.

## Flag instructions
- CLC — Clear Carry (C ← 0)
- SEC — Set Carry (C ← 1)
- CLI — Clear Interrupt Disable (I ← 0)
- SEI — Set Interrupt Disable (I ← 1)
- CLD — Clear Decimal Mode (D ← 0) — disables BCD decimal arithmetic
- SED — Set Decimal Mode (D ← 1) — enables BCD decimal arithmetic (affects ADC/SBC)
- CLV — Clear Overflow (V ← 0)

## Comparisons (CMP/CPX/CPY)
- CMP / CPX / CPY perform a subtraction of the operand from the register (Register − Operand) to set flags, but do not change the register contents.
- Flags are set as in a subtraction; useful relation mapping:
  - Register < Operand → Z = 0, C = 0, N = sign bit of result
  - Register = Operand → Z = 1, C = 1, N = 0
  - Register > Operand → Z = 0, C = 1, N = sign bit of result
- Use branch instructions to test these flags for control flow.

## BIT (Bit Test)
- BIT performs A AND M (accumulator & memory) and sets Zero according to that result (Z = 1 if result == 0).
- Additionally, BIT copies bit 7 of the memory operand to the Negative flag (N ← M7) and bit 6 to the Overflow flag (V ← M6).
- The accumulator is not modified.

## Conditional branch instructions
- Branch targets are relative, signed 8-bit offsets (one-byte operand). Assemblers generally compute offsets from labels; branches encode PC-relative displacement from the next instruction address.
- Common branches and conditions:
  - BCC — Branch if Carry Clear (C = 0)
  - BCS — Branch if Carry Set (C = 1)
  - BEQ — Branch if Equal (Z = 1)
  - BNE — Branch if Not Equal (Z = 0)
  - BMI — Branch if Minus (N = 1)
  - BPL — Branch if Plus (N = 0)
  - (Also: BVC/BVS — Branch on Overflow Clear/Set; included in the full instruction set)

## References
- "shift_and_rotate_instructions" — expanded opcode forms and addressing modes for ASL/LSR/ROL/ROR
- "arithmetic_instructions_primer" — detailed ADC/SBC primer including multi-byte arithmetic and Decimal (BCD) mode effects

## Mnemonics
- LDA
- LDX
- LDY
- STA
- STX
- STY
- TAX
- TAY
- TSX
- TXA
- TXS
- TYA
- PHA
- PHP
- PLA
- PLP
- DEC
- DEX
- DEY
- INC
- INX
- INY
- ADC
- SBC
- AND
- EOR
- ORA
- ASL
- LSR
- ROL
- ROR
- CLC
- SEC
- CLI
- SEI
- CLD
- SED
- CLV
- CMP
- CPX
- CPY
- BIT
- BCC
- BCS
- BEQ
- BNE
- BMI
- BPL
- BVC
- BVS
