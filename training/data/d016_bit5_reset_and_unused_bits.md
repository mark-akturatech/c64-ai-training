# $D016 — VIC-II Control: Bit 5 (Chip Reset)

**Summary:** $D016 bit 5 controls the VIC-II chip Reset line (1 = video off). Set to 0 for normal VIC-II operation; bits 6–7 are unused.

## Description
Bit 5 of the VIC-II control register at $D016 is the VIC-II chip Reset control. Writing a 1 to bit 5 will assert the VIC-II reset and completely stop the video chip from operating (on older C64s this produces a black screen). For normal operation the bit should be kept cleared (0). Bits 6 and 7 of $D016 are unused and have no effect.

## Source Code
```text
                          Bit 5:  Bit 5 controls the VIC-II chip Reset line.  Setting this bit
                          to 1 will completely stop the video chip from operating.  On older
                          64s, the screen will go black.  It should always be set to 0 to insure
                          normal operation of the chip.

                          Bits 6 and 7.  These bits are not used.
```

## Key Registers
- $D016 - VIC-II - Bit 5 = VIC-II reset (1 = video off); Bits 6-7 unused

## References
- "scrolx_horizontal_fine_scrolling" — expands on context and default for $D016