# Insert uppercase/graphic character (KERNAL $E691-$E6B5)

**Summary:** KERNAL routine that converts a printable character to the uppercase/graphics set (ORA #$40), optionally sets the reverse bit (ORA #$80) if the reverse flag ($C7) is set, decrements the insert-count ($D8) when in insert mode, fetches the current colour ($0286) and calls the print-and-colour routine ($EA13) and the cursor-advance routine ($E6B6). Restores registers, clears the quote flag (via LSR $D4) if no further inserts remain, re-enables interrupts and returns.

## Behavior and flow
- Convert character in A to the uppercase/graphics set by setting bit 6 (ORA #$40).
- Test the reverse flag at $C7; if set, set the reverse bit (bit 7) with ORA #$80 to insert a reversed character.
- Check the insert-count at $D8:
  - If zero, skip decrement.
  - If non-zero, decrement $D8 (DEC $D8) — this enforces insert-mode behavior (consumes one insert slot).
- Load the current colour code from $0286 into X (LDX $0286) and call the print routine (JSR $EA13) which prints the character in A using colour X.
- After printing, call the cursor-advance routine (JSR $E6B6) to move the cursor (handles autoscroll/newline as needed; see referenced chunk).
- Restore Y (PLA / TAY).
- Re-check $D8 (insert-count). If it is zero after printing, clear the cursor quote flag by LSR $D4 (source comment: $xx = quote, $00 = no quote). If inserts remain, leave the quote flag set.
- Restore X and A from the stack (PLA / TAX / PLA).
- Clear the carry (CLC), enable interrupts (CLI), and return (RTS).
- This routine preserves registers via the stack (PLAs at the end) and ensures interrupts are re-enabled before returning.

## Source Code
```asm
.,E691 09 40    ORA #$40        change to uppercase/graphic
.,E693 A6 C7    LDX $C7         get the reverse flag
.,E695 F0 02    BEQ $E699       branch if not reverse
.,E697 09 80    ORA #$80        reverse character
.,E699 A6 D8    LDX $D8         get the insert count
.,E69B F0 02    BEQ $E69F       branch if none
.,E69D C6 D8    DEC $D8         else decrement the insert count
.,E69F AE 86 02 LDX $0286       get the current colour code
.,E6A2 20 13 EA JSR $EA13       print character A and colour X
.,E6A5 20 B6 E6 JSR $E6B6       advance the cursor
.,E6A8 68       PLA             pull Y
.,E6A9 A8       TAY             restore Y
.,E6AA A5 D8    LDA $D8         get the insert count
.,E6AC F0 02    BEQ $E6B0       skip quote flag clear if inserts to do
.,E6AE 46 D4    LSR $D4         clear cursor quote flag, $xx = quote, $00 = no quote
.,E6B0 68       PLA             pull X
.,E6B1 AA       TAX             restore X
.,E6B2 68       PLA             restore A
.,E6B3 18       CLC
.,E6B4 58       CLI             enable the interrupts
.,E6B5 60       RTS
```

## Key Registers
- $C7 - Zero Page - reverse flag (non-zero = reverse insertion)
- $D8 - Zero Page - insert-count (number of characters remaining to insert)
- $D4 - Zero Page - cursor quote flag holder (LSR used to clear; source: "$xx = quote, $00 = no quote")
- $0286 - RAM - current colour code (loaded into X before printing)
- $EA13 - KERNAL ROM - print character in A using colour in X (JSR target)
- $E6B6 - KERNAL ROM - cursor advance routine (JSR target; handles autoscroll/newline)

## References
- "toggle_open_quote_flag" — expands on quote mode influences inserted characters
- "advance_cursor_autoscroll_and_newline_handling" — expands on calls made by the cursor-advance routine after printing