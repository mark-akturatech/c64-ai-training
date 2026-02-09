# Copy I/O Start Address to Buffer Address (KERNAL $FB8E)

**Summary:** This KERNAL subroutine at $FB8E copies the I/O start address bytes from $00C2/$00C1 into the buffer address bytes $00AD/$00AC (buffer high/low). It sets the buffer pointer before store/verify and checksum routines.

**Description**

The routine loads the two-byte I/O start address (stored in zero page variables $00C2 = high, $00C1 = low) and writes them into the buffer address zero page variables $00AD = high, $00AC = low). It is intended as a helper (JSR $FB8E) invoked by store/verify and checksum code paths so the buffer pointer points at the current I/O data block.

Behavior notes:

- Uses LDA/STA to copy each byte; A and the destination zero-page bytes are modified.
- No stack or index registers are changed explicitly by the sequence shown (no PHA/PLA or TXA/TXS usage).
- Returns to caller (RTS).

## Source Code

```asm
                                *** copy I/O start address to buffer address
.,FB8E A5 C2    LDA $C2         ; get I/O start address high byte
.,FB90 85 AD    STA $AD         ; set buffer address high byte
.,FB92 A5 C1    LDA $C1         ; get I/O start address low byte
.,FB94 85 AC    STA $AC         ; set buffer address low byte
.,FB96 60       RTS             ; return
```

## Key Registers

- $00C2 - Zero page (KERNAL) - I/O start address high byte
- $00C1 - Zero page (KERNAL) - I/O start address low byte
- $00AD - Zero page (KERNAL) - Buffer address high byte (destination)
- $00AC - Zero page (KERNAL) - Buffer address low byte (destination)

## References

- "store_tape_character_and_buffer_handling" — expands on invoked (JSR $FB8E) to set buffer address before writing/verifying bytes and before checksum computation