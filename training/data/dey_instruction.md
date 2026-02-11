# DEY (Decrement Y register)

**Summary:** DEY — Implied addressing, opcode $88, 1 byte. Decrements the Y register and updates the Negative (N) and Zero (Z) flags.

## Description
DEY subtracts one from the processor Y register (Y := Y - 1), wrapping from $00 to $FF on underflow (8-bit arithmetic). After the operation:
- Zero flag (Z) is set if the result is $00, cleared otherwise.
- Negative flag (N) is set to the result's bit 7 (sign bit), cleared otherwise.
- Carry and Overflow flags are not affected.

Implied addressing — no operand bytes follow the opcode. Opcode encoding: $88 (1 byte).

## References
- "dex_instruction" — covers DEX (Decrement X register), the analogous operation for the X register

## Mnemonics
- DEY
