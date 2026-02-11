# Sprite Multiplexer (change Y coordinates during display)

**Summary:** Technique for reusing VIC-II hardware sprites by updating sprite Y coordinates (and optionally sprite pointers) while the sprite is being displayed; requires timing with the raster ($D012) and respect for the sprite height (new Y >= $15). Useful terms: VIC-II, $D012, sprite pointers, sprite Y, multiplexing.

## Sprite Multiplexer Principle
Change a sprite's Y register while the sprite is being drawn so that, as soon as the current instance finishes, the VIC-II will sample the updated Y and draw the sprite again lower on the screen. This lets a single hardware sprite be reused multiple times per frame (multiplexing).

- Visibility constraint: the new Y must be at least $15 (hex) greater than the previous Y (0x15 = 21 decimal), because 21 scanlines is the default sprite height; if you are using expanded-vertical sprites (double-height), the minimum gap doubles (>= $2A / 42 decimal).
- Timing: perform the write after the VIC-II has finished drawing the sprite's last visible line but before it begins the next line where you expect the second instance to appear. Use the raster position ($D012) or cycle-timed code to find the correct moment.

## Timing and constraints
- Raster sync: use the raster register ($D012) or raster interrupts to schedule the Y update precisely on the desired scanline. Changing the Y too early will move the first instance; too late and the second instance won't appear that frame.
- Minimum Y delta equals sprite height: because the VIC-II only begins drawing a sprite when the current scanline reaches the sprite's Y, the new Y must be oldY + sprite_height (>= $15) to be drawn below the original instance.
- Double-height sprites: if vertical expansion is enabled, treat sprite_height as doubled (>= $2A).

## Pointer changes (sprite data pointers)
- You can also change the sprite pointer(s) to show different sprite bitmaps on the reused hardware sprite.
- Pointer writes must be timed carefully: if you change the pointer while the sprite is mid-draw (i.e., during its visible lines), the partially-drawn sprite will use mixed data and produce visual corruption.
- Advanced effects: deliberately changing pointers mid-draw can produce split/masked visuals, but only if you precisely control timing and understand when VIC-II fetches sprite bitmap lines.

## Practical approach (workflow)
- Build a table of Y values (e.g., a sine table) for the positions you want to place the reused sprites.
- Use $D012 (raster) to discover/target the exact scanline when a sprite instance finishes so you know when to write the next Y (and pointer) for that sprite.
- Ensure writes occur within cycle/timing windows where they will take effect for the next instance and won't corrupt the current draw.

## Key Registers
- $D000-$D02E - VIC-II - sprite registers (X/Y positions, pointers, control and related VIC-II registers)
- $D012 - VIC-II - raster line register (use for timing writes)

## References
- "sprites_basics_and_pointers" — expands on sprite pointers and coordinate registers
