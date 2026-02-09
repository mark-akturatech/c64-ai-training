# Copy I/O Start Address to Tape Buffer ($00C1/$00C2 → $00AC/$00AD)

**Summary:** This Commodore 64 KERNAL ROM subroutine, located at $FB8E, copies the I/O start address from zero page locations $00C1 (low byte) and $00C2 (high byte) into the tape buffer pointer at zero page locations $00AC (low byte) and $00AD (high byte), respectively. This setup ensures that subsequent tape operations reference the correct buffer address.

**Description**

The routine initializes the tape buffer pointer by transferring the I/O start address:

- Loads the high byte from $00C2 and stores it in $00AD.
- Loads the low byte from $00C1 and stores it in $00AC.
- Returns from the subroutine.

This process is essential for aligning the tape buffer pointer with the I/O start address before performing tape read or write operations.

## Source Code

```asm
; Copy I/O start address to tape buffer pointer
.,FB8E   A5 C2      LDA $C2        ; Load high byte of I/O start address
.,FB90   85 AD      STA $AD        ; Store in high byte of tape buffer pointer
.,FB92   A5 C1      LDA $C1        ; Load low byte of I/O start address
.,FB94   85 AC      STA $AC        ; Store in low byte of tape buffer pointer
.,FB96   60         RTS            ; Return from subroutine
```

## Key Registers

- **$00C1-$00C2**: Zero Page - I/O start address (low/high bytes)
- **$00AC-$00AD**: Zero Page - Tape buffer pointer (low/high bytes)

## References

- "store_character" — Details on routines that set the tape buffer pointer before operations
- "tape_write_irq_routine" — Information on tape routines utilizing buffer pointers $00AC/$00AD