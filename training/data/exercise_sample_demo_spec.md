# Exercise: small C‑64 demo part — logo, 8 sprites (sine), scroller, raster bars, tune

**Summary:** Build a demo part using VIC‑II sprite registers ($D000 range) for 8 sprites driven by X/Y sine tables, a top logo (multi‑colour or hires), a bottom character scroller, raster bars by changing $D020 (border colour), and a tune typically found at $1000. Use packing/crunching for distribution.

## Exercise description
This is a single demo part intended as a first practical exercise before attempting IRQ loaders or multi‑part demos. Required elements and implementation constraints:

- Top logo
  - Draw with any graphics tool.
  - Use either multicolour mode or single‑colour hi‑res (bitmap/char graphics as you prefer).
  - Place at the top of the visible screen.

- Eight sprites moving in sine patterns
  - Use two tables: one table of X values and one of Y values.
  - Give each sprite an index/offset into both tables (an offset per sprite).
  - Every frame increment the offsets (or tweak per‑sprite speed) and read table values to write sprite positions.
  - Write sprite positions into the VIC‑II sprite registers (see Key Registers).
  - Table length suggestion: $0100 bytes (256 entries) for easy wraparound.
  - Per the exercise, you can keep table data in RAM and perform simple index arithmetic each frame to read X/Y entries and poke them into VIC registers.

- Bottom scroll text
  - Use a simple character‑based scroller in the bottom text rows (no requirement to change character ROM).
  - Update screen memory or character pointers each frame to scroll.

- Raster bars in top/bottom border
  - You do not need to open the border area; change the border colour register to produce coloured bars.
  - Change $D020 on raster lines (or per frame if coarse) to create top and bottom border bars.

- Playing a tune
  - You can rip an existing tune rather than composing your own.
  - Many demo tunes are loaded at $1000 and are often less than $1000 bytes long — a common workflow: run the demo, reset into the monitor and save $1000–$1FFF.
  - Playback can be started by jumping to the tune's init/play routines or by adapting a small player (not required for this exercise).

- Distribution and testing
  - Pack/crunch the finished part so it loads with a single RUN (or provide a small loader).
  - Familiarize yourself with packers/crunchers and basic loaders (tools referenced elsewhere).

Do not attempt IRQ loaders or advanced multiplexing for this initial part — focus on getting the combined visual/sound elements working frame‑by‑frame.

## Key Registers
- $D000-$D02E - VIC‑II - sprite X/Y position registers, sprite control, raster and border related VIC registers (includes border colour at $D020)

## References
- "sine_editors_and_sample_basic" — creating sine tables for sprite motion  
- "irq_loaders" — using IRQ loaders for multi‑part demos
