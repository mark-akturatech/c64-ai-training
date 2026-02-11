# KERNAL INPUT helper ($E632..$E683)

**Summary:** KERNAL routine at $E632–$E683 implements INPUT-from-screen-or-keyboard helper logic: tests CRSW ($00D0) to choose keyboard or screen, reads a character via LDA ($00D1),Y, performs quote (QTSW/$00D4) and reverse-video handling, increments PNTR ($00D3), calls QUOTES TSET (JSR $E684), handles end-of-line (INDX/$00C8) and default device checks (DFLTN/$0099, DFLTO/$009A), and returns the character in A (mapping $DE → $FF). X and Y are preserved across the call.

## Description
- Entry/exit register handling: X and Y are preserved (TYA / PHA; TXA / PHA on entry; PLA / TAX; PLA / TAY on exit).
- Device selection: CRSW at $00D0 is tested; if zero the routine branches to the keyboard-input path ($E5CD). Non-zero selects screen input.
- Screen read: the routine loads Y from PNTR ($00D3) and performs LDA ($00D1),Y to fetch the character from the current screen address; the fetched byte is stored into temporary $00D7.
- Character processing:
  - The accumulator is masked with AND #$3F (low 6 bits).
  - $00D7 is ASL'd and BIT $00D7 is used to test attribute bits (used for reverse-video/quote logic).
  - Depending on flags, high bits are OR'ed into A (#$80 or #$40) before further processing.
  - The routine increments PNTR ($00D3) and calls QUOTES TSET (JSR $E684) to handle quote-mode toggling when appropriate.
- End-of-line handling: compares Y with INDX ($00C8); if equal, PNTR is reset for a new line: CRSW ($00D0) is cleared and A is set to $0D (CR) and may be echoed to the screen, depending on default I/O devices.
- Output echo: if necessary the routine JSRs the screen-output routine ($E716) to echo the CR to screen based on DFLTN ($0099) and DFLTO ($009A) values (screen device == #$03).
- Return value: before returning, the fetched byte from $00D7 is compared with $DE; if equal, A is set to $FF (special mapping). CLC is executed and RTS returns with the character in A.
- External interactions:
  - Keyboard path: branches to INPUT-from-keyboard handler at $E5CD.
  - Quote handling: delegates to QUOTES TSET at $E684.
  - Screen echo: delegates to screen output at $E716.

## Source Code
```asm
.,E632 98       TYA
.,E633 48       PHA
.,E634 8A       TXA
.,E635 48       PHA
.,E636 A5 D0    LDA $D0         ; CRSW
.,E638 F0 93    BEQ $E5CD       ; branch to keyboard input
.,E63A A4 D3    LDY $D3         ; PNTR (cursor column)
.,E63C B1 D1    LDA ($D1),Y     ; read from current screen address
.,E63E 85 D7    STA $D7         ; temp store
.,E640 29 3F    AND #$3F
.,E642 06 D7    ASL $D7
.,E644 24 D7    BIT $D7
.,E646 10 02    BPL $E64A
.,E648 09 80    ORA #$80
.,E64A 90 04    BCC $E650
.,E64C A6 D4    LDX $D4         ; QTSW, quotes mode
.,E64E D0 04    BNE $E654
.,E650 70 02    BVS $E654
.,E652 09 40    ORA #$40
.,E654 E6 D3    INC $D3         ; PNTR++
.,E656 20 84 E6 JSR $E684       ; QUOTES TSET
.,E659 C4 C8    CPY $C8         ; INDX, end of logical line
.,E65B D0 17    BNE $E674
.,E65D A9 00    LDA #$00
.,E65F 85 D0    STA $D0         ; clear CRSW
.,E661 A9 0D    LDA #$0D
.,E663 A6 99    LDX $99         ; DFLTN (default input)
.,E665 E0 03    CPX #$03        ; compare to screen device (#$03)
.,E667 F0 06    BEQ $E66F
.,E669 A6 9A    LDX $9A         ; DFLTO (default output)
.,E66B E0 03    CPX #$03
.,E66D F0 03    BEQ $E672
.,E66F 20 16 E7 JSR $E716       ; output CR to screen
.,E672 A9 0D    LDA #$0D
.,E674 85 D7    STA $D7
.,E676 68       PLA
.,E677 AA       TAX
.,E678 68       PLA
.,E679 A8       TAY
.,E67A A5 D7    LDA $D7
.,E67C C9 DE    CMP #$DE
.,E67E D0 02    BNE $E682
.,E680 A9 FF    LDA #$FF
.,E682 18       CLC
.,E683 60       RTS
```

## Key Registers
- $00D0 - KERNAL CRSW - selects keyboard (0) vs screen input (non-zero)
- $00D1 - zero page pointer (pair) - base pointer used by LDA ($00D1),Y to read screen memory
- $00D3 - PNTR - screen cursor column / index used as Y in indirect read; incremented after read
- $00D4 - QTSW - quotes mode flag (checked to determine quote handling)
- $00D7 - temp storage / return character (stores fetched screen byte)
- $00C8 - INDX - end-of-logical-line index compared against Y
- $0099 - DFLTN - default input device (tested against #$03 = screen)
- $009A - DFLTO - default output device (tested against #$03 = screen)

## References
- "quotes_tset" — expands on QUOTES TSET (JSR $E684) called here to toggle/handle quotes
- "input_from_keyboard" — expands on keyboard path branches (BEQ to $E5CD) and keyboard input handling

## Labels
- CRSW
- PNTR
- QTSW
- INDX
- DFLTN
- DFLTO
