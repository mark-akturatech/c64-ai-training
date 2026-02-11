# PAC-MAN collisions on the C64 (VIC-II collision registers)

**Summary:** Uses VIC-II collision registers ($D000-$D02E range) and sprite collision bits to detect sprite-to-sprite and sprite-to-background impacts (e.g., PAC-MAN hitting ghosts or power pellets). Main implementation difficulty is bookkeeping which maze pellets have been eaten; arcade monitor orientation (rotated 90°) changes maze aspect ratio.

## Collision detection
The VIC-II provides dedicated collision reporting registers that indicate when sprites collide with other sprites and when sprites collide with the background (playfield/character graphics). These hardware flags make it straightforward to detect events such as PAC-MAN contacting a ghost or a power pellet: the VIC-II will set the appropriate collision bits when the raster-rendered pixels overlap.

The VIC-II collision registers are read-only status flags and are cleared by reading (or by writing to other VIC registers depending on model/implementation). Because collisions are reported in terms of sprite indices and playfield pixels rather than high-level game objects, the program must map sprite indices to game entities (PAC-MAN, ghosts, pellets) in software.

Determining which power pellet or ghost was involved in a sprite-to-sprite collision is direct (inspect sprite index/bit), and detecting sprite-to-background collisions detects contact with pellets drawn into the playfield graphics.

## Pellet bookkeeping and layout differences
The text notes the principal implementation challenge is tracking which normal pellets PAC-MAN has eaten. Hardware collision registers tell you that PAC-MAN touched playfield pixels at a given location, but they do not automatically maintain persistent state about which pellets have been consumed; that persistence must be handled in program data (e.g., a pellet map or flags).

Another major discrepancy with the arcade version is display orientation: the arcade monitor is rotated 90° (portrait), so the arcade maze is taller than it is wide. Translating the layout to the C64 (standard landscape TV/monitor) requires adapting the maze aspect ratio or rotating/reorienting graphics—this is cited as the only significant layout difference.

## Key Registers
- $D000-$D02E - VIC-II - Sprite registers and collision/status registers (sprite-to-sprite and sprite-to-background collision reporting)

## References
- "pac_man_overview_implementation" — practical collision detection in PAC-MAN implementations
