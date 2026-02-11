# 6502 Addition Principles

**Summary:** 6502 addition uses ADC (adds memory + carry into A); clear carry with CLC before an addition sequence; ADC sets C on unsigned overflow (carry-out) and sets V on two's‑complement (signed) overflow; use BCS to detect unsigned overflow and BVS to detect signed overflow. Example addresses: $0380, $0381, $0382.

## Principles
- Always start multi-instruction addition sequences with CLC so ADC does not include a stale carry.
- ADC adds the memory operand plus the processor carry flag into the accumulator: A := A + M + C_in.
- The C flag is set when an unsigned carry-out from the most significant bit (MSB) occurs — use BCS for unsigned overflow detection.
- The V (overflow) flag is set when two's‑complement signed overflow occurs (MSB sign inconsistency) — use BVS for signed overflow detection.
- For multi-byte (multi‑word) adds, add the low-order byte first, store result, then add the high-order byte using ADC so the carry from the low byte propagates into the high byte.
- Subtraction is analogous but uses SEC before SBC to set the incoming carry (see referenced subtraction chunk).

## Source Code
```asm
; Single-byte addition: result = $0380 + $0381 -> $0382
; Flags after ADC:
;   C set => unsigned overflow (carry-out)
;   V set => signed two's-complement overflow
        LDA $0380       ; A = low_operand
        CLC              ; clear carry before addition
        ADC $0381       ; A = A + other + C_in (0)
        STA $0382       ; store result

        BCS UnsignedOverflow   ; branch if unsigned overflow (C=1)
        BVS SignedOverflow     ; branch if signed overflow (V=1)
        ; ... continue for normal result

; Two-byte (16-bit) addition:
; operand1: $0380 (low), $0381 (high)
; operand2: $0382 (low), $0383 (high)
; result  : $0384 (low), $0385 (high)
        CLC              ; important: clear carry before starting
        LDA $0380        ; low byte of operand1
        ADC $0382        ; add low byte of operand2 + C_in (0)
        STA $0384        ; store low result

        LDA $0381        ; high byte of operand1
        ADC $0383        ; add high byte of operand2 + carry from low
        STA $0385        ; store high result

        BCS UnsignedOverflow16   ; unsigned carry-out from MSB (16-bit)
        BVS SignedOverflow16     ; signed overflow for 16-bit (V indicates signed overflow)
```

## References
- "signed_vs_unsigned_numbers" — differences and when to use V vs C to detect overflow
- "subtraction_and_multi_byte_subtraction" — subtraction rules (SEC before SBC) and multi-byte subtraction generalization

## Mnemonics
- ADC
