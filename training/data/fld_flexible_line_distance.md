# FLD (Flexible Line Distance) — delay Bad Line to scroll or remove text rows

**Summary:** FLD manipulates VIC-II registers $D011 and $D012 to postpone the next Bad Line (text character row fetch) by repeatedly writing a modified value to $D011 (mask low 3 bits, set upper bits for text mode). Used for vertical soft-scrolling and to suppress Bad Lines while updating or drawing bitmap/color bars.

**Description**

FLD (Flexible Line Distance) delays the VIC-II's next Bad Line so that the current text/character row is shown for extra scanlines. The common FLD sequence:

- Read $D012 (current raster / raster-row reference).
- Add a chosen delay value (e.g., +2) to that read value.
- Mask to the low 3 bits (AND #$07).
- OR in the upper bits appropriate for text mode (typical example ORA #$18 as used in many demos).
- STA $D011 to replace the VIC-II control byte so the low 3 bits no longer match $D012 for the next line.

By repeating the read/add/mask/OR/STA sequence each scanline (a tight loop across successive raster lines), the Bad Line condition is kept false for as many lines as desired. When you stop writing modified values, the low 3 bits will again match $D012 on some subsequent line, and the next Bad Line (next character row) will be fetched — this effectively shifts where character rows are displayed and lets you scroll the whole text area up/down by whole-character-row increments.

FLD is therefore useful for:

- Vertical soft-scrolling of text (vary loop count per frame to animate).
- Removing Bad Lines while updating bitmap areas or when drawing color/border bars (write FLD each frame and change $D020/$D021 safely without character-row fetches interfering).

Origins: introduced in early C-64 demos (Think Twice / The Judges, 1986).

## Source Code

Below is an example assembly listing demonstrating a complete FLD loop:

```assembly
; FLD example: Delays the next Bad Line by 2 scanlines

FLD_LOOP:
    LDA $D012        ; Load current raster line
    CLC              ; Clear carry flag
    ADC #2           ; Add delay (2 scanlines)
    AND #$07         ; Mask to low 3 bits
    ORA #$18         ; Set upper bits for text mode (00011000)
    STA $D011        ; Store back to control register
    ; Additional code to handle loop control and timing
    JMP FLD_LOOP     ; Repeat loop
```

In this example, the loop reads the current raster line from $D012, adds a delay of 2 scanlines, masks the result to the lower 3 bits, sets the upper bits for text mode, and writes the result back to $D011. This sequence is repeated to delay the Bad Line condition.

## Key Registers

- $D011 - VIC-II - Control register 1
- $D012 - VIC-II - Raster register
- $D020 - VIC-II - Border color
- $D021 - VIC-II - Background color

## References

- "bitmap_graphics_koala_example" — expands on using FLD to avoid Bad Lines when updating bitmap areas