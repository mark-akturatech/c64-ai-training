# Multi-color character mode (MCM = 1, BMM = ECM = 0)

**Summary:** Describes VIC‑II multi‑color character mode enabled by setting MCM (register 22 / $16 -> $D016), how character dot data are reinterpreted as 2‑bit color pairs (CHARACTER BIT‑PAIR mapping), the MSB of the color nybble conditional (standard vs MCM interpretation), and the background color registers $D021–$D023 used by the mapping.

## Behavior
Setting the MCM bit (register 22 / $16) to 1 makes the VIC‑II interpret character dot data as 2‑bit pairs rather than single bits. Each stored character byte is therefore decoded as pairs of bits, giving two bits per displayed dot and enabling up to four colors per character region at the cost of horizontal resolution.

- MSB of the color nybble:
  - If MSB = 0: character behaves as in standard character mode (MCM disabled for that character), allowing only the lower 8 colors.
  - If MSB = 1: character uses the multi‑color interpretation (2‑bit color pairs).
- Resolution and layout:
  - Because two bits specify one displayed dot, horizontal resolution is halved: each dot is drawn twice horizontally, producing what the source calls a 4×8 matrix (width reduced compared to standard 8×8).
  - This allows up to four colors in a character region (two considered background colors and two considered foreground colors — see MOB priority for interactions with sprites/MOBs).

(“color nybble” = the 4‑bit color value associated with the character; MSB and the 3 LSBs are used as described.)

## Source Code
```text
MULTI-COLOR CHARACTER MODE (MCM = 1, BMM = ECM = 0)

Multi-color mode provides additional color flexibility allowing up to
four colors within each character but with reduced resolution. The multi-
color mode is selected by setting the MCM bit in register 22 ($16) to
"1," which causes the dot data stored in the character base to be
interpreted in a different manner. If the MSB of the color nybble is a
"0," the character will be displayed as described in standard character
mode, allowing the two modes to be inter-mixed (however, only the lower
order 8 colors are available). When the MSB of the color nybble is a "1"
(if MCM:MSB(CM) = 1) the character bits are interpreted in the multi-
color mode:

               | CHARACTER  |
FUNCTION       |  BIT PAIR  |               COLOR DISPLAYED
-------------- +------------+---------------------------------------------
Background     |     00     |  Background #0 Color
               |            |  (register 33 ($21))
Background     |     01     |  Background #1 Color
               |            |  (register 34 ($22)
Foreground     |     10     |  Background #2 Color
               |            |  (register 35 ($23)
Foreground     |     11     |  Color specified by 3 LSB
               |            |  of color nybble

Since two bits are required to specify one dot color, the character is
now displayed as a 4*8 matrix with each dot twice the horizontal size as
in standard mode. Note, however, that each character region can now
contain 4 different colors, two as foreground and two as background (see
MOB priority).
```

## Key Registers
- $D016 - VIC-II - Register 22 ($16): MCM bit (enable multi-color character mode)
- $D021-$D023 - VIC-II - Registers 33-35 ($21-$23): Background #0, Background #1, Background #2 (used by MCM CHARACTER BIT‑PAIR mapping)

## References
- "standard_character_mode_behavior" — expands on Standard mode behavior for comparison and mixed-mode cases
- "extended_color_mode_and_constraints" — expands on Note that ECM and MCM should not be enabled simultaneously

## Labels
- $D016
- $D021
- $D022
- $D023
