# Check Line Increment (KERNAL .E8B3)

**Summary:** Checks whether the cursor (PNTR, $00D3) is at the end of a screen line (column $27 / 39 or that plus $28) and, if so and not on the bottommost line, increments TBLX ($00D6) to move the cursor down one logical line; handles wrap between physical/logical double-lines.

## Operation
This KERNAL routine tests whether the current cursor pointer PNTR ($00D3) equals the last column of a logical line and, if matched, advances the current line index TBLX ($00D6) unless already on the 25th line.

Step-by-step behavior:
- LDX #$02 sets a two-step test loop: check column $27 (decimal 39) and then column $27 + $28 (the next physical line; $28 = decimal 40, screen width).
- LDA #$27 / CMP $00D3 compares PNTR to the end-of-line column. If equal, branch to the code that will test/increment TBLX.
- If not equal, CLC / ADC #$28 adds $28 to the test column (no carry) and DEX / BNE loops back to compare the adjusted test column with PNTR. This allows matching either the logical line end or the corresponding position on the next physical line (used when logical lines map to two physical lines).
- If neither test matches, the routine returns without changing TBLX.
- On match: LDX $00D6 / CPX #$19 checks whether TBLX is already $19 (decimal 25, the bottommost line). If equal, the routine returns without incrementing. Otherwise INC $00D6 increments TBLX and then RTS returns.

**[Note: Source may contain an error — the original comment "get TBLX" appears after an RTS in the listing; it likely belongs immediately before LDX $D6.]**

## Source Code
```asm
                                *** CHECK LINE INCREMENT
                                When the cursor is at the end of the screen, if it is
                                moved forward, this routine places the cursor at the start
                                of the line below.
.,E8B3 A2 02    LDX #$02        start by testing position $27 (39)
.,E8B5 A9 27    LDA #$27        compare with PNTR
.,E8B7 C5 D3    CMP $D3         brach if equal, and move cursor down
.,E8B9 F0 07    BEQ $E8C2       else, add $28 to test next physical line
.,E8BB 18       CLC
.,E8BC 69 28    ADC #$28        two lines to test
.,E8BE CA       DEX
.,E8BF D0 F6    BNE $E8B7       return here without moving cursor down
.,E8C1 60       RTS             get TBLX
.,E8C2 A6 D6    LDX $D6         and test if at the 25th line
.,E8C4 E0 19    CPX #$19        yepp, return without moving down
.,E8C6 F0 02    BEQ $E8CA       increment TBLX
.,E8C8 E6 D6    INC $D6
.,E8CA 60       RTS
```

## Key Registers
- $00D3 - KERNAL variable PNTR (cursor pointer / screen position)
- $00D6 - KERNAL variable TBLX (current logical screen row index)

## References
- "check_line_decrement" — inverse operation: moving backward past start of line