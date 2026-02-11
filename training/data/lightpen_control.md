# COMMODORE 64 - LIGHTPEN CONTROL

**Summary:** The Commodore 64 supports lightpen input through its control ports, specifically Control Port 1. Lightpens compatible with the C64's 9-pin D-sub connector can be utilized for applications requiring direct screen interaction.

**Lightpen Control**

Lightpens interface with the Commodore 64 via Control Port 1, utilizing the 9-pin D-sub connector. The relevant pin assignments for lightpen operation are:

- **Pin 6 (Fire/Lightpen):** Triggers the lightpen input.
- **Pin 7 (+5V):** Provides power to the lightpen.
- **Pin 8 (Ground):** Serves as the ground connection.

The lightpen detects the electron beam's position on the CRT screen and sends a signal through Pin 6 when the beam passes under the pen. This signal latches the current screen coordinates into the VIC-II registers.

**Electrical Signal Levels and Timing Requirements**

The lightpen input operates by detecting the CRT's electron beam and sending a low-going pulse to the C64 when the beam is detected. This pulse latches the current raster position into the VIC-II's lightpen registers. The X-coordinate is captured with a resolution of 512 positions, while the Y-coordinate corresponds to the raster line number. The lightpen latch can be triggered only once per frame; subsequent triggers within the same frame will have no effect. Therefore, multiple samples should be taken before turning the pen to the screen to ensure accurate readings. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_6/page_348.html?utm_source=openai))

**Software Interface Details**

To read the lightpen's position, the following VIC-II registers are used:

- **LPX (Register $D013 / 53267):** Holds the 8 most significant bits of the X-coordinate.
- **LPY (Register $D014 / 53268):** Holds the Y-coordinate.

The X-coordinate ranges from approximately 0 to 511, providing a resolution of 2 pixels per unit, while the Y-coordinate corresponds directly to the raster line number. To detect if the lightpen has been triggered, monitor Bit 3 of the Interrupt Request Register ($D019 / 53273). An example in BASIC to read the lightpen coordinates:


This program continuously reads and displays the lightpen's X and Y coordinates. ([atariarchives.org](https://www.atariarchives.org/ecp/chapter_6.php?utm_source=openai))

**Recommended Lightpen Models**

Several lightpen models are known to be compatible with the Commodore 64, including:

- **Turbo Computer Lightpen:** Designed specifically for the C64, it connects directly to Control Port 1.
- **Inkwell Systems Lightpens (170-C and 184-C):** These models are supported by the cc65 compiler's mouse driver for the C64. ([cc65.github.io](https://cc65.github.io/doc/c64.html?utm_source=openai))

When selecting a lightpen, ensure it is designed for use with the C64's control port to guarantee compatibility.

## Source Code

```basic
10 PRINT "X="; PEEK(53267), "Y="; PEEK(53268)
20 GOTO 10
```


## References

- "graphics_and_art_modes" — expands on graphics modes used with lightpen input
- "instrument_control_interfaces" — expands on physical ports and connectors for peripherals

## Labels
- LPX
- LPY
