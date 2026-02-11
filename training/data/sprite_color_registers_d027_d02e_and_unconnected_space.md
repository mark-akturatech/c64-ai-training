# Sprite Color Registers ($D027-$D02E) and Color RAM ($D800)

**Summary:** Describes the C64 Color RAM at $D800 (55296) — 1024 bytes of per-character foreground color nybbles, color number mapping (0–15), behavior in text/multicolor modes, and VIC-II sprite color registers $D027-$D02E (SP0–SP7). Notes not-connected addresses $D02F-$D03F (reads return $FF, writes ignored) and related VIC-II background/border registers ($D020-$D021). Also includes a detailed description of CIA #1 registers at $DC00-$DC0F.

**Color RAM (foreground color nybbles)**

- Color RAM is a fixed 1024-byte block at $D800–$DBFF (decimal 55296–56319). Only the first 1000 bytes correspond to screen character positions in standard 40×25 text mode; the remaining bytes are unused for typical text display.
- Each byte stores a foreground color using only the low 4 bits (a nybble). The upper 4 bits are not connected; writing them does not affect the stored color. When read, the high nibble usually returns unpredictable values (some machines return a constant).
- Always mask reads to the low 4 bits. Example in BASIC: `CR = PEEK(55296) AND 15` (or `PEEK($D800) AND 15`).
- Color RAM is physically fixed and does not move with relocatable screen memory; it will function normally regardless of where Screen RAM is located.
- Newer C64 OS behavior: clearing the screen sets all Color RAM bytes to the current background color. Therefore, to initialize Color RAM to a value, set the background color (VIC register $D021), clear the screen, then restore the background if needed.

**Color numbering (0–15)**

Color values in Color RAM map to these canonical C64 colors:

- 0 = BLACK
- 1 = WHITE
- 2 = RED
- 3 = CYAN (light blue-green)
- 4 = PURPLE
- 5 = GREEN
- 6 = BLUE
- 7 = YELLOW
- 8 = ORANGE
- 9 = BROWN
- 10 = LIGHT RED
- 11 = DARK GRAY
- 12 = MEDIUM GRAY
- 13 = LIGHT GREEN
- 14 = LIGHT BLUE
- 15 = LIGHT GRAY

**Behavior in graphics modes and multicolor text**

- High-resolution bitmap mode: Color RAM is not used.
- Multicolor bitmap mode: Color RAM is used to determine the color of the 2-bit pair (“11” bit-pair) for each 8×8 dot cell.
- Multicolor text mode: Only the low 3 bits of Color RAM are used for color selection (colors 0–7). The 4th bit (bit 3) indicates multicolor text display:
  - Color value < 8: regular text mode for that character.
  - Color value ≥ 8: multicolor character; the 2-bit pair color index is (color value − 8).
- Because only 3 bits are used in multicolor text, the available colors are limited to 0–7 for that mode.

**Sprite color registers and not-connected VIC area**

- VIC-II provides per-sprite color registers at $D027–$D02E for sprites 0–7 (one byte each, select sprite color — can hold 0–15 for single-color sprites; multicolor sprite handling interacts with other VIC features).
- Addresses $D02F–$D03F are not connected on the VIC-II: reads return $FF and writes are ignored.
- The VIC-II border and background color registers are $D020 (border) and $D021 (background/clear-fill color). Using $D021 to set the background color before clearing the screen will also set Color RAM to that background value on newer OS variants.

**[Note: For sprite multicolor/hi-res behavior and sprite expansion/collision bits see referenced VIC-II register documentation (e.g., $D01D–$D01F, $D01C).]**

**CIA #1 Registers ($DC00–$DC0F)**

The Complex Interface Adapter (CIA) #1 at addresses $DC00–$DC0F (56320–56335) manages various I/O functions, including keyboard scanning, joystick input, timers, and interrupt control. Below is a detailed register-by-register description:

- **$DC00 (56320) – Data Port A (PRA):**
  - **Function:** Controls and reads the state of the keyboard matrix columns and joystick port 2.
  - **Details:**
    - **Bits 0–7:** Correspond to keyboard matrix columns.
    - **Bits 0–3:** Read joystick port 2 directions (0 = active).
    - **Bit 4:** Read joystick port 2 fire button (0 = pressed).
    - **Bits 6–7:** Control paddle selection for SID input.

