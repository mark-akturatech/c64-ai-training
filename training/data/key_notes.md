# C64 Memory Map — Bank Switching, VIC Bank Selection, Defaults

**Summary:** Describes processor port $0001 bank-switching (BASIC $A000-$BFFF, KERNAL $E000-$FFFF, Character ROM $D000-$D7FF, I/O $D000-$DFFF), VIC-II 16KB bank selection via CIA#2 Port A bits 0-1 ($DD00), and common defaults: BASIC at $0801, screen RAM $0400, color RAM $D800.

## Bank Switching
The CPU processor port at $0001 controls which system ROMs and the I/O area are visible in the CPU address space. Using $0001 you can enable/disable:
- BASIC ROM at $A000-$BFFF
- KERNAL ROM at $E000-$FFFF
- Character ROM (text) at $D000-$D7FF (overlaying the $D000-$DFFF I/O region when visible)
- The I/O area at $D000-$DFFF (VIC-II, SID, CIAs, etc.)

This mapping is the primary mechanism for switching between RAM and ROM/I/O regions for CPU accesses.

## VIC Bank Selection
The VIC-II's 16KB video bank is selected independently of $0001. CIA#2 Port A (bits 0–1) selects which 16KB bank the VIC-II uses for character and screen data, allowing the video chip to access different 16KB-aligned areas of the 64KB RAM for graphics (bank selection controlled through $DD00 port A bits 0–1).

## Default Configuration
Common factory/default memory layout and visibility:
- BASIC program start: $0801
- Screen memory (default): $0400
- Color RAM: $D800
- BASIC and KERNAL ROMs visible by default; I/O area active (so device registers at $D000-$DFFF respond)

These defaults are the standard C64 runtime layout unless altered by cartridges, custom initialization, or explicit bank-switching.

## Key Registers
- $0001 - Processor port (zero page) - controls visibility of BASIC ROM ($A000-$BFFF), KERNAL ROM ($E000-$FFFF), Character ROM ($D000-$D7FF), and I/O area ($D000-$DFFF)
- $DD00 - CIA#2 - Port A - VIC-II 16KB bank select (bits 0-1)
- $D800 - Color RAM - screen color bytes (one byte per character cell)
- $0400 - Screen RAM base - default text screen memory
- $0801 - Default BASIC program start address
- $A000-$BFFF - BASIC ROM range
- $E000-$FFFF - KERNAL ROM range
- $D000-$DFFF - I/O area / VIC/SID/CIA registers and Character ROM overlay region

## References
- "zero_page_processor_port_and_defaults" — expands on processor port $0001 functions
- "vic_bank_selection" — expands on VIC-II bank selection (CIA#2 Port A bits)
- "basic_program_area_and_cartridge_space" — expands on default BASIC layout and cartridge area