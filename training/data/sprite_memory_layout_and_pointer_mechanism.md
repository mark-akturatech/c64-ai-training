# VIC-II sprite memory layout and p-access (MOS 6567/6569)

**Summary:** Describes VIC-II sprite memory layout (63 bytes, 3 bytes per scanline), 64-byte-aligned sprite blocks within the VIC's 16KB address space, and the p-access / s-access mechanism (p-access reads 8-bit sprite data pointers from the last 8 bytes of the video matrix each raster line; MC0–MC7 supply the lower 6 address bits).

**Memory access and display**
Sprites on the VIC-II are stored linearly in memory: each displayed sprite is 24×21 pixels and uses 21 scanlines. Each scanline is encoded in 3 consecutive bytes, so a full sprite bitmap occupies 63 bytes total (21 × 3 = 63).

Sprite data blocks are aligned and movable in 64‑byte steps inside the VIC's 16KB address space. To select which 64‑byte page a sprite uses, the VIC performs a pointer read (p-access) every raster line: it reads an 8‑bit sprite data pointer for each sprite from the last 8 bytes of the video matrix. That pointer supplies the upper 8 address bits for subsequent sprite data accesses (s-accesses).

The lower 6 address bits come from a sprite data counter (MC0–MC7, one per sprite). These MC counters sequence through the 63 bytes (acting similarly for sprites as the VC counter does for the video matrix). Because p-accesses are performed on every raster line (not only when the sprite is visible), the sprite pointer can be changed mid-display to alter a sprite's appearance during its vertical scan — the new pointer will be used the next raster line when p-access occurs.

Address width: the combination of an 8‑bit pointer (upper bits) and 6 lower bits from the MC counter yields a 14‑bit address (16KB VIC address space) for sprite data accesses.

Notes:
- p-access: read of an 8‑bit pointer from the last 8 bytes of the video matrix, done every raster line.
- s-access: subsequent sprite data accesses that use pointer (upper 8 bits) + MC (lower 6 bits).
- MC0–MC7: per-sprite 6‑bit data counters (lower address bits), sequenced per scanline.

## References
- "s_access_timing_and_bus_takeover" — timing of s-accesses and bus takeover signals (BA/AEC)
- "sprite_data_sequencer_and_registers" — details of MC counters and how they form lower address bits for s-accesses
