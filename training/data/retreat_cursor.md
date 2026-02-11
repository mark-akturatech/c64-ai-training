# RETREAT CURSOR ($E6ED-$E700)

**Summary:** KERNAL routine that scans the screen line link table LDTB1 ($D9,X) testing bit7 (sign bit) to find a logical-line start and jumps to the start-of-line setup routine ($E9F0). If no logical-line marker is found, it decrements TBLX ($D6), calls $E87C to move to the previous physical line, and clears PNTR ($D3) (cursor column).

## Description
This routine performs the "retreat cursor" operation used when moving left/backwards across logical lines or when editing back past a line start:

- It uses X as an index to scan LDTB1 via LDA $D9,X. The BMI instruction checks the sign bit (bit7) of the table entry — a set bit7 indicates the start of a logical line.
- If a start-of-logical-line marker is found, execution jumps to $E9F0 (sets the start-of-line pointer and continues there).
- If the loop finishes without finding any bit7-set entries (X wraps to 0), the routine treats this as moving to the previous physical screen line:
  - DEC $D6 decrements TBLX (the physical line index).
  - JSR $E87C is invoked to position the cursor onto that line.
  - PNTR ($D3) is set to 0 (cursor column reset).
- Registers modified: X (decremented), zero-page $D6 (TBLX), $D3 (PNTR). The routine ends with RTS at $E700.

Behavioral note: The code uses JMP $E9F0 (not JSR), so finding a logical-line marker transfers control to the start-of-line routine without returning to the remaining instructions in this block.

## Source Code
```asm
.,E6ED B5 D9    LDA $D9,X       LDTB1, screen line link table
.,E6EF 30 03    BMI $E6F4       test bit7
.,E6F1 CA       DEX             next line
.,E6F2 D0 F9    BNE $E6ED       till all are done
.,E6F4 4C F0 E9 JMP $E9F0       set start of line
.,E6F7 C6 D6    DEC $D6         decrement TBLX, cursor line
.,E6F9 20 7C E8 JSR $E87C       goto next line
.,E6FC A9 00    LDA #$00
.,E6FE 85 D3    STA $D3         set PNTR, the cursor column, to zero
.,E700 60       RTS
```

## Key Registers
- $D9 - Zero page - LDTB1: screen line link table (indexed with X); bit7 marks logical-line starts
- $D6 - Zero page - TBLX: physical cursor line index (decremented when moving to previous physical line)
- $D3 - Zero page - PNTR: cursor column (set to 0 when moving to previous line)

## References
- "advance_cursor" — expands on wrapping/advance logic used when reverse-wrapping or crossing line boundaries
- "back_to_previous_line" — expands on delete/left-cursor operations that move onto the previous line

## Labels
- RETREAT_CURSOR
- LDTB1
- TBLX
- PNTR
