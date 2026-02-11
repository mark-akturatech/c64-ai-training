# Sprite system & vertical/horizontal fine scrolling (VIC-II)

**Summary:** Overview of the VIC-II sprite system (8 hardware sprites 0–7, 24×21 dots, 63 bytes each, sprite pointers at $07F8–$07FF) and VIC-II fine-scroll / screen-blanking behavior (registers $D011, $D016, $D020/$D021). Includes example BASIC programs demonstrating vertical fine scrolling and a screen-blanking timing test.

**Sprite system**
- The C64 has eight hardware sprites (numbered 0–7). Each sprite is 24×21 dots (bits), which equals 504 bits → 63 bytes per sprite (24 × 21 / 8 = 63).
- Sprite graphics are stored as 63-byte blocks. The Sprite Data Pointers (default located in the last eight bytes of screen memory: $07F8–$07FF) each hold a byte whose value × 64 (pointer × $40) gives the start address of that sprite's 63-byte data. That address is interpreted within the VIC-II chip’s 16K video addressable range.
- Sprite data format and bit patterns (how the 63 bytes map to the 24×21 dot grid) are referenced in the related node "sprite_data_format_and_bit_patterns".

**Fine vertical scrolling (vertical "dot" scrolling)**
- The VIC-II supports vertical fine scrolling in 1–7 dot steps (values 0–7). Stepping through values 1..7 produces smooth vertical motion from one character row to the next.
- Because fine-scroll values wrap (e.g. 7→0 or 0→7), a coarse scroll (moving all screen lines by 40 bytes in memory) must be performed when the fine-scroll wraps to continue smooth scrolling. This coarse movement requires moving 40 bytes per text row and is typically done in machine language for speed; BASIC can demonstrate the effect but is too slow for continuous smooth scroll in real software.
- A shortened (24-row) display mode can be selected to hide the row where new data is introduced during vertical fine scrolling (described below under $D011).

**Horizontal fine scrolling & screen edge blanking**
- The VIC-II supports horizontal fine scrolling in 0–7 pixel steps (low 3 bits of the horizontal control register). When horizontal fine scrolling is used, the screen is effectively shortened by one character column on either side to facilitate smooth horizontal motion; the blanking position shifts as the fine-scroll value changes (see register description).
- The shortened/blanked column hides the incoming or outgoing column as the display is scrolled horizontally; the blanking shifts one column (scan-line) at a time as the low-3-bit value changes 0..7.

**Screen blanking and CPU access**
- A screen-blanking bit in the VIC-II control register(s) lets the software force the display off. When blanking is enabled (bit = 0 per source), the screen shows only the border color (from the Border Color Register at $D020/$D021), and the VIC-II does not steal the CPU bus for video fetches. This reduces VIC-II bus contention and allows the 6510 to run at full speed (the source notes ~7% faster in a simple timing loop when the screen is blanked).
- The VIC-II normally fetches display data during 6510 idle cycles, but some operations (fetching 40 screen codes per text line or reading sprite data) require additional bus time and cause the VIC-II to delay the 6510. Screen blanking eliminates these delays.

**VIC-II Control Registers**

### $D011 (53265) - Control Register 1
- **Bit 0–2:** Vertical fine-scroll (0–7 dot offset).
- **Bit 3:** Selects 25-line text display (1 = normal 25-line, 0 = shortened 24-row display).
- **Bit 4:** Screen blanking control (1 = screen on, 0 = screen blanked).
- **Bit 5:** Bitmap Mode (1 = bitmap graphics mode, 0 = text mode).
- **Bit 6:** Extended Color Mode (1 = extended color mode enabled, 0 = normal color mode).
- **Bit 7:** Most significant bit of the raster counter (bit 8 of 9-bit raster line number).

### $D016 (53270) - Control Register 2
- **Bit 0–2:** Horizontal fine-scroll (0–7 pixel offset).
- **Bit 3:** Selects 40-column text display (1 = normal 40-column, 0 = shortened 38-column display).
- **Bit 4:** Multicolor Mode (1 = multicolor mode enabled, 0 = standard mode).
- **Bit 5–7:** Unused.

