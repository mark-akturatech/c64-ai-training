# Michael's Dancing Mouse — 3‑sprite BASIC example (POKE‑based sprites + SID sound)

**Summary:** Example Commodore 64 BASIC program that demonstrates loading three 24x21 (64‑byte) sprites into RAM pages (e.g., 12288–12478), setting sprite pointers via the zero‑page pointer bytes (POKE 2040,p), configuring VIC‑II sprite hardware ($D000‑$D02E range), and playing simple SID sound via $D400‑style pokes (54272 base). Shows looped horizontal movement with high/low X handling, conditional calls to sound subroutines, timing delays (POKE 2040,p usage shown), DATA blocks (lines 100–109) holding bitmap bytes, and two subroutines (lines 200 and 300) that toggle sprite pointer bytes to animate/morph sprites.

**Program structure and notes**
- **Sprite memory:** BASIC POKEs load 64 bytes per sprite into contiguous pages. Sprite pointers on the C64 are stored in memory at decimal 2040–2047 (hex $07F8–$07FF); each pointer byte holds the 8‑bit page number where a 64‑byte sprite bitmap begins (pointer value * 64 = address). This program uses pages 192, 193, and 194 (192*64 = 12288).
- **Enabling sprites:** VIC‑II sprite enable/control and X/Y registers reside in the $D000 block (decimal 53248 base). The program POKEs the sprite‑enable register to turn sprites 0–2 on and writes X/Y registers to move them.
- **High/low X byte:** Sprites' X coordinate is 9 bits across VIC registers; the program manages wrap and sets the high X bit when crossing 255.
- **Sound:** SID base is $D400 (decimal 54272). Minimal writes to voice frequency and control registers are used to produce beeps; the program calls a sound subroutine conditionally when certain animation frames occur.
- **Timing/delays:** Small FOR/NEXT delays and POKE 2040,p are used; POKE 2040,p here demonstrates writing to sprite pointer bytes (commonly used in BASIC sprite examples).
- **DATA:** Lines 100–109 contain the sprite bitmap bytes (three sprites × 64 bytes = 192 bytes). These are loaded into three consecutive 64‑byte pages.
- **Subroutines:** Line 200 toggles pointer bytes (simple morph animation by swapping pointer values); line 300 plays a short SID tone.

(Technical readers: this node focuses on the concrete BASIC listing and structure; see Key Registers for addresses used.)

## Source Code
