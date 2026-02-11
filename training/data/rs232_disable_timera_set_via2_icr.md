# Disable Timer A and Program VIA2 ICR for RS-232 (C64)

**Summary:** Writes VIA-II ICR ($DD0D) to disable Timer A, merges that value with the RS-232 interrupt-enable byte ($02A1) using EOR/ORA to set the IER "set" bit, stores the merged enable byte back to $02A1 and $DD0D, and returns (RTS). Relevant terms: $DD0D, $02A1, VIA-II (6522) ICR/IER, Timer A, RS-232.

## Operation
This routine disables the VIA2 Timer A interrupt and programs the VIA2 Interrupt Control/Register (ICR/IER) for RS-232 operation by merging a base value (#$01) with the current RS-232 interrupt-enable byte at $02A1.

Step-by-step:
- LDA #$01 — load accumulator with $01 (select Timer A bit; bit7=0 to clear selection on write).
- STA $DD0D — write $01 to VIA2 ICR (clears Timer A interrupt enable). (VIA ICR/IER write: bit7=1 means "set", bit7=0 means "clear".)
- EOR $02A1 — XOR accumulator with the current RS-232 interrupt-enable byte stored at $02A1 (merges/toggles selected bits).
- ORA #$80 — set bit7 in A to indicate a "set" operation when writing the VIA ICR/IER (bit7 = 1 means set selected bits).
- STA $02A1 — store the updated RS-232 interrupt-enable byte back to $02A1.
- STA $DD0D — write the same byte to VIA2 ICR/IER to apply the new interrupt enables on VIA2.
- RTS — return from subroutine.

Notes:
- The code writes $DD0D twice: first to clear the Timer A bit, then later to write the merged/set value.
- (VIA ICR/IER write behavior: bit7 selects set(1)/clear(0) for the bits in the lower 7 bits.)

## Source Code
```asm
.,EF39 A9 01    LDA #$01        disable timer A interrupt

.,EF3B 8D 0D DD STA $DD0D       save VIA 2 ICR
.,EF3E 4D A1 02 EOR $02A1       EOR with the RS-232 interrupt enable byte
.,EF41 09 80    ORA #$80        set the interrupts enable bit
.,EF43 8D A1 02 STA $02A1       save the RS-232 interrupt enable byte
.,EF46 8D 0D DD STA $DD0D       save VIA 2 ICR
.,EF49 60       RTS
```

## Key Registers
- $DD0D - VIA-II (6522) - Interrupt Control/Register (ICR/IER) for VIA 2
- $02A1 - RAM - RS-232 interrupt-enable byte (runtime flag merged into VIA2 ICR)

## References
- "rs232_setup_next_tx_byte" — expands on called when Tx buffer is drained to disable Timer A and finalize VIA2 ICR
- "rs232_setup_for_transmit" — expands on related enabling/disabling of interrupts before starting transmission

## Labels
- VIA2_ICR
- RS232_INT_ENABLE
