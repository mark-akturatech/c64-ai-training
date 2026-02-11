# Detect and toggle cursor quote-mode (entry $E684)

**Summary:** 6502 routine at $E684 that detects the double-quote character (") using CMP #$22, toggles the cursor quote-mode flag stored at zero-page $00D4 (bit 0), and returns the quote character in A; used by input/typing code to enter/exit quote mode.

## Operation
This subroutine expects a character in A. It compares A with the ASCII double-quote ($22). If the character is not a double-quote it immediately returns (RTS) with A unchanged. If it is a double-quote it toggles the cursor's quote-mode flag at zero-page $00D4 (bit 0) and leaves A containing $22 for the caller.

Behavior details:
- CMP #$22 — tests whether the character in A is the ASCII double-quote.
- If equal:
  - LDA $D4 (zero-page $00D4) — read the current cursor quote-mode flag.
  - EOR #$01 — toggle bit 0 of the flag (quote mode on/off).
  - STA $D4 — write the toggled flag back.
  - LDA #$22 — ensure A contains the quote character on exit.
- RTS — return to caller.

This routine does not alter other registers; only A and the zero-page byte $00D4 are affected. It is intended to be called from the input/keyboard/screen-reading loop and from character-insertion routines that must know whether quote-mode is active.

## Source Code
```asm
.,E684 C9 22    CMP #$22        comapre byte with "
.,E686 D0 08    BNE $E690       exit if not "
.,E688 A5 D4    LDA $D4         get cursor quote flag, $xx = quote, $00 = no quote
.,E68A 49 01    EOR #$01        toggle it
.,E68C 85 D4    STA $D4         save cursor quote flag
.,E68E A9 22    LDA #$22        restore the "
.,E690 60       RTS             
```

## Key Registers
- $00D4 - KERNAL zero-page - cursor quote-mode flag (bit 0 = 1 when quote mode is active; 0 = not in quote mode)

## References
- "input_from_screen_or_keyboard_loop" — expands on when this routine is called (open-quote handling)
- "insert_uppercase_graphic_character" — explains how quote mode affects character insertion into screen memory