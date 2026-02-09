# KERNAL: Clock/Data Line Control Primitives (CLKHI / CLKLO / DATAHI / DATALO / DEBPIA / W1MS)

**Summary:** Assemblies of KERNAL primitives that control serial clock/data lines and perform PIA debouncing and a 1 ms delay loop. Uses CIA2 Port A at $DD00 (D2PRA); routines: CLKHI, CLKLO, DATAHI, DATALO, DEBPIA, W1MS.

## Description
This chunk contains small KERNAL helper routines used by the serial bus send/receive code to manipulate the clock and data lines (both inverted) on CIA2 Port A and to sample/debounce those inputs plus provide a 1 ms timing delay.

- Line polarity and bits:
  - Clock line is on bit $10 (bit 4) of $DD00 (D2PRA). Because the hardware is inverted, clearing the bit sets the physical line high; setting the bit drives the line low.
  - Data line is on bit $20 (bit 5) of $DD00 (D2PRA). Clearing the bit sets data high (inverted), setting the bit drives it low.

- CLKHI / CLKLO:
  - CLKHI (at $EE85) clears bit $10 (AND #$EF) of $DD00 to set the physical clock line high (inverted).
  - CLKLO (at $EE8E) sets bit $10 (ORA #$10) of $DD00 to drive the physical clock line low.

- DATAHI / DATALO:
  - DATAHI (at $EE97) clears bit $20 (AND #$DF) of $DD00 to set the physical data line high (inverted).
  - DATALO (at $EEA0) sets bit $20 (ORA #$20) of $DD00 to drive the physical data line low.

- DEBPIA:
  - DEBPIA (at $EEA9) implements a simple debounce/stable-read loop: it reads $DD00 into A, immediately CMPs against $DD00 (which forces a second read from the port), and if the two samples differ it loops until two consecutive reads match. After stability is detected the routine ASLs A to shift the sampled bits so the data bit ends up in the carry and the clock bit affects the negative flag (per the in-code comment). The routine then RTS with the shifted value in A and flags set for subsequent code to use.

- W1MS:
  - W1MS (at $EEB3) provides an approximate 1 millisecond delay using a tight DEX/BNE loop. It saves X into A (TXA), loads X with #$B8 (184), then performs a DEX/BNE loop where each iteration is ~5 CPU cycles (about 5 µs at 1 MHz). The count #$B8 equals 200-16 per the comment (adjusted for entry/exit overhead) to approximate 1 ms. After the loop it restores X from A (TAX) and RTS.

These primitives are used by higher-level serial transfer routines (for example ACPTR-related routines) to sample bits with proper timing and to set or sample the inverted bus lines reliably.

## Source Code
```asm
.,EE6A CD 00 DD CMP $DD00       CMP    D2PRA           ;DEBOUNCE
.,EE6D D0 F8    BNE $EE67       BNE    ACP03A
.,EE6F 0A       ASL             ASL    A
.,EE70 30 F5    BMI $EE67       BMI    ACP03A
.,EE72 C6 A5    DEC $A5         DEC    COUNT
.,EE74 D0 E4    BNE $EE5A       BNE    ACP03           ;MORE BITS.....
                                ;...EXIT...
.,EE76 20 A0 EE JSR $EEA0              JSR DATALO      ;DATA LOW
.,EE79 24 90    BIT $90                BIT STATUS      ;CHECK FOR EOI
.,EE7B 50 03    BVC $EE80              BVC ACP04       ;NONE...
                                ;
.,EE7D 20 06 EE JSR $EE06              JSR DLADLH      ;DELAY THEN SET DATA HIGH
                                ;
.,EE80 A5 A4    LDA $A4         ACP04  LDA BSOUR1
.,EE82 58       CLI                    CLI             ;IRQ IS OK
.,EE83 18       CLC                    CLC             ;GOOD EXIT
.,EE84 60       RTS                    RTS
                                ;
                                CLKHI                  ;SET CLOCK LINE HIGH (INVERTED)
.,EE85 AD 00 DD LDA $DD00              LDA D2PRA
.,EE88 29 EF    AND #$EF               AND #$FF-$10
.,EE8A 8D 00 DD STA $DD00              STA D2PRA
.,EE8D 60       RTS                    RTS
                                ;
                                CLKLO                  ;SET CLOCK LINE LOW  (INVERTED)
.,EE8E AD 00 DD LDA $DD00              LDA D2PRA
.,EE91 09 10    ORA #$10               ORA #$10
.,EE93 8D 00 DD STA $DD00              STA D2PRA
.,EE96 60       RTS                    RTS
                                ;
                                ;
                                DATAHI                 ;SET DATA LINE HIGH (INVERTED)
.,EE97 AD 00 DD LDA $DD00              LDA D2PRA
.,EE9A 29 DF    AND #$DF               AND #$FF-$20
.,EE9C 8D 00 DD STA $DD00              STA D2PRA
.,EE9F 60       RTS                    RTS
                                ;
                                DATALO                 ;SET DATA LINE LOW  (INVERTED)
.,EEA0 AD 00 DD LDA $DD00              LDA D2PRA
.,EEA3 09 20    ORA #$20               ORA #$20
.,EEA5 8D 00 DD STA $DD00              STA D2PRA
.,EEA8 60       RTS                    RTS
                                                       ;
.,EEA9 AD 00 DD LDA $DD00       DEBPIA LDA D2PRA       ;DEBOUNCE THE PIA
.,EEAC CD 00 DD CMP $DD00              CMP D2PRA
.,EEAF D0 F8    BNE $EEA9              BNE DEBPIA
.,EEB1 0A       ASL                    ASL A           ;SHIFT THE DATA BIT INTO THE CARRY...
.,EEB2 60       RTS                    RTS             ;...AND THE CLOCK INTO NEG FLAG
                                ;
                                W1MS                   ;DELAY 1MS USING LOOP
.,EEB3 8A       TXA                    TXA             ;SAVE .X
.,EEB4 A2 B8    LDX #$B8               LDX #200-16     ;1000US-(1000/500*8=#40US HOLDS)
.,EEB6 CA       DEX             W1MS1  DEX             ;5US LOOP
.,EEB7 D0 FD    BNE $EEB6              BNE W1MS1
.,EEB9 AA       TAX                    TAX             ;RESTORE .X
.,EEBA 60       RTS                    RTS
                                .END
                                .LIB   RS232TRANS
                                ; RSTRAB - ENTRY FOR NMI CONTINUE ROUTINE
                                ; RSTBGN - ENTRY FOR START TRANSMITTER
```

## Key Registers
- $DD00 - CIA 2 - Port A (D2PRA) - bit $10 (0x10) = CLOCK (inverted: 0 = high, 1 = low); bit $20 (0x20) = DATA (inverted: 0 = high, 1 = low)

## References
- "acptr_and_eoi_timeout" — expands on ACPTR usage of these primitives to sample bits and detect timeouts
- "RS232TRANS" — RS‑232 transmit helpers referenced by .LIB and comments (RSTRAB, RSTBGN)