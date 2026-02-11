# Read unused sync-following byte and self-modify branch ($036D)

**Summary:** Example C64/6502 loader step that reads an unused byte (example value $32) immediately after sync, stores it into $036D to modify the BNE branch operand (self-modifying code), changing control flow to the header-reading state ($03A0).

## Description
This loader step is executed immediately after sync detection. The routine reads a single, ignored/unused byte (example shown as #$32) and stores that byte into memory location $036D. $036D is the operand byte of a BNE instruction whose opcode sits at $036C. Writing the new operand alters the branch target so the branch will jump to the header-reading entry at $03A0.

Key points:
- The stored value is an example immediate (#$32); in the running loader the value comes from the tape read operation (this example shows the concrete value used to compute the branch target).
- The branch instruction layout: opcode D0 (BNE) at $036C, operand at $036D. Branch target = (address of next instruction after the branch) + signed displacement.
- Example displacement calculation: if $036C holds D0 and $036D is written with $32 (decimal +50), the branch target = $036E + $32 = $03A0 — which transfers control into the header-reading state.
- This is a continued use of the self-modifying branch technique used elsewhere in the loader state machine: code writes branch operands at runtime to select the next state.

The final BNE at $039E (D0 D9) shown below is a conditional branch back to $0379 (loop/flow control). That instruction is separate from the modified branch at $036C/$036D but is present within the same small-state snippet.

## Source Code
```asm
; ********************************************
; * Read an unused byte                      *
; ********************************************
0399  A9 32          LDA #$32       ; Read byte is unused.
039B  8D 6D 03       STA $036D      ; Change the branch at $036C, to jump to $03A0
039E  D0 D9          BNE $0379      ; (6)
; ********************************************
; * Read an unused byte.END                  *
; ********************************************
```

## Key Registers
- $036C-$036D - RAM - BNE opcode ($036C) and its operand ($036D) — operand is overwritten to redirect flow to header-reading state
- $0399-$039E - RAM - loader snippet that loads/stores the unused byte and contains a local BNE at $039E
- $03A0 - RAM - header-reading entry point (target after self-modified branch)
- $0379 - RAM - alternate loop/flow target referenced by BNE at $039E

## References
- "read_pilot_train_and_sync_byte" — executed immediately after sync detection
- "read_header_bytes" — leads into reading header bytes