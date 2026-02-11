# LDX — 6502 Load X Register (SET_SIGN / SET_ZERO)

**Summary:** 6502 LDX loads an 8-bit operand into the X register (XR), updates the Negative (Sign) and Zero flags according to the result, and leaves all other status flags unchanged. Supported addressing modes: immediate, zero page, zero page,Y, absolute, absolute,Y.

## Operation
LDX performs these effects (pseudocode-level):

- Compute result = (src) & $FF  ; operand treated as 8-bit
- XR = result                 ; store into X register
- SET_ZERO(result)            ; Z = 1 if result == 0, else 0
- SET_SIGN(result)            ; N = bit7 of result

Flags:
- Affected: Negative (N) ← bit7(result), Zero (Z) ← (result == 0)
- Unaffected: Carry (C), Overflow (V), Decimal (D), Interrupt Disable (I), Break (B)

Notes:
- X is an 8-bit register; result is truncated to low 8 bits.
- Addressing modes determine operand fetch timing and byte count; see Source Code table for opcodes and cycle counts. For absolute,Y (BE) an extra cycle occurs if a page boundary is crossed.

## Source Code
```asm
; Pseudocode
; LDX
;    SET_SIGN(src);
;    SET_ZERO(src);
;    XR = (src);

; Definitions (reference)
; SET_ZERO(v)  -> Z = 1 if (v & $FF) == 0 else 0
; SET_SIGN(v)  -> N = 1 if (v & $80) != 0 else 0

; Opcode / addressing mode reference for LDX (6502)
; Opcode  Mode         Bytes  Cycles  Notes
A2  ; Immediate    ; 2 bytes ; 2 cycles    ; LDX #imm
A6  ; Zero Page    ; 2 bytes ; 3 cycles    ; LDX zp
B6  ; Zero Page,Y  ; 2 bytes ; 4 cycles    ; LDX zp,Y
AE  ; Absolute     ; 3 bytes ; 4 cycles    ; LDX abs
BE  ; Absolute,Y   ; 3 bytes ; 4 cycles (+1 if page crossed) ; LDX abs,Y
```

## References
- "instruction_tables_ldx" — expands on LDX opcodes and detailed cycle/addressing tables

## Mnemonics
- LDX
