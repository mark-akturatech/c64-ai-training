# Sprite multiplexing: per-sprite unrolled raster IRQ, $D010 precalc, doublebuffer-aware writes

**Summary:** Techniques for faster raster IRQ sprite updates on the VIC-II: unroll per-physical-sprite code blocks that STA directly to $D000-$D027 and precalc $D010 values; adjust frame-write STA high byte for the active double-buffer ($C3F8-$C3FF example) and branch/jump to the correct sprite entry depending on which sprite to start updating.

## Description
This chunk documents an optimization pattern for sprite multiplexing during a tight raster IRQ: reduce IRQ-time work by moving per-sprite logic out of loops and into separate, unrolled code blocks, and by precomputing any registers that would otherwise be calculated in the IRQ.

Key points:
- Unroll one code block per physical sprite. Each block performs fixed STA operations to the VIC-II sprite registers for that physical sprite (X/Y, pointer, color, enable), and writes the prepared frame bytes to the frame buffer addresses. This removes index arithmetic and table indirection from the IRQ path.
- Precalculate $D010 values (and other control bits) outside the IRQ so the interrupt handler only performs STA to $D010. Precalculation costs CPU time elsewhere but shortens IRQ duration and reduces visible timing artifacts for tight sprite clusters.
- Only update (write) the active screen buffer in the IRQ — modify the IRQ code to target the active buffer. The STA instructions that write frame data (example uses $C3F8-$C3FF) must have their high byte changed according to which buffer is currently active (double-buffering).
- Because updates need to begin from whatever virtual sprite is next, you must jump into the unrolled code at the appropriate per-sprite entry point. That adds complexity: the IRQ must select the correct entry (spriteN label) and the code layout must support starting in the middle of the sequence.
- The example uses arrays named sortspry, sortsprx, sortsprd010, sortsprf, sortsprc and a loop-end sentinel in endspr (comparison against Y + INY; when Y == endspr, branch to done). Using INY/CPY/BCS as the loop termination is shown.
- Tradeoffs: shorter IRQs and fewer timing glitches vs. larger code size and more complicated control flow (entry-point jumping, buffer-specific STA high-byte modification).

Caveats:
- The approach assumes you can modify STA instruction high bytes (patch code) or maintain separate code paths per buffer. That increases code size and complexity.
- You must ensure jumps to the correct per-sprite label are cycle-accurate if timing matters (entering in the middle of an unrolled sequence changes alignment).
- This technique is primarily about minimizing per-sprite IRQ overhead; it doesn't remove the requirement to carefully schedule raster lines and sprite priorities.

## Source Code
```asm
; Virtual sprite number is in Y.
; Example unrolled per-physical-sprite blocks (second example from source)

sprite0:        lda sortspry,y
                sta $d001
                lda sortsprx,y
                sta $d000
                lda sortsprd010,y
                sta $d010
                lda sortsprf,y
frame0:         sta $c3f8
                lda sortsprc,y
                sta $d027
                iny
                cpy endspr
                bcs done

sprite1:        lda sortspry,y
                sta $d003
                lda sortsprx,y
                sta $d002
                lda sortsprd00,y
                sta $d010
                lda sortsprf,y
frame1:         sta $c3f9
                lda sortsprc,y
                sta $d028
                iny
                cpy endspr
                bcs done

; ... continue for additional physical sprites ...
```

## Key Registers
- $D000-$D027 - VIC-II - Sprite registers (X/Y/ptr/color/enable range for sprites)
- $D010 - VIC-II - Control register (used here for precomputed control/high bits)
- $C3F8-$C3FF - RAM - example frame-write addresses (example doublebuffer write region)

## References
- "doublebuffering_sorted_sprite_tables" — expands on adapting optimizations to the currently-active screen buffer
- "write_registers_just_before_new_sprite" — expands on precalculation of interrupts and per-sprite unrolled code techniques