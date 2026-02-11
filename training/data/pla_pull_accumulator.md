# PLA — Pull accumulator from stack

**Summary:** PLA (opcode $68) pulls a byte from the hardware stack ($0100–$01FF) into the accumulator A. Implied addressing, 1 byte, 4 cycles; affects flags N and Z (set from the loaded value), other flags unchanged.

## Operation
PLA pops the top byte from the CPU stack into the accumulator.

- Addressing: Implied
- Opcode: $68
- Size: 1 byte
- Cycles: 4
- Operation: A ← (stack)
- Flags affected: N (bit 7 of A), Z (A == 0). C, I, D, V are unaffected.
- Stack behavior: The 6502 stack resides at $0100–$01FF. PLA increments the stack pointer (S) and reads the byte from $0100 + S (the pulled value) into A.

## Source Code
```asm
; Example: save A to stack, change A, then restore with PLA
        LDA #$42      ; A = $42        ; A9 42
        PHA           ; push A         ; 48
        LDA #$00      ; A = $00        ; A9 00
        PLA           ; pull A <- $42  ; 68
        RTS

; Raw bytes for the sequence above:
; A9 42 48 A9 00 68 60

; Minimal stand-alone listing showing opcode:
        PLA           ; opcode $68, 1 byte, 4 cycles
```

## Key Registers
- $0100-$01FF - Stack page used by PLA/stack operations (addressed as $0100 + S)

## References
- "pha_push_accumulator" — PHA (push accumulator) counterpart that pushes A
- "plp_pull_processor_status" — PLP (pull processor status) related stack pull instruction

## Mnemonics
- PLA
