# Commodore 64 — Fundamental Memory Map, I/O Breakdown, Cartridge Auto-start Signature, Memory-configuration Intro

**Summary:** Fundamental C64 memory regions and I/O area addresses ($D000-$DFFF), device assignments (VIC-II, SID, Color RAM, CIA1/2), expansion cartridge auto-start signature at $8000, and an introduction to memory-configuration control lines (/LORAM, /HIRAM, /GAME, /EXROM) used by the 6510 port.

**Memory map overview**
This chunk documents the canonical high-level C64 address regions (0x0000–0xFFFF) and which regions can be ROM, RAM, I/O or cartridge ROM depending on bank-switching. Major regions include low 16K ($0000–$3FFF), two 16K banks ($4000–$7FFF and $8000–$9FFF), BASIC ROM area ($A000–$BFFF), RAM at $C000–$CFFF, the 4K I/O/character-ROM region ($D000–$DFFF) and the KERNAL ROM region ($E000–$FFFF). These regions are selected/overlaid by the 6510 port control lines and external cartridge signals.

**I/O area breakdown**
The $D000–$DFFF block (4KB) is the C64 I/O and character-ROM window; within it the commonly assigned subblocks are:

- VIC (Video Interface Controller / VIC-II) area at $D000–$D3FF (1 KB nominal I/O window, device registers and mirrored ranges)
- SID (Sound Interface Device) at $D400–$D7FF (1 KB window, SID registers mirrored through the block)
- Color RAM at $D800–$DBFF (1 KB of nybble-wide color RAM; typically 1024 nibbles at $D800–$DBFF)
- CIA 1 at $DC00–$DCFF (256 bytes — keyboard, joystick, timer/interrupt)
- CIA 2 at $DD00–$DDFF (256 bytes — serial bus, user port, RS-232-related)
- Open I/O slot #1 at $DE00–$DEFF (256 bytes; often designated for expansion such as Z80/CP/M enable)
- Open I/O slot #2 at $DF00–$DFFF (256 bytes; often used for disk interface expansion)

These subblocks are logically 256–1024 byte regions inside the overall I/O window and are frequently mirrored across their 1KB/4KB spans by hardware.

**Expansion cartridge auto-start signature**
A C64 expansion cartridge can be auto-started by the system if a required 9-byte signature is present in the cartridge ROM beginning at address 32768 ($8000). The required layout of those nine bytes is:

- Bytes $8000–$8001: Cold Start vector (two bytes, vector used by the cartridge program)
- Bytes $8002–$8003: Warm Start vector (two bytes, vector used by the cartridge program)
- Bytes $8004–$8006: The three letters "C", "B", "M" with bit 7 set in each (i.e., high-bit of each ASCII letter set)
- Bytes $8007–$8008: The two ASCII digits "8" and "0" (PET ASCII)

If this signature is present at $8000, the cartridge program can be started automatically by the system.

**Memory configuration and control lines (intro)**
Memory configurations on the C64 are selected by the 6510 CPU port and external cartridge signals. The selectors mentioned are the active-low lines /LORAM, /HIRAM, /GAME and /EXROM; different combinations produce different visible memory maps (default C64 map, cartridge-enabled maps, Ultimax configuration, etc.). The source references a multi-column table that enumerates address ranges down the left column and the memory maps across the top, with each map titled by the 4-bit state of these lines (bits ordered as /LORAM /HIRAM /GAME /EXROM). See the 6510 port control documentation for the exact bit meanings and CHAREN behavior.

