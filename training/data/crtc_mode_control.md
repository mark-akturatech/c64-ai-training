# CRTC R8 — Mode Control (6545-1)

**Summary:** Mode Control register R8 for the 6545-1 CRTC selects interface/interlace flags, video display RAM addressing mode (binary vs row/column), display-enable and cursor skew (delay by one character time), and contains reserved/unused bits. Contains bit-level controls: bits 1:0 (interface), bit 2 (RAM addressing), bit 3 (reserved, must be 0), bit 4 (display enable skew), bit 5 (cursor skew), bits 6–7 unused.

## Description
This register configures several independent operating modes of the 6545-1 CRTC:

- Interface/interlace (bits 1:0): the register encodes the interface mode in the low two bits. The source table indicates that any pattern with bit0 = 0 selects non-interlace; patterns with bit0 = 1 are marked invalid (do not use). See note below about a possible source contradiction regarding interlace selection.
- Video display RAM addressing (bit 2): "0" = straight binary addressing; "1" = row/column addressing (character/row addressing).
- Reserved (bit 3): explicitly marked in the source as MUST BE SET TO "0".
- Display enable skew (bit 4): "0" = no delay; "1" = delay display enable by one character time.
- Cursor skew (bit 5): "0" = no delay; "1" = delay cursor by one character time.
- Bits 6–7: not used / unused.

Caveats:
- The source's small table for bits 1:0 shows only a valid non-interlace setting ("x 0 — non interlace") and marks the other case ("x 1") as invalid. If you expect an explicit interlace enable bit, note that the source may be incomplete or contradictory (see note below).
- Bit 3 is reserved and must be written as 0; do not set it to 1.

**[Note: Source may contain an error — the diagram marks the bit-pair for interface mode as "x 1 = invalid", which conflicts with a plain statement that bits select interlace; treat the source table literally unless corroborated elsewhere.]**

## Source Code
```text
Mode Control (R8)

This register is used to select the operating modes of the 6545-1 and is
outlines as follows:


           +-+-+-+-+-+-+-+-+
           |7|6|5|4|3|2|1|0|
           +-+-+-+-+-+-+-+-+
            | | | | | | | |
            | | | | | | `+'
            | | | | | |  |
            | | | | | |  `-------INTERFACE MODE CONTROL
            | | | | | |
            | | | | | |          BIT 1 BIT 0  OPERATION
            | | | | | |          ----------------------
            | | | | | |            x     0    non interlace
            | | | | | |            x     1    invalid (do not use)
            | | | | | |
            | | | | | |
            | | | | | `----------VIDEO DISPLAY RAM ADDRESSING
            | | | | |            "0" for straight binary
            | | | | |            "1" for row/column
            | | | | | 
            | | | | `------------MUST SET TO "0" 
            | | | |
            | | | `--------------DISPLAY ENABLE SKEW
            | | |                "0" for no delay
            | | |                "1" to delay display enable
            | | |                    one character time
            | | |
            | | `----------------CURSOR SKEW
            | |                  "0" for no delay
            | |                  "1" to delay cursor one
            | |                      character time
            | |
            | `---------------.
            |                 +--NOT USED
            `-----------------'

           Figure I.3
```

## References
- "6545_crtc_concept_and_register_map" — expands on R8's placement among CRTC registers and broader register map of the 6545-1

## Labels
- R8
- MODE_CONTROL
