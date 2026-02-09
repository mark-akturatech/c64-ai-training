# ANC (undocumented) — NMOS 6510 ($0B / $2B) and ALR (ASR) — NMOS 6510 ($4B)

**Summary:** ANC (aka ANC2, ANA, ANB) immediate undocumented opcode ($0B / $2B) performs AND A,#imm then sets the Carry flag to bit 7 of the result (i.e., C <- N as if an ASL/ROL had been executed). ALR (aka ASR) immediate opcode ($4B) performs AND A,#imm then LSR A (A = (A & #imm) >> 1). Both are 2-byte, 2-cycle undocumented instructions on NMOS 6510.

## ANC — behavior and effects
- Operation: A := A & #imm; then C := bit7(A) (i.e. Carry set to the same value as the Negative flag would be after the AND).
- Opcode bytes: $0B and $2B (both documented in some NMOS variations as ANC/ANA variants).
- Size: 2 bytes. Cycles: 2.
- Flag effects:
  - A updated as per AND #imm (bits cleared where #imm has 0).
  - N set according to bit7 of A (standard AND behavior).
  - Z set if A == 0 (standard AND behavior).
  - C set to bit7 of A (i.e., C <- N after the AND).
  - V, D, I, B are not affected beyond what AND would do (no reliable change to V).
- Equivalent conceptual sequence: AND #imm ; set C := bit7(A) (equivalent to AND #imm followed by a hypothetical ROL/ASL that sets C like N — ROL/ASL are not actually executed).
- Practical notes from source (preserved exactly):
  - ANC can replace AND when you need a guaranteed carry state after the operation, saving cycles compared with an explicit CLC/SEC.
  - ANC #$0 clears carry when the immediate has bit7=0; ANC #0 sets A to #$00 and clears carry.
  - ANC #$FF can be used to copy the current A bit7 into the Carry without otherwise changing A (i.e., remember the high bit).

## ALR (ASR) — behavior and effects
- Operation: A := (A & #imm) >> 1 (AND with immediate, then logical shift right).
- Opcode: $4B
- Size: 2 bytes. Cycles: 2.
- Semantics: performs AND #imm then LSR A — therefore effects on flags match the combined effect of those two operations:
  - C is set to bit0 of (A & #imm) before the shift.
  - Z is set if the shifted result is zero.
  - N is set according to bit7 of the result (for LSR the high bit is shifted in as 0, so N will be 0).
  - Other flags behave as they would for the sequence AND #imm; LSR A.
- Equivalent conceptual sequence: AND #imm ; LSR A.

## Examples (descriptions)
- Enforcing carry state before ADC:
  - LDA value
  - ANC #$0F  ; imm has bit7=0 → Carry cleared (no CLC needed)
  - ADC value2
  - STA result
- Setting A to zero and clearing carry in one instruction:
  - ANC #$00 ; A becomes #$00, Carry cleared
- Remembering the high bit (non-destructively to other registers):
  - ANC #$FF ; copies A bit7 into Carry (A unchanged)
  - (CMP #$80 is an alternative that also non-destructively sets Carry to reflect high bit)

## Source Code
```asm
; ANC examples (bytes shown)
; ANC #$AA  -> opcode bytes: 2B AA
        .byte $2B, $AA         ; ANC #$AA  ; A := A & $AA ; C := bit7(A)

; Enforce cleared Carry using ANC instead of CLC
        LDA value
        .byte $2B, $0F         ; ANC #$0F  ; imm bit7=0 ⇒ C cleared
        ADC value2
        STA result

; Set A to zero and clear carry in one instruction
        .byte $2B, $00         ; ANC #$00  ; A := 0 ; C := 0

; Remember highest bit of A into Carry without changing A
        .byte $2B, $FF         ; ANC #$FF  ; A := A & $FF (unchanged) ; C := bit7(A)

; ALR example (bytes)
; ALR #$nn -> opcode bytes: 4B nn
        .byte $4B, $7F         ; ALR #$7F  ; A := (A & $7F) >> 1 ; C := bit0(A & $7F)
```

## References
- "Lorenz-2.15/ancb.prg" — test code implementing/validating ANC behavior
- "arr_opcode_and_behavior" — related ARR/combined opcodes and flag behaviors (ARR is another combined AND+rotate opcode)