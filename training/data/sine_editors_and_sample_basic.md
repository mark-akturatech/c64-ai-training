# Sine tables for sprite movement and effects

**Summary:** Generating sine tables using the SIN function in Commodore BASIC and storing them in memory for sprite movement, scrollers, and plasma effects. This example BASIC program creates a 256-entry table at a specified memory address (A). It also discusses splitting values into "X div 8" and "X mod 8" for larger-logo scrolling.

**Sine table generation (editors vs BASIC)**

Sine editors produce ready-made tables for coordinated sprite movement, scrollers, and visual effects. Alternatively, generating tables directly on the C64 using a small BASIC program offers flexibility, allowing customization of table length, amplitude, and storage address.

Key considerations:

- **Radians in BASIC:** Commodore BASIC's SIN() function expects angles in radians. A full cycle is 2π (approximately 6.28318530718). ([c64-wiki.com](https://www.c64-wiki.com/wiki/SIN?utm_source=openai))
- **Parameters:**
  - `L`: Length of the table (number of entries).
  - `X`: Half of the amplitude (used as a vertical offset to ensure positive values).
  - `A`: Starting memory address where the table will be stored.
- **Memory Storage:** Ensure that POKE writes to consecutive addresses by incrementing `A` after each POKE, so the table occupies `L` bytes starting at address `A`.
- **Integer Values:** Table values must be integers between 0 and 255 for POKE operations. Use `INT(...)` to convert floating-point results to integers if necessary.
- **Coarse/Fine Scrolling:** For larger movement values, consider splitting them into "X div 8" and "X mod 8" for coarse and fine scrolling of large logos (implementation not provided here).
- **Waveform Variations:** To create different movement patterns, modify the expression used in the POKE statement (the SIN(...) part).

## Source Code

```basic
10 L=256: REM Length of table (entries)
20 X=10: REM Half of the amplitude
30 A=1024: REM Start address to store the table
40 FOR I=0 TO 6.28318530718 STEP 6.28318530718/L
50 POKE A,INT(SIN(I)*X+X)
60 A=A+1: NEXT
```

- This program writes `L` bytes to memory addresses from `A` to `A+L-1`.
- Modify line 50 to change the waveform or combine multiple sine functions for more complex motion patterns.

## References

- "sprite_example_movement" — expands on using sine tables for coordinated sprite movement
