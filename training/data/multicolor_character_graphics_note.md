# Multicolour Character Graphics (C64)

**Summary:** Multicolour character graphics on the C64 allow each character to use three colours: one per-character entry held in colour RAM and two global shared colours in VIC-II registers $D022 and $D023. $D022/$D023 are global for the screen and cannot vary per character.

## Description
- Each character in multicolour character mode can display three colours:
  - One colour is supplied per character from the colour RAM (colour RAM — per-character memory at $D800).
  - Two additional colours are supplied globally from VIC-II registers $D022 and $D023.
- The colours stored in colour RAM differ for every character; the values in $D022 and $D023 apply to all multicolour characters on the screen and cannot be changed on a per-character basis.
- For deeper details on how multicolour setup interacts with charset placement and the VIC pointer register $D018, see the referenced material.

## Key Registers
- $D022 - VIC-II - Global shared multicolour register (multicolour character colour #1)
- $D023 - VIC-II - Global shared multicolour register (multicolour character colour #2)

## References
- "changing_charset_and_d018" — expands on multicolour setup, charset placement, and $D018

## Labels
- D022
- D023
