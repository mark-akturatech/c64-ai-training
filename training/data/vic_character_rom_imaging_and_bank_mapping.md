# VIC-II view of Character ROM (D000-DFFF mapped into VIC-II image space $1000-$1FFF or $9000-$9FFF)

**Summary:** Explains how the C64 character ROM at $D000-$DFFF is seen by the VIC-II as image data in the video-bank area ($1000-$1FFF when bank 0, $9000-$9FFF when bank 2). Includes block map showing the 512‑byte character ROM blocks and their VIC-II image addresses and contents (upper/lower case, graphics, reversed variants).

**How the VIC-II "sees" character ROM**

The ROM that contains PETSCII/charset bitmaps physically resides in the ROM area $D000–$DFFF (4 KB). The VIC-II does not use the CPU's linear physical view directly; instead, it fetches character bitmap data from the currently selected video bank window. When the system video bank is bank 0, the VIC-II image view of the character ROM appears at $1000–$1FFF; when the video bank is bank 2, the same VIC-II image addresses appear at $9000–$9FFF. Each ROM "block" is 0x200 bytes (512 bytes), which holds 64 character bitmaps (8 bytes per character).

Practical consequences:

- Programs that want to copy or examine the character ROM must switch the CPU's memory mapping (or use the CIAs/PLA tricks) so the ROM becomes visible in the CPU address space, or let the VIC-II access it via its video bank view and use CPU->VIC transfers.
- The logical ordering of character sets (upper/lower/graphics and their reversed variants) is in 512‑byte blocks; the VIC-II indexes into these blocks when rendering character graphics.

**Switching CPU/VIC Bank Mapping**

To access the character ROM at $D000–$DFFF, the CPU must adjust the memory configuration to map the ROM into the address space. This involves manipulating the memory control register at $01.

The memory control register at $01 controls the memory configuration of the C64. To map the character ROM into the CPU address space, you need to clear the CHAREN bit (bit 2) and set the HIRAM and LORAM bits (bits 1 and 0). This configuration disables the I/O area and enables the character ROM.

Here's how you can achieve this in assembly language:


After executing this code, the character ROM will be mapped into the CPU address space at $D000–$DFFF. Remember to restore the original memory configuration after accessing the ROM to re-enable I/O operations.

**Character ROM Block Map**

The character ROM is organized into 8 blocks, each 512 bytes in size, corresponding to 64 characters (8 bytes per character). The following table outlines the memory layout:

## Source Code

```assembly
sei             ; Disable interrupts
lda $01         ; Load current value of memory control register
and #%11111100  ; Clear CHAREN (bit 2)
ora #%00000011  ; Set HIRAM and LORAM (bits 1 and 0)
sta $01         ; Store new value back to memory control register
cli             ; Enable interrupts
```

```text
+-----+-------------------+-----------+---------------------------------+
|     |       ADDRESS     |   VIC-II  |                                 |
|BLOCK+-------+-----------+   IMAGE   |            CONTENTS             |
|     |DECIMAL|    HEX    |           |                                 |
+-----+-------+-----------+-----------+---------------------------------+
|  0  | 53248 | D000-D1FF | 1000-11FF | Upper case characters           |
|     | 53760 | D200-D3FF | 1200-13FF | Graphics characters             |
|     | 54272 | D400-D5FF | 1400-15FF | Reversed upper case characters  |
|     | 54784 | D600-D7FF | 1600-17FF | Reversed graphics characters    |
|     |       |           |           |                                 |
|  1  | 55296 | D800-D9FF | 1800-19FF | Lower case characters           |
|     | 55808 | DA00-DBFF | 1A00-1BFF | Upper case & graphics characters|
|     | 56320 | DC00-DDFF | 1C00-1DFF | Reversed lower case characters  |
|     | 56832 | DE00-DFFF | 1E00-1FFF | Reversed upper case &           |
|     |       |           |           | graphics characters             |
+-----+-------+-----------+-----------+---------------------------------+

Notes:
- Each listed ROM range is 0x200 bytes (512 bytes) → 64 characters of 8 bytes each.
- VIC-II "image" addresses above are the addresses the VIC-II uses inside the selected video bank:
  - Video bank 0: VIC image $1000–$1FFF corresponds to ROM $D000–$DFFF
  - Video bank 2: VIC image $9000–$9FFF corresponds to ROM $D000–$DFFF
```



## Key Registers

- **$D000–$DFFF**: Character ROM (MOS 4KB charset ROM) – physical ROM area containing 8 blocks (512 bytes each) of character bitmaps.
- **$1000–$1FFF**: VIC-II image area when video bank = 0 – VIC-II sees character ROM mapped here in bank 0.
- **$9000–$9FFF**: VIC-II image area when video bank = 2 – VIC-II sees character ROM mapped here in bank 2.

## References

- "switching_io_and_interrupts_for_copying_char_rom" — expands on how to access/copy the character ROM (bank switching, IO tricks).
- "character_definitions_storage_and_ROM_locations" — expands on where characters are stored and how they are structured.

## Labels
- CHAREN
- HIRAM
- LORAM
