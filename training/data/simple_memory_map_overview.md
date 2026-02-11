# Commodore 64 — Simple Memory Map and What Machine Code Looks Like

**Summary:** Overview of how machine code is stored/seen (PEEK/POKE reference) and a compact Commodore 64 memory map with searchable register ranges and ROM/IO areas: 6510 registers ($0000-$0001), BASIC ROM ($A000-$BFFF), KERNAL ($E000-$FFFF), VIC-II ($D000-$D02E), SID ($D400-$D418), Color RAM ($D800-$DBFF), CIA I/O ($DC00/$DD00).

**What machine code looks like**
Machine code on the C64 is raw bytes placed into memory and executed by the 6510 CPU; CBM BASIC's PEEK and POKE let you read and write those bytes directly. The first two zero-page locations ($0000 and $0001) are the 6510 CPU port and data-direction register used for memory configuration (banking) and I/O; the layout of memory after those locations determines where BASIC, the KERNAL, ROMs, I/O and user RAM live. The usual workflow is: place assembled machine-code bytes into RAM (PEEK/POKE or an assembler), set the CPU vector/return address appropriately, and jump/JSR to the code.

**[Note: Source may contain an error — some decimal ranges in the provided map (SID/color RAM) are inconsistent with standard C64 addresses; this node uses the canonical C64 register ranges below.]**

**Simple memory map (roles and canonical address ranges)**
Below are the standard roles and canonical hexadecimal ranges for the main C64 memory regions referenced in the source:

- $0000-$0001 — 6510 CPU port and DDR (processor I/O and memory configuration)
- $0002-$03FF — System/OS workspace and vectors (zero page onward usage by OS)
- $0400-$07E7 — Default screen memory (25×40 = 1000 bytes) (commonly at $0400)
- $07F8-$07FF — Sprite pointers (8 bytes)
- $0800-$9FFF — User RAM area (where BASIC programs and user machine code normally reside)
- $A000-$BFFF — 8K BASIC ROM (CBM BASIC interpreter)
- $C000-$CFFF — RAM / cartridge / special programs area (varies by system configuration)
- $D000-$D02E — VIC-II registers (video chip control and sprite registers)
- $D400-$D418 — SID registers (audio chip: Voice 1 $D400-$D406, Voice 2 $D407-$D40D, Voice 3 $D40E-$D414, filter/$D415-$D418)
- $D800-$DBFF — Color RAM (1 KB; stores character colors; only 4 bits used per cell)
- $DC00-$DC0F — CIA 1 I/O registers (6526 — timers, TOD, serial, keyboard matrix port A/B)
- $DD00-$DD0F — CIA 2 I/O registers (6526 — user port, serial bus control)
- $D000-$DFFF — I/O region (VIC, SID, color RAM, CIAs and other I/O are here; mirrored depending on banking)
- $E000-$FFFF — 8K KERNAL ROM (system routines, vectors, I/O services)

Note: Some distributions or cartridges can remap ROM/RAM into these ranges via the 6510 port at $0001. The above are the canonical defaults.

## Source Code
```text
Simple memory map (original source, decimal -> canonical hex conversion)

+-------------+---------------------------------------------------------+
|   ADDRESS   |                      DESCRIPTION                        |
+-------------+---------------------------------------------------------+
| 0 & 1       | 6510 Registers.                                         |
| 2           | Start of memory.                                        |
| 2-1023      | Memory used by the operating system.                    |
| 1024-2039   | Screen memory. (decimal 1024 = $0400)                   |
| 2040-2047   | SPRITE pointers. (decimal 2040 = $07F8)                 |
| 2048-40959  | This is YOUR memory — where BASIC or machine code goes. |
|             | (decimal 2048 = $0800; 40959 = $9FFF)                   |
| 40960-49151 | 8K CBM BASIC Interpreter. (decimal 40960 = $A000)      |
| 49152-53247 | Special programs RAM area. (decimal 49152 = $C000)     |
| 53248-53294 | VIC-II. (decimal 53248 = $D000 ; 53294 = $D02E)        |
| 54272-55295 | SID Registers. (decimal 54272 = $D400 ; source end is  |
|             | inconsistent — canonical SID registers are $D400-$D418)|
| 55296-56296 | Color RAM. (source shows 55296-56296; canonical is     |
|             | $D800-$DBFF = 55296-56319)                             |
| 56320-57343 | I/O Registers. (6526's) (decimal 56320 = $DC00)        |
| 57344-65535 | 8K CBM KERNAL Operating System. (decimal 57344 = $E000)|
+-------------+---------------------------------------------------------+
```

## Key Registers
- $0000-$0001 - 6510 - CPU data-direction register and I/O port (memory banking/control)
- $0002-$03FF - 6510/OS - Start of OS workspace and system reserved memory
- $0400-$07E7 - VIC-II/Screen - Default screen memory (25×40, 1000 bytes)
- $07F8-$07FF - VIC-II - Sprite pointers (8 bytes)
- $0800-$9FFF - RAM - User program area (BASIC programs / assembled code)
- $A000-$BFFF - ROM - BASIC interpreter (8K)
- $C000-$CFFF - RAM/Cartridge area - special programs / cartridge ROM may appear here
- $D000-$D02E - VIC-II - Video control and sprite registers
- $D400-$D418 - SID - Audio voice registers and filter
- $D800-$DBFF - Color RAM - character color memory (1 KB, 4 bits per cell)
- $DC00-$DC0F - CIA 1 - CIA chip 1 registers (timers, TOD, ports)
- $DD00-$DD0F - CIA 2 - CIA chip 2 registers (timers, serial, user port)
- $E000-$FFFF - KERNAL - KERNAL ROM (8K)

## References
- "machine_code_and_registers_overview" — expands on machine-language instructions and internal registers
- "writing_machine_language_and_assemblers" — expands on tools and workflows for placing assembled programs into the memory regions above