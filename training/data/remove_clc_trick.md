# 6502 Sentinel Multiply — remove CLC from the loop

**Summary:** 6502 multiply optimization using a sentinel bit and pre-decrement (DEC) of NUM1 to eliminate an in-loop CLC (saves ~2 cycles per 1-bit in NUM2). Uses instructions LDA/STA/ASL/DEC/LSR/ADC/ROR/STA and a sentinel in RESULT; break-even when NUM2 has ≥3 one-bits (DEC zpg = 5 cycles).

**Description**
This is a micro-optimization for a bitwise multiply routine on the 6502 that removes a CLC from the inner loop by:

- Preloading a sentinel bit (0x80) into the low byte of RESULT.
- Using ASL A to set the accumulator to 0 and set the processor carry to 1.
- Decrementing NUM1 once (DEC NUM1).
- Replacing the normal CLC/ADC pair inside the loop with a single ADC NUM1. Because NUM1 was decremented and the carry was left set, ADC effectively adds the original NUM1 (NUM1-1 + carry(1) == NUM1).
- Using ROR A and ROR RESULT as a two-byte right-rotate to "stairstep" the 16-bit RESULT, and detecting loop termination when the sentinel bit is rotated off into the carry.

Effect:
- Removes one CLC instruction per iteration (CLC = 2 cycles on 6502), so you save ~2 cycles for each 1-bit set in NUM2 (each time the ADC would have been executed).
- The initial DEC NUM1 costs 5 cycles if NUM1 is in zero page (DEC zpg = 5 cycles). Therefore, the optimization is a net win when NUM2 contains at least three 1-bits (3 * 2 = 6 > 5). If DEC is not zero-page (absolute), DEC takes 6 cycles; break-even remains 3 one-bits (3 * 2 = 6).

Notes/behavioral details preserved from the source:
- The routine modifies NUM1 (it is decremented). The loop termination condition is driven by the sentinel falling into the carry during the ROR sequence.
- The algorithm relies on leaving the carry set before the first ADC; ASL A after loading #$80 accomplishes that by producing A=0 and Carry=1.
- The sentinel (initially bit7 set in RESULT low byte) provides a simple termination detection without checking NUM2 for zero explicitly.

## Source Code
```asm
; Compact form (original brief listing)
LDA #$80
STA RESULT
ASL A
DEC NUM1
loop    LSR NUM2
        BCC L2
        ADC NUM1
L2      ROR A
        ROR RESULT
        BCC loop
        STA RESULT+1

; Commented/annotated variant
        LDA #$80     ; Preload sentinel bit into RESULT low byte
        STA RESULT
        ASL A        ; Initialize RESULT hi byte to 0 (A <- 0), set C=1
        DEC NUM1     ; Pre-decrement NUM1 so ADC NUM1 adds original NUM1
L1      LSR NUM2     ; Shift low bit of NUM2 into carry
        BCC L2       ; If low bit was 0, skip add
        ADC NUM1     ; If low bit was 1, add (NUM1-1) + carry(1) => adds NUM1
L2      ROR A        ; Rotate high byte right through carry (handles ADC carry)
        ROR RESULT   ; Rotate low byte right through carry (stairstep)
        BCC L1       ; Continue while sentinel not yet rotated off into carry
        STA RESULT+1 ; Store final high byte from A
```

(Instructions assumed zero-page addressing for NUM1/NUM2/RESULT in the source cycle-cost discussion.)

## References
- "need_for_speed_and_sentinel_multiply_optimization" — expands on sentinel optimization and variations
