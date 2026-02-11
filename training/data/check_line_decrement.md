# Check Line Decrement (KERNAL)

**Summary:** 6502 KERNAL routine that tests the cursor pointer PNTR ($00D3) for column 0 or column 40 and, if matched, decrements TBLX ($00D6) (logical line index). Uses CMP/ADC/DEC/CBEQ loop with X as a 2-iteration counter.

## Description
This routine verifies whether the cursor is at the beginning of a screen line (column 0) or at column 40 (an alternate line boundary). It sets X=2 and A=0, then loops twice comparing A to PNTR ($00D3). On the first iteration A==0 is tested; if unequal A is increased by $28 (40 decimal) via CLC/ADC to test for column 40 on the second iteration. If either comparison matches, the routine decrements TBLX ($00D6) and returns. If neither matches, it returns without modifying TBLX.

Behavior summary:
- X = 2 controls two comparisons: A = 0, then A = 40.
- CMP $00D3 compares the logical cursor column (PNTR) against A.
- If equal, branch to DEC $00D6 (decrement logical line index) then RTS.
- If not equal and X still > 0, add $28 to A and loop to compare PNTR with 40.
- If neither 0 nor 40, the routine exits (RTS) with no changes to TBLX.

Notes:
- The routine itself only decrements TBLX when PNTR == 0 or 40; any action that places the cursor at the end of the previous line is handled elsewhere (caller or subsequent code).
- Short parentheticals: PNTR ($00D3) — cursor column pointer (logical), TBLX ($00D6) — logical line/table index.

## Source Code
```asm
                                *** CHECK LINE DECREMENT
                                When the cursor is at the beginning of a screen line, if
                                it is moved backwards, this routine places the cursor at
                                the end of the line above. It tests both column 0 and
                                column 40.
.,E8A1 A2 02    LDX #$02        test if PNTR is at the first column
.,E8A3 A9 00    LDA #$00        yepp
.,E8A5 C5 D3    CMP $D3         add $28 (40)
.,E8A7 F0 07    BEQ $E8B0       to test if cursor is at line two in the logical line
.,E8A9 18       CLC
.,E8AA 69 28    ADC #$28        test two lines
.,E8AC CA       DEX
.,E8AD D0 F6    BNE $E8A5       decrement line number
.,E8AF 60       RTS
.,E8B0 C6 D6    DEC $D6
.,E8B2 60       RTS
```

## Key Registers
- $00D3 - KERNAL variable PNTR - cursor column pointer (logical)
- $00D6 - KERNAL variable TBLX - logical line/table index

## References
- "check_line_increment" — inverse operation: moving forward past end of line

## Labels
- PNTR
- TBLX
