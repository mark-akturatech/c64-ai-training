# Multidirectional scrolling: actor vs leveldata (Cadaver)

**Summary:** Describes an active/inactive object system for C64 multidirectional scrolling: keep minimal "leveldata" (world coordinates, type, optional HP) for far objects and a small table of active "actors" for on/near-screen objects; spawn/despawn by testing positions against a visible rectangle and use block-accuracy/high-byte checks to make that test cheap.

## Concept
Separate all world objects into:
- leveldata — inactive objects stored in world (map) coordinates, containing only position, type and maybe hitpoints (minimal state).
- actors — active objects currently processed each frame (full behavior, animation, collisions).

The CPU only updates actors; leveldata entries are inert until they are near the visible area. This lets a C64 game avoid iterating tens or hundreds of objects each frame.

## Procedure
- Each frame, scan a portion of leveldata (for example 16 entries) rather than the whole list.
- For each scanned leveldata entry:
  - If its world position lies inside a visible rectangle (usually slightly larger than the on-screen area to provide a margin), remove it from leveldata and spawn it as an actor.
- For each actor each frame:
  - Process movement/AI/rendering as usual.
  - If an actor moves outside the visible rectangle, remove it from the actor table and reinsert an (minimal) entry back into leveldata.
- Special-case persistent objects (e.g., the player) so they are never removed from actors.

Processing only a slice of leveldata each frame amortizes insertion cost across frames and avoids stalls.

## Data representation
- Store level positions at block accuracy (coarse grid). Save X/Y as highbyte=block, lowbyte=subpixel (or omit lowbyte in leveldata).
- This allows cheap membership tests: compare coordinate highbytes against the visible rectangle's block-range rather than full 16-bit comparisons.
- leveldata entries contain only what’s necessary to respawn the actor (position block, type, optional HP); full actor state lives only in the actor table while active.

## Advantages / Notes
- Greatly reduces per-frame object processing cost by focusing CPU only on nearby objects.
- Block/high-byte checks convert spawn/despawn logic into simple byte-range tests.
- Amortized scanning (N level entries per frame) spreads workload evenly; choose slice size to balance responsiveness vs CPU spikes.
- Player and other always-active actors must be excluded from leveldata lifecycle.

## References
- "world_coordinate_representation_block_highbyte_lowbyte_subpixel_accuracy" — expands on storing positions at block accuracy and highbyte/lowbyte representation