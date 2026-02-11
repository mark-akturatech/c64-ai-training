# Commodore 64 Memory Map (Bank Configurations, Ultimax Note)

**Summary:** This document details the memory map for address ranges $F000–$0000, illustrating how the Commodore 64's memory configuration is influenced by control lines (/LORAM, /HIRAM, /GAME, /EXROM — represented as L H G E). It includes the behavior in Ultimax mode (when /GAME is low and /EXROM is high), the layout of ROM, BASIC, I/O, and RAM per bank, and notes that internal memory does not respond to write accesses in specified ROM areas.

**Memory-Map Overview**

The following table outlines the effective device (Kernal, BASIC, ROML, ROMH, I/O, RAM) visible at each 4K page ($F000 down to $0000) for the C64 under different combinations of the four control lines:

- **L** = /LORAM
- **H** = /HIRAM
- **G** = /GAME
- **E** = /EXROM

An "X" in a control-bit position indicates a "don't care" state for that configuration. The Ultimax configuration (GAME asserted low, EXROM high) enforces a specific mapping: in this mode, /LORAM and /HIRAM have no effect on the memory configuration.

**Address Pages Covered:**

- $F000, $E000, $D000, $C000, $B000, $A000, $9000, $8000, $7000, $6000, $5000, $4000, $3000, $2000, $1000, $0000 (each representing 4K blocks).

**Devices Shown:**

- **Kernal**: Kernal ROM
- **BASIC**: BASIC ROM
- **ROML**: Lower cartridge ROM
- **ROMH**: Upper cartridge ROM
- **I/O**: Input/Output devices (CIA, VIC-II, SID, etc.)
- **RAM**: Random Access Memory

**Footnote:**

- Areas marked with (*) indicate that internal memory does not respond to write accesses in these ROM areas; writes are ignored and non-destructive to the underlying ROM.

**Critical Behavioral Note:**

- **Ultimax Mode**: When /GAME is driven low and /EXROM is kept high, /LORAM and /HIRAM have no effect — the cartridge-controlled Ultimax mapping takes precedence.

**Legend for Control Line Combinations:**

- **1111**: Default configuration
- **101X**: Configuration 2
- **1000**: Configuration 3
- **011X**: Configuration 4
- **001X**: Configuration 5
- **1110**: Configuration 6
- **0100**: Configuration 7
- **1100**: Configuration 8
- **XX01**: Ultimax configuration

**Detailed Explanations for Notes (1)–(9):**

1. **Default Configuration (1111):**
   - **LORAM = 1, HIRAM = 1, GAME = 1, EXROM = 1**
   - Provides BASIC 2.0 and 38K contiguous bytes of user RAM.
   - ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

2. **Configuration 2 (101X):**
   - **LORAM = 1, HIRAM = 0, GAME = 1, EXROM = X**
   - Provides 60K bytes of RAM and I/O devices. The user must write custom I/O driver routines.
   - ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

3. **Configuration 3 (1000):**
   - **LORAM = 1, HIRAM = 0, GAME = 0, EXROM = 0**
   - Similar to Configuration 2, with specific control line settings.
   - ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

4. **Configuration 4 (011X):**
   - **LORAM = 0, HIRAM = 1, GAME = 1, EXROM = X**
   - Intended for use with softload languages (including CP/M), providing 52K contiguous bytes of user RAM, I/O devices, and I/O driver routines.
   - ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

5. **Configuration 5 (001X):**
   - **LORAM = 0, HIRAM = 0, GAME = 1, EXROM = X**
   - Grants access to all 64K bytes of RAM. I/O devices must be banked back into the processor’s address space for any I/O operation.
   - ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

6. **Configuration 6 (1110):**
   - **LORAM = 1, HIRAM = 1, GAME = 1, EXROM = 0**
   - Standard configuration for a BASIC system with a BASIC expansion ROM, providing 32K contiguous bytes of user RAM and up to 8K bytes of BASIC enhancement.
   - ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

7. **Configuration 7 (0100):**
   - **LORAM = 0, HIRAM = 1, GAME = 0, EXROM = 0**
   - Provides 40K contiguous bytes of user RAM and up to 8K bytes of plug-in ROM for special ROM-based applications that don’t require BASIC.
   - ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

