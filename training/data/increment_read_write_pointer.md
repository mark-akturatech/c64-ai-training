# Increment buffer address (low $AC, high $AD) — C64 ROM

**Summary:** Increments a two-byte buffer pointer stored in zero page $00AC (low) and $00AD (high) using INC/BNE/INC/RTS; searchable terms: $AC, $AD, INC, BNE, RTS, zero page, read/write pointer, tape_write_irq_routine, C64 ROM disassembly.

## Operation
This routine increments the low byte of a two-byte buffer address at zero page $00AC. If the low byte overflows from $FF to $00 (checked via the Z flag set by INC), the high byte at $00AD is incremented to propagate the carry. The routine then returns with RTS.

Notes:
- INC sets the Zero (Z) and Negative (N) flags based on the result; BNE tests Z to detect overflow (wrapped to zero).
- INC does not affect the Carry flag (C), so this implementation uses a second INC on the high byte rather than ADC with carry.

Typical usage: stepping through a tape buffer or read/write pointer (see "tape_write_irq_routine" for the caller that advances buffer addresses during tape IRQ handling).

## Source Code
```asm
                                *** increment read/write pointer
.,FCDB E6 AC    INC $AC         increment buffer address low byte
.,FCDD D0 02    BNE $FCE1       branch if no overflow
.,FCDF E6 AD    INC $AD         increment buffer address high byte
.,FCE1 60       RTS             
```

## Key Registers
- $00AC-$00AD - Zero Page - buffer address low/high (read/write pointer)

## References
- "tape_write_irq_routine" — expands on caller that steps through tape buffer addresses