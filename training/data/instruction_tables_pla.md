# PLA — Pull Accumulator from Stack (opcode $68)

**Summary:** PLA (opcode $68) is an implied 6502 instruction that pops one byte from the hardware stack (page $01), stores it into the accumulator A, and updates the N and Z flags. Size: 1 byte; Timing: 4 cycles.

## Operation
PLA pulls a byte from the stack into A. The stack pointer (S) is incremented, the byte at address (0x0100 + S) is transferred to A, and the processor status flags N (negative) and Z (zero) are updated based on the resulting A. The C, I, D, and V flags are not affected.

Behavior summary:
- Addressing: implied (stack)
- Opcode: $68
- Bytes: 1
- Cycles: 4
- Flags affected: N (set from bit 7 of A), Z (set if A == 0). C, I, D, V unchanged.

Execution sequence (conceptual):
- S ← S + 1
- A ← M[0x0100 + S]
- Z ← (A == 0)
- N ← (A & 0x80) != 0

## Source Code
```asm
; Opcode summary
; Addressing Mode | Assembly | Opcode | Bytes | Cycles
; Implied         | PLA      | $68    | 1     | 4

; Pseudocode implementation (conceptual)
PLA:
    ; Increment stack pointer then read from stack page $01
    S = (S + 1) & $FF
    A = M[$0100 + S]
    P.Z = (A == 0)
    P.N = (A & $80) != 0
    return
```

## References
- "instruction_operation_pla" — expanded pseudocode and timing details

## Mnemonics
- PLA
