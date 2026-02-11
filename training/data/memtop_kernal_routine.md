# MEMTOP

**Summary:** KERNAL routine MEMTOP at $FF99 (65433) — set or read top of RAM (top-of-memory pointer). Uses X/Y as communication registers; Carry=1 reads pointer into X/Y, Carry=0 writes X/Y into the pointer. Stack requirement: 2.

## Description
Purpose: set or read the top of RAM (top-of-memory pointer).

Call address: $FF99 (hex) / 65433 (decimal).

Communication registers: X, Y. When the processor Carry flag (C) is set on entry, MEMTOP loads the top-of-RAM pointer into X (low byte) and Y (high byte). When Carry is clear on entry, MEMTOP stores the contents of X (low byte) and Y (high byte) into the top-of-memory pointer, changing the top of RAM.

Preparatory routines: None.
Error returns: None.
Stack requirements: 2 (JSR pushes a return address; no additional stack use specified by source).
Registers affected: X, Y (documented); other registers not documented as modified.

Behavior summary:
- SEC / JSR MEMTOP — read top-of-memory into X/Y (SEC sets Carry).
- CLC / JSR MEMTOP — write X/Y into top-of-memory (CLC clears Carry).
Typical use: read the current top, adjust X/Y to expand/shrink available RAM, then write the new top back.

## Source Code
```asm
; MEMTOP usage example — Deallocate the RS-232 buffer
; Read current top of memory, decrement, write it back.

    SEC
    JSR $FF99   ; JSR MEMTOP - READ TOP OF MEMORY (Carry set -> load pointer into X/Y)
    DEX         ; decrement low byte of pointer (example)
    CLC
    JSR $FF99   ; JSR MEMTOP - SET NEW TOP OF MEMORY (Carry clear -> store X/Y into pointer)
```

## Key Registers
- $FF99 - KERNAL - MEMTOP call address (set/read top of RAM; uses X/Y; Carry selects read (1) or write (0))

## References
- "membot_kernal_routine" — complementary routine for bottom-of-RAM management
- "load_kernal_routine" — effects of top-of-memory on loaded data and buffers

## Labels
- MEMTOP
