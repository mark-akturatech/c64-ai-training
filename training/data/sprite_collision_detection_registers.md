# VIC-II Sprite Collision Detection (SSCOL $D01E, SBCOL $D01F)

**Summary:** VIC-II sprite collision detection utilizes SSCOL ($D01E) for sprite-to-sprite collisions and SBCOL ($D01F) for sprite-to-background collisions. Reading either register clears its data, so values must be stored before analysis. Sprite priority is controlled per sprite via the BPRIOR register at $D01B. In multicolor mode, the bit-pair 01 is treated as transparent for background collisions.

**Collision Detection Overview**

- **Sprite-to-Sprite Collisions:** Detected when non-transparent pixels of sprites overlap. SSCOL ($D01E) indicates which sprites were involved by setting corresponding bits (bit 0 for sprite 0, bit 1 for sprite 1, ..., bit 7 for sprite 7). It does not specify which sprites collided with each other. Reading SSCOL clears its contents; therefore, software must store the value before analysis.

- **Sprite-to-Background Collisions:** Detected when non-transparent pixels of a sprite overlap with non-transparent background pixels. SBCOL ($D01F) indicates which sprites were involved by setting corresponding bits (bit 0 for sprite 0, bit 1 for sprite 1, ..., bit 7 for sprite 7). In multicolor screen modes, the color bit-pair 01 is treated as transparent for collision detection. Reading SBCOL clears its contents; thus, software must store the value before analysis.

- **Off-Screen Collisions:** Collisions are detected even if sprites are off-screen.

- **Sprite Multiplexing:** If sprites are multiplexed (same sprite number reused on different scanlines/positions), SSCOL/SBCOL values may be unreliable for identifying specific collisions.

**Sprite Priority and Transparency Interaction**

- **Sprite Priority Control:** Each sprite's priority relative to the background is controlled by the BPRIOR register at $D01B. Each bit corresponds to a sprite (bit 0 for sprite 0, bit 1 for sprite 1, ..., bit 7 for sprite 7):
  - Bit clear (0): Sprite appears in front of the background.
  - Bit set (1): Sprite appears behind the background image but in front of the background color.

- **Transparency Interaction:** Sprites can contain transparent pixels. A lower-priority (behind) sprite with transparent pixels can reveal a higher-priority sprite through those transparent areas.

**Safe Read/Store Sequence for SSCOL/SBCOL**

To safely read and store the collision registers without unintentionally clearing data before analysis, follow this sequence:


In this sequence:
- `SSCOL_STORAGE` and `SBCOL_STORAGE` are memory locations designated to store the collision data for later analysis.
- Reading from $D01E and $D01F clears their contents, so it's crucial to store the values immediately upon reading.

## Source Code

```assembly
; Read and store SSCOL ($D01E)
LDA $D01E
STA SSCOL_STORAGE

; Read and store SBCOL ($D01F)
LDA $D01F
STA SBCOL_STORAGE
```


## Key Registers

- **$D01B (BPRIOR):** Sprite priority register. Each bit controls the priority of a corresponding sprite:
  - Bit clear (0): Sprite appears in front of the background.
  - Bit set (1): Sprite appears behind the background image but in front of the background color.

- **$D01E (SSCOL):** Sprite-to-sprite collision register. Each bit indicates if the corresponding sprite was involved in a collision:
  - Bit 0: Sprite 0
  - Bit 1: Sprite 1
  - ...
  - Bit 7: Sprite 7
  - Reading this register clears its contents.

- **$D01F (SBCOL):** Sprite-to-background collision register. Each bit indicates if the corresponding sprite was involved in a collision with the background:
  - Bit 0: Sprite 0
  - Bit 1: Sprite 1
  - ...
  - Bit 7: Sprite 7
  - In multicolor modes, color bit-pair 01 is treated as transparent.
  - Reading this register clears its contents.

## References

- "video_interrupts_virq_and_virqm" — expands on sprite/scanline collisions and VIRQ interrupt bits.

## Labels
- BPRIOR
- SSCOL
- SBCOL
