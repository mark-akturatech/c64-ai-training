# KERNAL GETIN and BASIN routines ($F14E–$F192)

**Summary:** Disassembly and explanation of KERNAL GETIN/BASIN input dispatching: device select via DFLTN ($99), keyboard handling (keyboard queue, PNTR $D3 / TBLX $D6 preservation), RS232 path (BSI232 call at $F086), cassette JTGET handling, and screen-device fake-CR behavior.

## Overview
This chunk covers two KERNAL input entry points:

- GETIN (starts around $F14E): dispatches based on DFLTN ($99). For RS232 it preserves Y in XSAV ($97), JSR to BSI232 ($F086), restores Y and returns with CLC/RTS. For keyboard device 0 it falls through to the BASIN path (keyboard queue handling via LP2).
- BASIN (label NBASIN at $F157): handles character input from logical channels:
  - Device 0 — Keyboard: saves current cursor column (PNTR $D3 -> LSTP $CA) and line index (TBLX $D6 -> LSXP $C9) then jumps to the screen editor loop (LOOP5 at $E632) which supplies characters until a CR.
  - Device 3 — Screen: fakes a carriage return by storing into CRSW ($D0) and sets INDX ($C8) from LNMX ($D5), then jumps to the same screen-editor character fetch (LOOP5).
  - Device 2 — RS232: handled by branching to the RS232 path (BN50).
  - Device 1 — Cassette: calls JTGET ($F199) to fetch characters from cassette buffers; preserves X in XSAV ($97), checks carry for errors/stop-key, manages EOF reporting (JSR UDST $FE1C with A=#$40 to indicate EOF), decrements BUFPT ($A6) when appropriate, and returns the character (via PLA) or error.
  - Devices >3 — serial bus devices (4–31) branch to the serial-bus BASIN handling (BN30).

Behavioral notes preserved from the listing:
- XSAV ($97) is used to save register X or Y when calling external device handlers.
- BASIN differs from GET (device 3 screen behavior uses a fake CR rather than actual keyboard input).
- Cassette JTGET returns characters via stack (PHA/PLA) and uses carry to indicate errors/stop key.
- The code relies on zero-page variables to hold temporary state while the screen-editor loop runs and then restores them after editing.

Addresses and labels shown are exact to the disassembly; the screen-editor entry point used is LOOP5 ($E632), and RS232 fetch is BSI232 ($F086). All control returns are standard 6502 CLC/RTS pairs where appropriate.

## Source Code
```asm
.,F14E 84 97    STY $97         GN232  STY XSAV        ;SAVE .Y, USED IN RS232
.,F150 20 86 F0 JSR $F086              JSR BSI232
.,F153 A4 97    LDY $97                LDY XSAV        ;RESTORE .Y
.,F155 18       CLC             GN20   CLC             ;GOOD RETURN
.,F156 60       RTS                    RTS
                                ;***************************************
                                ;* BASIN-- INPUT CHARACTER FROM CHANNEL*
                                ;*     INPUT DIFFERS FROM GET ON DEVICE*
                                ;* #0 FUNCTION WHICH IS KEYBOARD. THE  *
                                ;* SCREEN EDITOR MAKES READY AN ENTIRE *
                                ;* LINE WHICH IS PASSED CHAR BY CHAR   *
                                ;* UP TO THE CARRIAGE RETURN.  OTHER   *
                                ;* DEVICES ARE:                        *
                                ;*      0 -- KEYBOARD                  *
                                ;*      1 -- CASSETTE #1               *
                                ;*      2 -- RS232                     *
                                ;*      3 -- SCREEN                    *
                                ;*   4-31 -- SERIAL BUS                *
                                ;***************************************
                                ;
.,F157 A5 99    LDA $99         NBASIN LDA DFLTN       ;CHECK DEVICE
.,F159 D0 0B    BNE $F166       BNE    BN10            ;IS NOT KEYBOARD...
                                ;
                                ;INPUT FROM KEYBOARD
                                ;
.,F15B A5 D3    LDA $D3         LDA    PNTR            ;SAVE CURRENT...
.,F15D 85 CA    STA $CA         STA    LSTP            ;... CURSOR COLUMN
.,F15F A5 D6    LDA $D6         LDA    TBLX            ;SAVE CURRENT...
.,F161 85 C9    STA $C9         STA    LSXP            ;... LINE NUMBER
.,F163 4C 32 E6 JMP $E632       JMP    LOOP5           ;BLINK CURSOR UNTIL RETURN
                                ;
.,F166 C9 03    CMP #$03        BN10   CMP #3          ;IS INPUT FROM SCREEN?
.,F168 D0 09    BNE $F173       BNE    BN20            ;NO...
                                ;
.,F16A 85 D0    STA $D0         STA    CRSW            ;FAKE A CARRIAGE RETURN
.,F16C A5 D5    LDA $D5         LDA    LNMX            ;SAY WE ENDED...
.,F16E 85 C8    STA $C8         STA    INDX            ;...UP ON THIS LINE
.,F170 4C 32 E6 JMP $E632       JMP    LOOP5           ;PICK UP CHARACTERS
                                ;
.,F173 B0 38    BCS $F1AD       BN20   BCS BN30        ;DEVICES >3
.,F175 C9 02    CMP #$02        CMP    #2              ;RS232?
.,F177 F0 3F    BEQ $F1B8       BEQ    BN50
                                ;
                                ;INPUT FROM CASSETTE BUFFERS
                                ;
.,F179 86 97    STX $97         STX    XSAV
.,F17B 20 99 F1 JSR $F199       JSR    JTGET
.,F17E B0 16    BCS $F196       BCS    JTG37           ;STOP KEY/ERROR
.,F180 48       PHA             PHA
.,F181 20 99 F1 JSR $F199       JSR    JTGET
.,F184 B0 0D    BCS $F193       BCS    JTG36           ;STOP KEY/ERROR
.,F186 D0 05    BNE $F18D       BNE    JTG35           ;NOT AN END OF FILE
.,F188 A9 40    LDA #$40        LDA    #64             ;TELL USER EOF
.,F18A 20 1C FE JSR $FE1C       JSR    UDST            ;IN STATUS
.,F18D C6 A6    DEC $A6         JTG35  DEC BUFPT
.,F18F A6 97    LDX $97         LDX    XSAV            ;.X PRESERVED
.,F191 68       PLA             PLA                    ;CHARACTER RETURNED
                                ;C-CLEAR FROM JTGET
.,F192 60       RTS             RTS                    ;ALL DONE
```

## Key Registers
- $0097 - Memory - XSAV (saved X/Y across device calls)
- $0099 - Memory - DFLTN (default input device number)
- $00A6 - Memory - BUFPT (cassette buffer pointer)
- $00C8 - Memory - INDX (index used when faking CR for screen device)
- $00C9 - Memory - LSXP (saved line number / TBLX backup)
- $00CA - Memory - LSTP (saved cursor column / PNTR backup)
- $00D0 - Memory - CRSW (flag used to fake a carriage return for screen device)
- $00D3 - Memory - PNTR (cursor column / keyboard pointer)
- $00D5 - Memory - LNMX (line max / line end index)
- $00D6 - Memory - TBLX (current line number/index)

## References
- "keyboard_scan_and_irq_handling" — expands on keyboard queue removal (LP2/LP1)
- "rs232inout_buffer_and_protection" — expands on BSI232 RS232 input handling and buffering

## Labels
- GETIN
- BASIN
