# C64 VIC-II Memory Block 1 ($4000-$7FFF / 16384-32767)

**Summary:** VIC-II bank/block 1 ($4000-$7FFF) is normally used for BASIC program storage; when selected the VIC-II cannot see the character generator ROM ($D000-$DFFF), making this 16K block available for sprite shapes, character graphics, and bitmap data provided BASIC top-of-memory is lowered. Memory configuration is controlled via location 1 ($0001); character ROM can be temporarily switched in and copied to RAM if needed.

## Block 1 (VIC-II bank)
Block 1 refers to the 16KB region from decimal 16384 to 32767 (hex $4000-$7FFF). By default this area holds BASIC program text and variables, but when the VIC-II is set to use Block 1 the character generator ROM is not visible to the video chip. This means the full block is usable for:
- sprite shapes,
- custom character sets,
- bitmap screens.

Requirements and caveats:
- You must lower BASIC's top-of-memory so BASIC program/data does not overlap the area you intend to use; usable BASIC program space may be reduced (as little as ~14K) when Block 1 is chosen.
- The character ROM ($D000-$DFFF) is unavailable to the VIC-II while Block 1 is active. If you need ROM characters on-screen you must switch the ROM back in (via the CPU port at $0001 or equivalent) and copy characters into RAM before switching Block 1 back, or otherwise provide character data in RAM.
- Block 1 can be a useful alternative to avoid conflicts with code or data placed in higher memory banks.

## Key Registers
- $4000-$7FFF - RAM - VIC-II bank 1 (BASIC program area; usable for sprites/characters/bitmap when BASIC top-of-memory is lowered)
- $D000-$DFFF - Character ROM - character generator ROM not visible to VIC-II while Block 1 is selected
- $0001 - CPU port - memory configuration / bank selection (controls ROM/RAM visibility; used to switch character ROM in to copy to RAM)

## References
- "vic_memory_block0_description" — Default bank differences with Block 0  
- "vic_memory_block2_description" — Alternative bank with RAM under ROM availability

## Labels
- CPU_PORT
