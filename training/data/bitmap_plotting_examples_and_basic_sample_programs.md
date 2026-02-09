# Raster Compare Interrupts (VIC-II) and BASIC Raster-Split Example

**Summary:** This document details the implementation of raster compare interrupts using the VIC-II's raster registers ($D012/$D011) and interrupt enable register ($D01A). It outlines the steps to install a raster Interrupt Service Routine (ISR), including disabling interrupts, setting the desired raster line, modifying the IRQ vector, and re-enabling interrupts. Additionally, it provides an example of splitting the screen into multiple sections with different display modes using raster interrupts.

**Description**

- **Raster Compare IRQ:** The VIC-II can generate an interrupt when the current scanline matches a specified value. This is achieved by setting the raster registers:
  - $D012 holds the low 8 bits (0–255) of the target scanline.
  - Bit 7 of $D011 holds the 9th (high) bit, allowing for values above 255.

- **Installing a Raster ISR:**
  1. **Disable Interrupts:** Use the `SEI` instruction to disable interrupts while setting up the ISR.
  2. **Enable Raster Interrupt:** Set Bit 0 of the VIC-II interrupt enable register at $D01A to enable raster interrupts.
  3. **Set Raster Line:** Write the desired 9-bit raster line into $D012 (low byte) and the high bit into bit 7 of $D011.
  4. **Modify IRQ Vector:** Point the IRQ vector to your ISR by storing the low and high bytes of the ISR's start address into $0314 (low byte) and $0315 (high byte).
     - **Address Calculation:** To split an address `AD` into bytes:
       - `HIBYTE = INT(AD / 256)`
       - `LOWBYTE = AD - (HIBYTE * 256)`
  5. **Re-enable Interrupts:** Use the `CLI` instruction to re-enable interrupts.

- **Preserving System Behavior:**
  - **Chaining to Original IRQ:** To maintain normal keyboard and jiffy-clock operation, save the original IRQ vector ($0314/$0315) before replacing it. Chain to it from your ISR once per screen refresh (1/60 s).
  - **Disabling System Interrupts:** To suppress the system jiffy/keyboard interrupt, write 127 to CIA1 register $DC0D (decimal 56333) to disable the hardware timer interrupt used by the OS.

- **Partial-Screen Effects:**
  - To change only part of the screen, use multiple raster interrupts: one to switch graphics mode/parameters at the start line and another to switch them back at the end line.
  - The provided example divides the screen into three sections using raster interrupts:
    - First 80 scan lines in high-resolution bitmap mode.
    - Next 40 lines in text mode.
    - Last 80 lines in multicolor bitmap mode.
  - The split persists after the BASIC program ends; pressing STOP+RESTORE restores the normal display.

- **Data Locations Referenced by the Sample:**
  - The interrupt uses a table POKEd into four VIC locations during each of the three interrupts:
    - $D011 (Control Register 1)
    - $D016 (Control Register 2)
    - $D018 (Memory Control)
    - $D021 (Background Color 0)
  - The BASIC lines mentioned (49152–49276) correspond to where the first data byte of each POKE is stored in memory for that example.

## Source Code

Below is the BASIC program that installs a machine language routine to alter the screen colors using raster interrupts.

```basic
10 FOR J = 828 TO 862 : READ X
20 T = T + X : POKE J, X
30 NEXT J
40 IF T <> 3958 THEN STOP
50 POKE 56333, 127
60 POKE 788, 60 : POKE 789, 3
70 POKE 56333, 129 : POKE 53274, 129
80 DATA 173, 25, 208, 41, 1, 240, 25, 141, 25, 208, 162, 146, 160, 21, 173, 18
90 DATA 208, 16, 4, 162, 1, 160, 23, 142, 18, 208, 140, 24, 208, 76, 188, 254, 76, 49, 234
```

This program reads machine language data into memory starting at address 828, calculates a checksum to ensure data integrity, and sets up the raster interrupt. The machine language routine changes the screen colors at specific raster lines, creating a split-screen effect. ([atarimagazines.com](https://www.atarimagazines.com/compute/issue38/094_1_COMMODORE_64_VIDEO.php?utm_source=openai))

The machine language routine referenced in the DATA statements performs the following tasks:

1. **Disable System Interrupts:** Writes 127 to CIA1 register $DC0D to disable the system's timer interrupt.
2. **Set IRQ Vector:** Modifies the IRQ vector at $0314/$0315 to point to the custom interrupt routine.
3. **Enable Raster Interrupt:** Sets Bit 0 of the VIC-II interrupt enable register at $D01A to enable raster interrupts.
4. **Set Raster Line:** Writes the desired raster line to $D012.
5. **Interrupt Routine:**
   - Changes the screen mode and colors at specific raster lines.
   - Acknowledges the interrupt by writing to the VIC-II interrupt register at $D019.
   - Chains to the original IRQ handler to maintain system functionality.

This setup allows for the creation of multiple display modes on a single screen by changing VIC-II registers at precise raster lines.

## Key Registers

- **VIC-II Registers:**
  - $D011 (Control Register 1)
  - $D012 (Raster Register)
  - $D016 (Control Register 2)
  - $D018 (Memory Control)
  - $D019 (Interrupt Status Register)
  - $D01A (Interrupt Enable Register)
  - $D020 (Border Color)
  - $D021 (Background Color 0)

- **CIA1 Registers:**
  - $DC0D (Interrupt Control Register)

- **CPU Memory:**
  - $0314/$0315 (IRQ Vector Low/High Bytes)

## References

- "bitmap_pixel_addressing_and_plotting" — expands on BY formula and BI masks (bitmap plotting details)
- "Commodore 64 Video: A Guided Tour" — provides insights into raster interrupts and screen splitting techniques. ([atarimagazines.com](https://www.atarimagazines.com/compute/issue38/094_1_COMMODORE_64_VIDEO.php?utm_source=openai))