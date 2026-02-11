# VIC-II (MOS 6567/6569) — Sprite display rules (cycles 1–6, 6569 timing)

**Summary:** Rules governing sprite display sequencing on the VIC-II (6569) including MxYE ($D017) expansion flip‑flop behavior, MxE sprite DMA enable checks ($D015), MCBASE/MC handling and s-access sequence (three reads into the 24‑bit sprite shift register), and per‑pixel shifting/output including X‑expansion (MxXE in $D01D) and multicolor grouping.

**Sprite display rules (cycles valid for the 6569)**

1. **Expansion flip‑flop initialization**
   - For each sprite, the VIC sets an internal expansion flip‑flop depending on the MxYE bit in $D017: the flip‑flop is set as long as the corresponding MxYE bit is cleared.

2. **Cycle 55 inversion**
   - If a sprite’s MxYE bit is set during the first phase of cycle 55, the VIC inverts (toggles) that sprite’s expansion flip‑flop.

3. **Cycles 55 and 56: DMA enable tests and MCBASE clear**
   - In the first phases of cycles 55 and 56, the VIC tests, per sprite:
     - Whether the sprite’s MxE bit in $D015 is set (sprite enabled),
     - And whether the sprite Y coordinate (odd registers $D001–$D00F) equals the lower 8 bits of RASTER.
   - If both conditions hold and the sprite’s DMA is currently off:
     - DMA is turned on for that sprite,
     - MCBASE is cleared,
     - If the MxYE bit was set, the expansion flip‑flop is reset.

4. **Cycle 58: MC load and display enable**
   - In the first phase of cycle 58, the VIC loads each sprite’s MC from its MCBASE (MCBASE -> MC).
   - For each sprite, it then checks if DMA is on and Y matches the lower 8 bits of RASTER; if so, the sprite display is enabled (display turned on).

5. **s‑access sequence and MC increments**
   - When a sprite’s DMA is on, the VIC performs three sequential s‑accesses in that sprite’s assigned cycles (see referenced timing diagrams).
   - The p‑accesses (pointer accesses) occur regardless of sprite DMA state.
   - Read results of the three s‑accesses are stored into the sprite’s 24‑bit shift register as:
     - 1st s‑access -> upper 8 bits,
     - 2nd s‑access -> middle 8 bits,
     - 3rd s‑access -> lower 8 bits.
   - MC (memory counter for sprite) is incremented by one after each s‑access.

6. **Pixel output, shifting and X‑expansion / multicolor**
   - Once a sprite’s display is enabled, the sprite’s 24‑bit shift register is shifted left by one bit per displayed pixel as soon as the raster X equals the sprite X (even registers $D000–$D00E). Bits that “fall off” the shift register are driven to the video output.
   - If the sprite’s X‑expansion bit MxXE in $D01D is set, shifting occurs only every second pixel, producing an X‑doubled (wide) sprite.
   - In multicolor sprite mode, every two adjacent bits from the shift register form one displayed pixel (grouping of bits into double-width color pixels).

## Key Registers

- **$D000–$D00E**: VIC-II - Sprite X positions (even registers; sprite 0..7 X)
- **$D001–$D00F**: VIC-II - Sprite Y positions (odd registers; sprite 0..7 Y)
- **$D015**: VIC-II - Sprite enable bits (MxE) and related enable flags
- **$D017**: VIC-II - Control register containing MxYE bits (sprite Y‑expansion flip‑flop control)
  - **Bit 0**: M0YE (Sprite 0 Y-expansion)
  - **Bit 1**: M1YE (Sprite 1 Y-expansion)
  - **Bit 2**: M2YE (Sprite 2 Y-expansion)
  - **Bit 3**: M3YE (Sprite 3 Y-expansion)
  - **Bit 4**: M4YE (Sprite 4 Y-expansion)
  - **Bit 5**: M5YE (Sprite 5 Y-expansion)
  - **Bit 6**: M6YE (Sprite 6 Y-expansion)
  - **Bit 7**: M7YE (Sprite 7 Y-expansion)
- **$D01D**: VIC-II - Sprite X‑expansion bits (MxXE) and related sprite flags
  - **Bit 0**: M0XE (Sprite 0 X-expansion)
  - **Bit 1**: M1XE (Sprite 1 X-expansion)
  - **Bit 2**: M2XE (Sprite 2 X-expansion)
  - **Bit 3**: M3XE (Sprite 3 X-expansion)
  - **Bit 4**: M4XE (Sprite 4 X-expansion)
  - **Bit 5**: M5XE (Sprite 5 X-expansion)
  - **Bit 6**: M6XE (Sprite 6 X-expansion)
  - **Bit 7**: M7XE (Sprite 7 X-expansion)

## References

- "s_access_timing_and_bus_takeover" — expands on which cycles include s‑accesses and their relation to p‑access timing
- "sprite_data_sequencer_and_registers" — expands on where s‑access read data are stored (24‑bit shift register) and MC increment behavior
- "sprite_display_rules_7_and_8" — continuation covering MCBASE adjustments and DMA/display termination rules

## Labels
- $D000
- $D001
- $D015
- $D017
- $D01D
