# VIC-II Extended Color Mode (ECM): per-character background selection (ECM=1, BMM=0, MCM=0)

**Summary:** Extended Color Mode (ECM) is enabled by setting the ECM bit in VIC-II register 17 ($D011). In ECM, the two most significant bits (MSBs) of each character pointer select one of four background colors (VIC-II registers $D021–$D024), while character dot bits render foreground pixels normally; only 64 character definitions are accessible because the VIC-II forces CB10 and CB9 to 0.

**Extended color mode (ECM = 1, BMM = 0, MCM = 0)**

When ECM is selected (ECM bit in VIC-II register 17 / offset $11 set to 1), character regions remain at normal 8×8 resolution. The character dot data is displayed the same way as in standard (single-color) character mode: bits that are "1" output the character foreground color (from the usual color nybble). However, the two most-significant bits of the character pointer byte are repurposed to select which of four background colors is used to display the "0" bits for that character region.

Mapping of the character-pointer MSB pair to background registers:

- MSB pair 00 → Background #0 (VIC-II register 33 / $21)
- MSB pair 01 → Background #1 (VIC-II register 34 / $22)
- MSB pair 10 → Background #2 (VIC-II register 35 / $23)
- MSB pair 11 → Background #3 (VIC-II register 36 / $24)

Because those two MSB bits are consumed for background selection, the VIC-II (6566/6567) forces CB10 and CB9 to 0 regardless of the original pointer values. This limits the accessible character-definition set to the first 64 characters (0–63). In ECM, each character therefore has one of 16 possible foreground colors and one of 4 possible background colors.

**Note:** Extended Color Mode (ECM) and Multi-Color Character Mode (MCM) must not be enabled simultaneously.

## Source Code

```text
EXTENDED COLOR MODE (ECM = 1, BMM = MCM = 0)

The extended color mode allows the selection of individual background
colors for each character region with the normal 8×8 character
resolution. This mode is selected by setting the ECM bit of register 17
($11) to "1". The character dot data is displayed as in the standard mode
(foreground color determined by the color nybble is displayed for a "1"
data bit), but the 2 MSB of the character pointer are used to select the
background color for each character region as follows:

   CHAR. POINTER MS BIT PAIR  | BACKGROUND COLOR DISPLAYED FOR 0 BIT
   --------------------------+--------------------------------------
            00               | Background #0 color (register 33 ($21))
            01               | Background #1 color (register 34 ($22))
            10               | Background #2 color (register 35 ($23))
            11               | Background #3 color (register 36 ($24))

Since the two MSB of the character pointers are used for color information,
only 64 different character definitions are available. The 6566/6567 will
force CB10 and CB9 to "0" regardless of the original pointer values, so that
only the first 64 character definitions will be accessed. With extended color
mode, each character has one of sixteen individually defined foreground
colors and one of the four available background colors.

+-----------------------------------------------------------------------+
| NOTE: Extended color mode and multi-color mode should not be enabled  |
| simultaneously.                                                       |
+-----------------------------------------------------------------------+
```

## Key Registers

- $D011 - VIC-II - Control Register 1 (bit: ECM / Extended Color Mode enable; register offset $11)
- $D021-$D024 - VIC-II - Background color registers (background #0–#3 used by ECM; offsets $21–$24)

## References

- "multi_color_character_mode" — contrast and caution about enabling both ECM and MCM
- "character_display_mode_and_addressing" — character pointer/character base addressing constraints when ECM repurposes MSBs