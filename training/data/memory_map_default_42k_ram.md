# Default memory map (42K RAM) — Fig. 7-5

**Summary:** Default C64 memory map showing ROM/I/O vs RAM regions with 42K accessible RAM when BASIC and KERNAL ROMs are present; shows $A000-$BFFF BASIC ROM, $D000-$DFFF I/O/Character ROM, $E000-$FFFF KERNAL ROM and the control bits in processor port $0001 (LORAM/HIRAM/CHAREN) used for bank switching.

**Map description**
This figure shows the standard/default address layout used when both the 8K BASIC ROM and the 8K KERNAL ROM are mapped in (i.e., not banked out) and the I/O block is visible. The important regions and their typical sizes:

- $E000-$FFFF — 8K KERNAL ROM (system ROM vectors and I/O entry points)
- $D000-$DFFF — 4K I/O area (VIC-II, SID, color RAM window, CIAs) / Character ROM (selectable)
- $C000-$CFFF — 4K RAM
- $A000-$BFFF — 8K BASIC ROM
- $8000-$9FFF — 8K RAM
- $0000-$7FFF — 32K RAM

When LORAM=1 and HIRAM=1 (bits in the processor port at $0001), BASIC and KERNAL ROMs are visible at $A000-$BFFF and $E000-$FFFF respectively. The CHAREN bit (also in $0001) selects whether the $D000-$DFFF region presents I/O registers and color RAM (CHAREN=1, typical default) or the character generator ROM (CHAREN=0), subject to ROM presence.

Bank switching is performed by the processor port at $0001—changing LORAM/HIRAM/CHAREN controls whether RAM, BASIC ROM, KERNAL ROM, I/O, or Character ROM appear in the CPU address space at those regions.

## Source Code
```text
Address labels and ASCII diagram:

FFFF
E000
D000
C000
A000
8000
0000

| $E000-$FFFF | 8K KERNAL ROM |
| $D000-$DFFF | 4K I/O (VIC-II, SID, Color RAM, CIAs) |
| $C000-$CFFF | 4K RAM |
| $A000-$BFFF | 8K BASIC ROM |
| $8000-$9FFF | 8K RAM |
| $0000-$7FFF | 32K RAM |

LORAM  HIRAM  CHAREN  <- control bits in processor port $0001
Fig. 7-5. The default memory map with 42K RAM.
```

Bit diagram for processor port at $0001:

```text
Bit 7  | Bit 6  | Bit 5  | Bit 4  | Bit 3  | Bit 2  | Bit 1  | Bit 0
-------|--------|--------|--------|--------|--------|--------|--------
  —    |   —    | MOTOR  | SENSE  | OUT    | CHAREN | HIRAM  | LORAM
```

- **LORAM (Bit 0):** Controls visibility of BASIC ROM at $A000-$BFFF. 1 = BASIC ROM visible; 0 = RAM visible.
- **HIRAM (Bit 1):** Controls visibility of KERNAL ROM at $E000-$FFFF. 1 = KERNAL ROM visible; 0 = RAM visible.
- **CHAREN (Bit 2):** Controls visibility of I/O registers vs. Character ROM at $D000-$DFFF. 1 = I/O registers visible; 0 = Character ROM visible.
- **OUT (Bit 3):** Datasette data output line.
- **SENSE (Bit 4):** Datasette switch sense; 1 = No button pressed; 0 = Button pressed.
- **MOTOR (Bit 5):** Datasette motor control; 1 = Motor off; 0 = Motor on.
- **Bits 6 and 7:** Not used.

## Key Registers
- $0001 - Processor port - LORAM (BASIC ROM enable), HIRAM (KERNAL ROM enable), CHAREN (I/O vs Character ROM select)
- $D000-$DFFF - I/O / Character ROM area (VIC-II, SID, color RAM window, CIAs)
- $D000-$D02E - VIC-II registers (graphics chip)
- $D400-$D418 - SID registers (sound chip; voices and filter)
- $D800-$DBFF - Color RAM (1K, 4-bit per cell)
- $DC00-$DC0F - CIA 1 registers (I/O, keyboard, serial)
- $DD00-$DD0F - CIA 2 registers (I/O, timers, user port)

## References
- "memory_map_60k_ram_no_kernal" — expands on alternate memory map without KERNAL ROM (Fig. 7-4)
- "character_generator_rom_and_bank_switching" — describes how character generator ROM fits into the memory map and how I/O port bits control ROM vs registers

## Labels
- LORAM
- HIRAM
- CHAREN
- OUT
- SENSE
- MOTOR
