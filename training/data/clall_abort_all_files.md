# CLALL — ABORT ALL FILES (KERNAL)

**Summary:** KERNAL entry CLALL (vectored from $FFE7) clears the zero-page LDTND variable ($0098) to 0 (no open files) using LDA #$00 / STA $98. Routine code located at $F32F in this listing.

## Description
This KERNAL routine is the CLALL (abort all files) handler. When vectored to via the CLALL vector at $FFE7, it sets the count/flag LDTND (zero-page $0098) to zero, indicating there are no open file channels. The implementation shown is minimal: it loads 0 into A and stores it to $98.

Behavioral note from the source: "The number of open files are set to zero, and the next routine is performed."

(See Source Code for the exact two-instruction implementation.)

## Source Code
```asm
.,F32F A9 00    LDA #$00
.,F331 85 98    STA $98         clear LDTND, no open files
```

## Key Registers
- $0098 - Zero Page - LDTND (number of open files)
- $FFE7 - KERNAL Vector - CLALL vector entry (vectors to this routine at $F32F)
- $F32F - ROM (KERNAL) - CLALL code start (listed address)

## References
- "clrchn_restore_default_io" — expands on CLALL and may be used before restoring default I/O channels

## Labels
- CLALL
- LDTND
