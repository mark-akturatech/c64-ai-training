# KERNAL: Scroll Screen Routine (E8EA - E964)

**Summary:** Scrolls the visible screen down one physical line, updates the screen line link table ($D9/$DA/$F1), saves/restores SAL/EAL ($AC-$AF) on the stack, updates TBLX ($D6) and a line-index temporary ($02A5), and reads CIA#1 ($DC00/$DC01) to test for <CTRL>. Calls set_start_of_line (JSR $E9F0), move_a_screen_line (JSR $E9C8) and clear_screen_line (JSR $E9FF).

## Description
This KERNAL routine scrolls the screen by one physical line. High-level flow:

- Save current SAL/EAL pair ($AC,$AD,$AE,$AF) on the stack (four PHA).
- Decrement screen table index TBLX ($D6) and line stack pointer LXSP ($C9).
- Store a temporary line index at $02A5 and use X to iterate the 25 screen lines (0..24).
- For each line:
  - Call set_start_of_line (JSR $E9F0) with X to compute that line's start address.
  - If X < $18 (24 decimal), load the low-byte of the source screen address from $ECF1,X into $AC and load $DA,X (used by move routine) then JSR move_a_screen_line ($E9C8) to move the line up.
  - If X >= $18, repeat by looping back to process from start (BMI/BPL control).
- After moving, call clear_screen_line (JSR $E9FF) to clear the new bottom line.
- Recompute the screen line link table:
  - For each index X (0..24), take $D9,X, clear bit 7 (AND #$7F), then test $DA,X (LDY). If $DA,X has bit7 set (negative), ORA #$80 to set bit7 in the stored link; store result back to $D9,X.
- Unlink the bottom-line link by setting bit7 in $F1.
- Test the top-line link ($D9): if it is linked (branch condition), repeat the whole scroll operation (this causes repeated scroll if the top lines are linked).
- Restore TBLX ($D6) and increment the temporary $02A5, then perform a keyboard check using CIA#1:
  - Compare $DC01 with #$FB to detect <CTRL>. The routine preserves flags across the write to $DC00 by PHP/PLP so the result of the CMP is used by the following branch.
  - A small delay loop (DEX/DEY/NOP) is executed if <CTRL> was detected before clearing the NDX variable ($C6).
- Restore SAL/EAL from the stack (four PLA) and return (RTS).

Notes about specific behavior:
- The routine uses the sign (bit7) semantics in $DA,X/$D9,X to encode link state; it reconstructs $D9 entries from $DA values (copy low 7 bits, set bit7 based on $DA bit7).
- The CIA keyboard read is performed directly: STA $DC00 writes $7F to the CIA port, LDA $DC01 reads the keyboard column, CMP #$FB detects <CTRL>; PHP/PLP brackets the write to preserve the processor flags for the CMP result.
- Stack save/restore order: SAL ($AC/$AD) then EAL ($AE/$AF) are pushed and later popped in reverse to restore.

## Source Code
```asm
.,E8EA A5 AC    LDA $AC         temp store SAL on stack
.,E8EC 48       PHA
.,E8ED A5 AD    LDA $AD
.,E8EF 48       PHA
.,E8F0 A5 AE    LDA $AE         temp store EAL on stack
.,E8F2 48       PHA
.,E8F3 A5 AF    LDA $AF
.,E8F5 48       PHA
.,E8F6 A2 FF    LDX #$FF
.,E8F8 C6 D6    DEC $D6         decrement TBLX
.,E8FA C6 C9    DEC $C9         decrement LXSP
.,E8FC CE A5 02 DEC $02A5       temp store for line index
.,E8FF E8       INX
.,E900 20 F0 E9 JSR $E9F0       set start of line (X)
.,E903 E0 18    CPX #$18
.,E905 B0 0C    BCS $E913
.,E907 BD F1 EC LDA $ECF1,X     read low-byte screen addresses
.,E90A 85 AC    STA $AC
.,E90C B5 DA    LDA $DA,X
.,E90E 20 C8 E9 JSR $E9C8       move a screen line
.,E911 30 EC    BMI $E8FF
.,E913 20 FF E9 JSR $E9FF       clear a screen line
.,E916 A2 00    LDX #$00
.,E918 B5 D9    LDA $D9,X       calculate new screen line link table
.,E91A 29 7F    AND #$7F        clear bit7
.,E91C B4 DA    LDY $DA,X
.,E91E 10 02    BPL $E922
.,E920 09 80    ORA #$80        set bit7
.,E922 95 D9    STA $D9,X       store new value in table
.,E924 E8       INX             next line
.,E925 E0 18    CPX #$18        till all 25 are done
.,E927 D0 EF    BNE $E918
.,E929 A5 F1    LDA $F1         bottom line link
.,E92B 09 80    ORA #$80        unlink it
.,E92D 85 F1    STA $F1         and store back
.,E92F A5 D9    LDA $D9         test top line link
.,E931 10 C3    BPL $E8F6       line is linked, scroll again
.,E933 E6 D6    INC $D6         increment TBLX
.,E935 EE A5 02 INC $02A5

.,E938 A9 7F    LDA #$7F
.,E93A 8D 00 DC STA $DC00
.,E93D AD 01 DC LDA $DC01       read keyboard decode column
.,E940 C9 FB    CMP #$FB        <CTRL> pressed
.,E942 08       PHP
.,E943 A9 7F    LDA #$7F
.,E945 8D 00 DC STA $DC00
.,E948 28       PLP
.,E949 D0 0B    BNE $E956       nope, exit
.,E94B A0 00    LDY #$00
.,E94D EA       NOP
.,E94E CA       DEX
.,E94F D0 FC    BNE $E94D
.,E951 88       DEY
.,E952 D0 F9    BNE $E94D
.,E954 84 C6    STY $C6         clear NDX
.,E956 A6 D6    LDX $D6         read TBLX
.,E958 68       PLA             retrieve EAL
.,E959 85 AF    STA $AF
.,E95B 68       PLA
.,E95C 85 AE    STA $AE
.,E95E 68       PLA             retrieve SAL
.,E95F 85 AD    STA $AD
.,E961 68       PLA
.,E962 85 AC    STA $AC
.,E964 60       RTS             exit
```

## Key Registers
- $AC-$AF - RAM (KERNAL) - SAL/EAL temporary registers saved/restored on stack
- $02A5 - RAM - temporary store for line index
- $C9 - RAM (zero page) - LXSP (line index stack pointer)
- $D6 - RAM (zero page) - TBLX (screen table index)
- $D9-$DA - RAM - screen line link table ($D9) and auxiliary table ($DA) used for recomputing link bits
- $ECF1 - RAM - screen address low-byte table (indexed by X)
- $F1 - RAM - bottom line link byte
- $DC00-$DC01 - CIA 1 - keyboard port write/read (write $7F to $DC00, read $DC01 to detect <CTRL>)

## References
- "set_start_of_line" — computes start address for a screen line (JSR $E9F0)
- "move_a_screen_line" — moves characters and color bytes up one line (JSR $E9C8)
- "clear_screen_line" — clears the bottom line after moving lines (JSR $E9FF)

## Labels
- TBLX
- LXSP
- SAL
- EAL
- NDX
