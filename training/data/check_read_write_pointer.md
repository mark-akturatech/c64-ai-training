# Compare 16-bit buffer pointer with end pointer (returns with Carry set if pointer >= end)

**Summary:** 6502 assembly routine that compares a 16-bit buffer pointer ($AC/$AD) with a 16-bit end pointer ($AE/$AF) using SEC/SBC sequence. Leaves Carry set when buffer pointer >= end (unsigned compare); uses LDA/SBC on low then high bytes and returns with RTS.

## Description
This small 6502 routine performs an unsigned 16-bit comparison (buffer - end) by subtracting the 16-bit end pointer from the 16-bit buffer pointer. It:

- Sets the carry (SEC) before the subtraction so SBC treats the operation as a normal subtraction with no initial borrow.
- Subtracts the low bytes first: LDA $AC; SBC $AE. The SBC result (low difference) and the processor Carry/borrow are updated.
- Loads the high byte of the buffer pointer into A (LDA $AD) and subtracts the high byte of the end pointer (SBC $AF). The final Carry reflects the overall 16-bit unsigned comparison:
  - Carry = 1 if buffer >= end (no final borrow)
  - Carry = 0 if buffer < end (final borrow occurred)
- Returns with RTS. The routine destroys A and affects processor flags; it does not modify memory.

Behavioral notes (from the code as written):
- Operates on zero page pointer bytes: buffer low = $AC, buffer high = $AD; end low = $AE, end high = $AF.
- No branching or stack use; minimal 5-byte sequence plus RTS.
- Final A contains the high-byte result of the subtraction (buffer_high - end_high - borrow_from_low), not preserved.

## Source Code
```asm
                                *** check read/write pointer
                                return Cb = 1 if pointer >= end
.,FCD1 38       SEC             set carry for subtract
.,FCD2 A5 AC    LDA $AC         get buffer address low byte
.,FCD4 E5 AE    SBC $AE         subtract buffer end low byte
.,FCD6 A5 AD    LDA $AD         get buffer address high byte
.,FCD8 E5 AF    SBC $AF         subtract buffer end high byte
.,FCDA 60       RTS             
```

## Key Registers
- $00AC-$00AF - Zero page - buffer pointer and end pointer (low/high bytes: $AC buffer low, $AD buffer high, $AE end low, $AF end high)

## References
- "tape_write_irq_routine" — expands on uses this routine to decide block completion