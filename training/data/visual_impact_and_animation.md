# Visual Impact — Sprite Color & Animation Guidance

**Summary:** Advice for C64 sprite/color/animation design targeting TV displays: choose high-contrast color combinations for clarity on a television, vary animation sequences (explosions, fades, carrying animations) to increase interest, and use flashing or swapped sprites to indicate state changes.

## Overview
Visual impact is the primary impression players form. On a standard television (the common C64 display), certain color combinations render more distinctly than others and can affect perceived sharpness and fuzziness. Use high-contrast combinations for clarity; avoid combinations that tend to blur together on NTSC/PAL TVs.

Examples from source:
- Black characters on a white background produce high contrast and sharp, clear characters.
- Red characters on a blue background can appear fuzzy and indistinct on a TV.

## Animation Techniques
To increase visual interest and convey state changes, vary the animation sequences for moving figures rather than using a single static replacement.

Suggested techniques:
- Replace simple disappearance with an animation (e.g., explosion followed by fade-out) to increase dramatic effect.
- Swap sprites or alter sprite graphics to indicate carried objects or different player states (carrying, different level).
- Use flashing colors or alternate sprite frames to indicate state changes (damage, power-up, invulnerability).

Vary timing and sequence of animations where appropriate to maintain player interest.

## References
- "sprite_maker_utility" — tools to design and preview sprites and their colors