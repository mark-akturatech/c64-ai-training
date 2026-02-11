# Minimal Sprite Program (sprite 0) — BASIC excerpt

**Summary:** Defines sprite 0 as a solid square using sprite pointer POOKEs (memory $07F8-$07FF), references the SPRITEMAKING CHART (page 176) for POKE values; includes a BASIC example and an alternate FOR loop to set all sprite pointers.

## Description
This chunk documents the minimal ingredients for creating a single sprite on the Commodore 64 (sprite 0). The program uses BASIC POKE statements whose numeric values are taken from the SPRITEMAKING CHART (page 176). It explains the two-line program:

- LINE 10 clears the screen.
- LINE 20 sets the "sprite pointer" — the memory locations the VIC-II reads for each sprite's data. The source lists sprite pointers in decimal as 2040 (sprite 0) through 2047 (sprite 7). An alternate single-line FOR loop is provided to set all eight sprite pointers to the same value (13 in the example).

The program defines sprite 0 as a solid white square on the screen (sprite bitmap bytes taken from the chart).

## Source Code
```basic
10 PRINT CHR$(147)      : REM clear screen
20 POKE 2040,13         : REM set sprite 0 pointer to 13

    REM alternate to set all 8 sprite pointers to 13:
20 FOR SP=2040 TO 2047 : POKE SP,13 : NEXT SP
```

(POKE numbers come from the SPRITEMAKING CHART — page 176.)

## Key Registers
- $07F8-$07FF - Sprite Pointer Table (decimal 2040-2047) - where each sprite's pointer value is stored (pointer value selects where VIC-II will read that sprite's bitmap).

## References
- "sprite_memory_allocation_and_video_register" — expands on where each sprite's data is stored (832..894) and V register usage
- "sprite_enable_bitmask_table" — expands on how to enable sprites after pointers are set

## Labels
- SPRITE POINTER TABLE
