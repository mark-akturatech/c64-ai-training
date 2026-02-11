# Clean descriptor-stack item check and discard

**Summary:** Compares YA (Y/A registers) against the top-of-stack descriptor pointer bytes ($18/$17), and if they match discards the top descriptor, updates descriptor stack pointer bytes ($16/$17) and the last-string-pointer low byte, clears Y, then returns (RTS). Search terms: $16, $17, $18, CPY, CMP, STA, SBC, LDY, RTS, descriptor stack.

## Description
This routine checks whether the pointer currently in Y:A matches the top entry of the descriptor stack (top pointer stored in $18/$17). Execution flow:

- CPY $18 — compare Y with the descriptor-stack top high byte; exit if different.
- CMP $17 — compare A with the descriptor-stack top low byte; exit if different.
- If both bytes equal the stack top, the code treats this as a match and removes/discards that descriptor stack item:
  - STA $16 — write A into $16 (updates descriptor stack pointer byte).
  - SBC #$03 — subtract 3 from A (used to update the last-string-pointer low byte). (SBC uses the carry flag).
  - STA $17 — save the adjusted low byte into $17 (completes update of the pointer byte).
  - LDY #$00 — clear Y (zero the high byte / clear Y register).
- RTS — return to caller.

Comments in the original listing describe $16/$17 and $18/$17 as descriptor stack pointer and top-of-stack pointer bytes respectively, and indicate the SBC #$03 step updates the "last string pointer" low byte.

## Source Code
```asm
.,B6DB C4 18    CPY $18         compare high byte with current descriptor stack item
                                pointer high byte
.,B6DD D0 0C    BNE $B6EB       exit if <>
.,B6DF C5 17    CMP $17         compare low byte with current descriptor stack
                                item pointer low byte
.,B6E1 D0 08    BNE $B6EB       exit if <>
.,B6E3 85 16    STA $16         set descriptor stack pointer
.,B6E5 E9 03    SBC #$03        update last string pointer low byte
.,B6E7 85 17    STA $17         save current descriptor stack item pointer low byte
.,B6E9 A0 00    LDY #$00        clear high byte
.,B6EB 60       RTS
```

## References
- "chr_string_creation" — expands on uses of descriptor stack space after creating string
- "pull_string_and_byte_param" — expands on related descriptor stack manipulations