8. **Configuration 8 (1100):**
   - **LORAM = 1, HIRAM = 1, GAME = 0, EXROM = 0**
   - Provides 32K contiguous bytes of user RAM and up to 16K bytes of plug-in ROM for special ROM-based applications that don’t require BASIC (e.g., word processors, other languages).
   - ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

9. **Ultimax Configuration (XX01):**
   - **LORAM = X, HIRAM = X, GAME = 0, EXROM = 1**
   - This is the Ultimax video game memory map. Note that the 2K byte "expansion RAM" for the Ultimax, if required, is accessed out of the Commodore 64, and any RAM in the cartridge is ignored.
   - ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

**Mapping of CHAREN/I/O Select Details:**

- **CHAREN (Character ROM Enable):**
  - **Bit 2 of Processor Port ($0001):**
    - **1**: I/O devices are visible at $D000–$DFFF.
    - **0**: Character ROM is visible at $D000–$DFFF.
  - ([c64-wiki.com](https://www.c64-wiki.com/wiki/Bank_Switching?utm_source=openai))

- **I/O Devices per Page:**
  - **$D000–$D3FF**: VIC-II (Video Interface Controller)
  - **$D400–$D7FF**: SID (Sound Interface Device)
  - **$D800–$DBFF**: Color RAM
  - **$DC00–$DCFF**: CIA1 (Complex Interface Adapter 1)
  - **$DD00–$DDFF**: CIA2 (Complex Interface Adapter 2)
  - **$DE00–$DEFF**: Open I/O slot #1 (e.g., CP/M Enable)
  - **$DF00–$DFFF**: Open I/O slot #2 (e.g., Disk)
  - ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_262.html?utm_source=openai))

## Source Code

```text
           LHGE   LHGE   LHGE   LHGE   LHGE   LHGE   LHGE   LHGE   LHGE

           1111   101X   1000   011X   001X   1110   0100   1100   XX01
  10000  default                00X0                             Ultimax
  -------------------------------------------------------------------------
   F000
          Kernal  RAM    RAM   Kernal  RAM   Kernal Kernal Kernal ROMH(*
   E000
  -------------------------------------------------------------------------
   D000    IO/C   IO/C  IO/RAM  IO/C   RAM    IO/C   IO/C   IO/C   I/O
  -------------------------------------------------------------------------
   C000    RAM    RAM    RAM    RAM    RAM    RAM    RAM    RAM     -
  -------------------------------------------------------------------------
   B000
          BASIC   RAM    RAM    RAM    RAM   BASIC   ROMH   ROMH    -
   A000
  -------------------------------------------------------------------------
   9000
           RAM    RAM    RAM    RAM    RAM    ROML   RAM    ROML  ROML(*
   8000
  -------------------------------------------------------------------------
   7000

   6000
           RAM    RAM    RAM    RAM    RAM    RAM    RAM    RAM     -
   5000

   4000
  -------------------------------------------------------------------------
   3000

   2000    RAM    RAM    RAM    RAM    RAM    RAM    RAM    RAM     -

   1000
  -------------------------------------------------------------------------
   0000    RAM    RAM    RAM    RAM    RAM    RAM    RAM    RAM    RAM
  -------------------------------------------------------------------------

     NOTE: (1)    (2)    (3)    (4)    (5)    (6)    (7)    (8)    (9)

    *) Internal memory does not respond to write accesses to these areas.
```

## Key Registers

- **Processor Port ($0001):**
  - **Bit 0 (LORAM):** Controls BASIC ROM visibility at $A000–$BFFF.
  - **Bit 1 (HIRAM):** Controls Kernal ROM visibility at $E000–$FFFF.
  - **Bit 2 (CHAREN):** Controls Character ROM/I/O visibility at $D000–$DFFF.
  - ([c64-wiki.com](https://www.c64-wiki.com/wiki/Bank_Switching?utm_source=openai))

## References

- "memory_map_legend_and_address_space_definitions" — expands on Legend and definitions for the symbols used in the memory map
- "memory_map_configuration_explanations" — expands on Explanations of the numbered memory maps (1)–(9) referenced in the table

## Labels
- PROCESSOR_PORT
- LORAM
- HIRAM
- CHAREN
