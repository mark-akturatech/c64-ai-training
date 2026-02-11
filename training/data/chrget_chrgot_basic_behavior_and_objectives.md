# MACHINE — CHRGET / CHRGOT behavior (BASIC character fetch, self-modifying)

**Summary:** Describes the CHRGET/CHRGOT character-fetch mechanism used by BASIC: a self-modifying increment of the LDA operand (CHRGOT), pointer increment semantics (low‑byte wrap to high byte), and the character-classification objectives (skip spaces, set Z on end-of-line or colon $3A, and set/clear C for numeric digits $30–$39).

**Behavior and purpose**
This routine reads the next character from the BASIC program buffer (or the input buffer for direct commands). It uses a self-modifying LDA operand so the code itself holds the two‑byte pointer into the BASIC text; the increment of that operand advances the program pointer.

Key points:
- The subroutine performs a self-modifying increment on the operand bytes of the instruction labeled CHRGOT, then executes CHRGOT (an LDA) to load the character from the BASIC buffer.
- The intended increment logic: add one to the low byte of the pointer; if the low byte wraps from $FF to $00, increment the high byte to carry into the next page. This advances the pointer through the BASIC program buffer.
- After loading a character, the routine must:
  1. Skip spaces (loop and fetch next character).
  2. If the character is zero (BASIC end‑of‑line) or a colon ($3A, end‑of‑statement), set the Z flag and exit.
  3. Set the Carry (C) flag if the character is numeric ($30–$39), otherwise clear C — this encodes "is digit" as the carry bit for the caller.

Implementation note from source: the routine is explicitly self‑modifying (it alters the LDA operand in place). That is acknowledged as not always good style but effective here.

## Source Code
```asm
; CHRGET routine implementation
CHRGET  INC $7A        ; Increment low byte of text pointer
        BNE CHRGOT     ; If no overflow, skip next increment
        INC $7B        ; Increment high byte of text pointer
CHRGOT  LDA ($7A),Y    ; Load character from BASIC program/input buffer
        CMP #$20       ; Compare with space character
        BEQ CHRGET     ; If space, fetch next character
        CMP #$3A       ; Compare with colon
        BEQ SET_Z      ; If colon, set Z flag and exit
        CMP #$30       ; Compare with '0'
        BCC SET_C      ; If less than '0', set C flag and exit
        CMP #$3A       ; Compare with ':'
        BCS SET_C      ; If greater than '9', set C flag and exit
        CLC            ; Clear C flag (character is a digit)
        RTS
SET_C   SEC            ; Set C flag (character is not a digit)
        RTS
SET_Z   LDA #$00       ; Load zero into A to set Z flag
        RTS
```

## Key Registers
- **$7A/$7B**: Pointer to the current character in the BASIC program or input buffer.
- **Y Register**: Used as an index, typically set to 0 for direct addressing.

## References
- "infiltrating_basic_wedge_intro_and_CHRGET_location" — expands on where CHRGET resides and additional context for its operation.

## Labels
- CHRGET
- CHRGOT
