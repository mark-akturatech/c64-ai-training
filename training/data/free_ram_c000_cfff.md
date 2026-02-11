# 4K Free RAM: $C000-$CFFF (49152–53247)

**Summary:** $C000-$CFFF (49152–53247) is a 4K free RAM area not contiguous with BASIC program/variable space and therefore not counted in FRE(0). Common uses include machine-language subroutines, alternate I/O drivers, character graphics and sprite data; beware address collisions with system additions (e.g., Universal Wedge at $CC00, Simon's BASIC).

## Description
Addresses 49152–53247 ($C000–$CFFF) are a 4K block of RAM available to the programmer. Because this block is not contiguous with the BASIC program text/variable area, it is not included in BASIC's free memory total (FRE(0)) and therefore is not usable by BASIC for program or variable storage.

Typical uses:
- Storing machine-language subroutines to be called from BASIC (USING SYS).
- Alternate I/O drivers for parallel ports or IEEE/DOS devices.
- Character graphics sets or sprite data (custom character/sprite bitmaps).
- Any other system additions that require resident RAM.

Warnings and caveats:
- This area is a popular place for resident utilities and cartridges to place code/data. Multiple utilities may compete for the same addresses.
- Example: the Universal Wedge DOS Support is commonly loaded at 52224 ($CC00). Loading code that uses $CC00 will overwrite that DOS support code and can prevent both programs from functioning correctly.
- Simon's BASIC (cartridge) also occupies several locations in this range.
- When developing or adding hardware/software that places code in $C000–$CFFF, check for common resident programs and avoid collisions.

## Key Registers
- $C000-$CFFF - RAM - 4K free RAM area; not contiguous with BASIC program area and not counted in FRE(0). Typical uses: machine code, alternate I/O drivers, character/sprite data.

## References
- "io_memory_map_and_vicii_intro" — expands on nearby I/O and ROM areas and cautions when banking or using I/O/RAM.
- "floating_point_arithmetic_and_constants" — notes that some FP/KERNAL code is split across ROM areas (related memory-layout awareness).
