# Overview of the $D000-$DFFF 4K I/O block

**Summary:** Description of the C64 $D000-$DFFF I/O block (VIC-II $D000-$D02E, SID $D400-$D418, Color RAM $D800-$DBFF, CIA1 $DC00-$DC0F, CIA2 $DD00-$DD0F), optional character ROM/4K RAM mapping, address-space sparsity, and bit-manipulation examples (BASIC POKE/PEEK).

## I/O block overview
The 4K block $D000-$DFFF is a shared address range used by multiple I/O devices and optionally by character ROM or RAM overlays. Devices resident here include:

- VIC-II video controller (primary graphics engine; normally accessed at $D000-$D02E).
- SID sound chip (registers at $D400-$D418).
- Color RAM (screen color attributes stored at $D800-$DBFF).
- Two CIA (Complex Interface Adapter) chips accessible inside this block: CIA1 at $DC00-$DC0F and CIA2 at $DD00-$DD0F.
- Optional character ROM and an alternate 4K RAM image can be mapped into this block in place of I/O devices for special uses (normally only VIC-II reads character ROM).

Address-space characteristics:
- Many addresses in the 4K window are unused by the devices or are read/write images of internal chip registers; devices typically occupy only a few addresses each and sometimes only a few bits within those addresses.
- Some addresses are reserved for future expansion or for hardware accessible via the expansion port (e.g., CP/M boards).
- Because devices are bit-addressed (control bits in register bytes), software commonly manipulates single bits using bitmasks rather than overwriting whole registers.

This chunk sets up VIC-II register descriptions (VIC-II registers begin at $D000). Further detailed registers and bit layouts are in the dedicated VIC-II and SID reference chunks.

## Source Code
```text
Memory map notes (addresses in $hex)
$D000-$D02E   VIC-II registers (Video Interface Controller)
$D400-$D418   SID registers (Sound Interface Device)
$D800-$DBFF   Color RAM (screen color attributes)
$DC00-$DC0F   CIA 1 registers
$DD00-$DD0F   CIA 2 registers
$D000-$DFFF   Character ROM or 4K RAM overlay (optional, VIC-II may read character ROM)
```

```basic
REM Bit mask values (bit -> numeric)
REM Bit 0 = 1
REM Bit 1 = 2
REM Bit 2 = 4
REM Bit 3 = 8
REM Bit 4 = 16
REM Bit 5 = 32
REM Bit 6 = 64
REM Bit 7 = 128

REM Example BASIC bit set/reset idioms
REM Set bit: POKE addr, PEEK(addr) OR BitValue
REM Clear bit: POKE addr, PEEK(addr) AND 255-BitValue

REM Example: set bit 2 at address $D020 (background color register)
POKE 53248, PEEK(53248) OR 4

REM Example: clear bit 2 at address $D020
POKE 53248, PEEK(53248) AND 251
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II registers (control, raster, sprite, matrix, etc.)
- $D400-$D418 - SID - SID voice/filter/control registers
- $D800-$DBFF - Color RAM - screen character color attributes (1K)
- $DC00-$DC0F - CIA 1 - CIA 1 I/O and timer registers
- $DD00-$DD0F - CIA 2 - CIA 2 I/O and timer registers
- $D000-$DFFF - Character ROM / 4K RAM - optional mapping (VIC-II normally reads character ROM)

## References
- "vic_ii_registers_block_intro" — VIC-II register start and detailed register descriptions at $D000
- "sid_registers_overview" — SID register block and voice/filter mapping at $D400-$D418