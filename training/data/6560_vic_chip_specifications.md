# 6560 VIC (VIC-20) — Pin/Register Summary, Screen & Sound Mapping

**Summary:** 6560 VIC registers $9000-$900F (decimal 36864–36879) control VIC-20 video: screen origin, raster, screen/character memory pointers, color bits, and sound (three tone generators + noise + volume). Includes formulas for screen/colour memory address calculation, sound frequency formula, light-pen/paddle inputs, and the register bit/function mapping (A–Z).

## Overview
This packet covers the 6560 VIC capability summary and the 16 control registers at $9000–$900F used by the VIC‑20 for:
- Screen layout and centering (horizontal/vertical origin, columns, rows)
- Character size (8x8 / 8x16), raster value, and interlace mode
- Screen memory and character memory pointers (with address calculation formulas)
- Color registers: auxiliary color, screen color, border color, reverse mode
- On‑chip sound: three tone generators, white noise, amplitude/modulation, volume, and frequency registers with clock table
- Inputs: two paddles (A/D converters) and light‑pen X/Y

Features (from source):
- 16K address space; 16 control registers
- 16 color generation, two color modes
- Three independent tone generators + white noise + amplitude modulator
- Two on‑chip 8‑bit A/D converters (paddles)
- On‑chip DMA and address generation, light‑pen support

## Registers and bit functions (A–Z)
The register bits are referenced in the source by letters A..Z across $9000–$900F. Their meanings (as provided):

- A — Interlace enable (frame repetition halved)
- B — Screen origin (horizontal)
- C — Screen origin (vertical)
- D — Number of columns (video columns)
- E — Number of rows (video rows)
- F — Character size: 0 = 8x8, 1 = 8x16
- G — Raster value (used for light‑pen synchronization)
- H — Screen memory location (high bits of screen address)
- I — Character memory location (pointer to character ROM/RAM)
- J — Light pen horizontal (latched dot from left)
- K — Light pen vertical (latched dot from top)
- L — Paddle 1 (digitized 0–255)
- M — Paddle 2 (digitized 0–255)
- N — Bass (voice 1) enable
- O — Alto switch (voice 2) enable
- P — Soprano switch (voice 3) enable
- Q — Noise switch
- R — Bass frequency (voice 1)
- S — Alto frequency (voice 2)
- T — Soprano frequency (voice 3)
- U — Noise frequency
- V — Sound volume (0–15)
- W — Auxiliary color (0–15, upper nibble of color register)
- X — Screen color (0–15, lower nibble)
- Y — Reverse mode bit (1 = normal, 0 = reverse all characters)
- Z — Border color (0–7)

Important interactions and formulas (as in source):
- Interlace toggle (bit A): POKE 36864, PEEK(36864) AND 127  (turn off)
  POKE 36864, PEEK(36864) OR 128  (turn on)
  (36864 = $9000)
- Screen origin (horizontal B): POKE 36864, PEEK(36864) AND 128 OR X
- Screen origin (vertical C): POKE 36865,X
- Columns D: POKE 36866, PEEK(36866) AND 128 OR X
- Rows E (value range 0–23, note source multiplies by 2): POKE 36867, PEEK(36867) AND 129 OR (X*2)
- Char size F: POKE 36867, PEEK(36867) AND 254  (8x8)
  POKE 36867, PEEK(36867) OR 1  (8x16)

## Screen memory, character memory, and color memory pointers
Screen memory pointer details (bits mapped across registers):
- Bits 4–6 of location 36869 ($9005) are bits 10–12 of the screen address.
- Bit 7 of location 36866 ($9002) is bit 9 of the screen address.
- The source gives the formula (decimal arithmetic):

  S = 4 * (PEEK(36866) AND 128) + 64 * (PEEK(36869) AND 112)

- Color memory base depends on bit 7 of 36866:
  If bit7 = 0 → color memory starts at 37888; if bit7 = 1 → starts at 38400.

  C = 37888 + 4 * (PEEK(36866) AND 128)

Character memory pointer (I): 36869 ($9005) low nibble encodes character table selection (values 0–15). The source lists the mapping of X → character memory base; see the table in Source Code.

Note: the source uses decimal POKE/PEEK addresses (36864–36879). These correspond to $9000–$900F.

## Sound system, frequency formula and registers
Sound controls are in the high registers. Key points from source:
- N,O,P,Q bits enable/disable voice 1 (bass), voice 2 (alto), voice 3 (soprano), and noise respectively.
- R,S,T,U are frequency registers for bass/alto/soprano/noise.
- Frequency formula (source):

      Frequency = Clock / (127 - X)

  Where X is 0..127; if X = 127 use X = -1 (special case).
- Clock values (from source) differ NTSC vs PAL and by register:

  - Reg 36874 ($900A): NTSC 3995, PAL 4329
  - Reg 36875 ($900B): NTSC 7990, PAL 8659
  - Reg 36876 ($900C): NTSC 15980, PAL 17320
  - Reg 36877 ($900D): NTSC 31960, PAL 34640

- Volume V: 0 (off) .. 15 (max). Use POKE 36878 to set: POKE 36878, PEEK(36878) AND 240 OR X (0–15)
- Auxiliary color W is in the upper nibble of the same register as volume; set via POKE 36878, PEEK(36878) AND 15 OR (16*X)
- Screen color X and reverse mode Y and border Z reside in 36879 ($900F) with masks described in source.

## Inputs: light pen and paddles
- Light pen X (J) latched dot horizontal; light pen Y (K) latched dot vertical.
- Paddle 1 & 2 (L, M) are digitized 8‑bit values, 0–255.

