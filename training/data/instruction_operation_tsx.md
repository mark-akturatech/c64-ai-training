# TSX — Transfer Stack Pointer to X

**Summary:** TSX transfers the 8-bit stack pointer (S / SP) into the X register and updates the Negative (Sign) and Zero flags based on the result; common 6502 opcode $BA, 1 byte, 2 cycles.

**Operation**

TSX reads the processor's stack pointer (S, an 8-bit register holding the low byte of the stack address), copies that value into the X register, and sets the processor status flags N and Z according to the resulting X value. The stack pointer itself is not changed.

Behavioral details:

- SP is 8-bit (range $00–$FF). On the 6502, the stack page is $01xx; TSX deals only with the low byte.
- The value written into X is the raw 8-bit stack pointer (no sign-extension).
- Only the Negative (N) and Zero (Z) flags are affected. All other status flags (C, V, D, I, B, and unused bit) remain unchanged.

Flag rules:

- Z (Zero): Set if (X == $00); cleared otherwise.
- N (Negative/Sign): Set if bit 7 of X is 1 (X & $80 != 0); cleared otherwise.

## Source Code

```asm
; TSX — Transfer Stack Pointer to X
; Opcode: $BA
; Bytes: 1
; Cycles: 2

        TSX     ; X <- SP ; set N,Z

; Pseudocode
/* TSX */
    unsigned src = SP;
    SET_SIGN(src);
    SET_ZERO(src);
    XR = (src);
```

## References

- "instruction_tables_tsx" — expands the TSX opcode entry (opcode, cycles, addressing, variants)

## Mnemonics
- TSX
