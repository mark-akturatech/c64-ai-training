# Suggested Screen and Character Color Combinations (C64)

**Summary:** 16x16 compatibility chart of C64 palette indices (0–15) showing which SCREEN (background) vs CHARACTER color pairs produce TV artifacts (composite chroma bleed) — ratings: o = excellent, / = fair, x = poor. Related registers: VIC-II $D020/$D021 (border/background) and Color RAM $D800-$DBFF (per-character color).

## Chart explanation
Rows = SCREEN (background) color index 0–15.  
Columns = CHARACTER color index 0–15.  
Ratings: o = excellent (recommended), / = fair (acceptable), x = poor (avoid — likely chroma bleed or blurred image on many TV sets). Use when choosing background vs character color in text/character modes (including multicolor character modes).

This chart is guidance for composite TV behavior (NTSC/PAL) and is intended to reduce adjacent-color chroma interference when different character colors are placed on the same scan line as the background color.

## Source Code
```text
SUGGESTED SCREEN AND CHARACTER COLOR COMBINATIONS

                          CHARACTER COLOR
            0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
         0| x| o| x| o| o| /| x| o| o| x| o| o| o| o| o| o|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
         1| o| x| o| x| o| o| o| x| /| o| /| o| o| x| o| o|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
         2| x| o| x| x| /| x| x| o| o| x| o| x| x| x| x| /|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
         3| o| x| x| x| x| /| o| x| x| x| x| /| x| x| /| x|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
         4| o| /| x| x| x| x| x| x| x| x| x| x| x| x| x| /|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
         5| o| /| x| /| x| x| x| x| x| x| x| /| x| o| x| /|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  SCREEN 6| /| o| x| o| x| x| x| x| x| x| x| x| x| /| o| o|
  COLOR   +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
         7| o| x| o| x| x| x| /| x| /| o| /| o| o| x| x| x|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
         8| /| o| o| x| x| x| x| o| x| o| x| x| x| x| x| /|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
         9| x| o| x| x| x| x| x| o| o| x| o| x| x| x| x| o|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
        10| /| /| o| x| x| x| x| /| x| o| x| x| x| x| x| /|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
        11| o| o| x| /| x| x| x| o| x| x| x| x| o| o| /| o|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
        12| o| o| /| x| x| x| /| x| x| /| x| o| x| x| x| o|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
        13| o| x| x| x| x| o| /| x| x| x| x| o| x| x| x| x|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
        14| o| o| x| o| x| x| o| x| x| x| x| /| x| x| x| /|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
        15| o| o| o| x| /| /| o| x| x| /| /| o| o| x| /| x|
          +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+

Legend:
  o = EXCELLENT
  / = FAIR
  x = POOR
```

## Key Registers
- $D020-$D021 - VIC-II - Border and background color registers (useful when setting overall screen/background color)
- $D800-$DBFF - Color RAM - Character color bytes (per-screen-cell color values used by character/text modes)

## References
- "multi_color_character_mode_intro_and_enable_disable" — expands on color considerations when using character color and background color registers