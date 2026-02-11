# NMI RS232 IN (KERNAL)

**Summary:** NMI handler that reads a single RS232 data bit from CIA2 port B ($DD01), stores it in zero-page INBIT ($00A7), adjusts CIA2 Timer B ($DD06/$DD07) using BAUDOF ($0299/$029A), programs CIA2 control and interrupt registers ($DD0F/$DD0D), then jumps to the RS232 receive routine at $EF59.

## Description
This non-maskable-interrupt (NMI) entry services an RS232 serial input bit. Sequence of operations (literal order in code):

- Read CIA2 port B data ($DD01) and mask bit0 to obtain the received data bit.
- Store the received bit into zero-page INBIT ($00A7).
- Read Timer B low byte ($DD06), subtract constant #$1C, add BAUD offset low byte (<BAUDOF at $0299), and store back to $DD06.
- Read Timer B high byte ($DD07), add BAUD offset high byte (>BAUDOF at $029A), and store back to $DD07.
- Load #$11 into CIA2 control register B ($DD0F).
- Load ENABL from $02A1 and store it into CIA2 interrupt control register ($DD0D) to re-enable CIA2 interrupts.
- Load #$FF into A and store $FF into $DD06 and $DD07 (overwriting Timer B bytes with $FFFF).
- Jump to RS232 receive routine at $EF59 to continue processing the received bit stream.

Notes:
- BAUDOF is a two-byte offset (low/high) used to set the spacing for the next incoming bit; addresses are $0299 (low) and $029A (high).
- ENABL is loaded from $02A1 and written to CIA2 interrupt control register ($DD0D) — this re-enables (or restores) the interrupt mask/state used by the receive mechanism.
- The code writes adjusted timer B values, then later writes $FF to both timer bytes; the listing preserves this exact sequence (do not assume additional semantics beyond the literal writes).

## Source Code
```asm
                                *** NMI RS232 IN
                                This routine inputs a bit from the RS232 port and sets the
                                baudrate timing for the next bit. Continues to the RS232
                                receive routine.
.,FED6 AD 01 DD LDA $DD01       RS232 I/O port
.,FED9 29 01    AND #$01        test bit0, received data
.,FEDB 85 A7    STA $A7         store in INBIT
.,FEDD AD 06 DD LDA $DD06       lowbyte of timer B
.,FEE0 E9 1C    SBC #$1C
.,FEE2 6D 99 02 ADC $0299       <BAUDOF
.,FEE5 8D 06 DD STA $DD06       store timer B
.,FEE8 AD 07 DD LDA $DD07       highbyte of timer B
.,FEEB 6D 9A 02 ADC $029A       >BAUDOF
.,FEEE 8D 07 DD STA $DD07       store timer B
.,FEF1 A9 11    LDA #$11
.,FEF3 8D 0F DD STA $DD0F       CIA#2 control register B
.,FEF6 AD A1 02 LDA $02A1       ENABL
.,FEF9 8D 0D DD STA $DD0D       CIA#2 interrupt control register
.,FEFC A9 FF    LDA #$FF
.,FEFE 8D 06 DD STA $DD06
.,FF01 8D 07 DD STA $DD07
.,FF04 4C 59 EF JMP $EF59       jump to RS232 receive routine
```

## Key Registers
- $DD00-$DD0F - CIA #2 (6526) - Port B ($DD01), Timer B low/high ($DD06/$DD07), Interrupt Control ($DD0D), Control Register B ($DD0F)
- $0299-$029A - RAM - <BAUDOF> (baud offset low/high)
- $02A1 - RAM - ENABL (interrupt enable/restore value)
- $00A7 - Zero Page RAM - INBIT (stored received bit)

## References
- "rs232_timing_table_ntsc" — timing constants used to program Timer B for the next bit

## Labels
- INBIT
- BAUDOF
- ENABL
