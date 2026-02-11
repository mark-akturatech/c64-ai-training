# MOS 6567/6569 (VIC-II) — memory areas relevant to graphics

**Summary:** Describes the three C64 memory areas the VIC-II uses: 64KB main RAM, 1K×4-bit Color RAM, and the 4KB character generator ROM (Char ROM). Notes that the 6510 CPU and the VIC-II have different views of and address decoding for the shared address space.

**Memory areas involved with the VIC-II**
- **64KB main memory**: The system's primary RAM used for screen memory, sprite data, program code, etc.
- **1K × 4-bit Color RAM**: A separate 1K area with 4 bits per cell used for color information in text and graphics modes.
- **4KB Char ROM**: The character generator ROM containing bitmap glyphs used by text/charset modes.

**CPU vs VIC address decoding (overview)**
- The CPU (6510) and the VIC-II have independent address decoders and therefore different "views" of the C64 address space.
- Although the same physical memory resources are present, the CPU and the VIC-II can map and access those resources differently; the two views must be coordinated by the system's memory-mapping logic.
- The following sections explain how the three memory areas share the address space as seen separately by the CPU and by the VIC, and cover basic memory access and DRAM handling (timing/refresh implications).

**CPU memory map**
The 6510 CPU in the Commodore 64 has a 16-bit address space, allowing it to address up to 64KB of memory. The memory map is as follows:

- **$0000–$00FF**: Zero Page — 256 bytes of RAM used for fast access and special addressing modes.
- **$0100–$01FF**: Stack — 256 bytes of RAM used for the CPU stack.
- **$0200–$03FF**: System variables and buffers — 512 bytes used by the system for various purposes.
- **$0400–$07FF**: Screen Memory — 1KB of RAM mapped to the screen display.
- **$0800–$9FFF**: Main RAM — 37KB of general-purpose RAM available for programs and data.
- **$A000–$BFFF**: BASIC ROM — 8KB containing the BASIC interpreter (can be banked out to access underlying RAM).
- **$C000–$CFFF**: RAM — 4KB of additional RAM.
- **$D000–$DFFF**: I/O and Character ROM — 4KB area used for I/O registers (VIC-II, SID, CIAs) and the Character ROM (can be banked in or out).
- **$E000–$FFFF**: KERNAL ROM — 8KB containing the operating system routines (can be banked out to access underlying RAM).

Memory banking is controlled via the processor port at address $0001, allowing the CPU to switch between different configurations of RAM, ROM, and I/O visibility.

**VIC-II memory map**
The VIC-II graphics chip has its own view of memory, accessing a 16KB window within the CPU's address space. This window is determined by the two most significant bits of the VIC-II's internal address, set by bits 1 and 0 of the VIC-II Control Register 2 at $D011. The possible base addresses for the VIC-II's 16KB window are:

- **$0000–$3FFF**: Bits 1 and 0 = 00
- **$4000–$7FFF**: Bits 1 and 0 = 01
- **$8000–$BFFF**: Bits 1 and 0 = 10
- **$C000–$FFFF**: Bits 1 and 0 = 11

Within this 16KB window, the VIC-II expects to find:

- **Screen Memory**: Typically located at an offset within the 16KB window, often at $0400–$07FF relative to the window's base.
- **Character Memory**: Located at another offset within the 16KB window, often at $1000–$1FFF relative to the window's base.
- **Sprite Data**: Also located within the 16KB window, with specific addresses depending on the configuration.

The actual addresses used by the VIC-II depend on the settings of its internal registers and the configuration of the system's memory map.

**DRAM handling details**
The Commodore 64 uses dynamic RAM (DRAM), which requires periodic refreshing to maintain data integrity. The VIC-II is responsible for generating the necessary refresh cycles. It performs memory refresh by reading from 5 refresh addresses at the end of each raster line. This systematic refreshing ensures that all memory rows are refreshed within the required time frame to prevent data loss.

The division of memory access between the CPU and the VIC-II is managed as follows:

- Each clock cycle consists of two phases: the first phase (ϕ2 low) is allocated to the VIC-II, and the second phase (ϕ2 high) is allocated to the CPU.
- The Address Enable Control (AEC) signal, controlled by the VIC-II, determines which device has access to the memory bus. When AEC is low, the VIC-II has control; when AEC is high, the CPU has control.
- During certain operations, such as fetching character pointers and sprite data, the VIC-II may require additional cycles, temporarily halting the CPU to access memory.

This coordinated access ensures that both the CPU and the VIC-II can function effectively without interfering with each other's operations.

## References
- "memory_map_cpu" — expanded memory map as seen by the 6510 CPU
- "memory_map_vic" — expanded memory map as seen by the VIC-II
- Commodore 64 Programmer's Reference Guide: Memory Management
- Commodore 64 Service Manual: RAM Control Logic
- Commodore 64 VIC-II Graphics Guide

## Labels
- VICII_CTRL2
