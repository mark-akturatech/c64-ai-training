# get_block — Minimal C64 Datasette block reader (6502)

**Summary:** get_block is a small 6502 routine that reads N bytes by repeatedly calling JSR get_byte and storing each returned byte into memory via the zero-page indirect indexed store STA (ptr),Y. It expects A = byte count on entry, uses zero-page variables count and ptr, and returns early with the carry set if get_byte signals end-of-data (BCS).

## Description
- Calling convention:
  - On entry A must contain the number of bytes to read; the routine stores this value into the zero-page variable count (STA count).
  - ptr is a zero-page 2-byte indirect pointer (low/high) pointing at the destination buffer; the routine writes successive bytes using STA (ptr),Y with Y starting at 0.
- Behavior:
  - LDX is not used; Y is initialized to 0 and incremented after each stored byte.
  - Each loop iteration does JSR get_byte; get_byte is expected to return the next byte in A and set the processor carry to signal an end-of-data condition.
  - If get_byte sets carry, the routine branches to the exit (BCS g2) and returns with the carry still set (early termination).
  - If no end-of-data, the returned byte (in A) is stored to (ptr),Y, Y is incremented, count (zero-page) is decremented. The loop continues while count != 0.
  - Normal completion (count reaches zero) returns with carry clear (assuming get_byte did not set it).
- Notes on addressing:
  - STA (ptr),Y is the zero-page indirect indexed addressing mode; ptr must be a zero-page pointer pair.
  - count is decremented in zero-page so external code can inspect remaining count if needed.
- Side effects:
  - A is overwritten by the last get_byte return (or left as returned when the routine exits early).
  - Y contains the number of bytes stored (mod 256).
  - Zero-page variables used: count, ptr (names as used in source).

## Source Code
```asm
get_block:
    sta count
    ldy #0
g1: jsr get_byte
    bcs g2
    sta (ptr),y
    iny
    dec count
    bne g1
g2: rts
```

## References
- "get_byte_routine" — covers get_byte and its end-of-data carry signaling
- "header_format" — describes the header read as a 192-byte data block

## Labels
- COUNT
- PTR
