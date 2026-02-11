# PRINT TO SCREEN (KERNAL, $EA13)

**Summary:** Stores a character (in A) to screen RAM via the zero-page pointer ($D1),Y and its colour (in X) to colour RAM via ($F3),Y; initializes the blink timer BLNCT ($CD) and calls the colour-pointer synchroniser at $EA24. Uses PNTR ($D3) for the cursor column offset.

## Description
This KERNAL routine writes a single character to the current screen position and its colour to the corresponding colour RAM byte.

Behavior and register usage:
- Entry expectation: character to print in A, colour in X (caller must supply X).
- A is saved temporarily in Y with TAY, then restored with TYA after the colour-pointer synchronisation call.
- BLNCT ($CD) is set to #$02 to initialise the cursor blink timer (causes the cursor blink toggle after a short interval).
- JSR $EA24 synchronises the colour pointer so the colour RAM pointer matches the current screen line (see referenced "synchronise_colour_pointer").
- PNTR ($D3) is loaded into Y to obtain the column offset on the current line.
- STA ($D1),Y writes the character (A) into screen RAM using the zero-page indirect pointer at $D1.
- TXA / STA ($F3),Y writes the colour (originally in X) into colour RAM using the zero-page indirect pointer at $F3.
- RTS returns to the caller.

Notes:
- The routine overwrites Y and A during execution but preserves the character by transferring it between A and Y as needed.
- BLNCT is a KERNAL zero-page variable controlling cursor blink countdown; setting it to $02 restarts the blink timing.
- The indirect zero-page pointers $D1/$D2 and $F3/$F4 (pointer pairs) are used to point to the current screen RAM and colour RAM base addresses respectively; this routine offsets them by PNTR ($D3) to select the correct column.

## Source Code
```asm
.,EA13 A8       TAY             ; put print character in (Y)
.,EA14 A9 02    LDA #$02
.,EA16 85 CD    STA $CD         ; store initial value in BLNCT, timer to toggle cursor
.,EA18 20 24 EA JSR $EA24       ; synchronise colour pointer
.,EA1B 98       TYA             ; print character back to (A)
.,EA1C A4 D3    LDY $D3         ; PNTR, cursor column on line
.,EA1E 91 D1    STA ($D1),Y     ; store character on screen
.,EA20 8A       TXA
.,EA21 91 F3    STA ($F3),Y     ; store character colour
.,EA23 60       RTS
```

## Key Registers
- $CD - zero page - BLNCT (cursor blink countdown/timer)
- $D1 - zero page pointer (indirect) - screen RAM pointer (used with LDY $D3 and STA ($D1),Y)
- $D3 - zero page - PNTR (cursor column on current line)
- $F3 - zero page pointer (indirect) - colour RAM pointer (used with STA ($F3),Y)

## References
- "synchronise_colour_pointer" — ensures the colour RAM pointer corresponds to the current screen line
- "set_colour_code" — earlier routine used to compute the colour value stored by this routine

## Labels
- BLNCT
- PNTR
