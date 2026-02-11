# KERNAL ROM — ERRORHANDLER / STOP check (F6ED–F72B)

**Summary:** KERNAL ROM routines that check the STOP key via STKEY ($0091), close/restore I/O channels (CLRCH $FFCC), flush keyboard queue (store to NDX $00C6), and print CBM I/O error messages conditioned on MSGFLG ($009D). Implements standard KERNAL error codes ERROR1..ERROR9 (LDA #$01..#$09) and returns error number in A with the carry set; uses BSOUT ($FFD2) to emit the ASCII error digit.

## Description
- NSTOP (at $F6ED) — STOP-key check and cleanup:
  - Loads STKEY ($0091) and compares with #$7F. If equal (STOP key in the sentinel position), it saves processor flags (PHP), calls CLRCH ($FFCC) to clear/restore I/O channels, stores the STKEY value into NDX ($00C6) (used here to flush/record keyboard state), restores flags (PLP), and returns with A containing the last row/key value.
  - If STKEY != $7F, the routine simply returns (RTS).
- ERROR handler (starts at $F6FB) — produces KERNAL error return and optional message:
  - ERROR1..ERROR9 are defined as immediate LDA #$01 .. LDA #$09 entries (table entries shown in the listing).
  - The current error number is pushed (PHA), CLRCH ($FFCC) is called to restore I/O channels, then MSGFLG ($009D) is tested via BIT $9D:
    - BIT sets the V flag to bit 6 of MSGFLG; BVC (branch on V clear) skips printing when MSGFLG bit 6 is 0.
    - If MSGFLG bit 6 is set, JSR $F12F (MSG) prints the "CBM I/O ERROR" header string, then the error number is converted to ASCII (ORA #$30) and printed via BSOUT ($FFD2).
  - The error number is left in A and the carry flag is set (SEC) before returning (RTS). Thus calling code receives error number in A with carry set to indicate the KERNAL error return.

- Behavior/flags:
  - The routine preserves processor flags across CLRCH by pushing PHP before the call and restoring PLP after.
  - The printing decision uses BIT MSGFLG; the V flag (overflow) is used to reflect MSGFLG bit 6, hence BVC is an efficient test for "print allowed".

## Source Code
```asm
                                .LIB   ERRORHANDLER
                                ;***************************************
                                ;* STOP -- CHECK STOP KEY FLAG AND     *
                                ;* RETURN Z FLAG SET IF FLAG TRUE.     *
                                ;* ALSO CLOSES ACTIVE CHANNELS AND     *
                                ;* FLUSHES KEYBOARD QUEUE.             *
                                ;* ALSO RETURNS KEY DOWNS FROM LAST    *
                                ;* KEYBOARD ROW IN .A.                 *
                                ;***************************************
.,F6ED A5 91    LDA $91         NSTOP  LDA STKEY       ;VALUE OF LAST ROW
.,F6EF C9 7F    CMP #$7F        CMP    #$7F            ;CHECK STOP KEY POSITION
.,F6F1 D0 07    BNE $F6FA       BNE    STOP2           ;NOT DOWN
.,F6F3 08       PHP             PHP
.,F6F4 20 CC FF JSR $FFCC       JSR    CLRCH           ;CLEAR CHANNELS
.,F6F7 85 C6    STA $C6         STA    NDX             ;FLUSH QUEUE
.,F6F9 28       PLP             PLP
.,F6FA 60       RTS             STOP2  RTS
                                ;************************************
                                ;*                                  *
                                ;* ERROR HANDLER                    *
                                ;*                                  *
                                ;* PRINTS KERNAL ERROR MESSAGE IF   *
                                ;* BIT 6 OF MSGFLG SET.  RETURNS    *
                                ;* WITH ERROR # IN .A AND CARRY.    *
                                ;*                                  *
                                ;************************************
                                ;
.,F6FB A9 01    LDA #$01        ERROR1 LDA #1          ;TOO MANY FILES
.:F6FD 2C       .BYTE $2C       .BYT   $2C
.,F6FE A9 02    LDA #$02        ERROR2 LDA #2          ;FILE OPEN
.:F700 2C       .BYTE $2C       .BYT   $2C
.,F701 A9 03    LDA #$03        ERROR3 LDA #3          ;FILE NOT OPEN
.:F703 2C       .BYTE $2C       .BYT   $2C
.,F704 A9 04    LDA #$04        ERROR4 LDA #4          ;FILE NOT FOUND
.:F706 2C       .BYTE $2C       .BYT   $2C
.,F707 A9 05    LDA #$05        ERROR5 LDA #5          ;DEVICE NOT PRESENT
.:F709 2C       .BYTE $2C       .BYT   $2C
.,F70A A9 06    LDA #$06        ERROR6 LDA #6          ;NOT INPUT FILE
.:F70C 2C       .BYTE $2C       .BYT   $2C
.,F70D A9 07    LDA #$07        ERROR7 LDA #7          ;NOT OUTPUT FILE
.:F70F 2C       .BYTE $2C       .BYT   $2C
.,F710 A9 08    LDA #$08        ERROR8 LDA #8          ;MISSING FILE NAME
.:F712 2C       .BYTE $2C       .BYT   $2C
.,F713 A9 09    LDA #$09        ERROR9 LDA #9          ;BAD DEVICE #
                                ;
.,F715 48       PHA             PHA                    ;ERROR NUMBER ON STACK
.,F716 20 CC FF JSR $FFCC       JSR    CLRCH           ;RESTORE I/O CHANNELS
                                ;
.,F719 A0 00    LDY #$00        LDY    #MS1-MS1
.,F71B 24 9D    BIT $9D         BIT    MSGFLG          ;ARE WE PRINTING ERROR?
.,F71D 50 0A    BVC $F729       BVC    EREXIT          ;NO...
                                ;
.,F71F 20 2F F1 JSR $F12F       JSR    MSG             ;PRINT "CBM I/O ERROR #"
.,F722 68       PLA             PLA
.,F723 48       PHA             PHA
.,F724 09 30    ORA #$30        ORA    #$30            ;MAKE ERROR # ASCII
.,F726 20 D2 FF JSR $FFD2       JSR    BSOUT           ;PRINT IT
                                ;
.,F729 68       PLA             EREXIT PLA
.,F72A 38       SEC             SEC
.,F72B 60       RTS             RTS
                                .END
```

## Key Registers
- $0091 - Zero page - STKEY (last keyboard row/value checked for STOP)
- $009D - Zero page - MSGFLG (bit 6 controls KERNAL error message printing; BIT sets V to bit6)
- $00C6 - Zero page - NDX (used here to store/flush keyboard/index value)
- $FFCC - KERNAL (JSR CLRCH) - clear/restore I/O channels
- $F12F - KERNAL (JSR MSG) - print "CBM I/O ERROR" string
- $FFD2 - KERNAL (JSR BSOUT) - output single character on current output channel

## References
- "load_library" — expands uses of error codes (ERROR4: FILE NOT FOUND, ERROR9: BAD DEVICE #)
- "save_library" — invokes STOP and error printing on save failure

## Labels
- STKEY
- MSGFLG
- NDX
- CLRCH
- MSG
- BSOUT
