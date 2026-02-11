# KERNAL: INSERT (Open a space on current screen line) — $E965+

**Summary:** KERNAL routine at $E965 opens a space on the current screen line for the INSERT (INST) operation; it inspects the screen-line link table ($00D6/$00D8-$00DA), may call the screen-scrolling routine ($E8EA), moves/clears individual screen lines (JSRs $E9C8 / $E9FF), and updates the link table (JSR $E6DA). Uses temporary index $02A5 and pushes SAL/EAL from $00AC-$00AF.

## Description
This routine implements screen-line insertion (used by INST). High-level flow:

- Load current table index (TBLX) from $00D6 into X, increment to test the next table entry, and scan the screen-line link byte table ($00D9,X and $00DA,X) until a link-mark (bit 7 set) is found. The final X is stored in $02A5 as a temporary line index.
- Compare the found index with #$18 (24 decimal, bottom-of-screen test):
  - If X > $18, the routine calls scroll_screen (JSR $E8EA) to scroll the visible screen down and then jumps to the link-table adjust routine ($E6DA) after fixing TBLX.
  - If X <= $18 (not at or beyond bottom), the routine:
    - Pushes SAL/EAL (start/end-of-program pointers) from $00AC-$00AF onto the stack.
    - Sets the start-of-line for operations (JSR $E9F0 with X initialized to #$19 and decremented).
    - Loops moving each screen line down by calling move_a_screen_line (JSR $E9C8) while decrementing X and checking the entry at $00D8/$00D9; branches on negative/positive results control loop continuation.
    - Calls clear_screen_line (JSR $E9FF) to clear the newly opened line.
    - Runs a small fixup pass updating the screen-line link table: for each entry from $02A5 down to zero, it reads LDTB1+1 ($00DA,X) and LDTB1 ($00D9,X), masks and sets bit7 appropriately (AND #$7F then ORA #$80 where needed), and writes back to $00DA,X.
    - Restores X from $02A5 and calls adjust link table (JSR $E6DA).
- Finally, control returns to the caller after pulling SAL/EAL and jumping back ($4C 58 E9 JMP $E958).

Behavioral notes preserved from code:
- Temporary index is stored at $02A5.
- SAL/EAL pointer pair are in $00AC-$00AF and are pushed to the stack before line moves.
- Link table entries use bit7 as a marker; code uses BPL/BMI and bit masking (AND #$7F / ORA #$80) to test and set that bit.
- The routine uses absolute KERNAL tables at $ECEF (screen line address table) to map line indices to screen addresses when moving lines.

## Source Code
```asm
.; KERNAL: OPEN A SPACE ON THE SCREEN (INSERT)
.; Address labels/comments preserved from Magnus Nyman disassembly

.,E965 A6 D6    LDX $D6         ; TBLX, current cursor line number
.,E967 E8       INX             ; test next
.,E968 B5 D9    LDA $D9,X       ; LDTB1, screen line link table
.,E96A 10 FB    BPL $E967
.,E96C 8E A5 02 STX $02A5       ; temp line for index
.,E96F E0 18    CPX #$18        ; bottom of screen
.,E971 F0 0E    BEQ $E981       ; yes
.,E973 90 0C    BCC $E981       ; above bottom line
.,E975 20 EA E8 JSR $E8EA       ; scroll screen down
.,E978 AE A5 02 LDX $02A5       ; temp line for index
.,E97B CA       DEX
.,E97C C6 D6    DEC $D6         ; TBLX
.,E97E 4C DA E6 JMP $E6DA       ; adjust link table and end
.,E981 A5 AC    LDA $AC         ; push SAL, scrolling pointer
.,E983 48       PHA
.,E984 A5 AD    LDA $AD
.,E986 48       PHA
.,E987 A5 AE    LDA $AE         ; push EAL, end of program
.,E989 48       PHA
.,E98A A5 AF    LDA $AF
.,E98C 48       PHA
.,E98D A2 19    LDX #$19
.,E98F CA       DEX
.,E990 20 F0 E9 JSR $E9F0       ; set start of line
.,E993 EC A5 02 CPX $02A5       ; temp line for index
.,E996 90 0E    BCC $E9A6
.,E998 F0 0C    BEQ $E9A6
.,E99A BD EF EC LDA $ECEF,X     ; screen line address table
.,E99D 85 AC    STA $AC         ; SAL
.,E99F B5 D8    LDA $D8,X       ; LDTB1
.,E9A1 20 C8 E9 JSR $E9C8       ; move screen line
.,E9A4 30 E9    BMI $E98F
.,E9A6 20 FF E9 JSR $E9FF       ; clear screen line
.,E9A9 A2 17    LDX #$17        ; fix screen line link table
.,E9AB EC A5 02 CPX $02A5       ; temp line for index
.,E9AE 90 0F    BCC $E9BF
.,E9B0 B5 DA    LDA $DA,X       ; LDTB1+1
.,E9B2 29 7F    AND #$7F
.,E9B4 B4 D9    LDY $D9,X       ; LDTB1
.,E9B6 10 02    BPL $E9BA
.,E9B8 09 80    ORA #$80
.,E9BA 95 DA    STA $DA,X
.,E9BC CA       DEX             ; next line
.,E9BD D0 EC    BNE $E9AB       ; till line zero
.,E9BF AE A5 02 LDX $02A5       ; temp line for index
.,E9C2 20 DA E6 JSR $E6DA       ; adjust link table
.,E9C5 4C 58 E9 JMP $E958       ; pull SAL and EAL
```

## Key Registers
- $00D6 - KERNAL table index (TBLX) — current cursor line number
- $00D8-$00D9 - KERNAL screen-line link table (LDTB1 / LDTB1 low/high bytes of link data)
- $00DA - KERNAL screen-line link table (LDTB1+1, used with bit7)
- $00AC-$00AF - SAL / EAL pointer bytes (start/end addresses saved/pushed)
- $02A5 - Temporary line index (stored by this routine)
- $ECEF - Screen line address table base (used with X to load screen addresses)

## References
- "scroll_screen" — scrolling when insertion needs to push bottom line ($E8EA)
- "move_a_screen_line" — moves a single screen line down ($E9C8)
- "clear_screen_line" — clears the opened/emptied screen line ($E9FF)

## Labels
- INSERT
- TBLX
- LDTB1
- SAL
- EAL
