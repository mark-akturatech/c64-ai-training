# Memory Map Legend (Kernal / IO / ROML / ROMH / BASIC / RAM / '-')

**Summary:** Definitions for Commodore 64 memory-map shorthand and selectable regions: Kernal ($E000-$FFFF), I/O/Character ($D000-$DFFF), I/O/RAM ($D000-$DFFF), I/O ($D000-$DFFF), BASIC ($A000-$BFFF), ROMH ($A000-$BFFF or $E000-$FFFF), ROML ($8000-$9FFF), internal RAM ranges, and '-' open address space behavior (only VIC-II DMA/refresh sees accesses).

## Legend entries
- Kernal — $E000-$FFFF
  - Kernal ROM.

- IO/C — $D000-$DFFF
  - I/O address space or Character generator ROM, selected by the -CHAREN line.
  - If the CHAREN bit is clear, the character generator ROM is chosen.
  - If the CHAREN bit is set, the I/O chips are accessible.

- IO/RAM — $D000-$DFFF
  - I/O address space or RAM, selected by the -CHAREN line.
  - If the CHAREN bit is clear, the character generator ROM is chosen.
  - If the CHAREN bit is set, the internal RAM is accessible.

- I/O — $D000-$DFFF
  - I/O address space. The -CHAREN line has no effect (I/O devices are always selected).

- BASIC — $A000-$BFFF
  - BASIC ROM.

- ROMH — $A000-$BFFF or $E000-$FFFF
  - External ROM selected when the -ROMH line is connected to the cartridge's -CS input (high-ROM selection).

- ROML — $8000-$9FFF
  - External ROM selected when the -ROML line is connected to the cartridge's -CS input (low-ROM selection).

- RAM — various ranges
  - Commodore 64 internal RAM (various address ranges depending on memory configuration).

- '-' (open address space) — $1000-$7FFF and $A000-$CFFF
  - Open address space where the C64's internal memory chips do not detect accesses.
  - Only the VIC-II's DMA and memory-refresh circuitry respond to accesses in these areas.

## References
- "memory_map_table_and_ultimax_behavior" — expands on Memory map table that uses these legend terms
- "memory_map_configuration_explanations" — expands on Detailed descriptions of each memory configuration (1)-(9)
