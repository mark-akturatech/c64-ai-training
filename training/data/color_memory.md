# Color RAM (Color Memory) — $D800-$DBE7

**Summary:** Color RAM is fixed at $D800-$DBE7 (55296–56295) and cannot be moved; screen memory (1000 bytes typically at 1024/$0400) is relocatable by changing the VIC-II bank and the KERNAL screen-page pointer (POKE 648,page). VIC-II bank base must be added to any screen address when selecting alternate screen pages.

## Description
Color memory (the 1 KB "color RAM") is permanently located at addresses $D800–$DBE7 (decimal 55296–56295). It cannot be relocated; only screen memory and VIC-II bank selection affect where character codes are fetched from. Screen memory normally occupies 1000 bytes starting at 1024 (decimal) = $0400 (hex), but the VIC-II can be pointed to other 1 KB pages in different banks — changing the graphics mode or bank can make a picture created in one mode appear entirely different in another mode.

When using an alternate screen location you must:
- Add the VIC-II bank base (the VIC-II "bank address") to the screen address used by the chip.
- Inform the KERNAL screen editor of the chosen screen page by writing the page number to location 648 (decimal) / $0288 (hex); page = (screen address) / 256. Example: for screen at 1024 ($0400), page = 1024/256 = 4 so use POKE 648,4.

## Source Code
```text
  |   192   |  1100XXXX  |  12288  |  $3000            |
  |   208   |  1101XXXX  |  13312  |  $3400            |
  |   224   |  1110XXXX  |  14336  |  $3800            |
  |   240   |  1111XXXX  |  15360  |  $3C00            |
  +---------+------------+---------+-------------------+
  +-----------------------------------------------------------------------+
  | * Remember that the BANK ADDRESS of the VIC-II chip must be added in. |
  | You must also tell the KERNAL'S screen editor where the screen is as  |
  | follows: POKE 648, page (where page = address/256, e.g., 1024/256= 4, |
  | so POKE 648,4).                                                       |
  +-----------------------------------------------------------------------+

  COLOR MEMORY

    Color memory can NOT move. It is always located at locations 55296
  ($D800) through 56295 ($DBE7). Screen memory (the 1000 locations starting
  at 1024) and color memory are used differently in the different graphics
  modes. A picture created in one mode will often look completely different
  when displayed in another graphics mode.
```

## Key Registers
- $D800-$DBE7 - Color RAM - fixed 1 KB color memory (one nybble per character cell)
- $0400-$07E7 - Screen memory (typical default 1000 bytes starting at 1024/$0400)
- $3000-$33FF - Alternate 1 KB screen page (starts $3000)
- $3400-$37FF - Alternate 1 KB screen page (starts $3400)
- $3800-$3BFF - Alternate 1 KB screen page (starts $3800)
- $3C00-$3FFF - Alternate 1 KB screen page (starts $3C00)
- $0288 - KERNAL screen editor page pointer (decimal 648; POKE 648,page where page = screen_address/256)

## References
- "screen_memory_and_register_d018" — interaction with screen memory placement and VIC-II bank selection