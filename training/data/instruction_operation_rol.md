# 6502 ROL (Rotate Left)

**Summary:** ROL rotates an 8-bit operand left through the processor Carry flag: old bit7 -> Carry, old Carry -> bit0. Affects Carry, Negative (Sign), and Zero flags; result is stored in the accumulator or in memory depending on addressing mode.

**Operation**
ROL shifts the source byte one bit toward the high bit, inserts the current processor Carry into bit0, and sets the Carry from the bit shifted out (old bit7). After masking to 8 bits, the Negative (Sign) and Zero flags are updated from the final 8-bit result. The instruction operates on either the accumulator or a memory location depending on addressing mode.

Flag effects:
- C (Carry) = old bit7 of the source (the bit shifted out).
- N (Negative/Sign) = bit7 of the result after the rotation.
- Z (Zero) = set if the 8-bit result == 0.
- V (Overflow) = unaffected.

Behavior summary (conceptual):
- Take source (accumulator or memory).
- Shift left by one.
- Insert current Carry into bit0.
- Set Carry to the value that was shifted out (> 0xFF before masking).
- Mask to 8 bits and write back result.
- Update Sign (N) from bit7 and Zero (Z) if result == 0.

**Addressing Modes, Opcodes, and Cycle Counts**

| Addressing Mode | Opcode | Bytes | Cycles |
|-----------------|--------|-------|--------|
| Accumulator     | $2A    | 1     | 2      |
| Zero Page       | $26    | 2     | 5      |
| Zero Page,X     | $36    | 2     | 6      |
| Absolute        | $2E    | 3     | 6      |
| Absolute,X      | $3E    | 3     | 7      |

**Example 6502 Assembly Encodings and Usage**


## Source Code

```assembly
; Rotate the accumulator left
ROL A        ; Opcode: $2A

; Rotate the value at zero page address $10 left
ROL $10      ; Opcode: $26 10

; Rotate the value at zero page address $10 plus X register left
ROL $10,X    ; Opcode: $36 10

; Rotate the value at absolute address $1234 left
ROL $1234    ; Opcode: $2E 34 12

; Rotate the value at absolute address $1234 plus X register left
ROL $1234,X  ; Opcode: $3E 34 12
```

```text
/* ROL pseudocode */
    src <<= 1;
    if (IF_CARRY()) src |= 0x1;
    SET_CARRY(src > 0xff);
    src &= 0xff;
    SET_SIGN(src);
    SET_ZERO(src);
    STORE src in memory or accumulator depending on addressing mode.
```

## References
- "instruction_tables_rol" — expands on ROL opcodes and modes (opcode bytes and cycle counts)

## Mnemonics
- ROL
