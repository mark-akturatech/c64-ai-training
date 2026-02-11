# LORAM / HIRAM (bits 0 & 1 of $0001) — swapping BASIC/Kernal ROM with RAM

**Summary:** Explains bits 0 (LORAM) and 1 (HIRAM) of the processor port at $0001 and how clearing them swaps BASIC ROM ($A000-$BFFF) and Kernal ROM ($E000-$FFFF) with RAM; shows the BASIC copy technique using PEEK/POKE and example POKEs to install and restore RAM copies plus example modifications.

## Description
- Bit 0 (LORAM): when 0, BASIC ROM at $A000-$BFFF is switched out and the underlying RAM appears at those addresses. Default = 1.
- Bit 1 (HIRAM): when 0, Kernal ROM at $E000-$FFFF is switched out and replaced by RAM. Default = 1.
- The processor port/data register at $0001 controls these signals (POKE 1 to change). ($0001 is the processor port data register.)
- Technique to obtain an editable copy of ROM code: read (PEEK) from ROM-mapped addresses while writing (POKE) to the same addresses — writes go to the underlying RAM even though ROM is currently mapped for reads. Therefore a loop that PEEKs each ROM byte and POKEs it back copies ROM into the corresponding RAM.
- Typical sequence:
  1. With ROMs mapped normally, run a copy loop to populate RAM with the ROM image.
  2. Clear LORAM (bit 0) so reads at $A000-$BFFF use the RAM copy of BASIC (POKE 1,PEEK(1) AND 254).
  3. Make modifications in RAM (POKEs, machine code installs, vector redirects).
  4. Restore ROM mapping by setting the bit(s) back (e.g. POKE 1,PEEK(1) OR 1 to set LORAM).
- Examples in the source show simple modifications after loading BASIC into RAM: changing the READY/power-up text, altering a BASIC token (FOR → FER), changing INPUT prompt character, and modifying interpreter behavior (PRINT ASC("") returning 0) via direct POKEs into the RAM copy.
- Note: writes to ROM addresses are captured by RAM beneath those addresses only when the hardware/port is configured so that RAM is physically present under ROM (standard C64 configuration). The data-direction register at $0000 controls the port direction but typical usage uses POKE 1 as shown (see references for DDR details).

## Source Code
```basic
10 FOR I=40960 TO 49151: POKE I,PEEK(I): NEXT  : REM copy BASIC ROM ($A000-$BFFF) into RAM
```

```basic
REM Switch to RAM copy of BASIC (clear LORAM bit 0)
POKE 1, PEEK(1) AND 254

REM Restore ROM BASIC (set LORAM bit 0)
POKE 1, PEEK(1) OR 1
```

```basic
REM Example modifications after BASIC is running from RAM:
POKE 41122,69    : REM change FOR token to FER    (41122 = $A0A2)
POKE 43846,58    : REM change INPUT prompt to ':' (43846 = $AB46)
POKE 46991,5     : REM make PRINT ASC("") return 0 (46991 = $B78F)
```

```text
Register $0001 (processor port - data register) bit summary:
bit 0 = LORAM (1 = BASIC ROM mapped at $A000-$BFFF; 0 = RAM)
bit 1 = HIRAM (1 = KERNAL ROM mapped at $E000-$FFFF; 0 = RAM)
bit 2 = CHAREN (controls character ROM/IO) -- not expanded here
bits 3-7 = other control bits / unused for LORAM/HIRAM description
```

## Key Registers
- $0001 - Processor port (data register) - bit 0 = LORAM (BASIC ROM enable), bit 1 = HIRAM (Kernal ROM enable)
- $A000-$BFFF - BASIC ROM / RAM overlay (addresses for BASIC interpreter)
- $E000-$FFFF - Kernal ROM / RAM overlay (addresses for OS Kernal routines)

## References
- "r6510_internal_io_port_overview" — Definition of LORAM/HIRAM bits that allow ROM/RAM swapping
- "d6510_data_direction_register_at_0" — Data direction considerations when accessing I/O-controlled bits
- "replacing_roms_and_kernel_interrupts_notes" — Further notes on replacing ROMs with alternate OS/applications and interrupt/vector considerations

## Labels
- LORAM
- HIRAM
- CHAREN
