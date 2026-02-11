# CINT1: I/O and Screen Initialization (KERNAL disassembly)

**Summary:** KERNAL init routines for I/O and screen setup: CINT1 initializes I/O defaults and keyboard parameters, CLEAR SCREEN builds LDTB1 ($00D9-$00F2) and erases the text area, HOME CURSOR sets PNTR/TBLX to 0, SET SCREEN POINTERS computes screen pointers and calls line/start routines, and SET I/O DEFAULTS copies VIC-II registers from the table at $ECB8 to VIC-II registers $D000-$D02E. Searchable terms: $ECB8, $CFFF..$D02E, VIC-II, LDTB1, $00D9-$00F2, $0286 COLOR, $0289 XMAX, $028B KOUNT, DFLTO ($009A), DFLTN ($0099).

## CINT1: INITIALISE I/O
Sets up KERNAL I/O and keyboard/screen defaults:
- Calls SET I/O DEFAULTS to set default input/output and initialize VIC-II registers.
- Disables SHIFT+CBM by clearing MODE at $0291.
- Configures cursor blink enable/flags: BLNON, stored to $CF, and cursor timers (BLCNT $00CD, BLNSW $00CC).
- Sets KEYLOG vector to point to $EB48 via $0290.
- Keyboard buffer size and repeat parameters:
  - XMAX ($0289) = 10 (keyboard buffer max chars)
  - KOUNT ($028B) = repeat interval (how many $028C ticks before new key)
  - $028C = initial delay (how many 1/60s before repeat starts)
- Sets cursor color via $0286 (COLOR = light blue).
- Sets other keyboard repeat / key-log related values.

Behavioral notes:
- Most keyboard and cursor timing/flags are stored in page $02 variables (not zero page).
- The routine ends by jumping into screen clear/home cursor sequence.

## CLEAR SCREEN (LDTB1 setup and screen erase)
- Builds the screen line link table LDTB1 at $00D9..$00F2 by starting from HIBASE ($0288) and storing successive line start pointers (adds $28 per line). The last pointer is written as $FF to mark the end.
- Uses a loop with X from 0 to $19 (26 lines) writing Y (page) into $D9,X and incrementing address by $28 per line; the table spans $00D9-$00F2.
- After building LDTB1, clears the screen line-by-line starting from the bottom (line $18) by calling the line-erase subroutine.

## HOME CURSOR
- Sets cursor column (PNTR, $00D3) and line (TBLX, $00D6) to zero (top-left).
- Simple LDY #$00 / STY $D3 / STY $D6 sequence.