- **$DC01 (56321) – Data Port B (PRB):**
  - **Function:** Controls and reads the state of the keyboard matrix rows and joystick port 1.
  - **Details:**
    - **Bits 0–7:** Correspond to keyboard matrix rows.
    - **Bits 0–3:** Read joystick port 1 directions (0 = active).
    - **Bit 4:** Read joystick port 1 fire button (0 = pressed).
    - **Bit 4:** Also connected to the light pen input.

- **$DC02 (56322) – Data Direction Register A (DDRA):**
  - **Function:** Sets the data direction for Port A.
  - **Details:**
    - **Bits 0–7:** 0 = input, 1 = output.

- **$DC03 (56323) – Data Direction Register B (DDRB):**
  - **Function:** Sets the data direction for Port B.
  - **Details:**
    - **Bits 0–7:** 0 = input, 1 = output.

- **$DC04 (56324) – Timer A Low Byte:**
  - **Function:** Sets or reads the low byte of Timer A.

- **$DC05 (56325) – Timer A High Byte:**
  - **Function:** Sets or reads the high byte of Timer A.

- **$DC06 (56326) – Timer B Low Byte:**
  - **Function:** Sets or reads the low byte of Timer B.

- **$DC07 (56327) – Timer B High Byte:**
  - **Function:** Sets or reads the high byte of Timer B.

- **$DC08 (56328) – Time of Day Clock (10ths of Seconds):**
  - **Function:** Reads or sets the tenths of a second for the Time of Day (TOD) clock.
  - **Details:**
    - **Range:** 0–9 (BCD format).

- **$DC09 (56329) – Time of Day Clock (Seconds):**
  - **Function:** Reads or sets the seconds for the TOD clock.
  - **Details:**
    - **Range:** 0–59 (BCD format).

- **$DC0A (56330) – Time of Day Clock (Minutes):**
  - **Function:** Reads or sets the minutes for the TOD clock.
  - **Details:**
    - **Range:** 0–59 (BCD format).

- **$DC0B (56331) – Time of Day Clock (Hours):**
  - **Function:** Reads or sets the hours for the TOD clock.
  - **Details:**
    - **Range:** 1–12 (BCD format).
    - **Bit 7:** AM/PM flag (0 = AM, 1 = PM).

- **$DC0C (56332) – Serial Data Register (SDR):**
  - **Function:** Holds data for serial communication.
  - **Details:**
    - **Bits 0–7:** Data to be transmitted or received serially.

- **$DC0D (56333) – Interrupt Control Register (ICR):**
  - **Function:** Controls and indicates interrupt sources.
  - **Details:**
    - **Bits 0–4:** Interrupt mask and status for Timer A, Timer B, TOD clock, SDR, and FLAG pin.
    - **Bit 7:** Interrupt flag (1 = interrupt occurred).

- **$DC0E (56334) – Control Register A (CRA):**
  - **Function:** Controls Timer A operation.
  - **Details:**
    - **Bit 0:** Start/stop Timer A (1 = start, 0 = stop).
    - **Bit 1:** PB6 output mode.
    - **Bit 2:** Toggle mode.
    - **Bit 3:** Force load.
    - **Bit 4:** Input mode.
    - **Bits 5–6:** Timer mode selection.
    - **Bit 7:** TOD clock mode (0 = 60 Hz, 1 = 50 Hz).

- **$DC0F (56335) – Control Register B (CRB):**
  - **Function:** Controls Timer B operation.
  - **Details:**
    - **Bit 0:** Start/stop Timer B (1 = start, 0 = stop).
    - **Bit 1:** PB7 output mode.
    - **Bit 2:** Toggle mode.
    - **Bit 3:** Force load.
    - **Bit 4:** Input mode.
    - **Bits 5–6:** Timer mode selection.
    - **Bit 7:** TOD clock mode (0 = 60 Hz, 1 = 50 Hz).

## Source Code
```basic
REM Example BASIC read of Color RAM (first byte)
CR = PEEK(55296) AND 15
```

```text
Addresses (hex / decimal)
$D800 (55296) - start of Color RAM (1024 bytes, 1000 used for 40x25 text)
$DBFF (56319) - end of Color RAM
$D020 (53248) - VIC-II border color register
$D021 (53281) - VIC-II background screen color register
$D027-$D02E (53287-53294) - VIC-II sprite color registers SP0-SP7
$D02F-$D03F (53295-53215?) - not connected: reads return $FF, writes ignored
$DC00-$DC0F (56320-56335) - CIA #1 registers
```

## Labels
- PRA
- PRB
- DDRA
- DDRB
- SDR
- ICR
- CRA
- CRB
