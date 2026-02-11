# MOS 6567/6569 (VIC-II) — Memory Access (Section 3.6)

**Summary:** This section details the VIC-II's memory access mechanisms, including the calculation of absolute X coordinates (LPX measurement), definitions of access types (c/g/p/s), and the timing of a raster line. Key topics include:

- **X Coordinates:** Methods for determining absolute X coordinates using LPX measurement.
- **Access Types:** Classification of VIC-II DRAM access cycles (c/g/p/s) and their impact on CPU contention.
- **Raster Line Timing:** Cycle-by-cycle timing for one display raster, detailing which cycles the VIC-II uses for memory fetches and refresh operations.

**X Coordinates**

The VIC-II does not provide a direct register for reading the current X coordinate of the raster beam. However, the light pen feature can be utilized to determine this position. When the light pen input (LP) is triggered, the current raster position is latched into the LPX ($D013) and LPY ($D014) registers. LPX contains the upper 8 bits of the 9-bit X position, and LPY contains the lower 8 bits of the 9-bit Y position. This setup limits the horizontal resolution of the light pen to 2 pixels.

To measure the current X coordinate:

1. **Trigger the Light Pen Input:** This can be done by generating a negative edge on the LP input. Software control is possible via bit 4 of port B of CIA A ($DC01/$DC03).

2. **Read the LPX Register:** After triggering, read the value from LPX. This value corresponds to the upper 8 bits of the 9-bit X coordinate.

3. **Calculate the Absolute X Coordinate:** The value in LPX represents the X coordinate divided by 2. To obtain the absolute X coordinate, multiply the LPX value by 2.

**Example Calculation:**

If LPX reads $1E (decimal 30), the absolute X coordinate is:


This method allows synchronization of raster interrupt routines to exact cycles by determining the current X position of the raster beam.

**Access Types**

The VIC-II classifies its memory access cycles into four types, each designated by a letter:

- **c (Character Access):** Occurs during Bad Lines to fetch character data. These accesses take place during cycles 15–54 of a raster line when a Bad Line condition is met. Character accesses have a significant impact on CPU contention, as the VIC-II takes control of the bus during these cycles.

- **g (Graphics Access):** Fetches bitmap or character pixel data. These accesses occur during cycles 15–54 of each raster line. Graphics accesses also affect CPU contention, as the VIC-II requires bus access during these cycles.

- **p (Sprite Pointer Access):** Fetches sprite pointers. These accesses occur during cycles 55–58 of a raster line. Sprite pointer accesses have minimal impact on CPU contention.

- **s (Sprite Data Access):** Fetches sprite data. These accesses occur during cycles 59–63 of a raster line. Sprite data accesses can cause slight CPU contention but are generally less impactful than character or graphics accesses.

Understanding these access types is crucial for optimizing CPU and VIC-II operations, especially when precise timing is required.

**Raster Line Timing**

The VIC-II's operation during a single raster line can be broken down into specific cycles, each dedicated to different tasks. Below is a cycle-by-cycle breakdown for a standard raster line:


**Detailed Timing Diagram:**


In this diagram:

- **Idle State (Cycles 0–14):** The VIC-II is in an idle state, typically displaying the border color.

- **Character/Graphics Fetches (Cycles 15–54):** The VIC-II fetches character and graphics data. If a Bad Line condition is met, character data is fetched during this period.

- **Sprite Pointer Fetches (Cycles 55–58):** The VIC-II fetches sprite pointers for any sprites enabled on the current line.

- **Sprite Data Fetches (Cycles 59–63):** The VIC-II fetches sprite data for rendering sprites on the current line.

Understanding this timing is essential for synchronizing CPU operations with the VIC-II and for advanced graphics programming techniques.

**Register References**

Several VIC-II registers influence fetch timing and X-coordinate interpretation:

- **$D011 (Control Register 1):** Controls vertical scrolling and enables/disables the display. The DEN bit (bit 4) must be set for the display to be active, affecting Bad Line conditions.

- **$D012 (Raster Register):** Holds the current raster line number. Writing to this register can set up raster interrupts for precise timing control.

- **$D016 (Control Register 2):** Controls horizontal scrolling and screen width. The CSEL bit (bit 3) selects between 38 or 40 columns, affecting the horizontal display area.

- **$D018 (Memory Control Register):** Selects the base addresses for character and screen memory, influencing where the VIC-II fetches data from.

- **$D013 (LPX Register):** Holds the upper 8 bits of the light pen X coordinate, used for determining the current X position of the raster beam.

- **$D014 (LPY Register):** Holds the lower 8 bits of the light pen Y coordinate.

## Source Code

```
Absolute X Coordinate = LPX * 2
                      = 30 * 2
                      = 60
```

```
Cycle  | Operation
-------|------------------------------
0–14   | Idle state (border area)
15–54  | Character and graphics data fetch (c and g accesses)
55–58  | Sprite pointer fetch (p accesses)
59–63  | Sprite data fetch (s accesses)
```

```text
Cycle:  0   1   2   ... 14 | 15  16  17  ... 54 | 55  56  57  58 | 59  60  61  62  63
       [Idle state (border)]|[Character/Graphics fetches]|[Sprite pointer fetches]|[Sprite data fetches]
```


## References

- "x_coordinates" — How to determine absolute X coordinates (LPX measurement)
- "access_types" — c/g/p/s refresh and idle accesses

**Note:** The information provided is based on the VIC-II's operation as detailed in the original MOS Technology documentation and subsequent technical analyses.

## Labels
- D011
- D012
- D016
- D018
- LPX
- LPY
