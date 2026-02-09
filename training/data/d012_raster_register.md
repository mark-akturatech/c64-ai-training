# $D012 — VIC-II raster register (read current line / set next raster interrupt)

**Summary:** $D012 (VIC-II) returns the current raster line (low 8 bits) when read and sets the low 8 bits of the next raster-interrupt line when written; the high/9th bit is provided by bit 7 of $D011. Relevant for raster interrupts, synchronization, and timing graphics/audio (see $D011, $D020, $D021, PAL 318-line timing).

## Raster read/write behavior
- Reading $D012 returns the current raster line low 8 bits (0–255). On PAL machines the full raster count ranges up to 318 lines per frame; the extra (high) bit is supplied by bit 7 of $D011 (the VIC-II control register). To obtain the full raster line number: if ($D011 & %10000000) is set, add 256 to the value read from $D012.
- Writing $D012 sets the low 8 bits of the raster line at which the VIC-II will trigger the next raster interrupt. To request an interrupt beyond 255 you must also set bit 7 of $D011 appropriately.
- PAL frame size: 318 raster lines (values typically 0..317). Use caution: comparisons and values must account for the 9-bit raster counter (low byte in $D012, high bit in $D011 bit 7).
- Common usage patterns:
  - Polling $D012 to synchronize code to a particular raster line (simple, non-interrupt approach).
  - Writing $D012 (and optionally adjusting $D011 bit 7) to schedule a raster interrupt at a chosen line (faster/more precise; requires setting up IRQ vector and enabling interrupts).
- Caveat: the source text’s description of "$D011 bit 7 is really bit 8 of $D012" is confusing wording. Practically, treat $D011 bit 7 as the high bit (bit 8, value 256) to extend $D012 beyond $FF. **[Note: Source may contain confusing wording about bit numbering — clarified above.]**

## Usage patterns: polling, raster bars, music timing
- Polling loop: repeatedly read $D012 and branch until it equals the target value, then execute the timed routine. This simple method is widely used in demos for synchronized effects when interrupts are not employed.
- Raster bars (color splits): wait for a specific raster line, then change background/border colors:
  - Normal screen (active display area): change both $D020 (border) and $D021 (background) for visible bands.
  - Upper or lower border areas: changing $D020 alone can suffice.
  - Precise placement requires careful timing (hardcoded delays or additional raster waits).
- Music timing: demo music players commonly run a routine once per frame or at a fixed raster position. The example pattern shows initializing a tune at $1000, polling $D012 to a specific line, calling the music play routine, and using $D020 increments/decrements to visualize the time spent in the player.

## Source Code
```asm
* = $0801

           LDA #$00
           TAX
           TAY
           JSR $1000    ; initialize music (tune driver at $1000)

mainloop:  LDA $D012    ; load current raster line (low 8 bits)
           CMP #$80     ; compare to $80 (line 128)
           BNE mainloop ; loop until raster reaches $80

           INC $D020    ; increment border color (visualize timing)
           JSR $1003    ; call music-play routine
           DEC $D020    ; decrement border color
           JMP mainloop ; repeat
```

## Key Registers
- $D012 - VIC-II - Current raster line (read: low 8 bits); write: set low 8 bits of next raster interrupt line.
- $D011 - VIC-II - Control register; bit 7 is the high bit (adds 256) for the raster line counter / interrupt target.
- $D020 - VIC-II - Border color register.
- $D021 - VIC-II - Background color register.

## References
- "how_to_implement_interrupts_example" — expands on using raster interrupts (vectors and writing $D012)
- "raster_bars_timing" — expands on making raster bars by changing $D020/$D021 at specific lines