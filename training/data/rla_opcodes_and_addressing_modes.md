# NMOS 6510 — RLA (undocumented) opcode summary

**Summary:** RLA (illegal 6502/6510 opcode) performs a memory ROL (rotate-left-through-carry) then ANDs that memory with A (A = A AND {addr}); affects flags C (from ROL), N and Z (from the AND result). Includes opcode bytes, instruction sizes and cycle counts for zp, zp,X, (zp,X), (zp),Y, abs, abs,X, abs,Y addressing modes.

## Operation
RLA = combined ROL (memory) then AND A with that memory. Sequence:

1. Rotate the memory operand left through the carry (ROL {addr}); the bit shifted out becomes the new Carry.
2. Store the rotated value back to memory.
3. A := A AND {rotated memory}
4. Set flags:
   - C = bit shifted out by the ROL (updated by the ROL step)
   - N = bit 7 of the AND result
   - Z = set if AND result == 0
   - V, D, I, B are unaffected

This is functionally equivalent to performing ROL on the effective memory location, then performing AND A,mem (two separate instructions), except it is a single undocumented opcode. (ROL: rotate left through carry; AND: logical AND sets N and Z).

## Source Code
```asm
; Equivalent sequence (conceptual)
; RLA addr  ≈  ROL addr
;               AND A, addr

; Opcode table (addressing mode — bytes — cycles — opcode)
; Note: zero-page and indexed zero-page addressing modes are 2 bytes; absolute modes are 3 bytes.
; Cycle counts shown are typical (page-cross penalty behavior for abs,X/abs,Y: +1 cycle if page crossed).
RLA zp        — 2 bytes — 5 cycles — $27
RLA zp,X      — 2 bytes — 6 cycles — $37
RLA (zp,X)    — 2 bytes — 8 cycles — $23
RLA (zp),Y    — 2 bytes — 8 cycles — $33
RLA abs       — 3 bytes — 6 cycles — $2F
RLA abs,X     — 3 bytes — 7 cycles — $3F
RLA abs,Y     — 3 bytes — 7 cycles — $3B
```

## References
- "rla_operation_flags_and_equivalents" — expands on the combined operation and flag effects for RLA  
- "rla_examples_scrolling_and_addressing_modes" — shows usage examples and optimizations using RLA

## Mnemonics
- RLA
