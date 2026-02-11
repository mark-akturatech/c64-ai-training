# Input routine: read from screen or wait for keyboard (ROM E632-E683)

**Summary:** Reads a character either from the screen buffer or, if $D0==0, branches to the keyboard-wait routine; uses zero-page variables $D0/$D1/$D3/$D4/$D7 and compares Y to $C8, toggles cursor quote flag via JSR $E684, may convert a screen-read into CR and route output (JSR $E716), restores X/Y and returns with the character in A (RTS).

## Operation
- Prologue: save Y and X on the stack (TYA/PHA / TXA/PHA).
- Input source test:
  - LDA $D0 — $D0 nonzero = input is from screen; $D0 == $00 = keyboard.
  - BEQ $E5CD — if keyboard, branch to the keyboard wait/read routine (not included here).
- Screen read:
  - LDY $D3 — load cursor column into Y.
  - LDA ($D1),Y — fetch the character at (pointer in $D1) + Y, i.e. character under cursor from current screen line.
  - STA $D7 — save that byte into zero-page $D7 as a temporary last-character.
  - AND #$3F — mask A to low 6 bits (strip attribute/high bits).
  - ASL $D7 — shift the saved byte left one; ASL affects Carry (used later).
  - BIT $D7 — set N/V from $D7 (used by following branch).
  - BPL $E64A — if bit7 of $D7 was clear (positive), branch to $E64A (character present / not "no key").
  - ORA #$80 — set bit7 in A (mark as high-bit set).
  - BCC $E650 — branch based on Carry (carry came from ASL of $D7): if Carry clear, branch to $E650 (handling depends on carry).
- Quote handling:
  - LDX $D4 — load cursor quote flag: $D4 == $xx -> in-quote, $00 -> not in quote.
  - BNE $E654 — if in quote mode, skip the next branch (flow continues at $E654).
  - BVS $E654 — (falls through here if not in-quote and overflow set) otherwise ORA #$40 happens next.
  - ORA #$40 — set bit6 of A (used for quote tracking in screen-read).
- Cursor advance and quote-toggle call:
  - INC $D3 — increment cursor column.
  - JSR $E684 — call helper to toggle the open-quote flag when an open-quote character was encountered (subroutine handles quote state).
- End-of-line check / convert to CR:
  - CPY $C8 — compare Y (cursor column) with $C8 (end-of-line pointer / maximum column).
  - BNE $E674 — if not at line end, branch to restore/return.
  - LDA #$00 / STA $D0 — clear $D0 to indicate subsequent input is keyboard (clear screen-source flag).
  - LDA #$0D — set A to CR (ASCII 13).
  - LDX $99 / CPX #$03 — compare input device number in $99 to $03 (the screen device).
  - BEQ $E66F — if input device is the screen, skip to output handling.
  - LDX $9A / CPX #$03 — compare output device number in $9A to $03.
  - BEQ $E672 — if output device is screen, skip output-call.
  - JSR $E716 — call output routine to output the character (or dispatch CR handling).
  - LDA #$0D — ensure A is CR and continue.
  - STA $D7 — save returned/converted character into $D7.
- Epilogue: restore X/Y from stack (PLA/TAX / PLA/TAY), reload A from $D7 (LDA $D7), special-case mapping:
  - CMP #$DE / BNE $E682 — if A == $DE then LDA #$FF (map $DE to $FF), otherwise skip.
  - CLC / RTS — set carry clear (flag OK) and return with character in A.

Notes on registers/flags used in flow:
- Uses ASL $D7 which sets Carry according to shifted-out bit; later BCC uses that Carry.
- BIT $D7 sets N/V from the saved-and-shifted value; BPL tests N to detect "no key".
- The routine may convert a screen-read into a CR when cursor reaches the end ($C8) and then conditionally routes that CR through the output device handling.

## Source Code
```asm
.,E632 98       TYA             copy Y
.,E633 48       PHA             save Y
.,E634 8A       TXA             copy X
.,E635 48       PHA             save X
.,E636 A5 D0    LDA $D0         input from keyboard or screen, $xx = screen,
                                $00 = keyboard
.,E638 F0 93    BEQ $E5CD       if keyboard go wait for key
.,E63A A4 D3    LDY $D3         get the cursor column
.,E63C B1 D1    LDA ($D1),Y     get character from the current screen line
.,E63E 85 D7    STA $D7         save temporary last character
.,E640 29 3F    AND #$3F        mask key bits
.,E642 06 D7    ASL $D7         << temporary last character
.,E644 24 D7    BIT $D7         test it
.,E646 10 02    BPL $E64A       branch if not [NO KEY]
.,E648 09 80    ORA #$80        
.,E64A 90 04    BCC $E650       
.,E64C A6 D4    LDX $D4         get the cursor quote flag, $xx = quote, $00 = no quote
.,E64E D0 04    BNE $E654       if in quote mode go ??
.,E650 70 02    BVS $E654       
.,E652 09 40    ORA #$40        
.,E654 E6 D3    INC $D3         increment the cursor column
.,E656 20 84 E6 JSR $E684       if open quote toggle the cursor quote flag
.,E659 C4 C8    CPY $C8         compare Y with input/EOL pointer
.,E65B D0 17    BNE $E674       if not at line end go ??
.,E65D A9 00    LDA #$00        clear A
.,E65F 85 D0    STA $D0         clear input from keyboard or screen, $xx = screen,
                                $00 = keyboard
.,E661 A9 0D    LDA #$0D        set character [CR]
.,E663 A6 99    LDX $99         get the input device number
.,E665 E0 03    CPX #$03        compare the input device with the screen
.,E667 F0 06    BEQ $E66F       if screen go ??
.,E669 A6 9A    LDX $9A         get the output device number
.,E66B E0 03    CPX #$03        compare the output device with the screen
.,E66D F0 03    BEQ $E672       if screen go ??
.,E66F 20 16 E7 JSR $E716       output the character
.,E672 A9 0D    LDA #$0D        set character [CR]
.,E674 85 D7    STA $D7         save character
.,E676 68       PLA             pull X
.,E677 AA       TAX             restore X
.,E678 68       PLA             pull Y
.,E679 A8       TAY             restore Y
.,E67A A5 D7    LDA $D7         restore character
.,E67C C9 DE    CMP #$DE        
.,E67E D0 02    BNE $E682       
.,E680 A9 FF    LDA #$FF        
.,E682 18       CLC             flag ok
.,E683 60       RTS             
```

## References
- "keyboard_buffer_read_and_shift" — expands on behavior when input source is the keyboard
- "toggle_open_quote_flag" — expands on the helper called at $E684 that toggles quote state
- "output_character_unshifted_and_control_dispatch" — expands on outputs and CR handling (JSR $E716)
