# KERNAL: SCNKEY (keyboard scan) and IRQ return (EA2E–EA87)

**Summary:** Describes the KERNAL IRQ return sequence and SCNKEY keyboard-scan entry (JSR $EA87), including blink cursor handling (BLNSW/$CC, BLNCT/$CD, BLNON/$CF), cassette port checks (R6510/$01, CAS1/$C0), clearing CIA1 ICR ($DC0D), and initialization of SHFLAG ($028D) and last-key index. Notes SCNKEY's role: column toggling, debouncing, KEYTAB translation, shift handling (SHFLAG/LSTSHF), repeat/queue logic, and RTI exit.

**Description**

This chunk contains the KERNAL interrupt-return and keyboard-scan logic around $EA2E–$EA87:

- IRQ return and housekeeping (starting at $EA2E):
  - STA $F4 / RTS (preserve USER+1, early return variant).
  - KEY (at $EA31): JSR $FFEA updates the jiffy clock.
  - Blink cursor handling:
    - Check BLNSW ($CC). If enabled, decrement BLNCT ($CD); when zero reset BLNCT to #$14 (20) and toggle BLNON ($CF).
    - On changing blink state, save original character and color (via pointers), set GDBLN and GDCOL ($0287), set COLOR ($0286) to blink color, EOR #$80 to invert high bit, and JSR DSPP2 to display the blinked character.
  - Cassette switch / motor handling:
    - Read port $01 (R6510), AND #$10 to detect a cassette switch; store CAS1 ($C0) accordingly.
    - If motor bit not set, ORA #$20 to set motor-on flag and STA $01 to write back to port $01.
  - SCNKEY is invoked (JSR $EA87) to scan the keyboard matrix.
  - Clear CIA1 interrupt flags by LDA $DC0D (CIA1 ICR) before restoring registers and RTI (PLAs, TAX/TAY, RTI).

- SCNKEY entry (at $EA87):
  - Initialize: LDA #$00; STA $028D (SHFLAG) — clear shift flags.
  - LDY #$40 — set the "last key index" (initial value used by scan/translate routines).
  - SCNKEY handles:
    - Toggling column lines (COLM), reading row inputs, debouncing (multiple compares), translating raw matrix codes through KEYTAB tables, handling special keys (SHIFT, STOP, Commodore key combos via SHFLOG), updating shift state (SHFLAG/LSTSHF), key repeat/delay logic, queueing keys (KEYLOG indirect), and returning from IRQ with RTI.
  - SCNKEY may call RSP232 protection routines and references SHFLOG/KEYCOD translation helpers.

This chunk keeps the exact register uses and control-flow relevant to keyboard scanning and IRQ exit, preserving KERNAL variable locations and side effects on I/O port $01 and CIA1.

