# MACHINE - CRTC Register R3: VSYNC and HSYNC widths

**Summary:** CRTC register R3 (6545-1) is an 8-bit register where bits 7–4 set VSYNC width in scan lines and bits 3–0 set HSYNC width in character-clock times; if VSYNC bits are all zero the controller uses a 16-scan-line VSYNC. Useful for adapting HSYNC/VSYNC timing to different CRT monitors without external one-shots.

## Description
R3 is split into two 4-bit fields:
- Bits 7–4 (MSN): VSYNC width expressed as a binary number of scan lines (weights 8,4,2,1). If the four bits are all zero the hardware defaults to a 16-scan-line VSYNC.
- Bits 3–0 (LSN): HSYNC width expressed as a binary number of character clock times (weights 8,4,2,1).

These fields allow the 6545-1 CRTC to generate variable-width sync pulses so the video timing can be adjusted to match a variety of CRT monitors without requiring external timing one-shots or monostable circuits.

## Source Code
```text
                         +---+---+---+---+---+---+---+---+
                   Bit   | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
                         +---+---+---+---+---+---+---+---+
                           |   |   |   |   |   |   |   |
                   Value   8   4   2   1   8   4   2   1
                          \------+------/ \------+------/
                                 |               |
                           VSYNC WIDTH*     HSYNC WIDTH
                            (NUMBER OF      (NUMBER OF
                            SCAN LINES)      CHARACTER
                                           CLOCK TIMES)

                         *IF BITS 4-7 ARE ALL "0" THEN
                          VSYNC WILL BE 16 SCAN LINES WIDE
```

## References
- "6545_crtc_concept_and_register_map" — expands on R3 bit positions and the full CRTC register map.