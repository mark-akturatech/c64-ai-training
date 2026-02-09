# KERNAL: Advance cursor one screen position ($E6B6..$E6EB)

**Summary:** KERNAL routine to advance the text cursor one screen position, updating PNTR ($D3), checking against LNMX ($D5), handling 40/80-column logical-line linking via LDTB1 ($D9,X), adjusting LNMX (+$28) for 80-char logical lines, and honoring AUTODN ($0292) to either open a space or scroll when the bottom is reached. Calls JSR $E8B3 and $E8EA.

## Operation
- Entry: JSR $E8B3 then INC $D3 (PNTR = cursor column on current line).
- Compares PNTR ($D3) with LNMX ($D5). If PNTR <= LNMX the routine returns (cursor stayed on same physical line).
- If PNTR > LNMX, the code handles a wrap to the next physical/logical line:
  - If PNTR == #$4F (79 decimal) a special case is taken to "put cursor on new logical line" (BEQ $E6F7).
  - Otherwise it checks AUTODN ($0292):
    - If $0292 == 0 (zero), execution continues to the scroll/link logic (auto-scroll enabled).
    - If $0292 != 0, jumps to $E967 to open a space on the new screen position (no scroll).
- For wrapping with auto-scroll or linking:
  - Reads TBLX ($D6) into X and compares with #$19 (25). If >= 25 (cursor reached bottom), it JSR $E8EA (scroll down) and then DEC $D6 to place the cursor on line 24.
  - Uses LDTB1 ($D9,X) as a per-line logical-line flag byte:
    - ASL $D9,X then LSR $D9,X clears bit 7 to mark the line as logical-line 2 (procedure uses bit7 to indicate which half of an 80-column logical line).
    - Increments X and sets bit7 on the next line's LDTB1 with ORA #$80 / STA $D9,X to mark it as logical-line 1.
  - Adds #$28 to LNMX ($D5) with ADC #$28 (CLC; ADC) to allow 80-character logical lines (physical LNMX extended by 40).
- The routine preserves the behavior of opening a space vs. scrolling depending on AUTODN. PNTR, LNMX, TBLX and LDTB1 are the primary variables modified.

## Source Code
```asm
.,E6B6 20 B3 E8 JSR $E8B3
.,E6B9 E6 D3    INC $D3
.,E6BB A5 D5    LDA $D5
.,E6BD C5 D3    CMP $D3
.,E6BF B0 3F    BCS $E700
.,E6C1 C9 4F    CMP #$4F
.,E6C3 F0 32    BEQ $E6F7
.,E6C5 AD 92 02 LDA $0292
.,E6C8 F0 03    BEQ $E6CD
.,E6CA 4C 67 E9 JMP $E967
.,E6CD A6 D6    LDX $D6
.,E6CF E0 19    CPX #$19
.,E6D1 90 07    BCC $E6DA
.,E6D3 20 EA E8 JSR $E8EA
.,E6D6 C6 D6    DEC $D6
.,E6D8 A6 D6    LDX $D6
.,E6DA 16 D9    ASL $D9,X
.,E6DC 56 D9    LSR $D9,X
.,E6DE E8       INX
.,E6DF B5 D9    LDA $D9,X
.,E6E1 09 80    ORA #$80
.,E6E3 95 D9    STA $D9,X
.,E6E5 CA       DEX
.,E6E6 A5 D5    LDA $D5
.,E6E8 18       CLC
.,E6E9 69 28    ADC #$28
.,E6EB 85 D5    STA $D5
```

## Key Registers
- $D3 - KERNAL - PNTR, cursor column on current line
- $D5 - KERNAL - LNMX, physical screen line length (extended by +$28 for 80-column logical lines)
- $D6 - KERNAL - TBLX, current physical line number (0..24)
- $D9 - KERNAL - LDTB1 base (LDTB1,$D9,X) per-line logical-line flag bytes; bit7 used to mark logical-line halves
- $0292 - KERNAL - AUTODN, auto-scroll down flag (0 = auto-scroll enabled; nonzero = open-space/no-scroll)

## References
- "setup_screen_print" — called after printing a character to move the cursor
- "output_to_screen_unshifted_and_control_codes" — usage of advance-cursor logic for wrapping and scrolling
- "retreat_cursor" — inverse operation for backing up across logical lines