# ACPTR / EOIACP — KERNAL serial input and EOI timeout flow

**Summary:** Disassembly of KERNAL ACPTR/EOIACP serial-input flow: disables IRQs (SEI), debounces CIA lines with DEBPIA, programs CIA1 Timer 2 ($DC07) and Timer Control B ($DC0F), polls CIA1 ICR ($DC0D) for timeout, handles EOI timeout and framing/read errors (CSBERR/UDST). Uses CIA2 port A ($DD00) for clock/data sampling.

## Operation
This code implements the KERNAL serial-byte receive (ACPTR) and EOI timeout handling (EOIACP):

- ACPTR entry: SEI to disable IRQs, clears error/count flag in zero page $A5, ensures clock line is released (JSR CLKHI) and waits for clock high via DEBPIA (JSR DEBPIA + BPL loop).
- EOIACP: programs CIA1 Timer 2 high byte ($DC07) with #$01 (256 µs timer interval) and Timer Control Register B ($DC0F) with #$19, then sets DATA high (JSR DATAHI) and clears CIA1 ICR ($DC0D) before polling the timer flag (AND #$02). If the timer flag indicates timeout, EOI handling is performed; otherwise the routine waits for the clock low transition via DEBPIA.
- Timeout/EOI handling: On first timeout the code sets an internal flag (COUNT at $A5). If a second timeout occurs (COUNT non-zero) it branches to CSBERR (read timeout error). On timeout it pulses DATA low (JSR DATALO), pulses clock (JSR CLKHI) to accommodate C64-specific timing, ORs an EOI bit into status via JSR UDST (JSR $FE1C with A = #$40), increments COUNT and repeats the EOI timeout sequence.
- Byte transfer loop: Once clock activity is detected, COUNT is set to 8 and the routine samples CIA2 port A ($DD00) for clock transitions, with debounce via repeated reads (CMP $DD00 loops). The code uses ASL A to shift the accumulator into carry then ROR $A4 to rotate the sampled bit into the receive buffer ($A4). The loop continues until all 8 bits are captured.
- Error handling: Timeout branches to CSBERR (JMP $EDB2) when COUNT indicates a previous timeout; UDST is used to set the EOI status bit when required.

Labels/variables from the listing:
- COUNT: zero-page $A5 used to count bits and track timeout state.
- BSOUR1 / $A4: receive shift register (rotated via ROR).
- DEBPIA: debounce routine for CIA port lines (used to wait stable clock transitions).
- UDST / CSBERR: higher-level status/error handlers (UDST ORs EOI bit into status; CSBERR handles read-timeout error).

## Source Code
```asm
                                ; DELAY THEN RELEASE CLOCK AND DATA
                                ;
.,EE06 8A       TXA             DLADLH TXA             ;DELAY APPROX 60 US
.,EE07 A2 0A    LDX #$0A               LDX #10
.,EE09 CA       DEX             DLAD00 DEX
.,EE0A D0 FD    BNE $EE09              BNE DLAD00
.,EE0C AA       TAX                    TAX
.,EE0D 20 85 EE JSR $EE85              JSR CLKHI
.,EE10 4C 97 EE JMP $EE97              JMP DATAHI
                                ;INPUT A BYTE FROM SERIAL BUS
                                ;
                                ACPTR
.,EE13 78       SEI                    SEI             ;NO IRQ ALLOWED
.,EE14 A9 00    LDA #$00               LDA #$00        ;SET EOI/ERROR FLAG
.,EE16 85 A5    STA $A5                STA COUNT
.,EE18 20 85 EE JSR $EE85              JSR CLKHI       ;MAKE SURE CLOCK LINE IS RELEASED
.,EE1B 20 A9 EE JSR $EEA9       ACP00A JSR DEBPIA      ;WAIT FOR CLOCK HIGH
.,EE1E 10 FB    BPL $EE1B              BPL ACP00A
                                ;
                                EOIACP
.,EE20 A9 01    LDA #$01               LDA #$01        ;SET TIMER 2 FOR 256US
.,EE22 8D 07 DC STA $DC07              STA D1T2H
.,EE25 A9 19    LDA #$19               LDA #TIMRB
.,EE27 8D 0F DC STA $DC0F              STA D1CRB
.,EE2A 20 97 EE JSR $EE97              JSR DATAHI      ;DATA LINE HIGH (MAKES TIMMING MORE LIKE VIC-20
.,EE2D AD 0D DC LDA $DC0D              LDA D1ICR       ;CLEAR THE TIMER FLAGS<<<<<<<<<<<<
.,EE30 AD 0D DC LDA $DC0D       ACP00  LDA D1ICR
.,EE33 29 02    AND #$02               AND #$02        ;CHECK THE TIMER
.,EE35 D0 07    BNE $EE3E              BNE ACP00B      ;RAN OUT.....
.,EE37 20 A9 EE JSR $EEA9              JSR DEBPIA      ;CHECK THE CLOCK LINE
.,EE3A 30 F4    BMI $EE30              BMI ACP00       ;NO NOT YET
.,EE3C 10 18    BPL $EE56              BPL ACP01       ;YES.....
                                ;
.,EE3E A5 A5    LDA $A5         ACP00B LDA COUNT       ;CHECK FOR ERROR (TWICE THRU TIMEOUTS)
.,EE40 F0 05    BEQ $EE47              BEQ ACP00C
.,EE42 A9 02    LDA #$02               LDA #2
.,EE44 4C B2 ED JMP $EDB2              JMP CSBERR      ; ST = 2 READ TIMEOUT
                                ;
                                ; TIMER RAN OUT DO AN EOI THING
                                ;
.,EE47 20 A0 EE JSR $EEA0       ACP00C JSR DATALO      ;DATA LINE LOW
.,EE4A 20 85 EE JSR $EE85              JSR CLKHI       ; DELAY AND THEN SET DATAHI (FIX FOR 40US C64)
.,EE4D A9 40    LDA #$40               LDA #$40
.,EE4F 20 1C FE JSR $FE1C              JSR UDST        ;OR AN EOI BIT INTO STATUS
.,EE52 E6 A5    INC $A5                INC COUNT       ;GO AROUND AGAIN FOR ERROR CHECK ON EOI
.,EE54 D0 CA    BNE $EE20              BNE EOIACP
                                ;
                                ; DO THE BYTE TRANSFER
                                ;
.,EE56 A9 08    LDA #$08        ACP01  LDA #08         ;SET UP COUNTER
.,EE58 85 A5    STA $A5                STA COUNT
                                ;
.,EE5A AD 00 DD LDA $DD00       ACP03  LDA D2PRA       ;WAIT FOR CLOCK HIGH
.,EE5D CD 00 DD CMP $DD00       CMP    D2PRA           ;DEBOUNCE
.,EE60 D0 F8    BNE $EE5A       BNE    ACP03
.,EE62 0A       ASL             ASL    A               ;SHIFT DATA INTO CARRY
.,EE63 10 F5    BPL $EE5A       BPL    ACP03           ;CLOCK STILL LOW...
.,EE65 66 A4    ROR $A4         ROR    BSOUR1          ;ROTATE DATA IN
                                ;
.,EE67 AD 00 DD LDA $DD00       ACP03A LDA D2PRA       ;WAIT FOR CLOCK LOW
```

## Key Registers
- $DC00-$DC0F - CIA 1 - Timer 2 High ($DC07), Timer Control Register B ($DC0F), Interrupt Control Register ($DC0D) and related CIA1 registers used for timeout/timer polling
- $DD00-$DD0F - CIA 2 - Port A (D2PRA at $DD00) used for clock/data sampling and debouncing

## References
- "clkhi_clklo_data_lines" — expands on uses of CLKHI/CLKLO/DATAHI/DATALO primitives defined later

## Labels
- ACPTR
- EOIACP
- COUNT
- BSOUR1
- CSBERR
