# KERNAL Case Conversion & Shift Logic (keyboard handling, $D018, KEYLOG)

**Summary:** Handles case/shift logic and keyboard mode selection by manipulating VIC-II register $D018, MODE flags and keyboard translation tables (KEYLOG). Implements function-key detection, CR handling, quote-mode toggling (QTSW), insertion into the current line buffer with line-length checking, scrolling (NEWLIN), color updates (SCOLOR), and keyboard lock/unlock behavior.

## Behavior Overview
This code fragment (starting at $E7DA) is the KERNAL routine for processing typed characters and special keys, with the following notable behaviors and checks:

- Entry/setup
  - $E7DA: loads #$5E into A (initial value used by NXTX1 / NXTXA labels).
- Function-key vs printable character
  - CMP #$20 at $E7DC tests whether the incoming key is a function/keycode ($A < $20 => branch).
  - CMP #$0D at $E7E3 tests for CR (carriage return).
- Quote/insert mode handling
  - Reads QTSW at $D4 (LDX $D4 at $E7EA). If QTSW non-zero, it sets bit $40 (ORA #$40 at $E82D) to mark shifted/quoted entry.
  - Reads LNMX at $D5 (LDY $D5 at $E7F2) and uses (PNT)Y addressing (indirect indexed via $D1) to fetch/modify characters in the current input line.
- Line length / insertion logic
  - Compares Y with PNTR ($D3) and with a maximum value (#$4F — CPY #$4F at $E7FE) to enforce MAXCHR-1 limit; if at max, branches to INSEXT (exit) to avoid overflow.
  - If insertion needed and line length will grow past limit, calls NEWLIN ($E965) to scroll the screen and make room.
  - SCOLOR ($EA24) is called to set/update color for inserted characters.
  - Uses indirect (PNT)Y and (USER)Y stores to write the character into the input buffer and user-visible buffer.
  - Increments INSRT at $D8 after a successful insert (INC $D8).
- Special-key handling (left/erase/translation table index)
  - CMP #$11 at $E832 detects a special key code (#$11 branch to UP2). UP2 handler checks TBLX at $D6 (LDX $D6 at $E836) and adjusts the translation table index or pointer (DEC $D6, SBC #$28 etc.) and may call STUPT ($E56C) to set up pointer tables.
- Color / USER buffer
  - Loads COLOR from $0286 (LDA $0286 at $E81F) and stores it into (USER)Y to keep color in sync with inserted character.
- Labels / Jumps
  - Notable labels in the fragment: NXTX1/NXTXA (entry), UHUH, NXT33, NXT1, UP5/UP6/UP9/UP2, INS1/INS2/INS3/INSEXT, UPALIN, JPL2, UPALIN, NC3.
- Variables referenced (RAM locations used by this logic)
  - $D1 — PNT (pointer to current input buffer)
  - $D3 — PNTR (current line pointer/index)
  - $D4 — QTSW (quote/shift switch)
  - $D5 — LNMX (line max or length indicator)
  - $D6 — TBLX (translation table index)
  - $D8 — INSRT (insert/insert-mode counter)
  - $F3 — USER (pointer to user/display buffer)
  - $0286 — COLOR (current text color used by SCOLOR/insert)
- External KERNAL calls used
  - JSR $E965 (NEWLIN) — scroll down / make room on CR/insert overflow
  - JSR $EA24 (SCOLOR) — set color attributes for insertion
  - JSR $E56C (STUPT) — set up pointer/translation tables when table index changes

## Source Code
```asm
.,E7DA A9 5E    LDA #$5E        LDA    #$5E
                                NXTX1
                                NXTXA
.,E7DC C9 20    CMP #$20               CMP #$20        ;IS IT A FUNCTION KEY
.,E7DE 90 03    BCC $E7E3       BCC    UHUH
.,E7E0 4C 91 E6 JMP $E691       JMP    NXT33
                                UHUH
.,E7E3 C9 0D    CMP #$0D        CMP    #$D
.,E7E5 D0 03    BNE $E7EA       BNE    UP5
.,E7E7 4C 91 E8 JMP $E891       JMP    NXT1
.,E7EA A6 D4    LDX $D4         UP5    LDX  QTSW
.,E7EC D0 3F    BNE $E82D       BNE    UP6
.,E7EE C9 14    CMP #$14        CMP    #$14
.,E7F0 D0 37    BNE $E829       BNE    UP9
.,E7F2 A4 D5    LDY $D5         LDY    LNMX
.,E7F4 B1 D1    LDA ($D1),Y     LDA    (PNT)Y
.,E7F6 C9 20    CMP #$20        CMP    #'
.,E7F8 D0 04    BNE $E7FE       BNE    INS3
.,E7FA C4 D3    CPY $D3         CPY    PNTR
.,E7FC D0 07    BNE $E805       BNE    INS1
.,E7FE C0 4F    CPY #$4F        INS3   CPY #MAXCHR-1
.,E800 F0 24    BEQ $E826       BEQ    INSEXT          ;EXIT IF LINE TOO LONG
.,E802 20 65 E9 JSR $E965       JSR    NEWLIN          ;SCROLL DOWN 1
.,E805 A4 D5    LDY $D5         INS1   LDY LNMX
.,E807 20 24 EA JSR $EA24       JSR    SCOLOR
.,E80A 88       DEY             INS2   DEY
.,E80B B1 D1    LDA ($D1),Y     LDA    (PNT)Y
.,E80D C8       INY             INY
.,E80E 91 D1    STA ($D1),Y     STA    (PNT)Y
.,E810 88       DEY             DEY
.,E811 B1 F3    LDA ($F3),Y     LDA    (USER)Y
.,E813 C8       INY             INY
.,E814 91 F3    STA ($F3),Y     STA    (USER)Y
.,E816 88       DEY             DEY
.,E817 C4 D3    CPY $D3         CPY    PNTR
.,E819 D0 EF    BNE $E80A       BNE    INS2
.,E81B A9 20    LDA #$20        LDA    #$20
.,E81D 91 D1    STA ($D1),Y     STA    (PNT)Y
.,E81F AD 86 02 LDA $0286       LDA    COLOR
.,E822 91 F3    STA ($F3),Y     STA    (USER)Y
.,E824 E6 D8    INC $D8         INC    INSRT
.,E826 4C A8 E6 JMP $E6A8       INSEXT JMP LOOP2
.,E829 A6 D8    LDX $D8         UP9    LDX INSRT
.,E82B F0 05    BEQ $E832       BEQ    UP2
.,E82D 09 40    ORA #$40        UP6    ORA #$40
.,E82F 4C 97 E6 JMP $E697       JMP    NC3
.,E832 C9 11    CMP #$11        UP2    CMP #$11
.,E834 D0 16    BNE $E84C       BNE    NXT2
.,E836 A6 D6    LDX $D6         LDX    TBLX
.,E838 F0 37    BEQ $E871              BEQ JPL2
.,E83A C6 D6    DEC $D6                DEC TBLX
.,E83C A5 D3    LDA $D3                LDA PNTR
.,E83E 38       SEC                    SEC
.,E83F E9 28    SBC #$28               SBC #LLEN
.,E841 90 04    BCC $E847              BCC UPALIN
.,E843 85 D3    STA $D3                STA PNTR
.,E845 10 2A    BPL $E871              BPL JPL2
.,E847 20 6C E5 JSR $E56C       UPALIN JSR STUPT
.,E84A D0 25    BNE $E871       BNE    JPL2
.,E84C C9 12    CMP #$12        NXT2   CMP #$12
```

## Key Registers
- $D018 - VIC-II - VIC control register used by KERNAL here to change character/graphics banking or display mode for case/character mapping (toggled during case/shift handling)

## References
- "key_tables_mode1_2_3" — expands on keyboard translation tables used during shift/case handling

## Labels
- PNT
- PNTR
- QTSW
- LNMX
- TBLX
- INSRT
- USER
- COLOR
