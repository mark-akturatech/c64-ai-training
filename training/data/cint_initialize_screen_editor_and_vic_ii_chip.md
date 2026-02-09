# CINT (Kernal) — $FF5B / 65371: Initialize Screen Editor and VIC-II

**Summary:** Kernal CINT routine at $FF5B (65371) — entry via jump table $FF81 ($FF81 = 65409) — initializes the VIC-II (VIC) to defaults, sets keyboard/screen directions, builds the screen line link table, clears the screen and homes the cursor, detects PAL vs NTSC using the VIC raster/interrupt status, sets PAL/NTSC flag at location 678 ($2A6), and programs CIA#1 Timer A for a 1/60s IRQ (writes to $DC04/$DC05 and $DC0E).

## Description
This documented Kernal routine (CINT) performs the Screen Editor / VIC-II initialization and contains a later-version patch that augments the original behavior:

- Entry and patch:
  - CINT entry point: $FF5B (decimal 65371).
  - Jump-table entry: $FF81 (decimal 65409) points to $FF5B.
  - The patched routine first JSRs the older initialization routine at $E518 (decimal 58648). That older routine:
    - Initializes the VIC-II chip registers to default values.
    - Sets keyboard port as input and screen output device mapping.
    - Initializes cursor flash variables.
    - Builds the screen line link table.
    - Clears the text screen and homes the cursor.

- PAL/NTSC detection:
  - The patch then inspects the VIC Interrupt register to determine whether a Raster Compare IRQ condition has occurred.
  - Because the raster compare register was initialized to 311, a raster-compare IRQ can only occur on PAL hardware (where raster counts include that value). NTSC systems lack that many scan lines, so the condition does not trigger.
  - Based on that test, the routine writes the detected video standard into the PAL/NTSC flag byte at memory location 678 (decimal) = $2A6 (hex).

- Timer setup for 1/60s IRQ:
  - After determining PAL vs NTSC, the routine programs CIA #1 Timer A to generate an IRQ every 1/60 second.
  - It writes appropriate values into CIA #1 Timer A low and high registers and configures CIA #1 Control Register A (prescaler / start / interrupt enable) to achieve the 1/60s cadence, using values selected for PAL or NTSC timing.

## Source Code
```text
Routine summary and addresses:
- CINT entry point: $FF5B (65371)
- Jump-table entry: $FF81 -> $FF5B (65409)
- Patched call to old init routine at $E518 (58648)
- PAL/NTSC flag stored at memory location 678 (decimal) = $2A6 (hex)

Behavioral steps (reference):
1) JSR $E518   ; call old VIC/screen init
2) Check VIC Interrupt register for Raster Compare condition
   - Raster compare initialized to 311 => only true on PAL
3) Set PAL/NTSC flag at $02A6 (decimal 678)
4) Program CIA#1 Timer A (write $DC04/$DC05) and set control ($DC0E)
   to generate IRQ every 1/60 s using prescaler values chosen for PAL/NTSC
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register range (includes raster compare $D012 and interrupt register $D019 used by this routine)
- $DC04-$DC05 - CIA1 - Timer A low/high (set to trigger 1/60s IRQ)
- $DC0E - CIA1 - Control Register A (start/stop, interrupt enable/prescaler bits for Timer A)

## References
- "kernal_patches_pal_ntsc_timer_compensation" — expands on the patch code used in CINT for PAL/NTSC detection and timer selection