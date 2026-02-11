# T2NMI — CIA-2 Timer-2 NMI handler for RS-232 bit sampling (KERNAL ROM)

**Summary:** T2NMI (ROM $FED6) samples the RS-232 input bit from CIA-2 port B ($DD01), stores it in INBIT ($00A7), computes and programs a mid-bit Timer-2 interval using BAUDOF/BAUDOF+1 ($0299/$029A), enables CIA-2 Timer-2 ($DD0F), restores NMI enable flags from ENABL ($02A1 -> $DD0D), presets the countdown to $FFFF, and jumps to RSRCVR to shift/process the sampled bit.

## Operation
- Read input bit: LDA $DD01 reads CIA-2 port B (D2PRB). The code masks bit 0 (AND #$01) and stores the result into INBIT ($00A7).
- Compute mid-bit timer: The handler updates Timer-2 low/high ($DD06/$DD07) to schedule a mid-bit sample roughly one half-bit later. It does this by:
  - Loading current D2T2L ($DD06), subtracting #$1C (0x1C = 28 decimal), then adding BAUDOF ($0299) and storing back to $DD06.
  - Loading current D2T2H ($DD07), adding BAUDOF+1 ($029A) with carry (ADC), and storing back to $DD07.
  - These two words (BAUDOF / BAUDOF+1) are used as the per-bit timing increments; see "baud_table_and_cbit" for how BAUDOF is derived.
- Enable Timer-2: Writes #$11 to D2CRB ($DD0F) to set/enable CIA-2 Timer-2 (control register B).
- Restore NMI enables: Restores previously-saved NMI enable bits by storing ENABL ($02A1) into CIA-2 ICR ($DD0D).
- Preset countdown: Loads #$FF into D2T2L/H ($DD06/$DD07) to let the timer count down from $FFFF for the next interval (the handler uses writes both to set new mid-bit time above and to preset $FFFF for the following period).
- Transfer to receiver: JMP to RSRCVR ($EF59) hands control to the receive/shifter routine which processes the sampled bit.

Timing notes (from ROM comments):
- The comments claim "worst case <213 cycles to here" with a calculation noted as "CALC 125 CYCLES+43-66 DEAD". The code applies a CBIT adjustment (see baud_table_and_cbit) to compensate for variable code-path timing so the sample occurs near mid-bit.

**[Note: Source uses SBC #$1C (subtract 28) with a comment 'SBC #22+6' — this is consistent (22+6 = 28).]**

## Source Code
```asm
                                ; T2NMI - SUBROUTINE TO HANDLE AN RS232
                                ;  BIT INPUT.
                                ;
.,FED6 AD 01 DD LDA $DD01       T2NMI  LDA D2PRB       ;GET DATA IN
.,FED9 29 01    AND #$01               AND #01         ;MASK OFF...
.,FEDB 85 A7    STA $A7                STA INBIT       ;...SAVE FOR LATTER
                                ;
                                ; UPDATE T2 FOR MID BIT CHECK
                                ;   (WORST CASE <213 CYCLES TO HERE)
                                ;   (CALC 125 CYCLES+43-66 DEAD)
                                ;
.,FEDD AD 06 DD LDA $DD06              LDA D2T2L       ;CALC NEW TIME & CLR NMI
.,FEE0 E9 1C    SBC #$1C               SBC #22+6
.,FEE2 6D 99 02 ADC $0299              ADC BAUDOF
.,FEE5 8D 06 DD STA $DD06              STA D2T2L
.,FEE8 AD 07 DD LDA $DD07              LDA D2T2H
.,FEEB 6D 9A 02 ADC $029A              ADC BAUDOF+1
.,FEEE 8D 07 DD STA $DD07              STA D2T2H
                                ;
.,FEF1 A9 11    LDA #$11               LDA #$11        ;ENABLE TIMER
.,FEF3 8D 0F DD STA $DD0F              STA D2CRB
                                ;
.,FEF6 AD A1 02 LDA $02A1              LDA ENABL       ;RESTORE NMI'S EARLY...
.,FEF9 8D 0D DD STA $DD0D              STA D2ICR
                                ;
.,FEFC A9 FF    LDA #$FF               LDA #$FF        ;ENABLE COUNT FROM $FFFF
.,FEFE 8D 06 DD STA $DD06              STA D2T2L
.,FF01 8D 07 DD STA $DD07              STA D2T2H
                                ;
.,FF04 4C 59 EF JMP $EF59              JMP RSRCVR      ;GO SHIFT IN...
```

## Key Registers
- $DD00-$DD0F - CIA 2 - Port and Timer 2 registers (includes PRB $DD01, T2 low $DD06, T2 high $DD07, ICR $DD0D, CRB $DD0F)
- $0000-$00FF (zero page) specific:
  - $00A7 - Zero page - INBIT (saved sampled input bit)
- $0200-$02FF (zero/stack area) specific:
  - $0299-$029A - RAM - BAUDOF / BAUDOF+1 (per-bit timing words)
  - $02A1 - RAM - ENABL (saved NMI enable flags written back to CIA-2 ICR)

## References
- "baud_table_and_cbit" — expands on BAUDOF/BAUDOF+1 and CBIT constants for timing
- "flnmi_half_bit_setup_and_return" — explains FLNMI setup for half-bit timer and transfer to T2NMI
- "nested_nmi_dispatch_and_rstrab" — explains how T2NMI is invoked when a Timer-2 NMI is detected

## Labels
- T2NMI
- INBIT
- BAUDOF
- ENABL
