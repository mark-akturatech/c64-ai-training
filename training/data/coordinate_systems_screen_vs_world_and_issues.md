# Coordinate systems (screen vs world)

**Summary:** Discusses screen-coordinate (sprite) vs world-coordinate systems for object positions, impacts on collision detection and edge behavior, and the recommendation to track objects in world coordinates and test collisions against map/block data rather than only on-screen sprite coordinates.

## Coordinate systems
Using the screen-coordinate system (the same coordinates sprites use) is the fastest representation of object location because it avoids extra conversion and indexing. However, it is prone to incorrect behavior at screen edges: routines that only inspect on-screen character/tile data will produce wrong results when an object or its collision checks extend beyond the visible area.

A concrete symptom: enemies near the visible-screen boundary act erratically (example: "walker" enemies in Turrican). The root cause is that the collision code reads only character data from the on-screen buffer; when a collision test needs data outside the visible region the routine often falls back to a hardcoded response such as "obstacle" or "free space". That fallback is fast but logically incorrect for a consistent world model.

Recommendation: represent object positions in a world-coordinate system and perform collision checks against the level/map/block data (the canonical world map). Advantages:
- Correct behavior regardless of on-screen position (no edge artifacts).
- Easier and correct handling of object activation/spawning and deciding which objects are active/on-screen (simplifies culling).
- Allows finer control over collision semantics independent of the visible tile buffer.

(If you need speed, optimize the world-to-screen conversion and collision lookup rather than relying on the screen buffer as the authoritative source.)

## References
- "world_coordinate_representation_block_highbyte_lowbyte_subpixel_accuracy" — expands on efficient world-coordinate representation and subpixel accuracy
- "object_activation_actor_leveldata_and_spawning" — expands on using world coordinates to decide active/on-screen objects and spawning logic
