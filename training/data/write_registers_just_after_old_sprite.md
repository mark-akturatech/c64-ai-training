# Sprite multiplexing — Method 2.4.2: "Just after the old sprite"

**Summary:** Sprite multiplexing technique that writes the first 8 sprites at the top of the frame then reuses sprite slots by writing replacement VIC-II sprite registers just after the old sprite on the raster; writing the Y coordinate last prevents visible glitches. Search terms: VIC-II, raster, sprite multiplexing, $D000-$D02E, Y register.

## Description
Method outline:
1. At the start of the frame, initialize/write the register values for the physical 8 hardware sprites (first 8 sprite slots).
2. For each additional (virtual) sprite beyond the hardware eight, wait until the raster line immediately below the old sprite that will be replaced.
3. On that raster line, write the replacement sprite's register values into the freed hardware slot so the sprite reappears lower in the frame (i.e., multiplexing).
4. Ensure the Y-coordinate write (sprite Y register) is performed last for each replacement update.

Why write Y last:
- If writes are delayed or the new sprite is too close vertically to the old one, writing Y last ensures the VIC-II will simply not display the late-updated sprite rather than showing a corrupted/mispositioned sprite. This is a "clean failure" — missing sprite instead of visual glitch.

Trade-offs:
- Pros: Simpler and cleaner to implement; robust against display glitches caused by late writes.
- Cons: In scenes with tightly packed sprites (small vertical spacing), sprites can be dropped because delayed writes (or deliberately deferred Y writes) cause the sprite not to appear; unacceptable for games that require dense sprite packing.

Operational note:
- Timing-critical: the replacement writes must occur at the raster line just below the sprite being replaced. The method relies on ordering of register writes (Y last) to convert timing misses into missing sprites rather than visible corruption.

## Key Registers
- $D000-$D02E - VIC-II - Sprite registers (Y/X positions, sprite pointers, control bits, enable)

## References
- "write_registers_just_before_new_sprite" — alternative approach with different trade-offs