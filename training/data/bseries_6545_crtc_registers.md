# B-Series 6545 CRT Controller (CRTC) registers — $D800/$D801 two-register interface

**Summary:** B-series 6545 (CRTC) registers accessed via a two-register port at $D800 (index) / $D801 (data). Covers register indices 0–17 (horizontal totals/positions, sync widths, vertical totals/positions, mode, scan lines, cursor start/end, display/cursor/light-pen addresses) and the typical values observed on a B-128.

**Description**
This CRTC is exposed as a two-register interface at $D800/$D801: write the register index to $D800, then read/write the selected register via $D801 (standard two-register access). The documented register map uses indices 0–17 and configures horizontal timing (total chars, displayed chars, sync position/width), vertical timing (total, adjustment, displayed, sync position), mode/scan lines, cursor start/end and the high/low bytes of display, cursor and light-pen addresses.

Behavior notes taken from the source:
- Most registers are write-only.
- Registers 14/15 (cursor address high/low) are read/write.
- Registers 16/17 (light-pen high/low) are read-only.
- Registers 10 (cursor start), 14 and 15 change dynamically as the cursor moves.
- Typical numeric values vary by system (B-128 example values are given).

The source also records the contents for link/vector addresses at $0280–$0295 (taken from a recent B-128), but those values are shown separately in the reference table below.

## Source Code
```text
B-Series 6545 CRT Controller
(two-register interface at $D800/$D801)
(register index -> meaning -> typical value (decimal))

Index | Register Name                  | Typical Value
------+--------------------------------+-------------------
  0   | Horizontal Total               | 108 or 126 or 127
  1   | Horizontal Chars Displayed     | 80
  2   | Horizontal Sync Position       | 83 or 98 or 96
  3   | V Sync Width | H Sync Width    | 15 or 10
  4   | Vertical Total                 | 25 or 31 or 38
  5   | Vertical Total Adjustment      | 3 or 6 or 1
  6   | Vertical Displayed             | 25
  7   | Vertical Sync Position         | 25 or 28 or 30
  8   | Mode                           | 0
  9   | Scan Lines                     | 13 or 7
 10   | Cursor Start                   | 96 (blink) or 0 or 6 (underline)
 11   | Cursor End                     | 13 or 7
 12   | Display Address (High)         | 0
 13   | Display Address (Low)          | 0
 14   | Cursor Address (High)          | Varies
 15   | Cursor Address (Low)           | Varies
 16   | Light Pen In (High)            | 0
 17   | Light Pen In (Low)             | 0

Notes:
- Most registers are write-only.
- 14/15 are read/write; 16/17 are read-only.
- Registers 10, 14, and 15 change as the cursor moves.

Additional: The above table shows contents for the link and vector addresses at $0280 to $0295; these are taken from a recent B-128.
(Figure C.14 referenced in original source.)

Bit-field definitions:

- **Mode Register (Index 8):**
  - Bit 7: Interlace Enable (0 = Non-interlaced, 1 = Interlaced)
  - Bit 6: Video Enable (0 = Video disabled, 1 = Video enabled)
  - Bit 5: Cursor Enable (0 = Cursor disabled, 1 = Cursor enabled)
  - Bits 4–0: Reserved

- **Scan Lines Register (Index 9):**
  - Bits 7–6: Reserved
  - Bits 5–0: Scan lines per character row (0–63)

- **Cursor Start Register (Index 10):**
  - Bits 7–6: Cursor Blink Rate
    - 00: Blink disabled
    - 01: Blink at slow rate
    - 10: Blink at fast rate
    - 11: Reserved
  - Bit 5: Cursor Enable (0 = Disabled, 1 = Enabled)
  - Bits 4–0: Cursor Start Line (0–31)

- **Cursor End Register (Index 11):**
  - Bits 7–5: Reserved
  - Bits 4–0: Cursor End Line (0–31)

Timing diagrams:

- **Horizontal Timing:**

  ```
  |<--- Horizontal Total --->|
  |<-- Displayed Chars -->|<-- Horizontal Sync Width -->|
  |                       |<-- Horizontal Sync Position -->|
  ```

- **Vertical Timing:**

  ```
  |<--- Vertical Total --->|
  |<-- Displayed Rows -->|<-- Vertical Sync Width -->|
  |                      |<-- Vertical Sync Position -->|
  ```

Register access side-effects:

- Writing to registers 10 (Cursor Start), 14 (Cursor Address High), and 15 (Cursor Address Low) can dynamically change the cursor's appearance and position.
- Reading from registers 16 and 17 provides the current light pen position, if a light pen is connected.
```

## References
- "bseries_memory_map_high_and_io" — expands on screen RAM and video controller addresses
- MOS Technology 6545 CRTC Datasheet: [https://www.zimmers.net/anonftp/pub/cbm/documents/chipdata/6545/index.html](https://www.zimmers.net/anonftp/pub/cbm/documents/chipdata/6545/index.html)