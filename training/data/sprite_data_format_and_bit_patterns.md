# C64 Sprite Shape Bytes — 24-dot lines (3 bytes per row), bit significance, examples, 63-byte cross sprite

**Summary:** This document details how Commodore 64 hardware sprites encode 24 horizontal pixels per scanline as three bytes (24 bits), including bit numbering and weights, example byte patterns with binary/decimal/hex values, and a complete 63‑byte (21 rows × 3 bytes) cross sprite layout. It also covers the sprite pointer table for referencing 63-byte sprite blocks and provides examples of multicolor sprite packing and doubled-width sprites.

**Sprite Byte Layout and Bit Significance (24 Pixels per Row)**

- Each hardware sprite row is 24 pixels wide and stored as 3 consecutive bytes:
  - **Byte0**: Left 8 pixels (columns 0–7)
  - **Byte1**: Middle 8 pixels (columns 8–15)
  - **Byte2**: Right 8 pixels (columns 16–23)
- Within each byte, bits map from MSB to LSB, corresponding to left to right in that 8-pixel segment:
  - Bit 7 = 128, Bit 6 = 64, Bit 5 = 32, Bit 4 = 16, Bit 3 = 8, Bit 2 = 4, Bit 1 = 2, Bit 0 = 1
  - Example: A byte value of `0b10000000` (bit 7 set) lights the leftmost pixel of that byte’s 8-pixel block.
- For the middle byte (Byte1), bit 7 corresponds to column 8 (leftmost of the middle block), and bit 0 corresponds to column 15 (rightmost of the middle block).
- A single sprite is 21 rows tall in the default size (24×21), so single-color sprites use 21 × 3 = 63 bytes.

**Practical Consequences:**

- To set a single pixel at absolute column X (0–23):
  - Compute the byte index: `byte_index = floor(X / 8)`
  - Determine the bit within that byte: `bit = 7 - (X % 8)`
- To set a contiguous run of pixels within a single byte, OR the corresponding bit weights together.
  - Example: To set 3 pixels starting at bit 5 → bits 5, 4, 3 → binary `00111000` = decimal 56 = `$38`.

**Common Byte Patterns (Binary / Decimal / Hex)**

- `%11111111` = 255 = `$FF`
- `%10000000` = 128 = `$80`
- `%01000000` = 64  = `$40`
- `%00100000` = 32  = `$20`
- `%00010000` = 16  = `$10`
- `%00001000` = 8   = `$08`
- `%00000100` = 4   = `$04`
- `%00000010` = 2   = `$02`
- `%00000001` = 1   = `$01`
- `%00111000` = 56  = `$38`  (three adjacent pixels in the left part of the byte’s 8-pixel block)
- `%00000000` = 0   = `$00`

**Examples (Byte-Level Meaning):**

- `0xFF, 0xFF, 0xFF` = Full 24 pixels on for that row
- `0x00, 0x38, 0x00` = Only 3 middle pixels set (columns 10–12) — used as a vertical bar 3 pixels wide centered in the middle 8-pixel block
- To set pixel column 14 (0‑based):
  - Compute: `byte = floor(14/8) = 1` (middle byte), `bit index = 7 - (14 % 8) = 7 - 6 = 1` → set bit 1 (value 2) → middle byte OR=2.

**Building Multi-Line Sprites**

- Construct sprite rows as 3-byte groups, one group per vertical row. Concatenate rows in top-to-bottom order to form the 63-byte block.
- Use ASCII-visual rows when designing: map each byte to 8 characters where `#` = pixel on, `.` = pixel off, then join 3 blocks to a 24-character row for quick visual checks.

**Typical Workflow:**

1. Sketch a 24×21 pixel drawing.
2. For each row, split into three 8-pixel sections.
3. For each 8-pixel section, form the 8-bit binary (bit 7..bit 0) and convert to hex/decimal for the sprite data array.
4. Store the 63 bytes in memory (sprite data area) and point the VIC sprite pointer to it.

**Example: 24×21 Cross Sprite (63 Bytes)**

**Design:** A vertical 3-pixel-wide bar centered in the middle block and a 3-pixel-tall horizontal band crossing the full width at the middle rows.

- **Rows 0–8:** Vertical bar only.
- **Rows 9–11:** Full-width horizontal band.
- **Rows 12–20:** Vertical bar only.

**Visual Rows (24 Columns Each):**

- Vertical-only row pattern: `"........" + "..###..." + "........"` = `"..........###........"`
- Horizontal band row: 24 `#` characters

**Full 21-Row ASCII Drawing (Top to Bottom):**

**Corresponding Per-Row Byte Triples (Binary / Decimal / Hex):**

Binary shown as b7..b0 for each byte (left, middle, right):
