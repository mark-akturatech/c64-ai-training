# Text/bitmap display (3.7) — VIC-II display components and sequencer states

**Summary:** This section introduces the VIC-II text and bitmap display subsystem, detailing the display components (video matrix, character/bitmap storage, color attributes) and explaining how the graphics sequencer transitions between idle and display states, utilizing the VC (Video Counter) and RC (Row Counter) to generate addresses for character and bitmap fetches.

**Text/bitmap display**

This section outlines the VIC-II text and bitmap display by:

- Enumerating the logical display components involved in screen generation: video matrix, character/bitmap data, attribute/color storage, and the display sequencer.
- Describing the graphics sequencer's operation in distinct idle and display states, which dictate when the VIC-II fetches name-table (screen) bytes, character generator bytes, or bitmap data.
- Explaining that the sequencer’s state transitions are synchronized with the internal column/row address counters (VC and RC), which together form the addresses used to fetch video matrix entries and character/bitmap data for each raster interval.

This overview links component definitions to sequencer behavior; detailed timing, address calculations, and fetch sequencing are covered in linked sections.

## Source Code

```text
Timing diagram illustrating fetch windows relative to raster cycles:

Cycle: | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |10 |11 |12 |13 |14 |15 |16 |17 |18 |19 |20 |21 |22 |23 |24 |25 |26 |27 |28 |29 |30 |31 |32 |33 |34 |35 |36 |37 |38 |39 |40 |
       ---------------------------------------------------------------------------------------------------------
       |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
       ---------------------------------------------------------------------------------------------------------
       |<---------------------------- Display State (40 cycles) ---------------------------->|<-- Idle State -->|
       |<-- Bad Line Condition -->|<------------------- Normal Display --------------------->|<-- Border Area -->|
       |<-- Character Fetches -->|<-- Bitmap Data Fetches -->|<-- Sprite Fetches -->|<-- CPU Access -->|<-- Refresh -->|
       ---------------------------------------------------------------------------------------------------------
```

This diagram represents the timing of various fetch operations within a raster line. The display state consists of 40 cycles, during which the VIC-II performs character and bitmap data fetches, as well as sprite fetches. The idle state follows, allowing CPU access and memory refresh operations.

```text
Block diagram of the VIC-II display components and sequencer:

+-------------------+
|                   |
|   Video Matrix    |
|                   |
+-------------------+
          |
          v
+-------------------+       +-------------------+
|                   |       |                   |
| Character/Bitmap  |       |   Color Memory    |
|     Storage       |       |                   |
+-------------------+       +-------------------+
          |                           |
          v                           v
+-------------------------------------------+
|                                           |
|           Graphics Sequencer              |
|                                           |
+-------------------------------------------+
          |
          v
+-------------------+
|                   |
|    Display Out    |
|                   |
+-------------------+
```

This block diagram illustrates the flow of data from the video matrix and character/bitmap storage through the graphics sequencer to produce the final display output.

## Key Registers

- **VC (Video Counter):** 10-bit counter used to generate addresses for video matrix and character/bitmap data fetches.
- **RC (Row Counter):** 3-bit counter indicating the current row within a character, used in conjunction with VC for address generation.
- **VCBASE (Video Counter Base):** 10-bit register that can load or be loaded from VC, serving as a base value for VC.

## References

- "idle_state_display_state" — expands differences between display and idle state in the graphics sequencer
- "vc_and_rc" — expands on VC/RC role in generating addresses for video matrix and character/bitmap fetches

## Labels
- VC
- RC
- VCBASE
