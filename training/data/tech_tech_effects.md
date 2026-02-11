# Tech-tech: per-line X-scroll and multi-charset widening

**Summary:** Describes the "tech-tech" effect using per-line X-scroll (VIC-II $D016 lower 3 bits) and extending the horizontal range by swapping character sets via VIC register $D018 (lower 4 bits). Mentions using VIC bank switching (source claims $DD00) to enable graphics-based variants.

**Effect description**
- **Per-line X-scroll:** The VIC-II X-scroll is controlled by the three lower bits of $D016, permitting 0..7 pixel horizontal shift within each 8-pixel character row. By changing these bits on a per-scanline basis, you obtain a wave-like horizontal displacement between character rows, but the maximum difference between lines is 7 pixels.
- **Why moving screen RAM doesn't help:** Screen RAM entries (character indices) are fetched once per character row (every 8 raster lines), so changing screen RAM mid-character-row does not change the visible pixels within that row.
- **Widening the effect with multiple charsets:** To exceed the 7-pixel limit, change the active character set (charset) mid-frame using the four lower bits of $D018. Prepare multiple charsets that are pixel-shifted versions of the same graphics (each shifted by one pixel). By selecting different charsets for different character rows, you can create larger horizontal offsets than 7 pixels.
- **Practical packing:** You can place up to 7 shifted charsets (plus the screen RAM) within one VIC page (16 kB), allowing up to 7 * 8 = 56 pixels of horizontal shift across the assembled character-set swaps. This is commonly referred to as a 56-pixel wide tech-tech using one VIC page.
- **Variations:** Instead of character-set logos, you can switch the VIC memory bank to point at graphics data (so the same technique can apply to bitmap graphics). The source mentions changing VIC bank via $DD00 to achieve broader graphics use — see note below.

**VIC-II Register Details**

- **$D016 (53270) - Control Register 2:**
  - **Bits 0-2:** X-scroll (horizontal fine scroll; 0..7 pixels)
  - **Bit 3:** CSEL (Column Select; 0 = 38 columns, 1 = 40 columns)
  - **Bit 4:** MCM (Multicolor Mode; 0 = standard, 1 = multicolor)
  - **Bits 5-7:** Unused

- **$D018 (53272) - Memory Control Register:**
  - **Bits 0-3:** Character Set Base Address (A11-A13)
  - **Bits 4-7:** Screen RAM Base Address (A10-A13)

**Note:** The VIC-II can only access 16 KB of memory at a time, known as a VIC bank. The base address for screen RAM and character sets is determined within this bank. The character set base address is specified in 2 KB increments, and the screen RAM base address in 1 KB increments. For example, setting bits 0-3 of $D018 to %0001 selects a character set starting at $0800 within the current VIC bank, and setting bits 4-7 to %0001 selects screen RAM starting at $0400. ([oxyron.de](https://www.oxyron.de/html/registers_vic2.html?utm_source=openai))

**Memory Layout for Multiple Charsets**

To pack 7 shifted charsets plus screen RAM into a single 16 KB VIC bank:

- **Screen RAM:** 1 KB
- **Each Charset:** 2 KB
- **Total for 7 Charsets:** 7 * 2 KB = 14 KB
- **Total Memory Used:** 1 KB (Screen RAM) + 14 KB (Charsets) = 15 KB

This fits within a 16 KB VIC bank. The base addresses within the VIC bank can be set as follows:

- **Screen RAM Base Address:** Set bits 4-7 of $D018 to select the 1 KB block for screen RAM.
- **Character Set Base Addresses:** Set bits 0-3 of $D018 to select each 2 KB block for the respective character set.

**Example:**

- **Screen RAM at $0400:** Set bits 4-7 of $D018 to %0001.
- **Charset 0 at $0800:** Set bits 0-3 of $D018 to %0001.
- **Charset 1 at $1000:** Set bits 0-3 of $D018 to %0010.
- **Charset 2 at $1800:** Set bits 0-3 of $D018 to %0011.
- **Charset 3 at $2000:** Set bits 0-3 of $D018 to %0100.
- **Charset 4 at $2800:** Set bits 0-3 of $D018 to %0101.
- **Charset 5 at $3000:** Set bits 0-3 of $D018 to %0110.
- **Charset 6 at $3800:** Set bits 0-3 of $D018 to %0111.

**Note:** Ensure that the selected addresses do not overlap with other critical memory areas and are within the same 16 KB VIC bank. ([oxyron.de](https://www.oxyron.de/html/registers_vic2.html?utm_source=openai))

**Example Assembly Code**

To perform per-line $D016 and mid-frame $D018 updates, you can use raster interrupts to change these registers at specific scanlines. Below is an example in assembly language:


**Notes:**

- Replace `<new_x_scroll_value>` with the desired X-scroll value (0-7).
- Replace `<new_d018_value>` with the desired value for $D018 to select the appropriate character set and screen RAM base addresses.
- Ensure that the interrupt service routine preserves the state of the registers it uses.
- This example sets up a raster interrupt at line 100; adjust as needed for your application.

**[Note: Source may contain an error — VIC bank selection is normally controlled via the CPU port at $0001 (memory configuration) and VIC-related bits in standard VIC registers; $DD00 is the base of CIA 2 and is not the usual register for selecting VIC memory bank.]**

## Source Code

```assembly
; Set up raster interrupt at line 100
lda #100
sta $D012
lda $D011
and #%01111111
sta $D011
lda #%00000001
sta $D01A

; Raster interrupt service routine
irq:
  ; Acknowledge the interrupt
  lda $D019
  sta $D019

  ; Change X-scroll (D016) for current line
  lda #<new_x_scroll_value>
  sta $D016

  ; Change Character Set (D018) for current line
  lda #<new_d018_value>
  sta $D018

  ; Restore registers and return from interrupt
  pla
  tay
  pla
  tax
  pla
  rti
```


## References
- "changing_charset_and_d018" — expands on using multiple charsets via $D018 for wider shifts
- VIC-II Register Reference ([oxyron.de](https://www.oxyron.de/html/registers_vic2.html?utm_source=openai))
- Commodore 64 Programmer's Reference Guide ([csclub.uwaterloo.ca](https://csclub.uwaterloo.ca/~pbarfuss/C64_Programmers_Reference_Guide.pdf?utm_source=openai))

## Labels
- D016
- D018
