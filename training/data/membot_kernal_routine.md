# MEMBOT (KERNAL)

**Summary:** MEMBOT is the KERNAL routine at $FF9C (65436) used to read or set the bottom-of-RAM pointer; it uses registers X (low byte) and Y (high byte) and is controlled by the accumulator carry flag (carry=read, clear=set). Default bottom on an unexpanded C64 is $0800 (2048).

## Description
Purpose: set or read the bottom of memory (beginning of RAM).

Call address: $FF9C (hex) / 65436 (dec).

Communication registers:
- X = low byte of bottom-of-RAM pointer
- Y = high byte of bottom-of-RAM pointer

Behavior:
- If the accumulator carry flag is set when JSR $FF9C is executed, MEMBOT returns the current bottom-of-RAM pointer: X = low byte, Y = high byte.
- If the accumulator carry flag is clear when JSR $FF9C is executed, MEMBOT sets the bottom-of-RAM pointer from the values in X (low byte) and Y (high byte).

Preparatory routines: none.
Error returns: none.
Stack requirements: none.
Registers affected: X, Y.

Default value on an unexpanded Commodore 64: $0800 (2048 decimal).

How to use:
- To read bottom-of-RAM:
  1. Set the carry flag (SEC).
  2. JSR $FF9C (JSR MEMBOT).
  3. Read X (low) and Y (high).
- To set bottom-of-RAM:
  1. Clear the carry flag (CLC).
  2. Ensure X/Y contain desired low/high bytes.
  3. JSR $FF9C (JSR MEMBOT).

Notes:
- A "page" here is 256 bytes; incrementing Y (high byte) moves the bottom by 256-byte pages.
- The routine only sets the pointer; other KERNAL or I/O routines may assume or modify memory bounds (see memtop/load KERNAL routines).

## Source Code
```asm
; EXAMPLE: MOVE BOTTOM OF MEMORY UP 1 PAGE
        SEC         ; set carry to READ MEMORY BOTTOM
        JSR $FF9C    ; JSR MEMBOT - returns pointer in X(low),Y(high)
        INY         ; increment high byte = move up one 256-byte page
        CLC         ; clear carry to SET MEMORY BOTTOM
        JSR $FF9C    ; JSR MEMBOT - sets pointer from X(low),Y(high)
```

## Key Registers
- $FF9C - KERNAL - MEMBOT routine entry (read/set bottom-of-RAM pointer, uses X/Y; carry selects read/set)

## References
- "memtop_kernal_routine" — complementary routine for top-of-RAM management
- "load_kernal_routine" — impact of memory bounds when loading/relocating data

## Labels
- MEMBOT
