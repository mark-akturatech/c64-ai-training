# Sprite Multiplexing — Doublebuffering the Sorted Sprite Table

**Summary:** Doublebuffer the sorted sprite arrays (2× space) so raster IRQs display one buffer while the main program sorts the other; searchable terms: sprite doublebuffering, sorted sprite table, raster IRQ, sprite multiplexing.

**Doublebuffering the Sorted Sprite Table**

Reserve twice the space for the sorted sprite arrays and alternate which half is used for display and which half is written by the main code. For example, if you need 24 hardware sprites, allocate space for 48 sorted entries. While the raster IRQs are displaying buffer A (entries 0–23), the main program may safely sort and write into buffer B (entries 24–47). On the next frame (or swap point), the roles are reversed.

Notes:

- This prevents tearing/glitches caused by modifying the sorted table while the VIC-II is reading it.
- The technique increases code complexity slightly (you must track which buffer is active and swap pointers/indices) but simplifies correctness.
- Keep unsorted (main) sprite arrays single-buffered to keep the main program simple (only the sorted/driver-facing table needs doubling).
- The raster interrupt code needs to know which buffer to use for display.

## Source Code

```text
; Example of doublebuffering the sorted sprite table

; Define buffer sizes
NUM_SPRITES = 24
BUFFER_SIZE = NUM_SPRITES * 2

; Allocate buffers
spriteBufferA: .res BUFFER_SIZE, 0
spriteBufferB: .res BUFFER_SIZE, 0

; Pointers to current buffers
currentDisplayBuffer: .word spriteBufferA
currentWriteBuffer: .word spriteBufferB

; Swap buffers routine
swapBuffers:
    lda currentDisplayBuffer
    sta temp
    lda currentDisplayBuffer+1
    sta temp+1

    lda currentWriteBuffer
    sta currentDisplayBuffer
    lda currentWriteBuffer+1
    sta currentDisplayBuffer+1

    lda temp
    sta currentWriteBuffer
    lda temp+1
    sta currentWriteBuffer+1

    rts
```

## References

- "true_sprite_multiplexing_overview" — expands on doublebuffering as an optional optimization
- "raster_interrupt_optimizations_and_unrolled_code" — discusses raster IRQs needing to know which buffer/screen to write to when doublebuffered