## Source Code
```text
[Register map (hex offsets shown as provided in original source)]

                 +------+-----------------------+----------+
                 | Loc  |   START VALUE-5K VIC  |   Bit    |
                 | Hex  |  Binary  |  Decimal   | Function |
                 +------+----------+------------+----------+
                 | 9000 | 00000101 |   5        | ABBBBBBB |
                 | 9001 | 00011001 |  25        | CCCCCCCC |
                 | 9002 | 10010110 | 150        | HDDDDDDD |
                 | 9003 | v0101110 |  46 or 176 | GEEEEEEF |
                 | 9004 | vvvvvvvv |   v        | GGGGGGGG |
                 | 9005 | 11110000 | 240        | HHHHIIII |
                 | 9006 | 00000000 |   0        | JJJJJJJJ |
                 | 9007 | 00000000 |   0        | KKKKKKKK |
                 | 9008 | 11111111 | 255        | LLLLLLLL |
                 | 9009 | 11111111 | 255        | MMMMMMMM |
                 | 900A | 00000000 |   0        | NRRRRRRR |
                 | 900B | 00000000 |   0        | OSSSSSSS |
                 | 900C | 00000000 |   0        | PTTTTTTT |
                 | 900D | 00000000 |   0        | QUUUUUUU |
                 | 900E | 00000000 |   0        | WWWWVVVV |
                 | 900F | 00011011 |  27        | XXXXYZZZ |
                 +------+----------+------------+----------+

Legend (from source):
 A Interlace enable    N Bass switch
 B Screen origin (H)   O Alto switch
 C Screen origin (V)   P Soprano switch
 D Number of columns   Q Noise switch
 E Number of rows      R Bass frequency
 F Char size (0=8x8, 1=8x16)  S Alto frequency
 G Raster value        T Soprano frequency
 H Screen memory loc   U Noise frequency
 I Char memory loc     V Sound volume
 J Light pen (H)       W Auxiliary color
 K Light pen (V)       X Screen color
 L Paddle 1            Y Reverse mode (0=on,1=off)*
 M Paddle 2            Z Border color
(*source labels reversed/normal wording; see register bits)

[Character memory pointer table (value X in low nibble of 36869/$9005)]

          +------+------+---------+--------------------------------+
          |  X   |    LOCATION    |           CONTENTS             |
          |Value | Hex  | Decimal |                                |
          +------+------+---------+--------------------------------+
          |  0   | 8000 |  32768  | Upper case normal characters   |
          |  1   | 8400 |  33792  | Upper case reversed characters |
          |  2   | 8800 |  34816  | Lower case normal characters   |
          |  3   | 8C00 |  35840  | Lower case reversed characters |
          |  4   | 9000 |  36864  | unavailable                    |
          |  5   | 9400 |  37888  | unavailable                    |
          |  6   | 9800 |  38912  | VIC chip-unavailable           |
          |  7   | 9C00 |  39936  | ROM-unavailable                |
          |  8   | 0000 |      0  | unavailable                    |
          |  9   | ---- |  -----  | unavailable                    |
          | 10   | ---- |  -----  | unavailable                    |
          | 11   | ---- |  -----  | unavailable                    |
          | 12   | 1000 |   4096  | RAM                            |
          | 13   | 1400 |   5120  | RAM                            |
          | 14   | 1800 |   6144  | RAM                            |
          | 15   | 1C00 |   7168  | RAM                            |
          +------+------+---------+--------------------------------+

[Sound frequency clock table from source — NTSC / PAL]

                +----------+----------------+----------------+
                | Register | NTSC (US TV's) | PAL (European) |
                +----------+----------------+----------------+
                |  36874   |      3995      |      4329      |
                |  36875   |      7990      |      8659      |
                |  36876   |     15980      |     17320      |
                |  36877   |     31960      |     34640      |
                +----------+----------------+----------------+

[Example POKE/PEEK usage from source (decimal addresses shown)]

To turn off interlace:
  POKE 36864, PEEK(36864) AND 127
To turn on interlace:
  POKE 36864, PEEK(36864) OR 128

To change horizontal origin:
  POKE 36864, PEEK(36864) AND 128 OR X

To change vertical origin:
  POKE 36865, X

To change number of columns:
  POKE 36866, PEEK(36866) AND 128 OR X

To change number of rows:
  POKE 36867, PEEK(36867) AND 129 OR (X*2)

To set character memory pointer (I):
  POKE 36869, PEEK(36869) AND 240 OR X

To enable/disable bass (voice 1, N):
  POKE 36874, PEEK(36874) OR 128  (on)
  POKE 36874, PEEK(36874) AND 127 (off)

To set bass frequency (R):
  POKE 36874, PEEK(36874) AND 128 OR X

To set volume (V) and auxiliary color (W):
  POKE 36878, PEEK(36878) AND 240 OR X    (volume 0–15)
  POKE 36878, PEEK(36878) AND 15 OR (16*X) (aux color 0–15)

To set screen color (X) and reverse/border (Y/Z):
  POKE 36879, PEEK(36879) AND 240 OR X    (screen color)
  POKE 36879, PEEK(36879) AND 247         (reverse on)
  POKE 36879, PEEK(36879) OR 8             (reverse off)
  POKE 36879, PEEK(36879) AND 248 OR X     (border color 0–7)

**[Note: Source may contain OCR artifacts on initial values and a 'v' prefix for $9003/$9004 start values; verify against hardware or other references if precise reset values are required.]**
```

## Key Registers
- $9000-$900F - 6560 VIC - Control registers: interlace, screen origin H/V, raster, columns, rows, char size, screen memory pointer, character memory pointer, light-pen X/Y, paddle A/B inputs, voice enables and frequency registers, noise, volume, auxiliary color, screen color, reverse mode, border color.