# Commodore 64 Input/Output Assignments (I/O Register Header)

**Summary:** Header table for C64 I/O register assignments showing MOS 6510 CPU-port registers $0000 (Data Direction Register) and $0001 (on‑chip I/O port) with bit definitions (/LORAM, /HIRAM, /CHAREN, cassette lines). Searchable terms: $0000, $0001, MOS 6510, /LORAM, /HIRAM, /CHAREN, cassette motor.

**Overview**
This chunk is the header and first rows of the C64 I/O register assignment table. It documents the MOS 6510 on‑chip I/O port and its data direction register at addresses $0000 and $0001. Bit semantics are given (1 = output, 0 = input) and the active‑low naming convention (leading slash, e.g. /LORAM) is preserved. The full device register table (VIC-II, SID, CIA, etc., typically mapped in $D000-$DFFF) is referenced but not included here.

## Source Code
```text
  COMMODORE 64 INPUT/OUTPUT ASSIGNMENTS

   HEX      DECIMAL        BITS                 DESCRIPTION
  -------------------------------------------------------------------------

  0000           0          7-0    MOS 6510 Data Direction
                                     Register (xx101111)
                                     Bit= 1: Output, Bit=0:
                                     Input, x=Don't Care

  0001           1                 MOS 6510 Micro-Processor
                                     On-Chip I/O Port
                            0      /LORAM Signal (0=Switch BASIC ROM Out)
                            1      /HIRAM Signal (0=Switch Kernal ROM Out)
                            2      /CHAREN Signal (0=Switch Char. ROM In)
                            3      Cassette Data Output Line
                            4      Cassette Switch Sense: 1 = Switch Closed
                            5      Cassette Motor Control 0 = ON, 1 = OFF
                            6-7    Undefined
```

## Key Registers
- $0000 - MOS 6510 - Data Direction Register (bits 7-0). Bit = 1 : output, Bit = 0 : input. Pattern shown as (xx101111).
- $0001 - MOS 6510 - On‑chip I/O Port. Bit assignments:
  - Bit 0: /LORAM (0 = switch BASIC ROM out)
  - Bit 1: /HIRAM (0 = switch Kernal ROM out)
  - Bit 2: /CHAREN (0 = switch Character ROM in)
  - Bit 3: Cassette data output
  - Bit 4: Cassette switch sense (1 = switch closed)
  - Bit 5: Cassette motor control (0 = ON, 1 = OFF)
  - Bits 6-7: Undefined

## References
- "memory_map_part3_screen_video_rom_ram" — expands on I/O registers residing in $D000-$DFFF region (VIC/SID/CIA etc.).

## Labels
- LORAM
- HIRAM
- CHAREN
