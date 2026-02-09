# Cartridge GAME/EXROM vs 6510 Port Bits (Memory Mapping and Max-emulation)

**Summary:** Explains how 6510 port bits (bits 0–2 of $0001, e.g. LORAM/HIRAM/CHAREN) combine with expansion-port signals GAME and EXROM to select cartridge ROM/RAM mappings ($8000-$9FFF, $A000-$BFFF, $E000-$FFFF, 16K at $8000-$BFFF) and describes the Max-emulation mode (Kernal replaced, only first 6K RAM used, no character ROM, character data remapped from $E000 to $2000).

## Memory configuration control: port bits vs cartridge signals
Bits 0–2 of the 6510 I/O port at $0001 provide software control over memory configuration (commonly LORAM, HIRAM, CHAREN). These bits are not the only determinants of the active memory map: external cartridges connected to the expansion port can assert two hardware lines, GAME and EXROM, which override or combine with the software lines to replace ROM/RAM segments with cartridge ROM.

GAME and EXROM are hardware signals on the expansion port used by cartridges to request specific mapping behaviours. When asserted in various combinations (and in combination with the $0001 port bits), cartridge ROM can be switched into one or more address ranges in place of on-cartridge ROMs or RAM.

## Typical cartridge mapping options
Common cartridge mappings enabled via GAME/EXROM (in conjunction with $0001 port bits) include:

- 8 KB at $8000–$9FFF — common for BASIC enhancement or program ROMs.
- 8 KB at $A000–$BFFF — cartridge ROM replacing the internal BASIC ROM.
- 8 KB at $E000–$FFFF — cartridge ROM replacing the Kernal ROM.
- 16 KB cartridge covering $8000–$BFFF (cartridge ROM occupying both $8000–$9FFF and $A000–$BFFF).
(These are the standard observed mappings used by many C64 cartridges.)

## Max-emulation mode (cartridge replaces Kernal)
When a cartridge ROM is selected to replace the Kernal (i.e., cartridge visible in $E000–$FFFF), the system may enter a Max-emulation mode (emulating the Commodore Max machine behavior). Characteristics of this mode described in the source:

- Only the first 6 KB of main RAM are used by the system.
- There is no access to the on-cartridge character ROM.
- Graphics data (character dot-data) that normally resides at $E000 (57344) is remapped down to $2000 (8192).

For full hardware-level details and authoritative descriptions, see the Commodore 64 Programmer's Reference Guide.

## Source Code
```text
Cartridge mapping reference (from source):

- 8K cartridge ROM @ $8000-$9FFF  (BASIC enhancement)
- 8K cartridge ROM @ $A000-$BFFF  (replaces BASIC)
- 8K cartridge ROM @ $E000-$FFFF  (replaces Kernal) -> may enter Max-emulation
- 16K cartridge ROM @ $8000-$BFFF (cartridge occupying both $8000-$9FFF and $A000-$BFFF)
- (source also lists "16K at $8000-$C000" phrasing; standard interpretation is 16K covering $8000-$BFFF)

Max-emulation specifics (as described):
- Only first 6K of RAM used
- No access to character ROM
- Character dot-data mapped from $E000 (57344) down to $2000 (8192)
```

## Key Registers
- $0001 - 6510 - Processor port (bits 0–2 control memory configuration; commonly LORAM/HIRAM/CHAREN)

## References
- "r6510_internal_io_port_overview" — expands on how GAME/EXROM combine with port bits to alter the memory map
- "loram_hiram_and_moving_rom_to_ram_examples" — expands on implications of replacing ROMs and using alternate ROMs mapped by cartridges