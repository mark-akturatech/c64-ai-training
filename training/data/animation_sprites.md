# Sprite Graphics (Animation)

**Summary:** Commodore 64 VIC-II hardware sprites provide 8 display levels so shapes can be ordered to move in front of or behind each other; see VIC-II sprite registers $D000-$D02E for sprite control and ordering.

## Animation
Commodore's Sprite Graphics enable creation of true cartoon-style animation by offering eight distinct display levels. Sprites can be arranged so individual shapes appear in front of or behind other shapes and the background, allowing layered motion and simple depth ordering without redrawing the background graphics.

## Source Code
(none)

## Key Registers
- $D000-$D02E - VIC-II - Sprite registers (sprite X/Y positions, pointers, control and priority bits, collision/status)

## References
- "graphics_and_art_modes" — expands on high-resolution and multi-color graphics modes  
- "machine_code_programming_resources" — expands on machine code techniques often used for sprite animation