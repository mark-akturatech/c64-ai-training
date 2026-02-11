# KERNAL: Back on to Previous Line ($E701–$E715)

**Summary:** KERNAL routine at $E701–$E715 that moves the cursor to the end of the previous physical line; tests TBLX ($D6), updates PNTR ($D3) and LNMX ($D5), and calls the screen-pointer setup routine ($E56C). Contains stack cleanup (PLA/PLA) and a conditional branch back into earlier code.

## Operation
- Entry: called by DEL and cursor-left handling when the cursor must retreat to the previous physical line.
- LDX $D6 (TBLX) tests the physical line number.
  - If TBLX ≠ 0, decrement TBLX and write it back; then JSR $E56C to set the screen pointers for the new line start.
  - If TBLX = 0, store 0 into PNTR ($D3), pull two bytes from the stack (PLA; PLA) and then branch to $E6A8 (backwards), continuing the caller's control flow.
- After JSR $E56C, LNMX ($D5) is loaded into Y and stored into PNTR ($D3) to position the cursor at the end of the (now previous) line.
- Final RTL: RTS returns to caller with saved registers cleaned up by the earlier PLA/PLA sequence (the routine assumes caller-saved values were stacked before entry).

Behavioral notes preserved from source:
- Tests "top-of-screen" (TBLX zero) to avoid moving above the first line.
- Uses TBLX ($D6) as the physical-line index/table index and PNTR ($D3) as the character pointer within the line.
- Calls $E56C to recompute screen pointers after changing the line index.

## Source Code
```asm
.,E701 A6 D6    LDX $D6         test TBLX, physical line number
.,E703 D0 06    BNE $E70B       if not on top line, branch
.,E705 86 D3    STX $D3         set PNTR to zero as well
.,E707 68       PLA
.,E708 68       PLA
.,E709 D0 9D    BNE $E6A8       always jump
.,E70B CA       DEX             decrement TBLX
.,E70C 86 D6    STX $D6         and store
.,E70E 20 6C E5 JSR $E56C       set screen pointers
.,E711 A4 D5    LDY $D5         get LNMX
.,E713 84 D3    STY $D3         and store in PNTR
.,E715 60       RTS
```

## Key Registers
- $D6 - KERNAL zero page - TBLX (physical line/table index)
- $D3 - KERNAL zero page - PNTR (pointer/column index into current line)
- $D5 - KERNAL zero page - LNMX (line maximum/end position)

## References
- "retreat_cursor" — expands on adjusting line/table pointers when retreating across logical/physical lines
- "output_to_screen_unshifted_and_control_codes" — expands on DEL and cursor-left handling in the output path

## Labels
- TBLX
- PNTR
- LNMX