## Source Code
```text
                                            BASIC TO MACHINE LANGUAGE   261
~

  COMMODORE 64 FUNDAMENTAL MEMORY MAP


                                 +----------------------------+
                                 |       8K KERNAL ROM        |
                      E000-FFFF  |           OR RAM           |
                                 +----------------------------+
                      D000-DFFF  | 4K I/O OR RAM OR CHAR. ROM |
                                 +----------------------------+
                      C000-CFFF  |           4K RAM           |
                                 +----------------------------+
                                 |    8K BASIC ROM OR RAM     |
                      A000-BFFF  |       OR ROM PLUG-IN       |
                                 +----------------------------+
                                 |            8K RAM          |
                      8000-9FFF  |       OR ROM PLUG-IN       |
                                 +----------------------------+
                                 |                            |
                                 |                            |
                                 |          16 K RAM          |
                      4000-7FFF  |                            |
                                 +----------------------------+
                                 |                            |
                                 |                            |
                                 |          16 K RAM          |
                      0000-3FFF  |                            |
                                 +----------------------------+



  I/O BREAKDOWN

    D000-D3FF   VIC (Video Controller)                     1 K Bytes
    D400-D7FF   SID (Sound Synthesizer)                    1 K Bytes
    D800-DBFF   Color RAM                                  1 K Nybbles
    DC00-DCFF   CIA1 (Keyboard)                            256 Bytes
    DD00-DDFF   CIA2 (Serial Bus, User Port/RS-232)        256 Bytes
    DE00-DEFF   Open I/O slot #l (CP/M Enable)             256 Bytes
    DF00-DFFF   Open I/O slot #2 (Disk)                    256 Bytes




  262   BASIC TO MACHINE LANGUAGE
~


    The two open I/O slots are for general purpose user I/O, special pur-
  pose I/O cartridges (such as IEEE), and have been tentatively designated
  for enabling the Z-80 cartridge (CP/M option) and for interfacing to a
  low-cost high-speed disk system.
    The system provides for "auto-start" of the program in a Commodore 64
  Expansion Cartridge. The cartridge program is started if the first nine
  bytes of the cartridge ROM starting at location 32768 ($8000) contain
  specific data. The first two bytes must hold the Cold Start vector to be
  used by the cartridge program. The next two bytes at 32770 ($8002) must
  be the Warm Start vector used by the cartridge program. The next three
  bytes must be the letters, CBM, with bit 7 set in each letter. The last
  two bytes must be the digits "80" in PET ASCII.


  COMMODORE 64 MEMORY MAPS

    The following table lists the various memory configurations available
  on the COMMODORE 64, the states of the control lines which select each
  memory map, and the intended use of each map.
    The leftmost column of the table contains addresses in hexadecimal
  notation. The columns aside it introduce all possible memory
  configurations. The default mode is on the left, and the absolutely most
  rarely used Ultimax game console configuration is on the right. Each
  memory configuration column has one or more four-digit binary numbers as
  a title. The bits, from left to right, represent the state of the /LORAM,
  /HIRAM, /GAME and /EXROM lines, respectively. The bits whose state does
  not matter are marked with "X". For instance, when the Ultimax video game
  configuration is active (the /GAME line is shorted to ground, /EXROM kept
  high), the /LORAM and /HIRAM lines have no effect.

  The table below details the memory configurations:

  ```
  +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
  | Address| 1111   | 101X   | 1000   | 011X   | 001X   | 1110   | 0100   | 1100   | XX01   |
  | Range  |        |        |        |        |        |        |        |        |        |
  +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
  | F000   | Kernal | RAM    | RAM    | Kernal | RAM    | Kernal | Kernal | Kernal | ROMH   |
  | E000   |        |        |        |        |        |        |        |        |        |
  +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
  | D000   | IO/C   | IO/C   | IO/RAM | IO/C   | RAM    | IO/C   | IO/C   | IO/C   | I/O    |
  +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
  | C000   | RAM    | RAM    | RAM    | RAM    | RAM    | RAM    | RAM    | RAM    | -      |
  +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
  | B000   | BASIC  | RAM    | RAM    | RAM    | RAM    | BASIC  | ROMH   | ROMH   | -      |
  | A000   |        |        |        |        |        |        |        |        |        |
  +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
  | 9000   | RAM    | RAM    | RAM    | RAM    | RAM    | ROML   | RAM    | ROML   | ROML   |
  | 8000   |        |        |        |        |        |        |        |        |        |
  +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
  | 7000   |        |        |        |        |        |        |        |        |        |
  | 6000   | RAM    | RAM    | RAM    | RAM    | RAM    | RAM    | RAM    | RAM    | -      |
  | 5000   |        |        |        |        |        |        |        |        |        |
  | 4000   |        |        |        |        |        |        |        |        |        |
  +--------+--------+--------+--------+--------+--------+

## Labels
- LORAM
- HIRAM
- GAME
- EXROM
