# Sprite design sheets — multicolor pixel width and expanded grids

**Summary:** This document provides information on sprite design sheets and the layout of multicolor-mode pixels on the Commodore 64. In multicolor modes, each pixel is represented by two bits, resulting in horizontally doubled pixels compared to single-bit (hi-res) representation. Sprite design sheets include expanded grids that align sprites with background character grids, facilitating precise placement and composition.

**Sprite design sheets and multicolor pixel layout**

The Commodore 64's graphics system offers two primary modes for sprite design: high-resolution (hi-res) and multicolor. Understanding the pixel layout and corresponding design sheets is crucial for effective sprite creation and integration with background elements.

- **Multicolor Mode:**
  - In multicolor mode, each pixel is defined by two bits, allowing for four possible color values. This results in pixels that are twice as wide as those in hi-res mode, effectively halving the horizontal resolution. Consequently, a sprite in multicolor mode has a resolution of 12×21 pixels, with each pixel being double the width of a hi-res pixel. ([c64-wiki.com](https://www.c64-wiki.com/wiki/sprite?utm_source=openai))

- **Sprite Design Sheets:**
  - To assist in designing sprites that align with background character grids, expanded sprite design sheets are utilized. These sheets provide grids that correspond to various sprite sizes and expansion settings, ensuring accurate placement and composition.

The following diagrams illustrate the character grid with double-wide dots for multicolor modes and the expanded sprite grids for different sprite sizes:

## Source Code

```text
Fig. 9-2: Character Grid with Double-Wide Dots for Multicolor Mode

+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+
|    |    |    |    |    |    |    |    |
|    |    |    |    |    |    |    |    |
+----+----+----+----+----+----+----+----+

Each cell represents a character space (8×8 pixels), with double-wide dots indicating the effective horizontal resolution in multicolor mode.
```
