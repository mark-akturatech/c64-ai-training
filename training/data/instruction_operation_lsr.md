# LSR (Logical Shift Right) — 6502

**Summary:** LSR shifts the operand right one bit, moves bit0 into the Carry flag (C), clears bit7 with a zero fill, updates Zero (Z) and Sign/Negative (N) flags, and writes the result back to the accumulator or memory depending on addressing mode. Searchable terms: LSR, 6502, Carry, Zero, Sign (Negative), accumulator, memory addressing, mnemonic.

## Operation
LSR performs a logical right shift by 1 on an 8-bit operand:

- Save bit0 of the source into the Carry flag (C).
- Shift the source right one bit; bit7 is filled with 0 (logical shift).
- Set the Zero flag (Z) if the result is 0.
- Set the Sign/Negative flag (N) according to the result's bit7 (after the shift) — note: after LSR this will always be 0 because bit7 is filled with 0.
- Store the shifted result back into the accumulator (A) if using the accumulator addressing mode, or into memory at the effective address for memory addressing modes.

Flags affected:
- C (Carry) := original bit0 of operand
- Z (Zero) := 1 if result == 0, else 0
- N (Negative/Sign) := result & 0x80 (will be 0 after LSR)

Addressing modes:
- LSR can operate on the accumulator or on memory (various zero-page/absolute addressing modes). The result is written to the selected destination (accumulator or memory location).

## Source Code
```asm
/* LSR pseudocode (6502) */
    SET_CARRY(src & 0x01);    ; C := bit0 of src
    src >>= 1;                ; logical shift right; bit7 := 0
    SET_SIGN(src);            ; N := src & 0x80 (will be 0)
    SET_ZERO(src);            ; Z := (src == 0)
    STORE src in memory or accumulator depending on addressing mode
```

## References
- "instruction_tables_lsr" — expands on LSR opcodes and addressing modes

## Mnemonics
- LSR
