# Baud rate computation notes and NTSC baud rate table ($FEC2-$FED4)

**Summary:** Formula and system clock values for computing the 16-bit RS232 "baud word" (used by C64 ROM timing routines): (system clock / baud rate) / 2 - 100; NTSC/PAL clock constants and the NTSC baud-word table stored in ROM at $FEC2-$FED4 are listed.

## Baud word formula and clocks
The ROM computes a 16-bit baud word for RS232 timing with the formula:

(system clock / baud rate) / 2 - 100

System clock constants used in the ROM:
- PAL:  985248 Hz
- NTSC: 1022727 Hz

The ROM contains a table (NTSC C64) of low/high bytes for common baud rates; these 16-bit words are used by RS232 timing/interrupt routines.

## Source Code
```text
                                *** baud rate word is calculated from ..
                                
                                (system clock / baud rate) / 2 - 100
                                
                                    system clock
                                    ------------
                                PAL        985248 Hz
                                NTSC     1022727 Hz
                                baud rate tables for NTSC C64
.:FEC2 C1 27                      50   baud   1027700
.:FEC4 3E 1A                      75   baud   1022700
.:FEC6 C5 11                     110   baud   1022780
.:FEC8 74 0E                     134.5 baud   1022200
.:FECA ED 0C                     150   baud   1022700
.:FECC 45 06                     300   baud   1023000
.:FECE F0 02                     600   baud   1022400
.:FED0 46 01                    1200   baud   1022400
.:FED2 B8 00                    1800   baud   1022400
.:FED4 71 00                    2400   baud   1022400
```

## Key Registers
- $FEC2-$FED4 - KERNAL ROM - NTSC baud-word table: low/high bytes for common baud rates (50, 75, 110, 134.5, 150, 300, 600, 1200, 1800, 2400)

## References
- "rs232_interrupt_and_timing_handlers" — expands on baud words used by RS232 timing routines