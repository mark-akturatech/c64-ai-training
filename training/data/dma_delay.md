# DMA Delay (Bad Line) — VIC‑II behavior when creating a Bad Line in cycles 15–53

**Summary:** DMA Delay is a VIC‑II technique triggered by forcing a Bad Line inside cycles 15–53 (e.g. via $D011 YSCROLL matching the lower 3 bits of the current raster). It exploits the VIC’s BA/AEC timing and the analog switch U16 so that the first three c‑accesses return invalid character pointers and color nibbles, misaligning VC and producing a horizontal screen shift without moving memory; DEN can also be toggled mid‑line to cause the same effect.

## Mechanism

- Condition: Create a Bad Line while the VIC graphics sequencer is idle inside cycles 15–53 of a displayed raster line (example: write $D011 so YSCROLL == raster & 7).
- Immediate reaction: VIC asserts BA low in the next cycle and switches the sequencer into display state, starting c‑accesses to the video matrix. The CPU is stopped while BA is low.
- AEC timing quirk: AEC follows φ2 and remains high for three clock cycles after BA goes low (hardwired behavior). During those three cycles the VIC’s D0–D7 drivers are tri‑stated, so the VIC reads $FF on D0–D7 instead of real video matrix data.
- Color nibble source: D8–D13 inputs are always active, but Color RAM’s chip select is not asserted while AEC is high (CPU still master). The analog 4‑bit switch U16 connects CPU D0–D3 to VIC D8–D11 while AEC is high, so the VIC receives the lower 4 bits of the CPU opcode present immediately after the $D011 write as color data.
- Data stored: These invalid reads ($FF as character pointers; lower opcode nibble as color) are stored as the first entries of the internal line buffers. After the initial three invalid cycles, normal video matrix/color reads resume.
- VC increments: The sequencer increments VC after each subsequent g‑access; because c/g‑accesses began mid‑line, fewer than the normal 40 increments occur that raster line, so VC is no longer a multiple of 40 at end of the line.
- Persistent misalignment: The VC misalignment continues on following lines (see VC behavior), so the whole screen appears shifted horizontally to the right by an amount equal to the number of cycles after cycle 14 when the $D011 access occurred. This is called DMA Delay.

## Trigger methods

- YSCROLL manipulation: Change $D011 so YSCROLL (lower 3 bits) equals raster lower 3 bits while in cycles 15–53 — causes BA immediate and DMA Delay.
- DEN toggle method: Set YSCROLL = 0 so line $30 becomes eligible for a Bad Line; toggle DEN (bit in $D011) from 0→1 in the middle of that line. Since BAD LINE requires DEN to have been set for at least one cycle in line $30, setting DEN mid‑line produces the Bad Line in the same delayed manner.

## Effects and use

- Horizontal soft scrolling: Scrolls entire screen contents sideways by large distances without moving graphics memory (works for text and bitmap because VC is used for bitmap data too).
- Combine with FLD and Linecrunch to achieve large arbitrary 2D scrolling with minimal CPU work.
- Useful for probing internal VIC registers/operation (RC, VC) by experimenting with access timing and observing resulting shifts.

## Key Registers
- $D011 - VIC‑II - control register containing YSCROLL and DEN (used to create Bad Line / DMA Delay conditions)

## References
- "x_coordinates" — horizontal displacement measured in cycles/pixel units  
- "fli" — combining DMA Delay with FLD/Linecrunch for arbitrary 2D scrolling

## Labels
- D011
- YSCROLL
- DEN