## Source Code
```basic
10 FOR I= 1 TO 50:FOR J=0 TO 7
20 POKE 53265, (PEEK(53265)AND248) OR J:NEXTJ,I
30 FOR I= 1 TO 50:FOR J=7 TO 0 STEP-1
40 POKE 53265, (PEEK(53265)AND248) OR J:NEXTJ,I

10 POKE 53281,0:PRINTCHR$(5);CHR$(147)
20 FORI=1 TO 27:
30 PRINTTAB(15)CHR$(145)"            ":POKE 53265,PEEK(53265)AND248
40 WAIT53265,128:PRINTTAB(15)"I'M FALLING"
50 FOR J=1 TO 7
60 POKE53265,(PEEK(53265)AND248)+J
70 FORK=1TO50
80 NEXT K,J,I:RUN

10 PRINT CHR$(147);TAB(13);"TIMING TEST":PRINT:TI$="000000":GOTO 30
20 FOR I=1 TO 10000:NEXT I:RETURN
30 GOSUB 20:DISPLAY=TI
40 POKE 53265,11:TI$="000000"
50 GOSUB 20:NOSCREEN=TI:POKE 53265,27
60 PRINT "THE LOOP TOOK";DISPLAY;" JIFFIES"
70 PRINT "WITH NO SCREEN BLANKING":PRINT
80 PRINT "THE LOOP TOOK";NOSCREEN;" JIFFIES"
90 PRINT "WITH SCREEN BLANKING":PRINT
100 PRINT "SCREEN BLANKING MAKE THE PROCESSOR"
110 PRINT "GO";DISPLAY/NOSCREEN*100-100;"PERCENT FASTER"
```

```text
Sprite summary (reference):
- Sprites: 8 (0-7)
- Size: 24 x 21 dots
- Bytes per sprite: 63
- Sprite data pointer bytes: default $07F8 - $07FF (pointer_value * 64 = sprite data address within VIC-II 16K)
```

```text
Registers described in source (bit-level detail moved here as reference):
- $D011 (53265) - Control Register 1:
  - Bits 0–2: Vertical fine-scroll (0–7 dot offset).
  - Bit 3: Selects 25-line text display (1 = normal 25-line, 0 = shortened 24-row display).
  - Bit 4: Screen blanking control (1 = screen on, 0 = screen blanked).
  - Bit 5: Bitmap Mode (1 = bitmap graphics mode, 0 = text mode).
  - Bit 6: Extended Color Mode (1 = extended color mode enabled, 0 = normal color mode).
  - Bit 7: Most significant bit of the raster counter (bit 8 of 9-bit raster line number).

- $D016 (53270) - Control Register 2:
  - Bits 0–2: Horizontal fine-scroll (0–7 pixel offset).
  - Bit 3: Selects 40-column text display (1 = normal 40-column, 0 = shortened 38-column display).
  - Bit 4: Multicolor Mode (1 = multicolor mode enabled, 0 = standard mode).
  - Bits 5–7: Unused.
```

## Key Registers
- $D011 - VIC-II - Control Register 1: vertical fine-scroll (bits 0–2), 25/24 row select (bit 3), screen blanking (bit 4), bitmap mode (bit 5), extended color mode (bit 6), raster MSB (bit 7).
- $D016 - VIC-II - Control Register 2: horizontal fine-scroll (bits 0–2), 40/38 column select (bit 3), multicolor mode (bit 4).
- $D020 - VIC-II - Border Color Register (decimal 53280).
- $D021 - VIC-II - Background Color Register (decimal 53281).
- $07F8-$07FF - Screen RAM - Sprite Data Pointers (default locations; pointer byte × 64 → sprite data address).

## References
- "sprite_data_format_and_bit_patterns" — expands on how sprite shape bytes map to dots.
- "sprite_position_registers_and_msb_handling" — expands on sprite placement using horizontal/vertical registers and MSB handling.