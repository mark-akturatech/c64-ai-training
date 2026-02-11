# Sprite priorities (VIC-II)

**Summary:** The VIC-II chip in the Commodore 64 manages sprite rendering with fixed sprite-to-sprite priorities and configurable sprite-to-background priorities. Sprite 0 has the highest priority, and sprite 7 the lowest. The BPRIOR register ($D01B) controls whether each sprite appears in front of or behind the background. Transparent sprite pixels allow lower-priority sprites or the background to show through.

**Sprite-to-sprite and sprite-to-background priority**

- **Sprite-to-sprite priority:** The VIC-II assigns fixed priorities to sprites:
  - Sprite 0 has the highest priority.
  - Sprite 7 has the lowest priority.
  - When sprites overlap, the lower-numbered sprite appears in front of higher-numbered ones.

- **Sprite-to-background priority:** Controlled by the BPRIOR register at $D01B:
  - Each bit corresponds to a sprite (bit 0 for sprite 0, bit 7 for sprite 7).
  - Bit value 0: Sprite appears in front of the background.
  - Bit value 1: Sprite appears behind the background but in front of the border.

- **Transparency:** Transparent pixels in a sprite allow whatever is behind them to show through, whether it's the background or lower-priority sprites.

- **Layering effects:** By adjusting sprite priorities and background settings, layered or 3D-like visual effects can be achieved, with sprites appearing to move in front of or behind each other and the background.

## Source Code

```text
The following table illustrates the fixed sprite-to-sprite priority:

+----------------+----------------+----------------+----------------+
| Sprite Number  | Priority Level | Appears in     | Appears Behind |
+----------------+----------------+----------------+----------------+
| 0              | Highest        | All sprites    | None           |
| 1              | High           | Sprites 2–7    | Sprite 0       |
| 2              | Medium-High    | Sprites 3–7    | Sprites 0–1    |
| 3              | Medium         | Sprites 4–7    | Sprites 0–2    |
| 4              | Medium-Low     | Sprites 5–7    | Sprites 0–3    |
| 5              | Low            | Sprites 6–7    | Sprites 0–4    |
| 6              | Lower          | Sprite 7       | Sprites 0–5    |
| 7              | Lowest         | None           | Sprites 0–6    |
+----------------+----------------+----------------+----------------+

This table demonstrates that sprite 0 has the highest priority, appearing in front of all other sprites, while sprite 7 has the lowest priority, appearing behind all other sprites.
```

## Key Registers

- **$D01B (53275)**: Sprite-to-background priority register (BPRIOR).
  - Bits 0–7 correspond to sprites 0–7.
  - Bit value 0: Sprite appears in front of the background.
  - Bit value 1: Sprite appears behind the background but in front of the border.

## References

- "sprites_overview" — expands on general sprite ordering and use in scenes

## Labels
- BPRIOR
