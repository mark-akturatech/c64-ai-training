# Output a character to the screen (unshifted path)

**Summary:** KERNAL output routine fragment that saves A/X/Y and last character ($D7), clears the input-source flag ($D0), reads cursor column ($D3), dispatches shifted characters to the shifted handler, routes CR ($0D) to the CR handler, distinguishes control chars (< $20) from printable range ($20–$5F vs >= $60), applies bitmask transforms, toggles open-quote state via a JSR, and then continues to the main insert/print path.

## Description
This fragment implements the unshifted-path for outputting a single character. Key behaviors (in order):

- Save caller state and last character:
  - PHA / STA $D7 — save A (the character) into zero page $D7 (temporary last character).
  - TXA / PHA and TYA / PHA — save X and Y on the stack so the routine can use registers.

- Clear the input-source flag:
  - LDA #$00; STA $D0 — $D0 is used as an input-source flag ($xx = screen, $00 = keyboard per source comment).

- Get cursor column:
  - LDY $D3 — load cursor column from zero page $D3 into Y.

- Detect shifted characters:
  - LDA $D7; BPL $E72A — branch if bit7=0 (positive) to the unshifted path. If bit7=1 (negative), the code JMPs to the shifted-character handler at $E7D4.

- Handle carriage return:
  - CMP #$0D; BNE continue — if character is $0D ([CR]) JMP to the CR output handler at $E891.

- Distinguish control vs printable characters:
  - CMP #$20; BCC $E745 — characters below SPACE ($20) branch to control/special handling.
  - CMP #$60; BCC $E73D — printable range split: $20–$5F vs >= $60.

- For characters >= $60:
  - AND #$DF; BNE $E73F — apply bitmask $DF (clears bit 5) and branch if result non-zero. If zero, fall through to AND #$3F.
  - AND #$3F — alternate mask used when previous result was zero (exact behavior depends on input value).

- Quote-toggle and continue:
  - JSR $E684 — call routine that toggles open-quote state and/or cursor direct/programmed flag (per source comment).
  - JMP $E693 — continue into the insert/print path.

This fragment routes shifted characters, CR, control characters, and printable characters into the appropriate subsequent handlers; it preserves caller registers and uses $D7/$D0/$D3 zero-page locations for temporary/flagged state.

## Source Code
```asm
                                *** output a character to the screen
.,E716 48       PHA             save character
.,E717 85 D7    STA $D7         save temporary last character
.,E719 8A       TXA             copy X
.,E71A 48       PHA             save X
.,E71B 98       TYA             copy Y
.,E71C 48       PHA             save Y
.,E71D A9 00    LDA #$00        clear A
.,E71F 85 D0    STA $D0         clear input from keyboard or screen, $xx = screen,
                                $00 = keyboard
.,E721 A4 D3    LDY $D3         get cursor column
.,E723 A5 D7    LDA $D7         restore last character
.,E725 10 03    BPL $E72A       branch if unshifted
.,E727 4C D4 E7 JMP $E7D4       do shifted characters and return
.,E72A C9 0D    CMP #$0D        compare with [CR]
.,E72C D0 03    BNE $E731       branch if not [CR]
.,E72E 4C 91 E8 JMP $E891       else output [CR] and return
.,E731 C9 20    CMP #$20        compare with [SPACE]
.,E733 90 10    BCC $E745       branch if < [SPACE]
.,E735 C9 60    CMP #$60        
.,E737 90 04    BCC $E73D       branch if $20 to $5F
                                character is $60 or greater
.,E739 29 DF    AND #$DF        
.,E73B D0 02    BNE $E73F       
.,E73D 29 3F    AND #$3F        
.,E73F 20 84 E6 JSR $E684       if open quote toggle cursor direct/programmed flag
.,E742 4C 93 E6 JMP $E693       
```

## References
- "insert_uppercase_graphic_character" — expands on alternative insert code (shifted route) for some characters
- "special_character_handling_and_insert_delete_branch" — expands on further handling for control codes and special keys
