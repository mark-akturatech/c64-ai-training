# CIA #2 Port A — VIC-II 16K Bank Select

**Summary:** CIA #2 Port A ($DD00) bits 0–1 select which 16K memory bank the VIC-II ($D000 range chip) uses for all graphics data (sprite data, character data, screen text/bitmap). Includes VIC-II 16K limitation, sprite/character/screen block sizes, and bank-selection mapping.

**VIC-II 16K Bank Selection and Implications**

Bits 0 and 1 of CIA #2 Port A control the VIC-II's 16K video-memory window. The VIC-II can only address one contiguous 16K block at a time; all graphics resources the VIC-II displays (sprites, character sets, screen memory, bitmaps) must reside within that active 16K.

Key resource sizes within the 16K window:

- Sprite graphics: 256 groups of 64 bytes each (sprite data groups).
- Character (PETSCII/charset) data: eight 2K blocks available within the 16K.
- Text screen memory: sixteen 1K areas available within the 16K.
- Bitmap screen memory: two 8K sections available within the 16K.

At power-up, the VIC-II defaults to the lowermost 16K (Bank 0, $0000–$3FFF). That area is commonly used by other essential software/data, producing conflicts for graphics storage; changing the CIA #2 Port A bank bits allows relocating the VIC-II window to avoid such conflicts.

The following table summarizes the bank selection:

| Bits (Port A, CIA #2) | Selected 16K Bank | Address Range  | Character ROM Availability |
|-----------------------|-------------------|----------------|----------------------------|
| 00                    | Bank 3            | $C000–$FFFF    | No                         |
| 01                    | Bank 2            | $8000–$BFFF    | Yes, at $9000–$9FFF        |
| 10                    | Bank 1            | $4000–$7FFF    | No                         |
| 11                    | Bank 0            | $0000–$3FFF    | Yes, at $1000–$1FFF        |

*Note: The Character ROM is accessible to the VIC-II only in Banks 0 and 2.*

**Changing VIC-II Bank from BASIC**

To change the VIC-II's 16K bank from BASIC, you need to configure the data direction and data registers of CIA #2. The following steps outline the procedure:

1. **Set Bits 0 and 1 of Port A as Outputs:**

   Ensure that bits 0 and 1 of the data direction register ($DD02) are set as outputs. This can be done by setting these bits to 1.


   This operation sets bits 0 and 1 of the data direction register to 1, configuring them as outputs.

2. **Select the Desired VIC-II Bank:**

   Write the appropriate value to the data register ($DD00) to select the desired 16K bank. The value to POKE is determined by the bank number:

   | Bank Number | Value to POKE |
   |-------------|---------------|
   | 0           | 3             |
   | 1           | 2             |
   | 2           | 1             |
   | 3           | 0             |

   For example, to select Bank 2:


   This operation clears bits 0 and 1 of the data register and sets them to the value corresponding to Bank 2.

*Note: After changing the VIC-II bank, you may need to update system pointers, such as the screen memory location, to reflect the new bank configuration.*

**Detailed Per-Bank Contents and Usage Considerations**

Each 16K bank has specific characteristics and considerations:

- **Bank 0 ($0000–$3FFF):**

  - Contains system variables and BASIC program text.
  - Default screen memory is located at $0400–$07FF.
  - Character ROM is visible to the VIC-II at $1000–$1FFF.
  - Limited free space for graphics data due to system usage.

- **Bank 1 ($4000–$7FFF):**

  - No Character ROM available to the VIC-II.
  - More contiguous free RAM available for graphics data.
  - Suitable for custom character sets and sprite data.

- **Bank 2 ($8000–$BFFF):**

  - Character ROM is visible to the VIC-II at $9000–$9FFF.
  - Contains free RAM suitable for graphics data.
  - Often used for graphics-intensive applications.

- **Bank 3 ($C000–$FFFF):**

  - No Character ROM available to the VIC-II.
  - Upper portion overlaps with I/O registers and KERNAL ROM.
  - Limited usable RAM for graphics data.

*Note: When selecting a bank for graphics data, consider the availability of the Character ROM and the amount of free RAM to avoid conflicts with system resources.*

## Source Code

   ```basic
   POKE 56578, PEEK(56578) OR 3
   ```

   ```basic
   POKE 56576, (PEEK(56576) AND 252) OR 1
   ```


## Key Registers

- $DD00 - CIA 2 - Port A (VIC-II 16K bank select: bits 0-1)
- $DD02 - CIA 2 - Data Direction Register A

## References

- Commodore 64 Programmer's Reference Guide: Programming Graphics - Overview
- VIC bank - C64-Wiki
- VIC-II graphics, accessing ROM font images from different banks (C64) | Retro64