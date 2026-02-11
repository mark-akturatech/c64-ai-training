# VIC 6560 Register Map ($9000–$900F)

**Summary:** The VIC 6560 (VIC-20) register map at $9000–$900F includes controls for screen margins, dimensions, raster position, memory addresses, light pen coordinates, paddle inputs, sound frequencies, and color settings. This document provides detailed bit-level definitions, read/write semantics, default/reset values, and timing information for each register.

**Register Overview**

The VIC 6560 has 16 registers mapped to memory addresses $9000–$900F. Below is a detailed description of each register, including bit-level definitions, read/write access, default values, and relevant timing information.

### $9000 – Interlace Mode and Horizontal Screen Origin

- **Bit 7 (A):** Interlace Mode
  - **0:** Non-interlaced mode
  - **1:** Interlaced mode
- **Bits 6–0 (BBBBBBB):** Horizontal Screen Origin
  - Sets the horizontal starting position of the screen. Default value is $05 (5).

**Access:** Read/Write  
**Default Value:** $05  
**Note:** Adjusting the horizontal screen origin affects the left margin of the display.

### $9001 – Vertical Screen Origin

- **Bits 7–0 (CCCCCCCC):** Vertical Screen Origin
  - Sets the vertical starting position of the screen. Default value is $19 (25).

**Access:** Read/Write  
**Default Value:** $19  
**Note:** Adjusting the vertical screen origin affects the top margin of the display.

### $9002 – Screen Memory Offset and Number of Columns

- **Bit 7 (H):** Screen Memory Offset Bit 9
- **Bits 6–0 (DDDDDDD):** Number of Columns
  - Sets the number of columns displayed. Default value is $16 (22).

**Access:** Read/Write  
**Default Value:** $16  
**Note:** The number of columns determines the horizontal resolution of the text display.

### $9003 – Raster Value, Number of Rows, and Character Height

- **Bit 7 (G):** Raster Value Bit 0
- **Bits 6–1 (EEEEEE):** Number of Rows
  - Sets the number of rows displayed. Default value is $2E (23).
- **Bit 0 (F):** Character Height
  - **0:** 8-pixel character height
  - **1:** 16-pixel character height

**Access:** Read/Write  
**Default Value:** $2E  
**Note:** The number of rows and character height settings affect the vertical resolution of the text display.

### $9004 – Raster Value

- **Bits 7–0 (GGGGGGGG):** Raster Value Bits 8–1
  - Represents the current raster line being drawn.

**Access:** Read/Write  
**Default Value:** Varies  
**Note:** Writing to this register can be used for raster interrupts or synchronization.

### $9005 – Screen and Character Memory Locations

- **Bits 7–4 (HHHH):** Screen Memory Address Bits 13–10
- **Bits 3–0 (IIII):** Character Memory Address Bits 13–10

**Access:** Read/Write  
**Default Value:** $F0  
**Note:** These bits set the base addresses for screen and character memory.

### $9006 – Light Pen Horizontal Position

- **Bits 7–1 (JJJJJJJ):** Light Pen Horizontal Position
- **Bit 0:** Always 1

**Access:** Read  
**Default Value:** $00  
**Note:** Provides the horizontal coordinate of the light pen when activated.

### $9007 – Light Pen Vertical Position

- **Bits 7–0 (KKKKKKKK):** Light Pen Vertical Position

**Access:** Read  
**Default Value:** $00  
**Note:** Provides the vertical coordinate of the light pen when activated.

### $9008 – Paddle Input X

- **Bits 7–0 (LLLLLLLL):** Paddle Input X

**Access:** Read  
**Default Value:** $FF  
**Note:** Returns the X-axis position of the paddle controller.

### $9009 – Paddle Input Y

- **Bits 7–0 (MMMMMMMM):** Paddle Input Y

**Access:** Read  
**Default Value:** $FF  
**Note:** Returns the Y-axis position of the paddle controller.

### $900A – Bass Sound Switch and Frequency

- **Bit 7 (N):** Bass Sound Switch
  - **0:** Off
  - **1:** On
- **Bits 6–0 (RRRRRRR):** Bass Frequency

