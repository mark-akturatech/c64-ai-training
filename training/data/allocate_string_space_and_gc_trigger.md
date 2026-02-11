# make-space helper for strings (allocate A bytes, return X/Y pointer)

**Summary:** Routine at $B4F4 that allocates A bytes in BASIC string memory, returns X = pointer low byte and Y = pointer high byte, updates bottom-of-string-space and string-utility pointers ($33/$34, $35/$36), tests against end-of-arrays ($31/$32), handles out-of-memory ($10) and invokes garbage collection (JSR $B526). Uses zero-page flag $0F (garbage-collected) and saves/restores the length on the stack.

## Operation
- Purpose: allocate A bytes in string space (A = string length in A on entry). On success returns pointer to allocated block in X (low) and Y (high), updates:
  - bottom-of-string-space ($33/$34) ← new bottom after allocation
  - string utility pointer ($35/$36) ← same pointer for use by string routines
- Stack usage: the routine saves A with PHA on entry and restores it with PLA either on the success path (before RTS) or on the GC retry path (before reattempting allocation). Only one saved byte is active at a time; the code branches to balance pushes/pulls.
- Subtraction method: computes bottom - length using two's-complement subtraction via EOR #$FF / SEC / ADC $33 and adjusts high byte with DEY if the low-byte subtraction underflowed (BCS/DEY).
- Out-of-memory check: after computing the candidate new bottom ($33/$34), it compares Y to end-of-arrays high byte ($32) and, if equal, compares low bytes ($31) to detect crossing into array region. If allocation would go below end-of-arrays, it sets error code $10 in X and either triggers the error handler (if garbage-collected flag set) or calls the garbage collector (JSR $B526).
- Garbage-collection path: if GC is needed, the routine JSRs $B526 (garbage collection), then sets $0F = $80 (flagging that GC occurred) and loops to retry allocation. If the garbage-collected flag was already set on error, it branches to the higher-level error handler (earlier routine at $B4D2 referenced by BMI).
- Return values on success: X = low byte of allocated pointer (TAX from $33), Y = high byte of allocated pointer (LDY $34 earlier). Length is restored to A before returning.

## Source Code
```asm
                                *** make space in string memory for string A long
                                return X = pointer low byte, Y = pointer high byte
.,B4F4 46 0F    LSR $0F         clear garbage collected flag (b7)
                                make space for string A long
.,B4F6 48       PHA             save string length
.,B4F7 49 FF    EOR #$FF        complement it
.,B4F9 38       SEC             set carry for subtract, two's complement add
.,B4FA 65 33    ADC $33         add bottom of string space low byte, subtract length
.,B4FC A4 34    LDY $34         get bottom of string space high byte
.,B4FE B0 01    BCS $B501       skip decrement if no underflow
.,B500 88       DEY             decrement bottom of string space high byte
.,B501 C4 32    CPY $32         compare with end of arrays high byte
.,B503 90 11    BCC $B516       do out of memory error if less
.,B505 D0 04    BNE $B50B       if not = skip next test
.,B507 C5 31    CMP $31         compare with end of arrays low byte
.,B509 90 0B    BCC $B516       do out of memory error if less
.,B50B 85 33    STA $33         save bottom of string space low byte
.,B50D 84 34    STY $34         save bottom of string space high byte
.,B50F 85 35    STA $35         save string utility ptr low byte
.,B511 84 36    STY $36         save string utility ptr high byte
.,B513 AA       TAX             copy low byte to X
.,B514 68       PLA             get string length back
.,B515 60       RTS             
.,B516 A2 10    LDX #$10        error code $10, out of memory error
.,B518 A5 0F    LDA $0F         get garbage collected flag
.,B51A 30 B6    BMI $B4D2       if set then do error code X
.,B51C 20 26 B5 JSR $B526       else go do garbage collection
.,B51F A9 80    LDA #$80        flag for garbage collected
.,B521 85 0F    STA $0F         set garbage collected flag
.,B523 68       PLA             pull length
.,B524 D0 D0    BNE $B4F6       go try again (loop always, length should never be = $00)
```

## Key Registers
- $000F - Zero page - garbage-collected flag (bit 7 used to indicate GC state)
- $0031 - Zero page - end-of-arrays low byte (limit for string allocation)
- $0032 - Zero page - end-of-arrays high byte
- $0033 - Zero page - bottom-of-string-space low byte (updated on allocation)
- $0034 - Zero page - bottom-of-string-space high byte
- $0035 - Zero page - string utility pointer low byte (set to allocation pointer)
- $0036 - Zero page - string utility pointer high byte

## References
- "garbage_collection_main_routine" — covers the garbage collection called at $B526 when allocation would fail

## Labels
- $000F
- $0031
- $0032
- $0033
- $0034
- $0035
- $0036
