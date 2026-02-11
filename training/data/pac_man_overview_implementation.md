# PAC-MAN (C64 implementation overview)

**Summary:** Overview of implementing PAC-MAN on the Commodore 64 using VIC-II multicolor character graphics and hardware sprites; mentions sprite reuse/multiplexing, difficulty tuning (character speed and frightened-duration), and the VIC-II raster register ($D012) for timing.

## Gameplay mechanics
PAC-MAN is a maze game where the player guides PAC-MAN through a maze while being chased by four computer-controlled ghosts. Key mechanics covered:
- Standard pellets must be eaten to clear the playfield and advance levels.
- Power pellets temporarily turn ghosts blue; while blue, ghosts can be eaten for bonus points.
- A bonus character appears intermittently during a level for extra points (value increases on higher levels).
- Difficulty is tuned by changing character movement speeds and the duration ghosts remain vulnerable after a power pellet is eaten.

## Graphics and sprites
- Use the VIC-II multicolor character graphics mode for the maze and pellets (playfield graphics).
- PAC-MAN, the four ghosts, and the bonus character are implemented as hardware sprites.
- The C64 provides eight hardware sprites; the example allocation uses six sprites (PAC-MAN + 4 ghosts + bonus), leaving two sprites free.
- Sprite reuse / multiplexing: the two spare sprites can represent multiple power pellets by repositioning (reassigning) them after the top two pellets have been displayed (a single-scanline or frame-timed reuse technique). This reduces sprite count while showing more pellet instances on-screen.

## Timing and control notes
- Use VIC-II timing (raster-based synchronization) to schedule sprite repositioning and multiplexing — the raster register ($D012) is a key timing source for precise updates.
- Difficulty tuning requires adjusting both movement speed parameters and the vulnerable (blue) duration after eating a power pellet.

## Key Registers
- $D000-$D02E - VIC-II - Video chip registers (sprite control/pointers, collision registers, multicolor/playfield control, etc.)
- $D012 - VIC-II - Raster counter (timing source for sprite multiplexing and frame-synced updates)

## References
- "sprite_collision_and_playfield_mapping" — expands on using collision registers to detect hits and pellet consumption

## Labels
- $D012
- $D000-$D02E
