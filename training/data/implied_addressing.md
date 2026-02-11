# Implied Addressing (6502/6510)

**Summary:** Implied addressing in the 6502/6510 microprocessors utilizes single-byte instructions where the operand is inherently specified by the opcode, typically involving internal CPU registers. These instructions are efficient, requiring no additional operand bytes or memory accesses.

**Description**

In implied addressing mode, the instruction's opcode inherently specifies the operation and the operand, which is usually an internal CPU register. This mode does not require additional operand bytes, making the instructions concise and faster to execute. For example, the `TAX` instruction transfers the contents of the accumulator to the X register without needing an explicit operand. Similarly, the `CLC` instruction clears the carry flag directly. The absence of extra operand bytes and memory address calculations results in quicker execution compared to other addressing modes that involve memory access.

## Source Code

```text
; Example of implied addressing instructions

CLC        ; Clear Carry Flag
TAX        ; Transfer Accumulator to X register
DEX        ; Decrement X register
INX        ; Increment X register
NOP        ; No Operation
```

## References

- "instruction_types_6510" — expands on data movement examples using implied addressing

## Mnemonics
- TAX
- CLC
- DEX
- INX
- NOP
