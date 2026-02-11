# VIC-II interrupt system (VIC 6567/6569) — $D019 / $D01A

**Summary:** VIC-II interrupt sources and behavior: raster interrupt (RST), sprite/bitmap collision (MBC), sprite-sprite collision (MMC), and lightpen negative edge (LP). Registers involved: $D019 (interrupt latch), $D01A (interrupt enable), raster compare ($D012 + $D011 bit 7), and collision registers $D01E/$D01F.

**VIC interrupts**
The VIC-II asserts its IRQ output (connected directly to the 6510 IRQ input) when at least one interrupt source’s latch bit and the corresponding enable bit are both set. The processor can mask these interrupts with the I flag in the status register.

Behavior summary:
- There are four distinct interrupt sources. Each source sets a bit in the interrupt latch ($D019) when the event occurs. The VIC does not clear these latch bits automatically; the CPU must clear them by writing a '1' to the corresponding bit(s) in $D019.
- An interrupt is signaled (IRQ held low) only if a latch bit is set and the matching bit in the interrupt enable register ($D01A) is set.
- Because the VIC does not clear latch bits, the CPU must clear the appropriate latch bits before re-enabling interrupts (clearing the I flag) or returning from the IRQ handler; otherwise the IRQ will immediately reassert (the 6510 IRQ input is level-sensitive).
- Bit 7 of $D019 is a readback of the inverted IRQ output state (i.e., it reflects whether the VIC is currently pulling the IRQ line low, inverted).
- For the two collision interrupts (MBC and MMC), only the first collision sets the latch and triggers the interrupt if the related collision register ($D01E for sprite vs. bitmap/text, $D01F for sprite vs. sprite) previously contained zero. To allow further interrupts from collisions, the CPU must read/clear the corresponding collision register first.

Raster compare specifics:
- The raster interrupt (RST) compares the internal raster counter to the value specified by $D012 plus the high bit in $D011 (bit 7). The raster compare test is performed in cycle 0 of each scanline (for raster line 0 the test occurs in cycle 1).

## Source Code
```text
VIC interrupt latch ($D019) / enable ($D01A) bits:

Bit | Name | Trigger condition
----+------+---------------------------------------------------------------------
0   | RST  | Reaching the raster compare line. Compare value held in $D012 plus
    |      | bit 7 of $D011. Test performed in cycle 0 of each line (line 0: cycle 1).
1   | MBC  | Sprite vs. background (text/bitmap) collision: a sprite sequencer
    |      | outputs a non-transparent pixel at the same time the graphics
    |      | sequencer outputs a foreground pixel.
2   | MMC  | Sprite vs. sprite collision: two (or more) sprite sequencers output
    |      | non-transparent pixels at the same time.
3   | LP   | Negative edge on the LP (lightpen) input.

Notes:
- The VIC sets the corresponding bit in the interrupt latch ($D019) on the event.
- To clear a latch bit the CPU must write a '1' to that bit position in $D019.
- The VIC never clears latch bits autonomously.
- Only the first collision sets the MBC/MMC latch if the corresponding collision register ($D01E/$D01F) was zero; read/clear the collision register to allow subsequent collision interrupts.
- Bit 7 of $D019 returns the inverted IRQ output state of the VIC.

Timing diagram for raster-compare test cycle:

Raster Line  | Cycle | Action
-------------+-------+---------------------------------
0            | 1     | Raster compare test performed
1–n          | 0     | Raster compare test performed
```

## Key Registers
- $D019 - VIC-II - Interrupt latch (write 1 to clear individual latch bits; bit 7 = inverted IRQ state)
- $D01A - VIC-II - Interrupt enable register (enable bits corresponding to $D019 latch bits)
- $D012 - VIC-II - Raster compare low 8 bits (used with $D011 bit 7 for full raster value)
- $D011 - VIC-II - Control register (bit 7 is the high bit for raster compare)
- $D01E - VIC-II - Sprite-to-background/text/bitmap collision register (read/clear to allow further MBC interrupts)
- $D01F - VIC-II - Sprite-to-sprite collision register (read/clear to allow further MMC interrupts)

## References
- "sprite_priority_and_collision" — expands on which collisions set $D01E/$D01F and can trigger MBC/MMC interrupts
- "vc_and_rc" — expands on raster interrupt (RST) compare timing and VC/RASTER registers

## Labels
- D019
- D01A
- D012
- D011
- D01E
- D01F
