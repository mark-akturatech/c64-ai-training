# INX (Increment X register)

**Summary:** INX increments the 6502 X register. Implied addressing, opcode $E8, 1 byte; affects Negative and Zero flags (N, Z).

## Description
INX adds 1 to the 8-bit X register (wraps from $FF → $00). Flags updated:
- Zero (Z): set if result is $00, cleared otherwise.
- Negative (N): set according to bit 7 of the result (1 if negative), cleared otherwise.

Opcode and encoding:
- Mnemonic: INX
- Addressing: Implied
- Opcode: $E8
- Size: 1 byte
- Flags: N, Z

## References
- "iny_instruction" — covers INY (increment Y register), similar behavior and flag effects.

## Mnemonics
- INX
