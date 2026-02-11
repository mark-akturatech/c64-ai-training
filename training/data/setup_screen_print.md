# KERNAL: Prepare and perform single-character print ($E691–$E6B5)

**Summary:** KERNAL routine that prepares a character for screen output by setting attribute bits (ORA #$40, optional ORA #$80 for reverse), handling the RVS (reverse) and INSRT (insert-mode) flags ($00C7, $00D8), fetching the current color ($0286) into X, calling the low-level print routine ($EA13), advancing the cursor ($E6B6), and restoring registers/flags before RTS.

## Behavior and structure
This routine receives a character in A and performs the following sequence:

- ORA #$40 — sets bit 6 (0x40) in A (the code always ORs this bit into the character byte).
- LDX $C7 / BEQ — tests the RVS flag (zero-page $00C7). If RVS is nonzero, ORA #$80 sets bit 7 (0x80) to mark the character as reversed.
- LDX $D8 / BEQ — tests the INSRT flag/counter (zero-page $00D8). If nonzero, DEC $D8 decrements the insert-mode character count (insert mode will display characters until this counter reaches zero).
- LDX $0286 — loads the current character color code from $0286 into X (used by the print routine).
- JSR $EA13 — calls the low-level CHROUT/print-to-screen routine (handles writing character+attribute to screen memory).
- JSR $E6B6 — calls the cursor-advance routine after printing.
- A series of PLA/TAY/PLA/TAX/PLA followed by CLC and CLI — pops saved register values from the stack, restores A/X/Y, clears the carry flag, enables interrupts, then RTS returns to the caller.

Notes:
- The code decrements $00D8 when insert mode is active, ensuring a finite number of inserted characters.
- LSR $D4 is executed only when INSRT is nonzero; the source does not define the semantic purpose of $00D4 here (it is shifted right once).
- The low-level print routine at $EA13 and the advance-cursor routine at $E6B6 perform the actual screen memory and cursor updates; this routine prepares flags, attributes, and registers for those calls.

## Source Code
```asm
.,E691 09 40    ORA #$40
.,E693 A6 C7    LDX $C7         test RVS, flag for reversed characters
.,E695 F0 02    BEQ $E699       nope
.,E697 09 80    ORA #$80        set bit 7 to reverse character
.,E699 A6 D8    LDX $D8         test INSRT, flag for insert mode
.,E69B F0 02    BEQ $E69F       nope
.,E69D C6 D8    DEC $D8         decrement number of characters left to insert
.,E69F AE 86 02 LDX $0286       get COLOR, current character colour code
.,E6A2 20 13 EA JSR $EA13       print to screen
.,E6A5 20 B6 E6 JSR $E6B6       advance cursor
.,E6A8 68       PLA
.,E6A9 A8       TAY
.,E6AA A5 D8    LDA $D8         INSRT
.,E6AC F0 02    BEQ $E6B0
.,E6AE 46 D4    LSR $D4
.,E6B0 68       PLA
.,E6B1 AA       TAX
.,E6B2 68       PLA
.,E6B3 18       CLC
.,E6B4 58       CLI
.,E6B5 60       RTS
```

## Key Registers
- $00C7 - Zero Page - RVS flag (reverse-video enable)
- $00D8 - Zero Page - INSRT counter (insert-mode character count)
- $00D4 - Zero Page - shifted with LSR $D4 (purpose not defined here)
- $0286 - RAM - current COLOR (character colour code loaded into X)

## References
- "output_to_screen_unshifted_and_control_codes" — expands on CHROUT output path and the low-level print routine
- "advance_cursor" — expands on the cursor-advance routine called after printing a character

## Labels
- RVS
- INSRT
- COLOR
