# Sprite display steps (VIC-II: $D000-$D02E, $D015, $D027-$D02E)

**Summary:** Steps to display a hardware sprite on the C64: enable the sprite bit in the Sprite Display Enable register ($D015), set the sprite horizontal/vertical position registers ($D000-$D010), and set the sprite color in the Sprite Color Registers ($D027-$D02E). These are VIC-II registers used after placing shape data and setting the sprite data pointer.

**Steps to display a sprite**
After the sprite shape bit-pattern has been placed in memory and the sprite data pointer has been configured, the VIC-II still requires three things to be done to show the sprite on-screen:

- **Enable the sprite:** Set the corresponding bit in the Sprite Display Enable register at $D015 (decimal 53269). Each bit in $D015 enables the corresponding sprite (0–7).
- **Position the sprite:** Write X and Y screen coordinates to the sprite position registers. The sprite horizontal and vertical position registers are mapped in VIC-II register range $D000-$D010 (decimal 53248–53264) and must be loaded with the desired screen coordinates for the sprite(s).
- **Set the sprite color:** Write the desired color index (0–15) to the Sprite Color Registers at $D027-$D02E (decimal 53287–53294) for each sprite.

**Note:** The Sprite Data Pointers, which specify the memory location of each sprite's shape data, are located at memory addresses 2040–2047 ($07F8–$07FF). Each pointer holds a value between 0 and 255, representing the starting block (each 64 bytes) of the sprite data within the current VIC-II memory bank. For example, if sprite data begins at memory location 12288, the pointer value would be 192 (since 12288 / 64 = 192). ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_134.html?utm_source=openai))

## Key Registers
- $D015 - VIC-II - Sprite Display Enable register (enable/disable sprites 0–7)
- $D000-$D010 - VIC-II - Sprite horizontal and vertical position registers (X/Y positions for sprites)
- $D027-$D02E - VIC-II - Sprite Color Registers (color index for sprites 0–7)

## References
- "spena_sprite_enable_register" — expands on Register $D015 to enable sprites
- "sprite_horizontal_and_vertical_position_registers" — expands on Registers $D000-$D010 to position sprites
- "sprite_color_registers" — expands on Registers $D027-$D02E for sprite color
