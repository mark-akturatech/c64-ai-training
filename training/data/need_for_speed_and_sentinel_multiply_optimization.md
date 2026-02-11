# 6502 One-Byte Multiply — Sentinel-bit / Carry-loop Optimization

**Summary:** One-byte multiply that uses a sentinel bit ($80) and the processor carry flag for loop control to eliminate DEY-based counting and reduce cycles (saves ~14 cycles). Uses instructions: LDA/STA, ASL, LSR, BCC, CLC, ADC, ROR; assumes RESULT in zero page for additional savings and preserves Y.

## Description
This routine multiplies a one-byte NUM1 by a one-byte NUM2 producing a 16-bit RESULT (RESULT low byte and RESULT+1 high byte). It introduces a sentinel-bit technique: preload a sentinel ($80) into the RESULT low byte so the loop can detect completion by the sentinel falling into the carry flag. The carry flag replaces use of the Y register as a loop counter, removing DEY from the loop and saving cycles.

Key behavioral notes preserved from the source:
- Sentinel value: $80 written into RESULT (low byte).
- A is initialized by shifting $80 left (ASL A) so A becomes 0; later rotations use the carry to propagate bits into the high byte.
- The loop shifts NUM2 right (LSR NUM2) to test its low bit; if set, NUM1 is added into the accumulator with ADC NUM1 (after CLC).
- After the conditional add, the code performs ROR A then ROR RESULT to "stairstep" shift the accumulating result through the two bytes.
- The loop ends when the sentinel bit has been rotated into the carry; BCC L1 tests that condition.
- Finally STA RESULT+1 stores the final high byte (A) into RESULT+1.
- Assumes RESULT is in zero page for additional cycle/addressing savings.
- Y register is not modified by this routine (preserved).

This micro-optimization reduces instruction count in the hot loop and yields an approximate 14-cycle saving over the comparable DEY-based implementation.

## Source Code
```asm
; One-byte multiply using sentinel bit and carry-loop
; Assumes: RESULT is in zero page; NUM1 and NUM2 are operand bytes
; Produces 16-bit RESULT (RESULT = NUM1 * NUM2)

        LDA #$80         ; Preload sentinel bit into RESULT (low byte)
        STA RESULT
        ASL A            ; Initialize RESULT high byte to 0 (A becomes 0)
L1      LSR NUM2         ; Get low bit of NUM2
        BCC L2            ; If bit=0 skip add
        CLC               ; Prepare for add
        ADC NUM1          ; Add NUM1 into A (accumulate)
L2      ROR A             ; Rotate carry into A (stairstep)
        ROR RESULT        ; Rotate A's carry into RESULT low byte
        BCC L1            ; When sentinel falls into carry, done
        STA RESULT+1      ; Store final high byte
```

## References
- "one_byte_multiplication_routine" — expands on the original routine being optimized
- "remove_clc_trick" — expands on further micro-optimization to remove CLC
