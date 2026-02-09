# VIC-II Character Display Mode — Character Pointer & Character Data Addressing

**Summary:** How the VIC-II (6566/6567) fetches 8-bit character pointers from the VIDEO MATRIX (1000 entries) and translates them into 14-bit addresses into the 2048‑byte CHARACTER BASE using VM13-VM10 and CB13-CB11 in register $D018, plus use of internal counters VC9-VC0 and RC2-RC0.

## Character display mode
The VIC-II reads an 8-bit CHARACTER POINTER from the VIDEO MATRIX (1000 consecutive locations). The video matrix base is selected by VM13-VM10 (the 4 MSB of the video matrix address) held in VIC-II register 24 (offset $18 — C64 address $D018). The VIC-II provides a 14‑bit address bus (A13–A0); the VIDEO MATRIX address is formed as:

- A13–A10 = VM13–VM10 (from $D018)
- A9–A0  = VC9–VC0 (internal 10‑bit video matrix counter stepping through 1000 locations)

Because the VIC-II outputs only 14 address lines, system memory decoding is required externally to map those 14 lines into full C64 memory.

Each VIDEO MATRIX location contains:
- an 8-bit character pointer (D7–D0) selecting one of up to 256 character definitions
- a 4‑bit COLOR NYBBLE associated with that matrix location (the video matrix memory must supply 12 bits per entry so color can be stored)

Character definitions are 8×8 dot matrices stored in the CHARACTER BASE (2048 bytes total). The CHARACTER BASE location is selected by CB13–CB11 bits in register $D018 (three MSB of the character base address). A character’s on-screen byte is selected by combining the 8‑bit character pointer and the 3‑bit raster counter:

- Bits A13–A11 = CB13–CB11 (from $D018)
- Bits A10–A0  = {D7..D0, RC2..RC0} (D7..D0 are the character pointer; RC2..RC0 are the 3 LSB raster row counter selecting one of the 8 bytes per character)

This yields a 14‑bit address into the 2048‑byte character table (8 bytes × up to 256 characters = 2048 bytes). The final screen is formatted as 25 rows × 40 columns.

Note: VCn and RCn are internal VIC-II counters (VC9–VC0 = video matrix index; RC2–RC0 = raster row within a character). They are not memory-mapped registers.

## Source Code
```text
                          CHARACTER POINTER ADDRESS

 A13| A12| A11| A10| A09| A08| A07| A06| A05| A04| A03| A02| A01| A00
 -----+----+----+----+----+----+----+----+----+----+----+----+----+------
  VM13|VM12|VM11|VM10| VC9| VC8| VC7| VC6| VC5| VC4| VC3| VC2| VC1| VC0
```

```text
                           CHARACTER DATA ADDRESS

 A13| A12| A11| A10| A09| A08| A07| A06| A05| A04| A03| A02| A01| A00
 -----+----+----+----+----+----+----+----+----+----+----+----+----+------
  CB13|CB12|CB11| D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | RC2| RC1| RC0
```

Additional reference values (from source):
- Video matrix size: 1000 consecutive locations
- Character pointer: 8 bits → up to 256 characters
- Character size: 8 bytes (8 raster rows) each → 8 × 256 = 2048 bytes CHARACTER BASE
- Screen format: 25 rows × 40 columns

## Key Registers
- $D018 - VIC-II - Memory control: VM13-VM10 (video matrix base MSBs) and CB13-CB11 (character base MSBs)

## References
- "vicii_overview_and_spec_intro" — General VIC-II overview and device purpose
- "standard_character_mode_behavior" — How character dot data are displayed in standard mode
- "extended_color_mode_and_constraints" — How character pointer bits are re-used for background selection in ECM