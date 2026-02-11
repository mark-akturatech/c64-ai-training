# KERNAL: Talk/Listen/Unlisten/Untalk Routines & Buffered Serial I/O (TKSA/TKATN/CIOUT/UNTLK/UNLSN)

**Summary:** KERNAL routines for Commodore serial bus talk/listen control and buffered I/O: TKSA/TKATN/TKATN1 send secondary addresses and shift to listener, CIOUT implements buffered output using BSOUR ($0095) and C3P0 ($0094) flags, and UNTLK/UNLSN send UNTALK/UNLISTEN commands while toggling ATN via CIA 2 port A ($DD00 / D2PRA).

**Overview**
This chunk documents KERNAL ROM routines that manage the IEC (Commodore serial) bus for talk/listen operations and buffered output:

- **TKSA**: Buffers a secondary address byte (stores into BSOUR) and calls ISOURA to send it.
- **TKATN / TKATN1**: Shifts to listener mode by manipulating ATN (via CIA2 $DD00), drives DATA/CLK lines (DATALO/CLKHI/DATA/CLK primitives), and waits for clock low (loop via DEBPIA).
- **CIOUT**: Buffered output—checks buffered-char flag (C3P0) with BIT $0094; if set, sends the existing buffered char, otherwise sets the buffer flag (ROR $0094), then stores the current char into BSOUR ($0095). Uses ISOUR to actually transmit.
- **UNTLK / UNLSN**: Asserts appropriate ATN changes and sends bus command bytes (UNTALK #$5F and UNLISTEN #$3F) via the send routine (LIST1 / ED11), then releases ATN/lines (SCATN).

Interrupt masking (SEI/CLI) surrounds critical sections (TKATN/TKATN1/UNTLK) to avoid race conditions while toggling bus lines.

**Routine Details**
- **Entry/Exit**: EDB2 JSR $FE1C (CSBERR / UDST) is a common serial-bus error entry; EDB5-EDB6 re-enable interrupts and clear carry to ensure a clean return.
- **Sending Secondary Address**:
  - **TKSA (.,EDC7)**: STA $0095 (BSOUR) buffers the secondary address; JSR $ED36 (ISOURA) sends it.
  - After sending, ATN is released by clearing bit 3 of $DD00 (D2PRA): LDA $DD00 / AND #$F7 / STA $DD00.
- **Shifting to Listener (TKATN / TKATN1)**:
  - **TKATN (.,EDCC-EDD9)**: SEI, JSR DATALO, JSR SCATN, JSR CLKHI, then loop on JSR DEBPIA until clock goes low (BMI loops). CLI and RTS follow.
  - **Purpose**: Ensure DATA/CLK line transitions and wait for bus state indicating listener takeover.
- **Buffered Output (CIOUT)**:
  - Check buffered-char flag: BIT $0094; if negative (flag set) branch to send last buffered char (CI2).
  - If no buffered char: SEC; ROR $0094 sets the flag bit (C3P0); BNE is always taken (effectively a short jump).
  - **CI2**: PHA; JSR ISOUR (send last char); PLA; store current char into BSOUR ($0095); CLC; RTS.
  - This preserves the "current" character while sending the previously buffered character, using the zero-page buffer (BSOUR) and C3P0 flag to coordinate.
- **Sending UNTALK / UNLISTEN**:
  - **UNTLK (.,EDEF)**: SEI; JSR CLKLO; set ATN by ORA #$08 / STA $DD00 (pull ATN); LDA #$5F (UNTALK command) followed by a .BYTE $2C (BIT absolute skip trick to fall through to UNLSN).
  - **UNLSN (.,EDFE)**: LDA #$3F (UNLISTEN); JSR $ED11 (LIST1) to send it.
  - After sending, release ATN/lines by JSR SCATN (.,EE03).

## Source Code
```asm
.,EDB0 A9 03    LDA #$03        LDA    #$03
.,EDB2 20 1C FE JSR $FE1C       CSBERR JSR UDST        ;COMMODORE SERIAL BUS ERROR ENTRY
.,EDB5 58       CLI             CLI                    ;IRQ'S WERE OFF...TURN ON
.,EDB6 18       CLC             CLC                    ;MAKE SURE NO KERNAL ERROR RETURNED
.,EDB7 90 4A    BCC $EE03       BCC    DLABYE          ;TURN ATN OFF, RELEASE ALL LINES
                                ;
                                ;SEND SECONDARY ADDRESS AFTER LISTEN
                                ;
.,EDB9 85 95    STA $95         SECND  STA BSOUR       ;BUFFER CHARACTER
.,EDBB 20 36 ED JSR $ED36       JSR    ISOURA          ;SEND IT
                                ;RELEASE ATTENTION AFTER LISTEN
                                ;
.,EDBE AD 00 DD LDA $DD00       SCATN  LDA D2PRA
.,EDC1 29 F7    AND #$F7        AND    #$FF-$08
.,EDC3 8D 00 DD STA $DD00       STA    D2PRA           ;RELEASE ATTENTION
.,EDC6 60       RTS             RTS
                                ;TALK SECOND ADDRESS
                                ;
.,EDC7 85 95    STA $95         TKSA   STA BSOUR       ;BUFFER CHARACTER
.,EDC9 20 36 ED JSR $ED36       JSR    ISOURA          ;SEND SECOND ADDR
                                TKATN                  ;SHIFT OVER TO LISTENER
.,EDCC 78       SEI             SEI                    ;NO IRQ'S HERE
.,EDCD 20 A0 EE JSR $EEA0       JSR    DATALO          ;DATA LINE LOW
.,EDD0 20 BE ED JSR $EDBE       JSR    SCATN
.,EDD3 20 85 EE JSR $EE85       JSR    CLKHI           ;CLOCK LINE HIGH JSR/RTS
.,EDD6 20 A9 EE JSR $EEA9       TKATN1 JSR DEBPIA      ;WAIT FOR CLOCK TO GO LOW
.,EDD9 30 FB    BMI $EDD6       BMI    TKATN1
.,EDDB 58       CLI             CLI                    ;IRQ'S OKAY NOW
.,EDDC 60       RTS             RTS
                                ;BUFFERED OUTPUT TO SERIAL BUS
                                ;
.,EDDD 24 94    BIT $94         CIOUT  BIT C3P0        ;BUFFERED CHAR?
.,EDDF 30 05    BMI $EDE6       BMI    CI2             ;YES...SEND LAST
                                ;
.,EDE1 38       SEC             SEC                    ;NO...
.,EDE2 66 94    ROR $94         ROR    C3P0            ;SET BUFFERED CHAR FLAG
.,EDE4 D0 05    BNE $EDEB       BNE    CI4             ;BRANCH ALWAYS
                                ;
.,EDE6 48       PHA             CI2    PHA             ;SAVE CURRENT CHAR
.,EDE7 20 40 ED JSR $ED40       JSR    ISOUR           ;SEND LAST CHAR
.,EDEA 68       PLA             PLA                    ;RESTORE CURRENT CHAR
.,EDEB 85 95    STA $95         CI4    STA BSOUR       ;BUFFER CURRENT CHAR
.,EDED 18       CLC             CLC                    ;CARRY-GOOD EXIT
.,EDEE 60       RTS             RTS
                                ;SEND UNTALK COMMAND ON SERIAL BUS
                                ;
.,EDEF 78       SEI             UNTLK  SEI
.,EDF0 20 8E EE JSR $EE8E       JSR    CLKLO
.,EDF3 AD 00 DD LDA $DD00       LDA    D2PRA           ;PULL ATN
.,EDF6 09 08    ORA #$08        ORA    #$08
.,EDF8 8D 00 DD STA $DD00       STA    D2PRA
.,EDFB A9 5F    LDA #$5F        LDA    #$5F            ;UNTALK COMMAND
.,EDFD 2C       .BYTE $2C       .BYT   $2C             ;SKIP TWO BYTES
                                ;SEND UNLISTEN COMMAND ON SERIAL BUS
                                ;
.,EDFE A9 3F    LDA #$3F        UNLSN  LDA #$3F        ;UNLISTEN COMMAND
.,EE00 20 11 ED JSR $ED11              JSR LIST1       ;SEND IT
                                ;
                                ; RELEASE ALL LINES
.,EE03 20 BE ED JSR $EDBE       DLABYE JSR SCATN       ;ALWAYS RELEASE ATN
```

## Key Registers
- **$0094**: Zero page (KERNAL) - C3P0: Buffered-character flag (BIT tested with BIT $94; ROR $94 toggles/sets).
- **$0095**: Zero page (KERNAL) - BSOUR: Buffered source character (current/previous char stored here for ISOUR).
- **$DD00**: CIA 2 (D2PRA) - Port A: Used to control IEC bus lines (bit 3 / $08 is ATN). Code clears bit 3 with AND #$F7 to release ATN and sets it with ORA #$08 to assert/pull ATN.

## References
- "serial_isour_and_isr" —

## Labels
- TKSA
- TKATN
- TKATN1
- CIOUT
- UNTLK
- UNLSN
