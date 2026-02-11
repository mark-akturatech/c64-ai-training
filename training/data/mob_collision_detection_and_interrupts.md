# VIC-II MOB Collision Detection (MOB-MOB and MOB-DATA)

**Summary:** Describes VIC-II sprite (MOB) collision detection behavior and the two collision registers $D01E (MOB-MOB) and $D01F (MOB-DATA). Covers what causes a collision (non-transparent pixels), read-to-clear behavior, off-screen detection/scrolled display interaction, the 0-1 multicolor pair exclusion option, and collision interrupt latches.

**Collision types and behavior**
- Two separate collision detectors exist in the VIC-II:
  1. MOB-to-MOB collisions: occur when non-transparent pixels of two or more MOBs (sprites) coincide. Transparent areas do not generate collisions. When a collision happens, the corresponding MnM bits in the MOB-MOB COLLISION register ($D01E) are set to 1 for each collided MOB. Bits remain set until the register is read; reading clears all bits.
  2. MOB-to-display (MOB-DATA) collisions: occur when a MOB and non-background display data (foreground pixels from character or bitmap modes) coincide. Transparent display data does not cause collisions. The MnD bits in the MOB-DATA COLLISION register ($D01F) are set to 1 for each MOB involved. Bits remain set until the register is read; reading clears all bits.

- The 0-1 multicolor bit pair (the lower two bits used in multicolor pixels) can be configured to be ignored for MOB-DATA collision tests. That allows using that multicolor bit pair as background without triggering sprite-to-display collisions. ([scribd.com](https://www.scribd.com/document/493495106/The-MOS-6567-6569-video-controller-VIC-II?utm_source=openai))

- Collision detection:
  - Treats only non-transparent pixels as potentially colliding.
  - Detects MOB-MOB collisions even when MOBs are positioned off-screen.
  - MOB-DATA collisions can occur off-screen horizontally when display data has been scrolled off-screen (see VIC-II scrolling behavior).

**Collision interrupt latches**
- Each collision register has an associated interrupt latch. When the first bit in a collision register is set (i.e., the first collision of that type since the register was last cleared), the corresponding interrupt latch is set.
- Once an interrupt latch is set, subsequent collisions of that type will not set the latch again until the collision register has been cleared to all zeros by a read of that register.
- Reading the collision register clears its bits (and thus allows future collisions to set the latch again). The interrupt latches are mapped to the VIC-II interrupt registers as follows:
  - **Interrupt Request Register ($D019):**
    - Bit 1: Sprite-to-background (MOB-DATA) collision interrupt flag.
    - Bit 2: Sprite-to-sprite (MOB-MOB) collision interrupt flag.
  - **Interrupt Enable Register ($D01A):**
    - Bit 1: Enable sprite-to-background (MOB-DATA) collision interrupt.
    - Bit 2: Enable sprite-to-sprite (MOB-MOB) collision interrupt.
  
  To enable collision interrupts, set the corresponding bits in the Interrupt Enable Register ($D01A). ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_151.html?utm_source=openai))

## Source Code
```text
Register bit maps (VIC-II collision registers):

$D01E - MOB-MOB COLLISION (MnM)
  bit 0 = M0M (sprite 0 collided with any other sprite)
  bit 1 = M1M (sprite 1 collided with any other sprite)
  bit 2 = M2M
  bit 3 = M3M
  bit 4 = M4M
  bit 5 = M5M
  bit 6 = M6M
  bit 7 = M7M

$D01F - MOB-DATA COLLISION (MnD)
  bit 0 = M0D (sprite 0 collided with non-background display data)
  bit 1 = M1D
  bit 2 = M2D
  bit 3 = M3D
  bit 4 = M4D
  bit 5 = M5D
  bit 6 = M6D
  bit 7 = M7D

Notes:
- Bits set to 1 indicate collision; register read clears all bits.
- The 0-1 multicolor bit pair exclusion is a VIC-II configuration option (see multicolor collision masking in VIC-II docs).
```

```asm
; Example: clear both collision registers (read them)
    LDA $D01E    ; read MOB-MOB collision register -> clears MnM bits
    LDA $D01F    ; read MOB-DATA collision register -> clears MnD bits
```

## Key Registers
- $D01E-$D01F - VIC-II - MOB-MOB collision (MnM) and MOB-DATA collision (MnD) registers (bits correspond to sprites 0–7)
- $D019 - VIC-II - Interrupt Request Register (bit 1: MOB-DATA collision, bit 2: MOB-MOB collision)
- $D01A - VIC-II - Interrupt Enable Register (bit 1: enable MOB-DATA collision interrupt, bit 2: enable MOB-MOB collision interrupt)

## References
- "mob_priority_and_foreground_behavior" — which MOB pixels are considered non-transparent and how priorities affect visible pixels
- "mob_memory_access_and_pointers" — collision detection is independent of MOB pointer fetching and can detect off-screen collisions