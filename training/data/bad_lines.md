# VIC-II Bad Lines — definition and mechanics

**Summary:** VIC-II Bad Lines cause the VIC to take 40–43 extra bus cycles to fetch character pointers, "stunning" the 6502; they are determined by the raster ($D012), YSCROLL and the DEN bit in $D011 and can be created or removed dynamically by changing YSCROLL (affects VC/RC and display timing).

## Definition and behavior

- Purpose: The VIC requires 40 additional bus cycles to read character pointers (the character codes from the video matrix) for a text line; the available transparent cycle budget at the start of a raster line is insufficient to fetch both pointers and pixel data, so the VIC suspends the CPU to perform these reads. This suspension is commonly called a Bad Line and lasts about 40–43 cycles.

- When it happens:
  - Normally: every 8th raster line inside the visible display window — i.e. the first raster line of each character (text) row. Thus the position of Bad Lines depends on YSCROLL (vertical fine scroll).
  - Bitmap modes: character-pointer (video matrix) reads are still required (video matrix used for color info), so Bad Lines also occur in bitmap modes.

- Formal Bad Line Condition (evaluated literally):
  - At the negative edge of Φ0 at the beginning of a CPU/VIC cycle:
    - RASTER is >= $30 and <= $F7, and
    - the lower 3 bits of RASTER equal YSCROLL, and
    - the DEN bit was set during any cycle of raster line $30.
  - If the condition is true the VIC will perform the extra fetches and the CPU is "stunned" for the 40–43 cycle Bad Line period.

- Dynamic behavior and edge cases:
  - The condition is evaluated per cycle, so changing YSCROLL during a raster line can create or remove a Bad Line condition within that same raster line (you can make any raster line in $30-$F7 partially or fully a Bad Line by modifying YSCROLL).
  - If YSCROLL = 0 and DEN is set, a Bad Line condition occurs in raster line $30.
  - Bad Lines alter VC/RC behavior and the overall graphics/memory access scheme (see linked references).

- Practical consequences:
  - The CPU is effectively prevented from accessing the bus for the Bad Line duration, which can break timing-critical programs.
  - The exact timing and whether a Bad Line occurs for a particular raster line depend on the instantaneous values of RASTER, YSCROLL and the historical setting of DEN during raster $30.

## Source Code
(omitted — no code or register maps in source)

## Key Registers
- $D011 - VIC-II - DEN bit (bit 4) (DEN enables vertical display; used in the Bad Line condition); YSCROLL = lower 3 bits (vertical fine scroll)
- $D012 - VIC-II - Raster register (RASTER) — used in Bad Line condition checks

## References
- "memory_access_timing" — expands on BA/AEC takeover sequence for Bad Line fetches  
- "vc_and_rc" — expands on VC/RC behavior and how Bad Lines affect VC/RC and VCBASE/RC