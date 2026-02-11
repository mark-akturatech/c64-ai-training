# VIC-II Sprite Priority and Collision Detection (6567/6569)

**Summary:** Sprite internal priority (0 highest → 7 lowest), per-sprite sprite-vs-graphics priority controlled by MxDP bits in $D01B, foreground/background determined by MCM (bit in $D016), and collisions latched into $D01E (sprite–sprite, MxM) and $D01F (sprite–graphics, MxD). Collision bits are latched until read and can generate VIC interrupts when enabled.

**Priority rules**

- Sprite internal ordering is fixed: Sprite 0 has highest priority, sprite 7 lowest. When two sprites overlap, the lower-numbered sprite wins; the higher-numbered sprite is visible only where the lower-numbered sprite has transparent pixels.
- Sprite vs text/bitmap priority is controlled per-sprite with the MxDP bits in $D01B. There are two priority modes:

  - MxDP = 0: sprite is displayed in front of foreground graphics but behind the screen border.
  - MxDP = 1: sprite is displayed between background and foreground graphics (i.e., behind the foreground).

  **[Note: the table in reference [2] is incorrect — use the MxDP definitions above.]**

- "Foreground" vs "Background" for text/bitmap graphics is defined by the MCM bit (bit 4 in $D016). The mapping:

  | MCM | Bits/pixel | Pixels/byte | Background | Foreground |
  |-----|------------|-------------|------------|------------|
  | 0   | 1          | 8           | "0"        | "1"        |
  | 1   | 2 (multicolor) | 4      | "00", "01" | "10", "11" |

  - In MCM=0 (standard, 1bpp) cleared pixels ("0") are background, set pixels ("1") are foreground.
  - In MCM=1 (multicolor, 2bpp) the bit-pair values "00"/"01" are background, "10"/"11" are foreground.
  - This foreground/background classification applies to graphics generated even in idle state.

- If an invalid video mode is selected, only sprites remain visible (graphics become black). If sprites are set to appear behind foreground graphics, the foreground becomes visible as black pixels overlaying sprites.

**Collision detection**

- Sprite–sprite collision:
  - Detected whenever two or more sprite data sequencers output a non-transparent pixel at the same display time (this detection can occur outside the visible screen area).
  - When detected, the MxM bits for all affected sprites are set in $D01E.
  - The bits are latched and remain set until the processor reads $D01E; reading the register clears the bits automatically.
  - If the corresponding VIC interrupt is enabled, a VIC interrupt is generated when collisions occur.

- Sprite–graphics (sprite–foreground) collision:
  - Detected when a sprite data sequencer outputs a non-transparent pixel simultaneously with the graphics sequencer outputting a foreground pixel (as defined by MCM).
  - The affected sprites’ MxD bits are set in $D01F, latched until read (read clears them), and may trigger interrupts if enabled.

- Vertical border flip-flop:
  - If the vertical border flip-flop is set (normally set within the upper/lower border), the graphics data sequencer output is turned off; in that state, no sprite–graphics collisions are reported.

## Source Code

```text
Bit layout of $D01B (Sprite Priority Register):

Bit 7 6 5 4 3 2 1 0
    | | | | | | | |
    | | | | | | | +-- M0DP: Sprite 0 priority (0 = in front, 1 = behind)
    | | | | | | +---- M1DP: Sprite 1 priority
    | | | | | +------ M2DP: Sprite 2 priority
    | | | | +-------- M3DP: Sprite 3 priority
    | | | +---------- M4DP: Sprite 4 priority
    | | +------------ M5DP: Sprite 5 priority
    | +-------------- M6DP: Sprite 6 priority
    +---------------- M7DP: Sprite 7 priority
```

```text
Bit layout of $D01E (Sprite–Sprite Collision Register):

Bit 7 6 5 4 3 2 1 0
    | | | | | | | |
    | | | | | | | +-- M0M: Sprite 0 collision flag (1 = collision)
    | | | | | | +---- M1M: Sprite 1 collision flag
    | | | | | +------ M2M: Sprite 2 collision flag
    | | | | +-------- M3M: Sprite 3 collision flag
    | | | +---------- M4M: Sprite 4 collision flag
    | | +------------ M5M: Sprite 5 collision flag
    | +-------------- M6M: Sprite 6 collision flag
    +---------------- M7M: Sprite 7 collision flag
```

```text
Bit layout of $D01F (Sprite–Background Collision Register):

Bit 7 6 5 4 3 2 1 0
    | | | | | | | |
    | | | | | | | +-- M0D: Sprite 0 background collision flag (1 = collision)
    | | | | | | +---- M1D: Sprite 1 background collision flag
    | | | | | +------ M2D: Sprite 2 background collision flag
    | | | | +-------- M3D: Sprite 3 background collision flag
    | | | +---------- M4D: Sprite 4 background collision flag
    | | +------------ M5D: Sprite 5 background collision flag
    | +-------------- M6D: Sprite 6 background collision flag
    +---------------- M7D: Sprite 7 background collision flag
```

```text
Bit layout of $D016 (Control Register 2):

Bit 7 6 5 4 3 2 1 0
    | | | | | | | |
    | | | | | | | +-- XSCROLL: Horizontal fine scrolling (0-7)
    | | | | | | +---- CSEL: Column select (0 = 38 columns, 1 = 40 columns)
    | | | | | +------ MCM: Multicolor mode (0 = standard, 1 = multicolor)
    | | | | +-------- RES: Unused (read as 1)
    | | | +---------- Unused (read as 1)
    | | +------------ Unused (read as 1)
    | +-------------- Unused (read as 1)
    +---------------- Unused (read as 1)
```

## Key Registers

- $D016 - VIC-II - Control Register 2: includes MCM (multicolor mode) bit (bit 4) defining foreground/background mapping for graphics
- $D01B - VIC-II - Sprite Priority Register: MxDP bits (bits 0-7) control per-sprite sprite-vs-graphics priority
- $D01E - VIC-II - Sprite–Sprite Collision Register: MxM bits (bits 0-7) indicate sprite–sprite collisions; latched, cleared on read
- $D01F - VIC-II - Sprite–Background Collision Register: MxD bits (bits 0-7) indicate sprite–graphics collisions; latched, cleared on read
- $D019 - VIC-II - Interrupt Status Register: VIC interrupt flags, including collision flags
- $D01A - VIC-II - Interrupt Enable Register: enables/disables VIC interrupts

## References

- "vic_registers_table" — expands on collision registers $D01E/$D01F and interrupt bits $D019/$D01A
- "graphics_modes_overview" — expands on how MCM determines background/foreground

## Labels
- D016
- D01B
- D01E
- D01F
- D019
- D01A
