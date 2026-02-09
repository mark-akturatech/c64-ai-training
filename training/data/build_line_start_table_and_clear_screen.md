# Construct start-of-line table and clear screen (ROM $E544-$E564)

**Summary:** This routine initializes the start-of-line pointer table in zero page, computes successive line pointers by adding the line length $28, writes an end-of-table marker ($FF), and then calls the clear-screen-line routine 25 times (JSR $E9FF).

**Operation**

This ROM fragment performs the following operations:

- Reads the screen memory page high byte from $0288, sets bit 7 (ORA #$80) to mark logical line starts, and copies it to Y.
- Clears the low-byte accumulator (A = #$00) and clears X (index = 0).
- Enters a loop to:
  - Store Y into $D9,X (zero-page table of start-of-line high bytes).
  - Add the line length $28 to A (low byte). Use CLC/ADC #$28 so a carry increments Y (the high byte) when the low byte overflows.
  - Increment X; compare X to $1A (26) to terminate. This produces the sequence of start pointers for the 25 logical lines (with the loop control handling the pointer carry into the high byte).
- After the loop, writes $FF into the next $D9,X entry to mark the end of the table.
- Sets X = $18 (25 decimal) and calls the clear-screen-line routine JSR $E9FF repeatedly to clear each text line (decrementing X and looping until done).

**Notes:**

- The line length used is $28 (40 decimal), matching a 40-column text line on the C64.
- The table at $00D9 receives only the high bytes in this snippet; low bytes are accumulated in A during the loop (and are likely stored/used elsewhere by surrounding code).
- CPX #$1A is used as the loop terminator (compare to number-of-lines + 1) so the range of stored entries and the placement of the end marker are deliberate.

## Source Code

```asm
.,E544 AD 88 02 LDA $0288       ; get the screen memory page
.,E547 09 80    ORA #$80        ; set the high bit, flag every line is a logical line start
.,E549 A8       TAY             ; copy to Y
.,E54A A9 00    LDA #$00        ; clear the line start low byte
.,E54C AA       TAX             ; clear the index
.,E54D 94 D9    STY $D9,X       ; save the start of line X pointer high byte
.,E54F 18       CLC             ; clear carry for add
.,E550 69 28    ADC #$28        ; add the line length to the low byte
.,E552 90 01    BCC $E555       ; if no rollover skip the high byte increment
.,E554 C8       INY             ; else increment the high byte
.,E555 E8       INX             ; increment the line index
.,E556 E0 1A    CPX #$1A        ; compare it with the number of lines + 1
.,E558 D0 F3    BNE $E54D       ; loop if not all done
.,E55A A9 FF    LDA #$FF        ; set the end of table marker
.,E55C 95 D9    STA $D9,X       ; mark the end of the table
.,E55E A2 18    LDX #$18        ; set the line count, 25 lines to do, 0 to 24
.,E560 20 FF E9 JSR $E9FF       ; clear screen line X
.,E563 CA       DEX             ; decrement the count
.,E564 10 FA    BPL $E560       ; loop if more to do
```

## Key Registers

- **$0288**: Screen memory page high byte.
- **$00D9-$00F1**: Start-of-line table high bytes stored at $00D9 with X index (entries written via STY $D9,X). The end marker $FF is written after the last entry.

## References

- "initialise_screen_and_keyboard_defaults" — expands on prior keyboard/screen defaults
- "home_cursor_and_compute_line_pointers" — expands on after clearing, home cursor and set pointers for cursor row/column