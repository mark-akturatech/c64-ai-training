# C64 RAM Map — $02A7-$02FF (Unused RAM area)

**Summary:** $02A7-$02FF is an unused RAM region on the Commodore 64, available for machine language subroutines or graphics data. This area is particularly useful for sprite or character data when the VIC-II is configured to use the bottom 16K of memory (default setting). Specifically, decimal locations 704–767 within this range can be utilized for sprite data block number 11 without interfering with BASIC program text or variables.

**Description**
The memory range $02A7-$02FF (decimal 679–767) is an unused area of RAM that programmers can use for machine language subroutines or for storing graphics data. When the VIC-II video chip is set to use the bottom 16K of memory for screen and character data—which is the default configuration upon power-up—this block is one of the few free areas that will not conflict with BASIC program text or variable storage.

Notably, decimal locations 704–767 within this range correspond to sprite data block number 11. Utilizing this block for sprite data ensures that it does not interfere with BASIC program text or variables. Each sprite requires 64 bytes of memory, and the sprite pointers, located at decimal addresses 2040–2047 ($07F8–$07FF), determine the memory location of each sprite's data. By setting the sprite pointer for sprite 11 to point to this memory block, programmers can effectively manage sprite data without disrupting other memory usage.

## References
- "tbuffr_cassette_buffer" — expands on other small free areas (cassette buffer) that can be used for graphics
- Commodore 64 Programmer's Reference Guide: Programming Graphics - Sprites
- Commodore 64 memory map
