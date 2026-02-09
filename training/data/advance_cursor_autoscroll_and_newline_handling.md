# Advance cursor and handle line wrap/scroll (ROM $E6B6–$E700)

**Summary:** Handles advancing the logical cursor column and line-wrap/scroll behavior in the C64 KERNAL: operates on cursor/line variables $00D3, $00D6, $00D5 and the start-of-line pointer table at $00D9 (indexed by row), and reads autoscroll flag at $0292; calls other ROM routines ($E8B3, $E8EA, $E967, $E87C, $E9F0).

## Description
This routine increments the logical cursor column, checks for line overflow and maximum column wrap, and either inserts an on-screen space (when autoscroll/open-space mode applies) or adjusts logical-line bookkeeping and causes screen scrolling/newline as needed.

Flow summary (preserves original control flow and variable usage):

- JSR $E8B3 — preliminary test for line increment (called prior to advancing).
- INC $00D3 — increment the logical cursor column (cursor column stored at $00D3).
- LDA $00D5 / CMP $00D3 ; BCS $E700 — if current screen line length ($00D5) >= cursor column, return (no wrap/line-extend).
- CMP #$4F ; BEQ $E6F7 — if cursor column equals max column (0x4F), branch to back-up/newline handling.
- LDA $0292 ; BEQ $E6CD — load autoscroll flag and branch if the flag indicates the “autoscroll” condition (see note below).
  - If the branch is not taken, JMP $E967 — uses routine that inserts an open-space on-screen (does not change logical-line pointers).
- At $E6CD:
  - LDX $00D6 ; CPX #$19 ; BCC $E6DA — get cursor row ($00D6). If less than max+1 (0x19) then proceed to add this row to the current logical line.
  - Otherwise JSR $E8EA — call scroll-screen routine, then DEC $00D6 to back up the cursor row.
- Update logical-line pointers (operating on the start-of-line pointer table at $00D9 indexed by row X):
  - Uses ASL $D9,X then LSR $D9,X (shifts on the high-byte entries) then INX; LDA $D9,X / ORA #$80 / STA $D9,X — sets bit7 in the high-byte for the next screen row to mark it as the start of a logical line.
  - Adjusts X back (DEX) to restore cursor row.
- Update logical-line length:
  - LDA $00D5 ; CLC ; ADC #$28 ; STA $00D5 — adds $28 to the current screen line length ($00D5). ($28 represents the increment applied to the line-length bookkeeping.)
- Loop to find the next start-of-logical-line:
  - LDA $D9,X ; BMI $E6F4 — if bit7 is set (negative flag set by LDA — bit7==1), exit loop; else DEX and loop until first line.
- At $E6F4 JMP $E9F0 — fetch a screen address (continuation in ROM).
- If wrapped at max column (branch at $E6C3 -> $E6F7):
  - DEC $00D6 ; JSR $E87C — move cursor up a line and execute newline handling routine.
  - LDA #$00 ; STA $00D3 — clear cursor column.
- RTS at $E700 — return to caller.

Behavioral details preserved from the disassembly:
- Cursor column is stored at $00D3; column increment is tested against line length at $00D5 and an absolute max column value $4F.
- Cursor row is at $00D6; the routine compares against 0x19 (max+1) to decide whether to append the current screen row to the logical line or force a scroll.
- The start-of-logical-line markers are stored in a table beginning at $00D9 and are manipulated per-row with shifts and bit7 setting (bit7 indicates "start of logical line").
- The autoscroll/open-space branch is controlled by the byte at $0292 (autoscroll flag); behavior depends on that flag (see note).
- The routine adjusts the logical-line-length variable ($00D5) by adding $28 when a row is appended to a logical line.
- Several ROM subroutines are invoked for related operations (open-space insertion, scrolling, newline, fetching screen addresses).

**[Note: Source may contain an ambiguity — the disassembly comment “branch if autoscroll on” at the LDA $0292 / BEQ sequence conflicts with BEQ semantics (branch on zero). The code as shown branches when $0292 == 0; whether $0292==0 means “autoscroll on” or “off” depends on the KERNAL convention elsewhere.]**

## Source Code
```asm
.,E6B6 20 B3 E8 JSR $E8B3       test for line increment
.,E6B9 E6 D3    INC $D3         increment the cursor column
.,E6BB A5 D5    LDA $D5         get current screen line length
.,E6BD C5 D3    CMP $D3         compare ?? with the cursor column
.,E6BF B0 3F    BCS $E700       exit if line length >= cursor column
.,E6C1 C9 4F    CMP #$4F        compare with max length
.,E6C3 F0 32    BEQ $E6F7       if at max clear column, back cursor up and do newline
.,E6C5 AD 92 02 LDA $0292       get the autoscroll flag
.,E6C8 F0 03    BEQ $E6CD       branch if autoscroll on
.,E6CA 4C 67 E9 JMP $E967       else open space on screen
.,E6CD A6 D6    LDX $D6         get the cursor row
.,E6CF E0 19    CPX #$19        compare with max + 1
.,E6D1 90 07    BCC $E6DA       if less than max + 1 go add this row to the current
                                logical line
.,E6D3 20 EA E8 JSR $E8EA       else scroll the screen
.,E6D6 C6 D6    DEC $D6         decrement the cursor row
.,E6D8 A6 D6    LDX $D6         get the cursor row
                                add this row to the current logical line
.,E6DA 16 D9    ASL $D9,X       shift start of line X pointer high byte
.,E6DC 56 D9    LSR $D9,X       shift start of line X pointer high byte back,
                                make next screen line start of logical line, increment line length and set pointers
                                clear b7, start of logical line
.,E6DE E8       INX             increment screen row
.,E6DF B5 D9    LDA $D9,X       get start of line X pointer high byte
.,E6E1 09 80    ORA #$80        mark as start of logical line
.,E6E3 95 D9    STA $D9,X       set start of line X pointer high byte
.,E6E5 CA       DEX             restore screen row
.,E6E6 A5 D5    LDA $D5         get current screen line length
                                add one line length and set the pointers for the start of the line
.,E6E8 18       CLC             clear carry for add
.,E6E9 69 28    ADC #$28        add one line length
.,E6EB 85 D5    STA $D5         save current screen line length
.,E6ED B5 D9    LDA $D9,X       get start of line X pointer high byte
.,E6EF 30 03    BMI $E6F4       exit loop if start of logical line
.,E6F1 CA       DEX             else back up one line
.,E6F2 D0 F9    BNE $E6ED       loop if not on first line
.,E6F4 4C F0 E9 JMP $E9F0       fetch a screen address
.,E6F7 C6 D6    DEC $D6         decrement the cursor row
.,E6F9 20 7C E8 JSR $E87C       do newline
.,E6FC A9 00    LDA #$00        clear A
.,E6FE 85 D3    STA $D3         clear the cursor column
.,E700 60       RTS             
```

## Key Registers
- $00D3 - KERNAL - logical cursor column
- $00D5 - KERNAL - current screen line length (logical-line length)
- $00D6 - KERNAL - cursor row (screen row index)
- $00D9 - KERNAL - start-of-line pointer table base (indexed by row with X; bit7 marks start of logical line)
- $0292 - KERNAL - autoscroll flag (byte checked to decide open-space vs. logical-line update)

## References
- "insert_uppercase_graphic_character" — expands on the routine called after printing to advance the cursor
- "back_to_previous_line_logic" — expands on logic used when needing to move up a line