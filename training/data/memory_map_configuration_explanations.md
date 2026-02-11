# Commodore 64 — Numbered Memory Map Configurations (1–9)

**Summary:** Descriptions of the nine numbered C64 memory-map configurations (1)–(9), including BASIC/default map, 60K/64K RAM maps, character ROM accessibility, softload languages/CP/M map, BASIC expansion and plug-in ROM maps, ROM-based application maps, and the ULTIMAX video-game map with its expansion-RAM behavior.

**Memory map descriptions (1)–(9)**

(1) BASIC (default)
- BASIC 2.0 present. Provides 38K contiguous bytes of user RAM.

(2) 60K RAM + I/O
- Provides 60K bytes of RAM and I/O devices.
- The user must supply their own I/O driver routines (I/O device routines are not provided by ROM).

(3) 60K RAM, character ROM not CPU-accessible
- Same as map (2) but the character ROM is not accessible to the CPU in this configuration.

(4) Softload languages / CP/M map
- Intended for softloaded language systems (including CP/M).
- Provides 52K contiguous bytes of user RAM, I/O devices, and I/O driver routines.

(5) Full 64K RAM map
- Gives the CPU access to all 64K bytes of RAM.
- I/O devices must be banked back into the processor address space for any I/O operation (i.e., software must remap I/O into the address space when needed).

(6) BASIC expansion ROM configuration
- Standard configuration when a BASIC expansion ROM is present.
- Provides 32K contiguous bytes of user RAM plus up to 8K bytes of BASIC "enhancement" ROM.

(7) ROM-based application map (8K ROM)
- Provides 40K contiguous bytes of user RAM and up to 8K bytes of plug-in ROM for ROM-based applications that do not require BASIC.

(8) ROM-based application map (16K ROM)
- Provides 32K contiguous bytes of user RAM and up to 16K bytes of plug-in ROM for ROM-based applications (word processors, other languages, etc.) that do not require BASIC.

(9) ULTIMAX video-game memory map
- ULTIMAX mode used for certain cartridge-based games.
- Note: the 2K expansion RAM required by ULTIMAX, if present, is accessed out of the Commodore 64 (i.e., from the system side) and any RAM located on the cartridge is ignored.

## Source Code

```text
Memory Map Configurations (1)–(9):

(1) BASIC (default)
- $0000-$9FFF: RAM (38K user RAM)
- $A000-$BFFF: BASIC ROM
- $C000-$CFFF: RAM
- $D000-$DFFF: I/O devices
- $E000-$FFFF: KERNAL ROM

(2) 60K RAM + I/O
- $0000-$9FFF: RAM (40K user RAM)
- $A000-$BFFF: RAM
- $C000-$CFFF: RAM
- $D000-$DFFF: I/O devices
- $E000-$FFFF: RAM

(3) 60K RAM, character ROM not CPU-accessible
- $0000-$9FFF: RAM (40K user RAM)
- $A000-$BFFF: RAM
- $C000-$CFFF: RAM
- $D000-$DFFF: I/O devices (character ROM not accessible)
- $E000-$FFFF: RAM

(4) Softload languages / CP/M map
- $0000-$9FFF: RAM (40K user RAM)
- $A000-$BFFF: RAM
- $C000-$CFFF: RAM
- $D000-$DFFF: I/O devices
- $E000-$FFFF: KERNAL ROM

(5) Full 64K RAM map
- $0000-$FFFF: RAM (64K user RAM)
- I/O devices must be banked in as needed

(6) BASIC expansion ROM configuration
- $0000-$7FFF: RAM (32K user RAM)
- $8000-$9FFF: BASIC expansion ROM
- $A000-$BFFF: BASIC ROM
- $C000-$CFFF: RAM
- $D000-$DFFF: I/O devices
- $E000-$FFFF: KERNAL ROM

(7) ROM-based application map (8K ROM)
- $0000-$9FFF: RAM (40K user RAM)
- $A000-$BFFF: Plug-in ROM (8K)
- $C000-$CFFF: RAM
- $D000-$DFFF: I/O devices
- $E000-$FFFF: KERNAL ROM

(8) ROM-based application map (16K ROM)
- $0000-$7FFF: RAM (32K user RAM)
- $8000-$BFFF: Plug-in ROM (16K)
- $C000-$CFFF: RAM
- $D000-$DFFF: I/O devices
- $E000-$FFFF: KERNAL ROM

(9) ULTIMAX video-game memory map
- $0000-$3FFF: RAM (16K user RAM)
- $4000-$7FFF: Cartridge ROM
- $8000-$9FFF: RAM
- $A000-$BFFF: Cartridge ROM
- $C000-$CFFF: RAM
- $D000-$DFFF: I/O devices
- $E000-$FFFF: Cartridge ROM
```

## Key Registers

- **Processor Port at $0001**: Controls memory configuration by selecting which memory blocks (RAM, ROM, I/O) are visible in the CPU address space.

## References

- "memory_map_table_and_ultimax_behavior" — expands on the annotated table and ULTIMAX behavior (detailed address ranges and access rules).
- "memory_map_legend_and_address_space_definitions" — expands on definitions used in these map explanations (address-space terms and legend).

## Labels
- PROCESSOR_PORT
