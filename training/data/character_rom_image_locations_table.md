# VIC-II Character ROM Imaging and Bank Selection (Commodore 64)

**Summary:** Describes how the VIC-II accesses the character generator ROM ($D000–$DFFF) remapped into its 16K window (appearing at $1000–$1FFF in bank 0 and $9000–$9FFF in bank 2), and how bank-select bits (banks 0–3) control whether these ROM image patterns are visible to the VIC-II.

**Overview**

The character generator ROM (character set) physically resides at $D000–$DFFF (decimal 53248–57343). The VIC-II can only access a single 16K memory bank (a 16K window) at a time. To present character patterns to the VIC-II, the system "images" the character ROM into the 16K block the VIC-II is currently using:

- When the VIC-II uses bank 0, the character ROM is presented to the VIC-II as if it were at $1000–$1FFF (decimal 4096–8191).
- When the VIC-II uses bank 2, the character ROM is presented to the VIC-II as if it were at $9000–$9FFF (decimal 36864–40959).

This imaging is only how the VIC-II sees character data; the character ROM remains physically at $D000–$DFFF for the system. The imaged ROM bytes can be treated like RAM by programs that expect character data in the VIC-II-visible area (for example, when VIC-II fetches character bitmaps).

**Behavior and Implications**

- The ROM image is applied only to character pattern fetches as seen by the VIC-II. Other CPU-visible memory (when the CPU accesses $D000–$DFFF) depends on the current CPU bank/I/O mapping.
- Because the VIC-II only sees 16K at a time, the character ROM patterns appear only when the VIC-II's chosen 16K block covers the imaged range.
- If the ROM image interferes with your graphics or data usage in those VIC-II-visible ranges, change the bank-select bits to a bank that does not present the character ROM images to the VIC-II (banks 1 or 3). In banks 1 and 3, the ROM patterns will not appear in the VIC-II-visible 16K block.
- Note: This mapping is an imaging convenience for the VIC-II; it does not mean the character ROM is duplicated in RAM — it is the VIC-II's view that is remapped.

**Character Set Location and Contents**

The character set consists of 256 characters, each defined by an 8×8 pixel grid, requiring 8 bytes per character. This totals 2048 bytes (2 KB) for the entire set. The character ROM contains two sets:

- **Character Set 1 (Uppercase/Graphics):** Located at $D000–$D7FF.
- **Character Set 2 (Uppercase/Lowercase):** Located at $D800–$DFFF.

Each character's bitmap is stored sequentially in memory. For example, the '@' character (character code 0) is defined by the first 8 bytes at $D000–$D007. The next character, 'A' (character code 1), follows immediately at $D008–$D00F, and so on. This pattern continues for all 256 characters.

To switch between the two character sets, you can modify the VIC-II's control register at $D018. Setting bits 1–3 of this register selects the character set offset within the current VIC-II bank. For instance, to select Character Set 2 in bank 0, you would set these bits to point to the appropriate 2 KB block.

**Bank Selection and Programming**

The VIC-II's 16K memory bank is selected using bits 0 and 1 of Port A in CIA #2 (located at $DD00). These bits determine which 16K bank the VIC-II accesses:

- **Bank 0:** Bits 0 and 1 set to 1 and 1 (binary 11).
- **Bank 1:** Bits 0 and 1 set to 1 and 0 (binary 10).
- **Bank 2:** Bits 0 and 1 set to 0 and 1 (binary 01).
- **Bank 3:** Bits 0 and 1 set to 0 and 0 (binary 00).

To change the VIC-II bank, you must first set these bits as outputs by configuring the data direction register at $DD02. Here's how you can do this in BASIC:


Replace 'A' with the desired bank value (0 to 3) according to the table above. For example, to select bank 2:


This configuration allows the VIC-II to access the desired 16K memory bank, enabling or disabling the visibility of the character ROM as needed.

## Source Code

```basic
POKE 56578, PEEK(56578) OR 3  : REM Set bits 0 and 1 of $DD02 to outputs
POKE 56576, (PEEK(56576) AND 252) OR A  : REM Set bits 0 and 1 of $DD00 to select bank
```

```basic
POKE 56578, PEEK(56578) OR 3
POKE 56576, (PEEK(56576) AND 252) OR 1
```


## Key Registers

- **$D000–$DFFF:** Character ROM / VIC-II image region (physical character generator ROM location; imaged into VIC-II 16K window).
- **$D000–$D02E:** VIC-II control registers (VIC-II registers reside in this $D000 range when I/O is visible).
- **$DD00:** CIA #2 Port A data register (controls VIC-II bank selection).
- **$DD02:** CIA #2 Port A data direction register (configures bits 0 and 1 as outputs for bank selection).

## References

- "character_memory_overview" — expands on character memory selection and ROM imaging.
- "VIC bank - C64-Wiki" — details on VIC-II bank selection and character ROM imaging.
- "VIC-II graphics, accessing ROM font images from different banks (C64) | Retro64" — discusses accessing ROM font images from different banks.
- "C64 Programmer's Reference Guide: Programming Graphics - Overview" — provides information on video bank selection and character memory.