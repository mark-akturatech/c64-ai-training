# Write character and wait for key ($E5CA - $E5FC)

**Summary:** C64 KERNAL routine (entry $E5CA) that calls the character output routine ($E716), then waits for and reads a key from the keyboard buffer ($0276...). It disables cursor flashing ($CF) and screen autoscroll ($0292) while the buffer contains characters, handles overwriting the character under the cursor when in the character phase, calls the keyboard-buffer read routine ($E5B4), and detects the [SHIFT][RUN] special key (compares to #$83) to fill the buffer with the automatic "LOAD", CR, "RUN", CR sequence.

## Description
This routine performs these steps:

- Calls the character output routine at $E716 to write the character to the screen.
- Reads the keyboard-buffer index from zero page $C6 and stores it into $CC to disable cursor flashing while there are buffered keys (cursor enable: $00 = flash cursor, non-zero = no flash).
- Clears the screen-autoscroll flag at $0292 (store $00 = allow scroll, non-zero = disable), thereby disabling automatic scrolling while the keyboard buffer contains characters.
- Loops checking $C6: if zero the buffer is empty and it keeps looping until a key is present.
- Disables interrupts (SEI) before manipulating cursor/character display state and the keyboard buffer.
- Uses the cursor blink phase ($CF) to detect whether the visible cursor is currently showing the blink-phase glyph or the underlying character:
  - If $CF = 0 (cursor phase), skip overwriting the character under the cursor.
  - Else (character phase): read the character under the cursor from $CE, read the colour under the cursor from $0287, clear $CF (set to $00), and call the print/put routine at $EA13 to reprint the character and colour under the cursor (this prevents corruption of the displayed character while keyed input is pending).
- Calls the keyboard-buffer read routine at $E5B4 to actually remove/return the next key from the buffer.
- Compares the returned key to #$83 (the [SHIFT][RUN] special key code). If equal, it fills the keyboard buffer with the autoload sequence: "LOAD",$0D,"RUN",$0D by copying bytes from the autoload table at $ECE6 down into the buffer area at $0276,X (9 bytes), setting $C6 to $09 (byte count/index). During this fill it again disables interrupts (SEI) and stores the count to $C6, then writes the bytes into $0276,X in descending X loop.
- Ends by branching back to wait for the next key (BEQ $E5CD — effectively a loop that waits while buffer empty).

Behavioral and implementation notes preserved from source:
- Cursor flash and autoscroll are disabled while buffered keys exist.
- Overwrite of the character under cursor only occurs when the cursor is in the character phase; the cursor-phase glyph is left intact.
- The [SHIFT][RUN] special sequence triggers an automatic fill of the KERNAL keyboard buffer with the prebuilt autoload command sequence.
- Interrupts are disabled (SEI) around sensitive operations to avoid race conditions while manipulating buffer and display state.

## Source Code
```asm
.,E5CA 20 16 E7 JSR $E716       output character

                                *** wait for a key from the keyboard
.,E5CD A5 C6    LDA $C6         get the keyboard buffer index
.,E5CF 85 CC    STA $CC         cursor enable, $00 = flash cursor, $xx = no flash
.,E5D1 8D 92 02 STA $0292       screen scrolling flag, $00 = scroll, $xx = no scroll
                                this disables both the cursor flash and the screen scroll
                                while there are characters in the keyboard buffer
.,E5D4 F0 F7    BEQ $E5CD       loop if the buffer is empty
.,E5D6 78       SEI             disable the interrupts
.,E5D7 A5 CF    LDA $CF         get the cursor blink phase
.,E5D9 F0 0C    BEQ $E5E7       if cursor phase skip the overwrite
                                else it is the character phase
.,E5DB A5 CE    LDA $CE         get the character under the cursor
.,E5DD AE 87 02 LDX $0287       get the colour under the cursor
.,E5E0 A0 00    LDY #$00        clear Y
.,E5E2 84 CF    STY $CF         clear the cursor blink phase
.,E5E4 20 13 EA JSR $EA13       print character A and colour X
.,E5E7 20 B4 E5 JSR $E5B4       input from the keyboard buffer
.,E5EA C9 83    CMP #$83        compare with [SHIFT][RUN]
.,E5EC D0 10    BNE $E5FE       if not [SHIFT][RUN] skip the buffer fill
                                keys are [SHIFT][RUN] so put "LOAD",$0D,"RUN",$0D into
                                the buffer
.,E5EE A2 09    LDX #$09        set the byte count
.,E5F0 78       SEI             disable the interrupts
.,E5F1 86 C6    STX $C6         set the keyboard buffer index
.,E5F3 BD E6 EC LDA $ECE6,X     get byte from the auto load/run table
.,E5F6 9D 76 02 STA $0276,X     save it to the keyboard buffer
.,E5F9 CA       DEX             decrement the count/index
.,E5FA D0 F7    BNE $E5F3       loop while more to do
.,E5FC F0 CF    BEQ $E5CD       loop for the next key, branch always
```

## Key Registers
- $C6 - zero page - keyboard buffer index / count
- $CC - zero page - cursor enable flag ($00 = flash cursor, non-zero = no flash)
- $CE - zero page - character currently under cursor
- $CF - zero page - cursor blink phase (used to decide overwrite)
- $0276-$027E - RAM - keyboard buffer area (written with autoload bytes via STA $0276,X)
- $0287 - screen RAM/colour zone - colour byte under the cursor
- $0292 - screen control flag - screen scrolling flag ($00 = scroll enabled, non-zero = no scroll)
- $ECE6-$ECEE - ROM table - autoload "LOAD",CR,"RUN",CR bytes (source bytes copied into buffer)

## References
- "keyboard_buffer_read_and_shift" — expands on the buffer-read routine invoked at $E5B4
- "write_character_unshifted_and_control_dispatch" — expands on the character output routine called at $E716

## Labels
- $C6
- $CC
- $CE
- $CF
- $0276
- $0287
- $0292
- $ECE6
