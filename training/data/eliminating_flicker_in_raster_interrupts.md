# Sprite Multiplexing Techniques (Cadaver / Lasse Oorni)

**Summary:** Techniques to reduce flicker and audio slowdown during sprite multiplexing by checking VIC-II raster ($D012) timing and avoiding displaying sprites outside visible ranges; includes an end-of-IRQ lateness check example using SEC / SBC #$03 / CMP $D012 to decide whether to skip costly IRQ handling.

## Problem
Sprite multiplexing schedules many raster interrupts at arbitrary Y positions (based on sprite Y-coordinates). Flicker and slowdown occur when the next planned raster IRQ is already too close to (or at/above) the current VIC-II raster counter ($D012), or when multiplexing causes other important IRQs (e.g., a bottom score panel) to be missed. The operation is unpredictable because sprites can be anywhere and several interrupts may need servicing near the same raster line.

Causes listed:
- Next raster IRQ is so close to the current one that the CPU is already late relative to $D012.
- Other important raster IRQs (like a score panel) get missed due to time spent handling sprite multiplexing.

## Recommendations
- Do not display sprites outside the visible screen area (clip sprite Y-coordinates outside visible ranges).
- Reduce allowed sprite Y positions near the bottom of the screen (e.g., if a score panel starts at line 200, disallow sprite Y 198–199).
- At the end of each raster IRQ (where timing/length is uncertain), check whether the next planned raster IRQ is already too late compared with the current $D012 value. If it's late, skip expensive register saves/restores and IRQ acknowledging to avoid causing flicker and audio slowdown.
- Use a small safety margin when comparing (three scanlines recommended; two may still be too small in some cases).
- These checks reduce flicker and audio slowdown caused by late IRQ handling but do not prevent game slowdown if the CPU genuinely has too much to do or graphical corruption when many sprites overlap.

Example behavior note: the accumulator should hold the Y position (raster line) for the next interrupt when performing the check. If the comparison indicates lateness, branch to a handler that performs a minimal, fast IRQ path (skip saves/ack).

## Source Code
```asm
        ; accumulator contains next raster IRQ Y position
        STA $D012        ; write planned IRQ to $D012 (example usage)
        SEC
        SBC #$03         ; safety margin of 3 scanlines
        CMP $D012        ; Late from next IRQ?
        BCC go_to_irq_directly

        ; go_to_irq_directly should jump to a fast IRQ path which
        ; skips register saving/restoring and interrupt acknowledging.
```

## Key Registers
- $D000-$D02E - VIC-II - raster counter and video registers (includes raster register $D012 used for timing comparisons)

## References
- "raster_interrupt_code_example_and_notes" — expands on integrating the lateness check into the raster IRQ flow to avoid late IRQs