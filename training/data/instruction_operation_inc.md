# 6502 INC (Increment Memory)

**Summary:** INC increments an 8-bit memory operand (wraps at $FF → $00), updates the Sign (N) and Zero (Z) flags, and stores the result back to memory. It does not affect the Carry (C) or Overflow (V) flags.

## Operation
INC reads an 8-bit value from memory, adds 1 modulo 256, sets condition flags based on the resulting 8-bit value, and writes the new value back to the same memory location. This is a memory-operation instruction (not the accumulator).

Behavioral steps:
- Read byte from address.
- Compute (value + 1) & $FF (wraps 8-bit).
- Set Zero flag if result == 0.
- Set Sign (Negative) flag from bit 7 of the result.
- Store result back to the same address.
- Flags unaffected: Carry (C) and Overflow (V).

## Flags
- N (Negative / Sign): Set from bit 7 of the result (1 => N=1).
- Z (Zero): Set if result == 0.
- C (Carry): Not affected.
- V (Overflow): Not affected.

## Source Code
```asm
/* INC (pseudocode) */
    src = (src + 1) & 0xff;
    SET_SIGN(src);      ; set N from bit 7 of src
    SET_ZERO(src);      ; set Z if src == 0
    STORE(address, src);
```

## References
- "instruction_tables_inc" — expands on INC opcodes and addressing modes.

## Mnemonics
- INC
