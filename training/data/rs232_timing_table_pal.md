# RS232 Timing Table (KERNAL PAL) $E4EC-$E4FE

**Summary:** KERNAL ROM data table at $E4EC-$E4FE containing ten 16-bit prescaler words (little-endian) used by the RS232 NMI timing routine on PAL C64 machines; entries correspond to fixed baud rates 50–2400. (NTSC table is at $FEC2 in the KERNAL.)

## Timing Table
This table holds the prescaler constants used by the KERNAL RS232 NMI timing code to generate standard baud rates on PAL machines. The table consists of 10 two-byte (16-bit) words stored little-endian (low byte first). Each word is a prescaler value for a particular fixed RS232 baud rate, ordered from lowest (50 baud) to highest (2400 baud). The KERNAL contains a separate NTSC table at $FEC2 because of the different system clock.

The listing below shows the stored bytes and the nominal baud rate each entry is used for. The entry at $E4FC is annotated in the original source as “(1800) 2400”, reflecting historical ambiguity in KERNAL comments; the table contains values for 2400 baud as the highest supported rate here.

## Source Code
```text
                                *** RS232 TIMING TABLE - PAL
                                Timing table for RS232 NMI for use with PAL machines.
                                Contains prescaler values for baudrates 50,75,110,134.5,
                                150,300,600,1200,(1800)2400,2400. NTSC table at $FEC2.

.:E4EC 19 26                    50 baud       (word $2619)
.:E4EE 44 19                    75 baud       (word $1944)
.:E4F0 1A 11                    110 baud      (word $111A)
.:E4F2 E8 0D                    134.5 baud    (word $0DE8)
.:E4F4 70 0C                    150 baud      (word $0C70)
.:E4F6 06 06                    300 baud      (word $0606)
.:E4F8 D1 02                    600 baud      (word $02D1)
.:E4FA 37 01                    1200 baud     (word $0137)
.:E4FC AE 00                    (1800) 2400   (word $00AE)
.:E4FE 69 00                    2400 baud     (word $0069)
```

## Key Registers
- $E4EC-$E4FE - KERNAL ROM - RS232 timing prescaler table (PAL), ten 16-bit little-endian entries for fixed baud rates

## References
- "rs232_send_receive_helpers" — expands on RS232 routines that use these timing constants for baud configuration