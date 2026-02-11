# VIC-II Memory Control: Video Matrix Base & Character Dot-Data Base ($D018) and Border/Background Colors ($D020, $D021)

**Summary:** VIC-II Memory Control Register $D018 (53272) contains the nybbles that select the Video Matrix base address (which RAM area is displayed) and the Character Dot-Data base address (where the 8x8 character bitmaps are fetched). Border Color ($D020 / 53280) and Background Color Register 0 ($D021 / 53281) determine the screen frame color and the common text-background color respectively; the Character Generator ROM is at $C000 (49152).

## Video Matrix and Character Dot-Data
The area of RAM shown as the text/graphics screen is chosen by the Video Matrix Base Address nybble in the VIC-II Memory Control Register ($D018). The complementary nybble in $D018 selects the base address used to fetch character dot-data (the 8×8 matrix of lit/unlit dots that defines each character’s shape).

Character shapes come from the on-board Character Generator ROM at $C000 (49152) by default; the VIC-II supports two ROM character sets, and users can instead point $D018 at a RAM location to supply a custom character set. Text-mode characters generally share a single background color (Background Color Register 0, $D021) while the screen border color is set separately (Border Color Register, $D020).

## Key Registers
- $D018 - VIC-II - Memory Control Register: Video Matrix base nybble (screen RAM) and Character Dot-Data base nybble (character bitmap base)
- $D020 - VIC-II - Border Color Register (screen frame color)
- $D021 - VIC-II - Background Color Register 0 (common text/background color)

## References
- "vicii_chip_overview" — VIC-II general overview
- "vmcsb_vic_memory_control_register" — detailed control of video matrix and character base addresses ($D018)
- "border_and_background_color_registers" — Border ($D020) and Background ($D021) register details

## Labels
- VMCSB
- BORDER
- BGCOL0
