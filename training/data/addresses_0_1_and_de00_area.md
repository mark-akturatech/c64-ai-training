# VIC-II / 6510 interactions: behavior of CPU addresses $DE00-$DFFF and $0000/$0001

**Summary:** On many C64s the CPU reads from $DE00-$DFFF return seemingly random data, but on some machines they return the byte the VIC-II read in the first phase of the video cycle; the same VIC-driven-bus effect can be used to force writes/reads of $0000/$0001 (6510 I/O DDR/DR) and to reconstruct zero-page bytes via sprite-collision probing.

## Behavior and exploitation of $DE00-$DFFF and $0000/$0001

- $DE00-$DFFF:
  - This 6510 address range is reserved for external expansions and normally not connected; CPU reads typically return unpredictable values.
  - On some C64 units the read value seen by the CPU equals the byte the VIC-II fetched from memory during the first phase of the same clock cycle. The phenomenon is machine-dependent and not perfectly reproducible across all boards.
  - Uses:
    - Software measurement of VIC-II timing (the VIC read timing can be deduced by observing which byte appears).
    - Running code from $DE00 or the Color RAM area by arranging the VIC to fetch display data that are valid 6510 opcodes (i.e., VIC supplies opcodes to the CPU via the bus).

- $0000/$0001 (zero page I/O port):
  - These addresses normally map to the 6510's I/O port Data Direction Register (DDR) and Data Register (DR). The port's data drivers remain tri‑stated on a CPU write, so a regular write does not force a bus value.
  - Because the R/W line is driven low during the write phase (a timing artifact of integrating the I/O port into the 6502 design), if the VIC supplies a byte on the bus (by reading it in the preceding VIC phase) that VIC-provided byte can be written into RAM at $0000 or $0001. In practice you perform an ordinary write to $00/$01 while ensuring the VIC had read the desired value just before the CPU write.
  - This allows software to set values in $00/$01 despite the normal I/O mapping, on machines/conditions where the VIC drives the bus as described.

- Alternate read method via sprite collisions:
  - The first two zero-page bytes can be reconstructed by making the VIC display a bitmap at address $0000 and using a single-pixel sprite as a probe: move the sprite over each bit of the target byte and test for sprite/bitmap collision; repeating for all 8 bit positions yields the byte.
  - This is a hardware-probing technique that reads zero-page contents via VIC collision flags rather than direct CPU reads.

- Reliability and caveats:
  - The VIC-driven-bus behaviors (both DE00 reads returning VIC data and VIC-supplied bytes being written to $00/$01) are hardware- and timing-dependent. They occur on some machines and not others, and timing/precision may vary.
  - These methods rely on precise alignment of VIC read phases and CPU bus cycles (useful references expand on raster timing and BA/AEC bus arbitration signals).

## Key Registers
- $DE00-$DFFF - Expansion area (CPU) - external expansions / reads may reflect the byte VIC-II fetched in the first phase of the cycle on some machines
- $D800-$DBFF - Color RAM (CPU view; upper nybbles) - upper nibbles can show similar VIC-read-dependent behavior on some machines
- $0000-$0001 - 6510 (I/O port) - Data Direction Register / Data Register (DDR/DR); writes can be effected if VIC supplies the bus byte during the write cycle

## References
- "memory_map_cpu" — CPU view of $D000-$DFFF and $0000/$0001 I/O port mapping
- "timing_of_raster_line" — using VIC timing and BA/AEC (bus arbitration) to make the VIC drive the bus for $DE00 and $0000/$0001 effects