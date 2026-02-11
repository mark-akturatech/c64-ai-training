# MOS 6566/6567 (VIC-II) — Overview (Appendix header)

**Summary:** The MOS 6566/6567 (VIC‑II) is a multi-purpose color video controller featuring 47 control registers accessible via the standard 8-bit 65XX microprocessor bus. It can address up to 16 KB of memory for display information. Various operating modes, including character and bitmap modes, as well as addressing options, are detailed in the following sections.

**Description**

The 6566/6567 are versatile color video controller devices designed for computer video terminals and video game applications. Each device provides 47 control registers (see Key Registers) accessible over a standard 8-bit microprocessor bus (65XX). The VIC‑II can address up to 16 KB of memory for display information, encompassing the video matrix, character/bitmap data, and related tables. Various operating modes and their options, such as character display mode, bitmap mode, and display base addressing, are elaborated upon in the subsequent sections of the appendix.

## Key Registers

- $D000–$D02E — VIC-II control registers (47 registers in total)

## References

- "character_display_mode_and_addressing" — expands on Character display mode, video matrix, and character base addressing
- "bitmap_mode_and_display_base_addressing" — expands on Bitmap mode and display base addressing