## SET SCREEN POINTERS
- On entry: TBLX ($00D6) = screen line index, PNTR ($00D3) = cursor column.
- Computes the physical address for the cursor by indexing into LDTB1:
  - LDY = LDTB1[X] (LDY $00D9,X)
  - If the high-byte indicates negative (BMI uses sign test), performs carry-safe add of $28 per step to derive column start (adds #$28 and stores back to PNTR).
- Calls subroutines to set start-of-line and to sync color pointer.
- Stores computed line length into LMNX ($00D5).
- Checks LXSP ($00C9) to determine cursor retreat behavior (cursor at start of input).

## SET I/O DEFAULTS
- Sets default output device DFLTO ($009A) = 3 (screen) and default input device DFLTN ($0099) = 0 (keyboard).
- Copies VIC-II register initial values from the video chip setup table at $ECB8 upwards into the VIC-II register block $CFFF,X (which maps to $CFFF..$D02E when indexed).
  - Uses LDX #$2F and loops: LDA $ECB8,X / STA $CFFF,X (writes $CFFF+$X range, covering $D000-$D02E).
- Returns after HOME cursor is set (caller then continues with cursor/home flow).

## Source Code
```asm
.,E518 20 A0 E5 JSR $E5A0
.,E51B A9 00    LDA #$00
.,E51D 8D 91 02 STA $0291
.,E520 85 CF    STA $CF
.,E522 A9 48    LDA #$48
.,E524 8D 8F 02 STA $028F
.,E527 A9 EB    LDA #$EB
.,E529 8D 90 02 STA $0290
.,E52C A9 0A    LDA #$0A
.,E52E 8D 89 02 STA $0289
.,E531 8D 8C 02 STA $028C
.,E534 A9 0E    LDA #$0E
.,E536 8D 86 02 STA $0286
.,E539 A9 04    LDA #$04
.,E53B 8D 8B 02 STA $028B
.,E53E A9 0C    LDA #$0C
.,E540 85 CD    STA $CD
.,E542 85 CC    STA $CC

.,E544 AD 88 02 LDA $0288
.,E547 09 80    ORA #$80
.,E549 A8       TAY
.,E54A A9 00    LDA #$00
.,E54C AA       TAX
.,E54D 94 D9    STY $D9,X
.,E54F 18       CLC
.,E550 69 28    ADC #$28
.,E552 90 01    BCC $E555
.,E554 C8       INY
.,E555 E8       INX
.,E556 E0 1A    CPX #$1A
.,E558 D0 F3    BNE $E54D
.,E55A A9 FF    LDA #$FF
.,E55C 95 D9    STA $D9,X
.,E55E A2 18    LDX #$18
.,E560 20 FF E9 JSR $E9FF
.,E563 CA       DEX
.,E564 10 FA    BPL $E560

.,E566 A0 00    LDY #$00
.,E568 84 D3    STY $D3
.,E56A 84 D6    STY $D6

.,E56C A6 D6    LDX $D6
.,E56E A5 D3    LDA $D3
.,E570 B4 D9    LDY $D9,X
.,E572 30 08    BMI $E57C
.,E574 18       CLC
.,E575 69 28    ADC #$28
.,E577 85 D3    STA $D3
.,E579 CA       DEX
.,E57A 10 F4    BPL $E570
.,E57C 20 F0 E9 JSR $E9F0
.,E57F A9 27    LDA #$27
.,E581 E8       INX
.,E582 B4 D9    LDY $D9,X
.,E584 30 06    BMI $E58C
.,E586 18       CLC
.,E587 69 28    ADC #$28
.,E589 E8       INX
.,E58A 10 F6    BPL $E582
.,E58C 85 D5    STA $D5
.,E58E 4C 24 EA JMP $EA24
.,E591 E4 C9    CPX $C9
.,E593 F0 03    BEQ $E598
.,E595 4C ED E6 JMP $E6ED
.,E598 60       RTS

.,E599 EA       NOP

.,E59A 20 A0 E5 JSR $E5A0
.,E59D 4C 66 E5 JMP $E566
.,E5A0 A9 03    LDA #$03
.,E5A2 85 9A    STA $9A
.,E5A4 A9 00    LDA #$00
.,E5A6 85 99    STA $99
.,E5A8 A2 2F    LDX #$2F
.,E5AA BD B8 EC LDA $ECB8,X
.,E5AD 9D FF CF STA $CFFF,X
.,E5B0 CA       DEX
.,E5B1 D0 F7    BNE $E5AA
.,E5B3 60       RTS
```

## Key Registers
- $D000-$D02E - VIC-II - Video chip registers initialized from table at $ECB8 (copied via STA $CFFF,X loop)
- $ECB8-$E5?? - ROM - VIC setup table (source table location; data copied to VIC registers)
- $00D9-$00F2 - LDTB1 - Screen line link table (line start pages stored here)
- $00D3 - PNTR - Cursor column pointer
- $00D6 - TBLX - Cursor line / table index
- $00D5 - LMNX - Physical screen line length (stored by SET SCREEN POINTERS)
- $00CD - BLCNT - Cursor toggle timer
- $00CC - BLNSW - Cursor enable/blink state
- $00C9 - LXSP - Cursor start-of-input flag (checked in SET SCREEN POINTERS)
- $009A - DFLTO - Default output device (set to 3 = screen)
- $0099 - DFLTN - Default input device (set to 0 = keyboard)
- $0286 - COLOR - Cursor/text color (set to light blue)
- $0288 - HIBASE - High byte of screen base (used to build LDTB1)
- $0289 - XMAX - Keyboard buffer length (10)
- $028B - KOUNT - Key repeat counter interval
- $028C - Repeat delay (1/60s counter before key repeat)
- $028F - (used to store a value; set during init)
- $0290 - KEYLOG vector (points to $EB48)
- $0291 - MODE - SHIFT+CBM disable flag (cleared to disable)

## References
- "video_chip_setup" — expands on the VIC register initial values/table at $ECB8 used by SET I/O DEFAULTS
- "keyboard_input_and_screen_output" — expands on keyboard buffer length, repeat timing, and input handling initialized here

## Labels
- DFLTO
- DFLTN
- LDTB1
- PNTR
- TBLX
- LMNX
- HIBASE
- XMAX
