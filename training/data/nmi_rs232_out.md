# NMI RS232 OUT (KERNAL FF07-FF42)

**Summary:** Prepares CIA#2 timer B and internal flags for RS232 output during NMI by loading non-standard BPS bytes ($0295/$0296) into CIA timer B ($DD06/$DD07), setting CIA control B ($DD0F), toggling ENABL ($02A1), initializing BITNUM into BITC1 ($A8), and contains helper routines (FF2E/FF34) that scale timing and store BAUDOF ($0299/$029A).

## Operation
This KERNAL NMI entry sequence prepares timing and control for bit-serial RS232 transmission:

- FF07-FF12: Load the non-standard BPS timing bytes from $0295 (low) and $0296 (high) and write them into CIA#2 Timer B low/high ($DD06/$DD07).
- FF13-FF15: Load #$11 into A and store to CIA#2 control register B ($DD0F) — configures CIA#2 control B for timer B operation.
- FF18-FF1D: Load #$12, EOR with the byte at $02A1, and store the result back to $02A1. This toggles selected enable bits in the ENABL word (RS232 enables).
- FF20-FF27: Load #$FF into A and write $FF to CIA#2 Timer B low/high ($DD06/$DD07). (Code writes timer bytes a second time with $FF.)
- FF28-FF2B: Load the bit-count value from $0298 into X and store X into $A8 (BITC1) — this initializes the remaining-bit counter for the RS232 byte being sent.
- FF2D: RTS returns to caller (end of setup).

Helper routines:
- FF2E-FF40: A short helper sequence (entered at FF2E or FF34) that uses $0296 and the caller-provided register values to compute/store BAUDOF:
  - The routine manipulates/rotates $0296 and the processor registers, performs additions, and writes the results to $0299/$029A (BAUDOF low/high). This is the scaling step used to produce the final baud/timer offset used by timing code (see rs232_timing_table_ntsc for presets).

Notes:
- Addresses $0295/$0296/$0298/$0299/$029A/$02A1 are KERNAL/RAM variables (BAUD presets, bit count, BAUDOF, ENABL flags).
- CIA#2 registers are at the $DD00 page: $DD06/$DD07 = Timer B low/high, $DD0F = Control register B.
- The sequence both loads a computed BPS into the CIA timer and then writes $FF to the timer bytes again — this behavior is preserved as in the listing.

## Source Code
```asm
.,FF07 AD 95 02 LDA $0295       ; M51AJB - non standard BPS time (low)
.,FF0A 8D 06 DD STA $DD06       ; CIA#2 Timer B low
.,FF0D AD 96 02 LDA $0296       ; non standard BPS time (high)
.,FF10 8D 07 DD STA $DD07       ; CIA#2 Timer B high
.,FF13 A9 11    LDA #$11
.,FF15 8D 0F DD STA $DD0F       ; CIA#2 Control Register B
.,FF18 A9 12    LDA #$12
.,FF1A 4D A1 02 EOR $02A1
.,FF1D 8D A1 02 STA $02A1       ; ENABL, RS232 enables (toggle)
.,FF20 A9 FF    LDA #$FF
.,FF22 8D 06 DD STA $DD06
.,FF25 8D 07 DD STA $DD07       ; CIA#2 Timer B set to $FFFF
.,FF28 AE 98 02 LDX $0298       ; BITNUM, number of bits still to send
.,FF2B 86 A8    STX $A8         ; BITC1, RS232 bitcount
.,FF2D 60       RTS

; Helper / scaling routines (scale timing values into BAUDOF)
.,FF2E AA       TAX
.,FF2F AD 96 02 LDA $0296
.,FF32 2A       ROL
.,FF33 A8       TAY
.,FF34 8A       TXA
.,FF35 69 C8    ADC #$C8
.,FF37 8D 99 02 STA $0299       ; BAUDOF low
.,FF3A 98       TYA
.,FF3B 69 00    ADC #$00
.,FF3D 8D 9A 02 STA $029A       ; BAUDOF high
.,FF40 60       RTS
.,FF41 EA       NOP
.,FF42 EA       NOP
```

## Key Registers
- $DD06-$DD07 - CIA-II - Timer B low/high (used to generate RS232 bit timing)
- $DD0F - CIA-II - Control register B (controls Timer B start/stop/mode)
- $0295-$0296 - KERNAL/RAM - Non-standard BPS timing bytes (low/high)
- $0298 - KERNAL/RAM - BITNUM (number of bits to send for the byte)
- $02A1 - KERNAL/RAM - ENABL flags (RS232 enables; toggled via EOR)
- $0299-$029A - KERNAL/RAM - BAUDOF low/high (computed baud/timer offset)
- $00A8 ($A8) - Zero Page/KERNAL - BITC1 (RS232 bit counter)

## References
- "rs232_timing_table_ntsc" — timing presets used to compute BAUDOF and CIA timer values