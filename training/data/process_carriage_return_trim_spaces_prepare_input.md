# Handle carriage return: trim trailing spaces and prepare input execution

**Summary:** Code path for carriage return (CR) in the C64 ROM: compares the key to $0D (CR), when CR is detected it trims trailing spaces from the current input line (walks the screen line backward via the ($D1),Y pointer), saves the resulting end-of-line pointer in $C8, marks input source ($D0), and clears screen-scroll, cursor column, and quote flags ($0292, $D3, $D4).

**Behavior and step-by-step explanation**
- CMP #$0D / BNE — Tests the retrieved key against CR ($0D). If not CR, execution returns to the normal key-printing/next-key path.
- On CR:
  - LDY $D5 / STY $D0 — Load the current screen line length from zero page $D5 and store the value into zero page $D0. (According to source comment $D0 distinguishes input-from-screen vs keyboard: nonzero = screen, $00 = keyboard.)
  - B1 D1 / CMP #$20 / BNE / DEY loop — Use the ($D1),Y indirect,Y addressing to read characters from the current screen line (pointer at $D1/$D2), comparing each to ASCII space ($20). While the character is space, DEY decrements Y to step left and the loop repeats until a non-space is found.
  - INY / STY $C8 — After the loop, INY advances Y to point just past the last non-space character; STY saves this EOL pointer into zero page $C8.
  - LDY #$00 / STY $0292 — Clear the screen-scrolling flag at $0292 (store 0 = no scroll).
  - STY $D3 / STY $D4 — Clear the cursor column ($D3) and the cursor quote flag ($D4). The quote flag is cleared so the interpreter won't treat the previous input as being inside a quoted string while executing.
- Final intent: record the trimmed end-of-line, mark input origin and clear flags so the input line can be executed (execution path continues in a related routine: "wait_for_key_and_autoload_run_sequence").

Notes:
- ($D1),Y is used to read characters from the on-screen input line; $D1/$D2 form the pointer to the current screen-line buffer.
- $D5 contains the length/index used as a starting Y for scanning backwards.
- $C8 stores the resulting EOL pointer used by subsequent input-processing routines.

## Source Code
```asm
.; Handle carriage return: trim trailing spaces and prepare input execution
.,E5FE C9 0D    CMP #$0D        ; compare the key with [CR]
.,E600 D0 C8    BNE $E5CA       ; if not [CR] print the character and get the next key
                                ; else it was [CR]
.,E602 A4 D5    LDY $D5         ; get the current screen line length
.,E604 84 D0    STY $D0         ; input from keyboard or screen, $xx = screen, $00 = keyboard
.,E606 B1 D1    LDA ($D1),Y     ; get the character from the current screen line
.,E608 C9 20    CMP #$20        ; compare it with [SPACE]
.,E60A D0 03    BNE $E60F       ; if not [SPACE] continue
.,E60C 88       DEY             ; else eliminate the space, decrement end of input line
.,E60D D0 F7    BNE $E606       ; loop, branch always
.,E60F C8       INY             ; increment past the last non space character on line
.,E610 84 C8    STY $C8         ; save the input [EOL] pointer
.,E612 A0 00    LDY #$00        ; clear A
.,E614 8C 92 02 STY $0292       ; clear the screen scrolling flag, $00 = scroll
.,E617 84 D3    STY $D3         ; clear the cursor column
.,E619 84 D4    STY $D4         ; clear the cursor quote flag, $xx = quote, $00 = no quote
```

## Key Registers
- $D1-$D2 - zero page pointer - pointer to current screen line buffer (used by LDA ($D1),Y)
- $D5 - zero page - current screen line length (initial Y for backward scan)
- $D0 - zero page - input source marker (nonzero = screen, $00 = keyboard) — set from $D5
- $C8 - zero page - saved input end-of-line (EOL) pointer after trimming trailing spaces
- $0292 - system variable - screen scrolling flag (cleared to $00)
- $D3 - zero page - cursor column (cleared)
- $D4 - zero page - cursor quote flag (cleared)

## References
- "wait_for_key_and_autoload_run_sequence" — expands on actions after CR is detected (execution and autoload/run handling)
- "set_input_cursor_pointers_and_bounds_check" — expands on how input cursor position and source are determined prior to this routine

## Labels
- $D1
- $D2
- $D5
- $D0
- $C8
- $0292
- $D3
- $D4
