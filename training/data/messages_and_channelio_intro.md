# KERNAL ROM — MESSAGES & CHANNEL I/O (SPMSG, GETIN)

**Summary:** KERNAL message strings (MS1..MS21, etc.) and SPMSG routine (checks MSGFLG at $009D and prints via BSOUT $FFD2). Channel I/O entry NGETIN/GETIN inspects DFLTN ($0099) to select device (0=keyboard, 1=cassette, 2=RS-232, 3=screen, 4-31=serial bus) and dispatches to keyboard queue, RS-232 handler, or BASIN.

**Messages and SPMSG (print message)**

SPMSG tests the message-flag byte MSGFLG (BIT $009D). If bit 7 of MSGFLG is set, SPMSG walks the message table (MS1, MS5..MS21, etc.) and calls the KERNAL character output routine BSOUT ($FFD2) for each byte in the message. The message table is stored in ROM (labels MS1..MS21, MS36 shown). The routine preserves processor flags around the call to BSOUT (PHP/PLP) and increments Y to step through a string until the high bit indicates termination (AND #$7F / BPL loop).

SPMSG behavior summary:
- BIT $009D — checks MSGFLG (message printing enabled if bit 7 set).
- If printing enabled: load message bytes from message table (e.g., $F0BD,Y) and JSR $FFD2 (BSOUT) for each byte.
- If printing disabled: return (CLC; RTS).

**Channel I/O (GETIN / NGETIN)**

NGETIN (GETIN entry) reads the default channel number from DFLTN ($0099):
- If DFLTN == 0: use keyboard queue.
  - Check NDX ($00C6) (the queue index). If zero, no character available -> return with Z flag set.
  - If queue non-empty: SEI and JMP to LP2 ($E5B4) to remove/return a character from the keyboard queue.
- If DFLTN != 0: check for RS-232 (CMP #$02).
  - If equal (DFLTN == 2): fall through to RS-232 handling.
  - If not equal: branch to BASIN handler (devices 1 and 3..31 use BASIN).

The code explicitly checks for device 2 (RS-232) and only if not 2 branches to BASIN; thus, devices 1 and 3..31 are sent to BASIN while 2 is handled separately.

## Source Code

```asm
.,F0AD 29 03    AND #$03               AND #%00000011  ; WITH T1 & T2
.,F0AF D0 F9    BNE $F0AA              BNE RSPOFF
.,F0B1 A9 10    LDA #$10               LDA #%00010000  ; DISABLE FLAG (NEED TO RENABLE IN USER CODE)
.,F0B3 8D 0D DD STA $DD0D              STA D2ICR       ;TURN OF ENABL************
.,F0B6 A9 00    LDA #$00               LDA #0
.,F0B8 8D A1 02 STA $02A1              STA ENABL       ;CLEAR ALL ENABLS
.,F0BB 68       PLA             RSPOK  PLA             ;ALL DONE
.,F0BC 60       RTS                    RTS
                                .END
                                .LIB   MESSAGES
                                MS1    .BYT $0D,'I/O ERROR ',$A3
                                MS5    .BYT $0D,'SEARCHING',$A0
                                MS6    .BYT 'FOR',$A0
                                MS7    .BYT $0D,'PRESS PLAY ON TAPE',$C5
                                MS8    .BYT 'PRESS RECORD & PLAY ON TAPE',$C5
                                MS10   .BYT $0D,'LOADING',$C7
                                MS11   .BYT $0D,'SAVING',$A0
                                MS21   .BYT $0D,'VERIFYING',$C7
                                MS17   .BYT $0D,'FOUND',$A0
                                MS18   .BYT $0D,'OK',$8D
                                MS34   .BYT $0D,'MONITOR',$8D
                                MS36   .BYT $0D,'BREAK',$CB
                                ;PRINT MESSAGE TO SCREEN ONLY IF
                                ;OUTPUT ENABLED
                                ;
.,F12B 24 9D    BIT $9D         SPMSG  BIT MSGFLG      ;PRINTING MESSAGES?
.,F12D 10 0D    BPL $F13C       BPL    MSG10           ;NO...
.,F12F B9 BD F0 LDA $F0BD,Y     MSG    LDA MS1,Y
.,F132 08       PHP             PHP
.,F133 29 7F    AND #$7F        AND    #$7F
.,F135 20 D2 FF JSR $FFD2       JSR    BSOUT
.,F138 C8       INY             INY
.,F139 28       PLP             PLP
.,F13A 10 F3    BPL $F12F       BPL    MSG
.,F13C 18       CLC             MSG10  CLC
.,F13D 60       RTS             RTS
                                .END
                                .LIB   CHANNELIO
                                ;***************************************
                                ;* GETIN -- GET CHARACTER FROM CHANNEL *
                                ;*      CHANNEL IS DETERMINED BY DFLTN.*
                                ;* IF DEVICE IS 0, KEYBOARD QUEUE IS   *
                                ;* EXAMINED AND A CHARACTER REMOVED IF *
                                ;* AVAILABLE.  IF QUEUE IS EMPTY, Z    *
                                ;* FLAG IS RETURNED SET.  DEVICES 1-31 *
                                ;* ADVANCE TO BASIN.                   *
                                ;***************************************
                                ;
.,F13E A5 99    LDA $99         NGETIN LDA DFLTN       ;CHECK DEVICE
.,F140 D0 08    BNE $F14A       BNE    GN10            ;NOT KEYBOARD
                                ;
.,F142 A5 C6    LDA $C6         LDA    NDX             ;QUEUE INDEX
.,F144 F0 0F    BEQ $F155       BEQ    GN20            ;NOBODY THERE...EXIT
                                ;
.,F146 78       SEI             SEI
.,F147 4C B4 E5 JMP $E5B4       JMP    LP2             ;GO REMOVE A CHARACTER
                                ;
.,F14A C9 02    CMP #$02        GN10   CMP #2          ;IS IT RS-232
.,F14C D0 18    BNE $F166       BNE    BN10            ;NO...USE BASIN
.,F14E A9 02    LDA #$02        LDA    #2              ;RS-232 DEVICE NUMBER
.,F150 20 C6 FF JSR $FFC6       JSR    CHKIN           ;SET INPUT CHANNEL
.,F153 4C CF FF JMP $FFCF       JMP    CHRIN           ;GET CHARACTER
.,F166 20 C6 FF BN10   JSR $FFC6       ;SET INPUT CHANNEL
.,F169 4C CF FF JMP $FFCF       JMP    CHRIN           ;GET CHARACTER
```

## Key Registers

- $DD0D - CIA 2 - Interrupt Control Register (D2ICR) — written to (STA $DD0D) to disable/clear enables
- $0099 - Zero Page - DFLTN (default channel/device for GETIN)
- $009D - Zero Page - MSGFLG (message-printing flags; BIT $009D used by SPMSG)
- $00C6 - Zero Page - NDX (keyboard queue index checked by NGETIN)
- $02A1 - RAM - ENABL (enable flags cleared by STA $02A1)
- $FFD2 - KERNAL - BSOUT (character output routine; JSR $FFD2 used by SPMSG)

## References

- "declare_zero_page_part1" — expands on zero-page declarations (MSGFLG, BSOUT, and other zero-page variables)

## Labels
- SPMSG
- NGETIN
- DFLTN
- MSGFLG
- NDX
- ENABL
