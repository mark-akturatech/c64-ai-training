# Check for Most Eligible String to Collect ($B5BD)

**Summary:** Subroutine at $B5BD in the garbage collector; inspects a string descriptor to determine whether the current string is the highest (most eligible) in memory and therefore a candidate for move/collection.

**Description**
This routine is part of the garbage collection process that evaluates string descriptors. Its sole purpose is to check whether the current string is the highest in memory — if so, it is considered the most eligible candidate for collection/movement by the collector. It participates in the larger GC flow (see referenced chunks for the full process and the move routine).

## Source Code
```assembly
; Subroutine at $B5BD: Check for Most Eligible String to Collect

B5BD  A5 22      LDA $22        ; Load low byte of current string address
B5BF  A6 23      LDX $23        ; Load high byte of current string address
B5C1  85 5D      STA $5D        ; Store low byte in $5D
B5C3  86 5E      STX $5E        ; Store high byte in $5E
B5C5  60         RTS            ; Return from subroutine
```

## Key Registers
- **A (Accumulator):** Used to load and store the low byte of the current string address.
- **X (Index Register):** Used to load and store the high byte of the current string address.

## References
- "garbag_string_garbage_collection_overview" — overview of the overall garbage collection process this routine participates in
- "garbag_collect_string" — routine used to move/collect a string when it is eligible