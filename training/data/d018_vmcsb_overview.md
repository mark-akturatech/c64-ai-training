# $D018 — VIC-II Memory Control (VMCSB)

**Summary:** Register $D018 (decimal 53272) — VIC-II VMCSB — selects offsets for the video matrix (screen RAM), character dot-data (charset), and bitmap base within the currently selected 16 KB VIC bank; uses bit fields to encode offsets (video matrix bits 7–4, charset bits 3–1, bitmap base flag bit 3).

**Overview**

Register $D018 (decimal 53272), commonly called VMCSB (Video Matrix/Character Set Base), determines where three important VIC-II memory regions reside relative to the start of the currently selected 16 KB VIC bank:

- **Video Matrix (screen RAM) base** — selectable by an offset field (bits 7–4).
- **Character dot-data (charset) base** — selectable by an offset field (bits 3–1).
- **Bitmap mode base** — selected via a bitmap base bit (bit 3) when bitmap mode is used.

All offsets/fields in $D018 are interpreted relative to the start address of the active VIC 16 KB bank (the bank selection itself is configured elsewhere). Changing $D018 rearranges where the VIC-II fetches screen bytes, glyph bitmaps, and bitmap data within that 16 KB window.

**Bit-Level Layout and Default Register Value**

The $D018 register is structured as follows:

- **Bits 7–4 (VM13–VM10):** Video Matrix (screen RAM) base address offset.
- **Bits 3–1 (CB13–CB11):** Character Base (charset) address offset.
- **Bit 0:** Unused.

At power-on, the default value of $D018 is $14 (binary %00010100), which corresponds to:

- **Video Matrix Base:** Offset of $0400 (1 KB) from the start of the VIC bank.
- **Character Base:** Offset of $1000 (4 KB) from the start of the VIC bank.

**Lookup Tables for Bit-Field Values**

### Video Matrix (Screen RAM) Offsets (Bits 7–4)

The 4-bit value in bits 7–4 determines the offset for the screen RAM:

| Bits 7–4 | Offset (Decimal) | Offset (Hex) | Absolute Address (Assuming VIC Bank at $0000) |
|----------|------------------|--------------|-----------------------------------------------|
| 0000     | 0                | $0000        | $0000                                         |
| 0001     | 1024             | $0400        | $0400                                         |
| 0010     | 2048             | $0800        | $0800                                         |
| 0011     | 3072             | $0C00        | $0C00                                         |
| 0100     | 4096             | $1000        | $1000                                         |
| 0101     | 5120             | $1400        | $1400                                         |
| 0110     | 6144             | $1800        | $1800                                         |
| 0111     | 7168             | $1C00        | $1C00                                         |
| 1000     | 8192             | $2000        | $2000                                         |
| 1001     | 9216             | $2400        | $2400                                         |
| 1010     | 10240            | $2800        | $2800                                         |
| 1011     | 11264            | $2C00        | $2C00                                         |
| 1100     | 12288            | $3000        | $3000                                         |
| 1101     | 13312            | $3400        | $3400                                         |
| 1110     | 14336            | $3800        | $3800                                         |
| 1111     | 15360            | $3C00        | $3C00                                         |

### Character Set (Charset) Offsets (Bits 3–1)

The 3-bit value in bits 3–1 determines the offset for the character set:

| Bits 3–1 | Offset (Decimal) | Offset (Hex) | Absolute Address (Assuming VIC Bank at $0000) |
|----------|------------------|--------------|-----------------------------------------------|
| 000      | 0                | $0000        | $0000                                         |
| 001      | 2048             | $0800        | $0800                                         |
| 010      | 4096             | $1000        | $1000                                         |
| 011      | 6144             | $1800        | $1800                                         |
| 100      | 8192             | $2000        | $2000                                         |
| 101      | 10240            | $2800        | $2800                                         |
| 110      | 12288            | $3000        | $3000                                         |
| 111      | 14336            | $3800        | $3800                                         |

**Note:** In VIC banks 0 and 2, offsets $1000 and $1800 correspond to the Character ROM, making the default character set available at these locations.

**Interaction Between Bitmap Flag (Bit 3) and Base Selection in Bitmap Mode**

In bitmap mode, the VIC-II uses bit 3 of $D018 to select the base address for bitmap data:

- **Bit 3 = 0:** Bitmap data starts at offset $0000 within the VIC bank.
- **Bit 3 = 1:** Bitmap data starts at offset $2000 within the VIC bank.

This selection allows for two possible locations for bitmap data within each 16 KB VIC bank.

**Examples of Typical $D018 Values and Resulting Addresses**

Assuming the VIC bank is set to start at $0000:

- **$D018 = $14 (Default):**
  - **Video Matrix Base:** $0400
  - **Character Base:** $1000 (Character ROM in banks 0 and 2)

- **$D018 = $16:**
  - **Video Matrix Base:** $0400
  - **Character Base:** $1800 (Character ROM in banks 0 and 2)

- **$D018 = $1A:**
  - **Video Matrix Base:** $0400
  - **Character Base:** $2800

- **$D018 = $F8:**
  - **Video Matrix Base:** $3C00
  - **Character Base:** $0000

These examples illustrate how different $D018 values configure the VIC-II's memory pointers within the selected VIC bank.

## Key Registers

- **$D018 - VIC-II - VMCSB (Video Matrix / Character Set Base):** Selects video matrix, charset, and bitmap base offsets relative to the currently selected 16 KB VIC bank.

## References

- "d018_bit_layout_and_defaults" — expands on each bit's meaning and default/reset value
- "screen_memory_offsets" — lookup table and examples for bits 7–4 (video matrix offsets)
- "character_memory_offsets" — lookup table and examples for bits 3–1 (charset offsets)
- "bitmap_mode_base" — explains bitmap base selection and interactions with bit 3

## Labels
- VMCSB
