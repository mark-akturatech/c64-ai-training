# COMMODORE 64 — Graphics and Art (overview)

**Summary:** The Commodore 64 supports sprite graphics, high-resolution and multicolor graphics plotting, programmable character sets, and combinations of bitmap and character display modes.

**Overview**

In addition to sprite graphics, the Commodore 64 provides:

- High-resolution and multicolor graphics plotting.
- Programmable characters (user-defined character sets).
- Combinations of different graphics and character display modes (mixed bitmap/character displays).

The VIC-II graphics chip offers multiple display modes, including:

- **Standard Character Mode:** 40×25 characters, each 8×8 pixels, with two colors per character block.
- **Multicolor Character Mode:** 40×25 characters, each 4×8 pixels, with four colors per character block.
- **Standard Bitmap Mode:** 320×200 pixels, with two colors per 8×8 pixel block.
- **Multicolor Bitmap Mode:** 160×200 pixels, with four colors per 4×8 pixel block.

These modes can be combined, allowing for flexible graphics and text displays.

## Source Code

```assembly
; Example: Switching to Multicolor Bitmap Mode
LDA #$3B        ; Set Control Register 1: BMM=1, ECM=0
STA $D011       ; Write to VIC-II Control Register 1
LDA #$18        ; Set Control Register 2: MCM=1
STA $D016       ; Write to VIC-II Control Register 2
```

```assembly
; Example: Redefining a Character
LDA #$00        ; Load character code (e.g., 'A')
STA $D018       ; Set Character Generator Address
LDA #$FF        ; Define new character pattern
STA $2000       ; Store pattern in Character RAM
```

```assembly
; Example: Mixing Bitmap and Character Modes
LDA #$3B        ; Enable Bitmap Mode
STA $D011       ; Write to Control Register 1
LDA #$18        ; Enable Multicolor Mode
STA $D016       ; Write to Control Register 2
; Additional code to define screen and color memory
```

## Key Registers

- **$D011 (Control Register 1):** Bit 5 (BMM) enables Bitmap Mode; Bit 6 (ECM) enables Extended Color Mode.
- **$D016 (Control Register 2):** Bit 4 (MCM) enables Multicolor Mode.
- **$D018 (Memory Control Register):** Sets the base addresses for Character and Screen Memory.

## References

- "animation_sprites" — expands on sprite-based animation details
- "lightpen_control" — expands on interactive graphics input methods

## Labels
- $D011
- $D016
- $D018
