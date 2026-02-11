# C64 Tape Loader — Read Checksum Byte and Prepare Next Header

**Summary:** 6502 assembly sequence at $03D5–$03E5 that stores the checksum byte into zero page $06, sets loop_break flag at $02, restores the next-header vector at $03A1, and restores the branch operand at $036D so the loader will seek the first pilot byte for the next file.

## Operation
This short routine finalizes a tape-file load by recording the received checksum and restoring loader state for the next file header. Steps performed (addresses and variables are preserved exactly as in the listing):

- STA $06 (at $03D5) — store the checksum byte into zero page $06.
- LDA #$FF / STA $02 (at $03D7–$03D9) — set the loop_break variable ($02) to $FF to indicate completion.
- LDA #$07 / STA $03A1 (at $03DB–$03DD) — restore the vector used to store the next header (writes $07 to $03A1).
- LDA #$02 / STA $036D (at $03E0–$03E2) — restore the operand byte at $036D so the branch at $036C will seek the first pilot byte of the next file.
- BNE $0379 (at $03E5) — branch if Z flag clear (continuation point; context in surrounding loader code).

Note: writing $036D updates the operand byte of a branch instruction at $036C (the branch opcode is at $036C, its operand at $036D), thereby changing the branch target used by the loader loop.

## Source Code
```asm
; ********************************************
; * Read Checksum byte                       *
; ********************************************
03D5  85 06          STA $06        ; Load checksum byte

03D7  A9 FF          LDA #$FF       ; Sets the loop_break variable
03D9  85 02          STA $02

03DB  A9 07          LDA #$07       ; Restore the vector to where store next header
03DD  8D A1 03       STA $03A1

03E0  A9 02          LDA #$02       ; Restore the Branch at $036C to seek the FIRST
03E2  8D 6D 03       STA $036D      ; Pilot Byte.
03E5  D0 92          BNE $0379      ; (6)
; ********************************************
; * Read Checksum byte.END                   *
; ********************************************
```

## Key Registers
- $0006 - Zero Page - stored checksum byte (loader checksum)
- $0002 - Zero Page - loop_break variable (set to $FF to indicate completion)
- $03A1 - RAM - vector location used for storing next header (restored with $07)
- $036D - RAM - operand byte of branch at $036C (restores branch target to seek pilot byte)

## References
- "checksum_subroutine_disassembly" — expands on checksum verification and reset-on-error behavior