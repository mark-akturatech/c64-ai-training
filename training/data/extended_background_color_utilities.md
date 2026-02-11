# Extended background color mode — windows, limitations, and text-conversion subroutine

**Summary:** Extended background color mode (VIC-II text-window technique) creates colored text windows by changing background color values and can require a custom character set because only the first 64 screen codes are usable for windowed shapes; includes a BASIC subroutine to translate a normal string for printing in window 2 (and notes for window 4 reverse-video printing).

**Description**
Extended background color mode is used to create visually distinct text windows by changing background colors (useful for separate status/inventory/command areas). Background color for a window is changed instantly by POKEing the appropriate color register, allowing effects such as flashing or hiding text by varying foreground/background colors.

Limitations:
- Only character shapes with screen codes in the first 64 positions can be used directly in extended-background windows. If the desired shape does not have a screen code < 64, you must define a custom character set and place that shape within the first 64 characters.

Text-printing issue:
- Characters typed literally in a PRINT statement do not always map to the correct screen codes needed for windows 2 and 4; window 1 and window 3 characters appear normally, and window 3 characters are simply the inverse of window 1. Therefore the primary conversion problem is for windows 2 and 4.

Provided solution:
- Place the message in A$ and run a translation subroutine which converts each character to the ASCII/screen-code offset required for window 2. The routine builds B$ from A$ by taking each character's ASC value, adding the required offset, and converting back with CHR$.

Reversed printing (window 4):
- To print the translated string in window 4 (reverse video), wrap the translated string with the reverse-on and reverse-off PETSCII control characters. Example: PRINT CHR$(18);B$;CHR$(146).

Enabling extended background color mode:
- Set bit 6 of the VIC-II control register at address 53265 ($D011) to 1. This can be achieved with the following BASIC command:
  ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_120.html?utm_source=openai))

## Source Code

  ```basic
  POKE 53265, PEEK(53265) OR 64
  ```

```basic
500 B$="":FOR I=1 TO LEN(A$):B=ASC(MID$(A$,I,1))
510 B=B+32:IF B<96 THEN B=B+96
520 B$=B$+CHR$(B):NEXT I:RETURN
```

Reference example for printing reversed (window 4):
```basic
PRINT CHR$(18);B$;CHR$(146)
```

## Key Registers
- **53265 ($D011)**: VIC-II Control Register 1
  - Bit 6: Extended background color mode enable (1 = enabled, 0 = disabled)

## References
- "d011_bit6_extended_background_color_mode_and_examples_part1" — expands on how to enable and test extended background mode
- "windows_demo_program" — example program creating colored windows

## Labels
- D011
