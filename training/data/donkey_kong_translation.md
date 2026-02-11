# DONKEY-KONG (C64 translation notes)

**Summary:** Overview of DONKEY-KONG gameplay and Commodore 64 translation techniques: use character graphics for static backgrounds, sprites for Mario/barrels/fireballs, and sprite multiplexing/repositioning across scanlines to reuse a small number of hardware sprites.

## Overview
DONKEY-KONG gameplay: the player controls Mario climbing structures to rescue a girl while avoiding barrels, hammers, and sometimes fireballs. Mario can pick up dropped clothing items and a hammer (temporary invulnerability/attack). Reaching Donkey Kong’s level advances or changes the level.

Arcade screens are rotated 90° (taller than wide). A faithful C64 translation will therefore be wider and shorter than the original.

## C64 translation notes
- Backgrounds (structures, Donkey Kong, the girl, dropped items) can be implemented using character graphics to free up sprites for moving objects.
- Sprites should be used for Mario, barrels, and fireballs; hammers can be sprites or reuse existing ones when available.
- Arcade designers avoided needing many sprites by letting barrels roll off-screen when they descend between levels; the player’s focus on Mario and the area above him hides the disappearance. The same visual trick can be applied on the C64 to reduce sprite requirements.
- Sprite budget example from the source:
  - The arcade never needs more than five sprites to display all barrels.
  - Reserving five sprites for barrels/fireballs + one for Mario leaves two sprites available for hammers.
- Typical on-screen density: for most scanlines only 3–4 sprites appear; this allows effective reuse.
- Repositioning (multiplexing) sprites across scanlines increases flexibility: reuse the same hardware sprite on multiple vertical positions by updating sprite registers between raster lines.

## References
- "sprite_multiplexing_benefits" — reusing sprites on different lines to show more moving objects