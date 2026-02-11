# 6502 Register Transfer Group (TAX, TAY, TXA, TYA)

**Summary:** Group header for 6502 register-transfer instructions TAX, TAY, TXA, and TYA — implied-mode transfers between A, X, and Y registers; commonly affect the Negative (N) and Zero (Z) processor status flags.

**Overview**
This group contains the four 6502 instructions that move data between the accumulator (A) and the X/Y index registers:

- **TAX** — Transfer A to X (implied addressing).
- **TAY** — Transfer A to Y (implied addressing).
- **TXA** — Transfer X to A (implied addressing).
- **TYA** — Transfer Y to A (implied addressing).

These instructions copy the full 8-bit value from the source register to the destination register without accessing memory. They are single-byte, implied-mode instructions (no operand bytes).

**Behavior Notes**
- Transfers are a simple register copy; the source register remains unchanged.
- These instructions update the Negative (N) and Zero (Z) flags based on the value transferred to the destination register:
  - **N flag**: Set if the most significant bit (bit 7) of the result is 1; cleared if it is 0.
  - **Z flag**: Set if the result is 0; cleared otherwise.
- They do not affect the Carry (C), Overflow (V), Decimal (D), or Interrupt (I) flags.

**Instruction Details**

| Instruction | Opcode | Cycles | N Flag | Z Flag |
|-------------|--------|--------|--------|--------|
| **TAX**     | $AA    | 2      | Set if bit 7 of X is 1; cleared if 0 | Set if X is 0; cleared otherwise |
| **TAY**     | $A8    | 2      | Set if bit 7 of Y is 1; cleared if 0 | Set if Y is 0; cleared otherwise |
| **TXA**     | $8A    | 2      | Set if bit 7 of A is 1; cleared if 0 | Set if A is 0; cleared otherwise |
| **TYA**     | $98    | 2      | Set if bit 7 of A is 1; cleared if 0 | Set if A is 0; cleared otherwise |

**Assembly Examples**


In these examples:
- After `TAX` and `TXA`, the N and Z flags are updated based on the value in the destination register.
- The same applies to `TAY` and `TYA`.

## Source Code

```assembly
; Example 1: Transfer A to X and back to A
LDA #$0F    ; Load A with immediate value $0F
TAX         ; Transfer A to X
INX         ; Increment X (X = $10)
TXA         ; Transfer X back to A (A = $10)

; Example 2: Transfer A to Y and back to A
LDA #$80    ; Load A with immediate value $80
TAY         ; Transfer A to Y
INY         ; Increment Y (Y = $81)
TYA         ; Transfer Y back to A (A = $81)
```


## Key Registers
- **A**: Accumulator
- **X**: X Index Register
- **Y**: Y Index Register

## References
- [6502 Instruction Set](https://www.masswerk.at/6502/6502_instruction_set.html)
- [6502 Instruction Tables](https://www.masswerk.at/6502/instruction-tables/)
- [6502 Reference](https://www.nesdev.org/obelisk-6502-guide/reference.html)

## Mnemonics
- TAX
- TAY
- TXA
- TYA
