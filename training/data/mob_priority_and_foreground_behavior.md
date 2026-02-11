# MOB (Sprite) Priority — VIC‑II register $D01B (MnDP bits)

**Summary:** VIC‑II register $D01B (offset $1B) contains eight MnDP bits (one per MOB/sprite) that control per‑sprite priority relative to character/bitmap display data: MnDP=0 = MOB in front; MnDP=1 = MOB behind (only visible instead of Background #0 or multicolor bit‑pair 01). Sprite-to-sprite priority is fixed (MOB0 highest → MOB7 lowest) and is resolved before sprite vs. character/bitmap priority.

## Priority
Each MOB (sprite) has an MnDP bit in VIC‑II register $D01B (offset $1B) that determines how non‑transparent sprite pixels are composited with character (text) or bitmap screen data:

- MnDP = 0 (bit clear): Non‑transparent MOB pixels are displayed in front of character/bitmap foreground and background (MOB in front).
- MnDP = 1 (bit set): Non‑transparent MOB pixels are displayed only in place of Background #0 (and in multicolor mode, only for the bit‑pair pattern 01); otherwise character/bitmap foreground/background is shown (MOB behind).

Additional rules:
- MOB pixel values of 0 (single‑color mode) — or the multi‑color bit pair 00 (multi‑color mode) — are transparent and always allow other layers to show through.
- MOB vs. MOB priority is fixed and independent of MnDP bits: MOB0 has highest priority; MOB7 has lowest. When two sprites have coincident non‑transparent pixels, the lower sprite number (smaller index) is displayed.
- Sprite vs. sprite priority is resolved first; the result is then composited against character/bitmap data according to each sprite's MnDP setting.

(Bit numbering: MnDP bit N controls MOB N — see register mapping below.)

## Source Code
```text
REG 27 ($1B) - MnDP bits: per‑MOB priority control (VIC-II $D01B)

REG BIT  |          PRIORITY TO CHARACTER OR BIT MAP DATA
---------+----------------------------------------------------
   0     |  Non-transparent MOB data will be displayed (MOB in front)
   1     |  Non-transparent MOB data will be displayed only instead of
         |  Bkgd #0 or multi-color bit pair 01 (MOB behind)

MOB-DISPLAY DATA PRIORITY
+--------------+--------------+
|   MnDP = 1   |   MnDP = 0   |
+--------------+--------------+
|  MOBn        |  Foreground  |
|  Foreground  |  MOBn        |
|  Background  |  Background  |
+--------------+--------------+

Notes:
- MOB data bits of "0" ("00" in multi-color mode) are transparent.
- Fixed MOB-to-MOB priority: MOB0 highest, MOB7 lowest.
- MOB-vs-MOB priority is resolved before MOB vs. character/bitmap priority.
```

## Key Registers
- $D01B - VIC‑II - MnDP sprite priority bits (bit0 → MOB0, bit1 → MOB1, ..., bit7 → MOB7). Bit = 0: sprite in front; Bit = 1: sprite behind (only replaces Background #0 or multicolor pair 01).

## References
- "mob_color_modes_and_multicolor_interpretation" — expands on which MOB bit patterns are transparent and multi‑color pair mappings
- "mob_collision_detection_and_interrupts" — expands on how displayed (non‑transparent) MOB pixels relate to collision detection

## Labels
- MNDP
