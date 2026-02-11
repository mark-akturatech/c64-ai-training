# NMOS 6510 vs 65C02: ADC in Decimal Mode — Z flag difference

**Summary:** Demonstrates how ADC in decimal (BCD) mode sets the Zero (Z) flag differently on NMOS 6502/6510 vs CMOS 65C02 using the instruction sequence SED/CLC/LDA/ADC/CLD; useful to distinguish CPU variants by observing Z after a decimal ADC.

## Behavior
Run this sequence with decimal mode enabled (SED) and carry clear (CLC). Using the example operands below, the accumulator ends up with the same visible value on both CPUs, but the Z flag differs:

- Sequence: SED; CLC; LDA #$50; ADC #$50; CLD
- Decimal interpretation: 0x50 + 0x50 -> 50 + 50 = 100 decimal -> accumulator 0x00, carry set
- Binary intermediate: 0x50 + 0x50 = 0xA0 (non-zero)

Difference:
- NMOS 6502 / 6510: Z is set from the binary (pre-adjustment) result, so Z = 0 (cleared), even though the post-adjusted decimal result in A is 0x00.
- CMOS 65C02: Z is set from the final (decimal-adjusted) accumulator value, so Z = 1 (set) when A becomes 0x00.

This behavior is a commonly-used diagnostic: observing Z after the example ADC distinguishes NMOS (Z clear) from CMOS 65C02 (Z set).

## Source Code
```asm
        ; Example: demonstrates Z flag difference in decimal ADC
        SED         ; set decimal mode
        CLC         ; clear carry
        LDA #$50    ; A = $50 (50 decimal)
        ADC #$50    ; add $50 in decimal mode
        CLD         ; clear decimal mode (cleanup)

; Expected observable state:
; A == $00  (both NMOS and 65C02)
; Carry == 1 (both)
; NMOS 6502/6510: Z == 0  ; Z based on binary intermediate (0xA0)
; 65C02 (CMOS):     Z == 1  ; Z based on decimal-adjusted result (0x00)
```

## References
- "adc_instruction_decimal_mode" — Z flag handling in decimal mode

## Mnemonics
- ADC
