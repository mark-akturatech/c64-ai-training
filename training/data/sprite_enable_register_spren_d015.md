# Sprite Enable/Disable — SPREN ($D015)

**Summary:** SPREN ($D015) is the VIC-II sprite enable register; each bit enables/disables one of the eight hardware sprites (sprite 0–7). A sprite bit set = enabled (visible only if that sprite's X/Y positions place it on-screen); bit clear = disabled.

## Overview
SPREN ($D015) contains one enable bit per hardware sprite. Setting a bit enables the corresponding sprite; clearing the bit disables it. Enabling alone does not guarantee visibility — the sprite will only appear if its X and Y position registers are configured so the sprite is within the visible portion of the screen.

- Register is part of the VIC-II sprite control set.
- Bits map one-to-one to sprites (sprite 0 through sprite 7).
- Typical flow: set sprite X/Y positions, then set the corresponding bit in SPREN to make the sprite visible.
- Clearing a bit immediately disables that sprite irrespective of its position.

## Key Registers
- $D015 - VIC-II - Sprite enable bits (bit per sprite; maps to sprites 0–7)

## References
- "sprite_control_registers_overview" — general mapping of control bits to sprites  
- "sprite_color_registers_list_sprcl0_sprcl7" — setting sprite colors for enabled sprites

## Labels
- SPREN