**Access:** Read/Write  
**Default Value:** $00  
**Note:** Controls the bass sound channel's activation and frequency.

### $900B – Alto Sound Switch and Frequency

- **Bit 7 (O):** Alto Sound Switch
  - **0:** Off
  - **1:** On
- **Bits 6–0 (SSSSSSS):** Alto Frequency

**Access:** Read/Write  
**Default Value:** $00  
**Note:** Controls the alto sound channel's activation and frequency.

### $900C – Soprano Sound Switch and Frequency

- **Bit 7 (P):** Soprano Sound Switch
  - **0:** Off
  - **1:** On
- **Bits 6–0 (TTTTTTT):** Soprano Frequency

**Access:** Read/Write  
**Default Value:** $00  
**Note:** Controls the soprano sound channel's activation and frequency.

### $900D – Noise Sound Switch and Frequency

- **Bit 7 (Q):** Noise Sound Switch
  - **0:** Off
  - **1:** On
- **Bits 6–0 (UUUUUUU):** Noise Frequency

**Access:** Read/Write  
**Default Value:** $00  
**Note:** Controls the noise sound channel's activation and frequency.

### $900E – Auxiliary Color and Composite Sound Volume

- **Bits 7–4 (WWWW):** Auxiliary Color
- **Bits 3–0 (VVVV):** Composite Sound Volume

**Access:** Read/Write  
**Default Value:** $00  
**Note:** Sets the auxiliary color and overall sound volume.

### $900F – Screen Color, Reverse Mode, and Border Color

- **Bits 7–4 (XXXX):** Screen Color
- **Bit 3 (Y):** Reverse Mode
  - **0:** Normal
  - **1:** Reverse
- **Bits 2–0 (ZZZ):** Border Color

**Access:** Read/Write  
**Default Value:** $1B  
**Note:** Sets the screen and border colors, and toggles reverse display mode.

**Timing and Units**

- **Paddle Inputs:** The paddle inputs are read via 8-bit A/D converters, providing values from 0 to 255 corresponding to the paddle's position.
- **Light Pen Coordinates:** The light pen registers provide horizontal and vertical positions based on the current raster line and pixel column.
- **Raster Value Scaling:** The raster value registers ($9003 and $9004) represent the current line being drawn on the screen, useful for synchronization and effects.
- **Voice Frequency Registers:** The frequency values in registers $900A–$900D determine the pitch of the sound channels. The exact frequency produced depends on the system clock and the value set in the register.

## Source Code

```text
VIC 6560 Chip Register Diagram:

      +-------+-------+-------+-------+-------+-------+-------+-------+
$9000 |Inter- |                   Left Margin (=5)                    | 36864
      | lace  |                                                       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9001 |                       Top Margin (=25)                        | 36865
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9002 |Scrn Ad|                    # Columns (=22)                    | 36866
      | Bit 9 |                                                       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9003 |       |                 # Rows (=23)                  |Double | 36867
      | Bit 0 |                                               | Char  |
      +- - - -+-------+-------+-------+-------+-------+-------+-------+
$9004 |                      Input Raster Value                       | 36868
      |                           Bits 8-1                            |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9005 |        Screen Address         |       Character Address       | 36869
      |          Bits 13-10           |          Bits 13-10           |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9006 |                           Light Pen                           | 36870
      |                          Horizontal                           |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9007 |                           Light Pen                           | 36871
      |                           Vertical                            |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9008 |                        Paddle Input X                         | 36872
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9009 |                        Paddle Input Y                         | 36873
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$900A |  Bass |                     Frequency                         | 36874
      | Sound |                                                       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$900B |  Alto |                     Frequency                         | 36875
      | Sound |                                                       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$900C |Soprano|                     Frequency                         | 36876
      | Sound |                                                       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$900D | Noise |                     Frequency                         | 36877
      | Sound |                                                       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$900E |Auxiliary Color|             Volume                            | 36878
      |               |                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$900F |Screen |Reverse|                 Border Color                  | 36879
      | Color | Mode  |                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
```

## Key Registers

- $9000–$900F – VIC 6560 Registers: Control screen margins, dimensions, raster position, memory addresses