## Source Code
```asm
.,EA2E 85 F4    STA $F4         STA    USER+1
.,EA30 60       RTS             RTS
.,EA31 20 EA FF JSR $FFEA       KEY    JSR $FFEA       ;UPDATE JIFFY CLOCK
.,EA34 A5 CC    LDA $CC                LDA BLNSW       ;BLINKING CRSR ?
.,EA36 D0 29    BNE $EA61              BNE KEY4        ;NO
.,EA38 C6 CD    DEC $CD                DEC BLNCT       ;TIME TO BLINK ?
.,EA3A D0 25    BNE $EA61              BNE KEY4        ;NO
.,EA3C A9 14    LDA #$14               LDA #20         ;RESET BLINK COUNTER
.,EA3E 85 CD    STA $CD         REPDO  STA BLNCT
.,EA40 A4 D3    LDY $D3                LDY PNTR        ;CURSOR POSITION
.,EA42 46 CF    LSR $CF                LSR BLNON       ;CARRY SET IF ORIGINAL CHAR
.,EA44 AE 87 02 LDX $0287              LDX GDCOL       ;GET CHAR ORIGINAL COLOR
.,EA47 B1 D1    LDA ($D1),Y            LDA (PNT)Y      ;GET CHARACTER
.,EA49 B0 11    BCS $EA5C              BCS KEY5        ;BRANCH IF NOT NEEDED
.,EA4B E6 CF    INC $CF                INC BLNON       ;SET TO 1
.,EA4D 85 CE    STA $CE                STA GDBLN       ;SAVE ORIGINAL CHAR
.,EA4F 20 24 EA JSR $EA24              JSR SCOLOR
.,EA52 B1 F3    LDA ($F3),Y            LDA (USER)Y     ;GET ORIGINAL COLOR
.,EA54 8D 87 02 STA $0287              STA GDCOL       ;SAVE IT
.,EA57 AE 86 02 LDX $0286              LDX COLOR       ;BLINK IN THIS COLOR
.,EA5A A5 CE    LDA $CE                LDA GDBLN       ;WITH ORIGINAL CHARACTER
.,EA5C 49 80    EOR #$80        KEY5   EOR #$80        ;BLINK IT
.,EA5E 20 1C EA JSR $EA1C              JSR DSPP2       ;DISPLAY IT
.,EA61 A5 01    LDA $01         KEY4   LDA R6510       ;GET CASSETTE SWITCHES
.,EA63 29 10    AND #$10               AND #$10        ;IS SWITCH DOWN ?
.,EA65 F0 0A    BEQ $EA71              BEQ KEY3        ;BRANCH IF SO
.,EA67 A0 00    LDY #$00        LDY    #0
.,EA69 84 C0    STY $C0                STY CAS1        ;CASSETTE OFF SWITCH
.,EA6B A5 01    LDA $01                LDA R6510
.,EA6D 09 20    ORA #$20               ORA #$20
.,EA6F D0 08    BNE $EA79              BNE KL24        ;BRANCH IF MOTOR IS OFF
.,EA71 A5 C0    LDA $C0         KEY3   LDA CAS1
.,EA73 D0 06    BNE $EA7B              BNE KL2
.,EA75 A5 01    LDA $01                LDA R6510
.,EA77 29 1F    AND #$1F               AND #%011111    ;TURN MOTOR ON
                                ;
                                KL24
.,EA79 85 01    STA $01                STA R6510
                                ;
.,EA7B 20 87 EA JSR $EA87       KL2    JSR SCNKEY      ;SCAN KEYBOARD
                                ;
.,EA7E AD 0D DC LDA $DC0D       KPREND LDA D1ICR       ;CLEAR INTERUPT FLAGS
.,EA81 68       PLA                    PLA             ;RESTORE REGISTERS
.,EA82 A8       TAY                    TAY
.,EA83 68       PLA                    PLA
.,EA84 AA       TAX                    TAX
.,EA85 68       PLA                    PLA
.,EA86 40       RTI                    RTI             ;EXIT FROM IRQ ROUTINES
                                ; ****** GENERAL KEYBOARD SCAN ******
                                ;
.,EA87 A9 00    LDA #$00        SCNKEY LDA #$00
.,EA89 8D 8D 02 STA $028D              STA SHFLAG
.,EA8C A0 40    LDY #$40               LDY #64         ;LAST KEY INDEX
```

## Key Registers
- $028D - KERNAL - SHFLAG (shift-flag storage, cleared at SCNKEY entry)
- $0287 - KERNAL - GDCOL (saved original character color)
- $0286 - KERNAL - COLOR (blink/display color)
- $01 - 6510 I/O port - cassette switches / motor control bits (R6510)
- $C0 - Zero Page - CAS1 (saved cassette switch state)
- $CC - Zero Page - BLNSW (blink enable switch)
- $CD - Zero Page - BLNCT (blink counter)
- $CF - Zero Page - BLNON (blink-on flag / original-char flag)
- $D1 - Zero Page - pointer used with Y to fetch characters (LDA ($D1),Y)
- $F3 - Zero Page - USER pointer (LDA ($F3),Y used to fetch color data)
- $DC0D - CIA 1 ($DC00-$DC0F) - ICR (Interrupt Control Register) — cleared during IRQ return

## References
- "key_tables_mode1_2_3" — KEYTAB translation tables used by SCNKEY
- "shift_logic_and_keycod" — SHFLOG and keycode/shift combination handling

## Labels
- SCNKEY
- SHFLAG
- GDCOL
- COLOR
