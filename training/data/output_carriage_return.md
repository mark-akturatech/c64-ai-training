# KERNAL: OUTPUT <CARRIAGE RETURN> (E891)

**Summary:** Handles the editor "carriage return" action in the KERNAL editor: clears editor mode flags ($00D8, $00C7, $00D4), resets pointer/column ($00D3) and calls go_to_next_line (JSR $E87C), then jumps to finish the screen print (JMP $E6A8).

## Description
This routine implements the <CARRIAGE RETURN> behavior in the KERNAL editor:
- Clears editor mode flags by storing 0 into zero-page variables:
  - INSRT (insert mode) at $00D8
  - RVS (reversed mode) at $00C7
  - QTSW (quotes mode) at $00D4
- Resets PNTR (cursor column pointer) at $00D3 to 0 so the cursor is placed at the first column of the next line.
- Calls go_to_next_line (JSR $E87C) to move the cursor down and position it at the start of the next line.
- Jumps to the finish screen print handler (JMP $E6A8) which completes the carriage-return-related screen output.

All operations are simple zero-store and control transfers; no stack usage beyond the JSR/RTS in the called routines.

## Source Code
```asm
.,E891 A2 00    LDX #$00
.,E893 86 D8    STX $D8         ; INSRT, disable insert mode
.,E895 86 C7    STX $C7         ; RVS, disable reversed mode
.,E897 86 D4    STX $D4         ; QTSW, disable quotes mode
.,E899 86 D3    STX $D3         ; PNTR, put cursor at first column
.,E89B 20 7C E8 JSR $E87C       ; go_to_next_line
.,E89E 4C A8 E6 JMP $E6A8       ; finish screen print
```

## Key Registers
- $00D8 - KERNAL zero page - INSRT (insert mode flag)
- $00C7 - KERNAL zero page - RVS (reversed mode flag)
- $00D4 - KERNAL zero page - QTSW (quotes mode flag)
- $00D3 - KERNAL zero page - PNTR (cursor column pointer)

## References
- "go_to_next_line" — moves cursor to next line and positions at first column
- "print_to_screen" — follows carriage return behavior to finish screen print

## Labels
- OUTPUT
- INSRT
- RVS
- QTSW
- PNTR
