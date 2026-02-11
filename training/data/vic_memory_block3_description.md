# VIC-II Bank / Block 3 ($C000–$FFFF)

**Summary:** Block 3 ($C000–$FFFF) contains 4K free RAM ($C000–$CFFF), 4K of I/O space ($D000–$DFFF including VIC‑II registers), and the 8K Kernal ROM ($E000–$FFFF). Note: character ROM is not available in this mapping and DOS support commonly resides at $CC00 (52224), so avoid $CC00–$CFFF for graphics if using DOS.

## Block 3 description
Block 3 is commonly used when you need large contiguous memory for graphics and BASIC programs. The usual layout within this 16K block is:

- $C000–$CFFF — 4K of RAM, normally unused by the system (convenient for graphics/BASIC workspace). The Commodore DOS support program in many versions is located at $CC00 (decimal 52224); using $CC00–$CFFF for graphics may conflict with DOS support.
- $D000–$DFFF — 4K I/O space (VIC‑II registers and other chip I/O). In this block the character ROM (chargen) is not available to the CPU; it must be copied into RAM if needed for modification.
- $E000–$FFFF — 8K Kernal ROM containing OS routines. Memory "under" the Kernal can be used as described above when the Kernal is switched out (per bank-switching procedures).

The block is therefore useful for graphics and BASIC program storage, but take care around $CC00–$CFFF due to DOS support code residency and note that chargen ROM data must be relocated into RAM if you need it while in this bank.

## Key Registers
- $C000-$CFFF - RAM - 4K free RAM; DOS support commonly at $CC00 (52224)
- $D000-$DFFF - I/O - VIC‑II, SID, CIAs, color RAM, cartridge I/O (general I/O window)
- $D000-$D02E - VIC‑II - video registers (raster, sprite positions, control, etc.)
- $D400-$D418 - SID - Voice 1–3 registers and filter registers
- $D800-$DBFF - Color RAM - 1K screen color memory (character colors)
- $DC00-$DC0F - CIA1 - timers, interrupts, I/O port, serial bus functions
- $DD00-$DD0F - CIA2 - timers, TOD, serial bus, user port
- $DE00-$DEFF - Cartridge/expansion I/O area
- $E000-$FFFF - Kernal ROM - 8K OS routines

## References
- "changing_vic_memory_banks_procedure" — Sample program demonstrates switching to Bank 3
