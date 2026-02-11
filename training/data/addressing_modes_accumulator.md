# 6502: Accumulator Addressing — LSR (Opcode $4A)

**Summary:** Accumulator addressing operates directly on the A register with no operand bytes; LSR (logical shift right) in accumulator form is opcode $4A (one byte, 2 cycles) and shifts A right one bit, moving bit0 into Carry.

## Accumulator addressing overview
Accumulator addressing means the instruction reads and writes only the accumulator (A). No operand bytes follow the opcode; the instruction encoding is a single byte. Assemblers may accept "LSR" or "LSR A" to indicate the accumulator form.

LSR (accumulator) behavior (6502):
- Operation: A := A >> 1 (logical shift right)
- Carry (C): receives the old bit0 of A
- Bit7 of A after the shift is set to 0
- Negative (N): set from bit7 of the result (always 0 for LSR)
- Zero (Z): set if result == 0
- Overflow (V): cleared to 0
- Instruction size: 1 byte
- Cycles: 2

Binary/bit-level summary:
- Old A bits: b7 b6 b5 b4 b3 b2 b1 b0
- After LSR: 0 b7 b6 b5 b4 b3 b2 b1
- C ← b0

## Source Code
```asm
; LSR accumulator — single-byte encoding
; Opcode: $4A, Size: 1, Cycles: 2

        .byte $4A          ; machine code for LSR A

; Example: A = %0000_0011 (3)
        LSR               ; opcode $4A
; Result: A = %0000_0001 (1), C = 1, Z = 0, N = 0, V = 0

; LSR opcode table (standard 6502 forms)
; mnemonic    addressing      opcode  bytes cycles
; LSR         Accumulator     $4A     1     2
; LSR         Zero Page       $46     2     5
; LSR         Zero Page,X     $56     2     6
; LSR         Absolute        $4E     3     6
; LSR         Absolute,X      $5E     3     7
```

## References
- "instruction_tables_lsr" — expanded forms and timings for LSR (zero page, absolute, X-indexed)

## Mnemonics
- LSR
