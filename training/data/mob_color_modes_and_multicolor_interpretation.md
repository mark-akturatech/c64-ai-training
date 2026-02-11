# MOB Color Modes and Registers (VIC-II)

**Summary:** Describes VIC-II MOB (sprite) color handling: per‑MOB 4‑bit color registers ($D027–$D02E), MOB Multi‑color #0/1 registers ($D025/$D026), and the MOB Multi‑color select register ($D01C, MnMC bits). Covers STANDARD MOB (MnMC=0) and MULTI‑COLOR MOB (MnMC=1) interpretation, bit‑pair table, reduced resolution (12×21), and shared multi‑colors.

## MOB Color Modes
Each MOB (sprite) has a dedicated 4‑bit color register that selects its color in standard mode. Two modes exist, selected per‑MOB by the MnMC bits in the VIC‑II MOB Multi‑color register (register 28 / $1C):

- STANDARD MOB (MnMC = 0)
  - MOB bitmap bits are single bits: a bit value of 1 displays the MOB's per‑MOB color (the MOB color register), a bit value of 0 is transparent and allows background pixels to show through.

- MULTI‑COLOR MOB (MnMC = 1)
  - When a MOB's MnMC bit in $D01C is set, that MOB is displayed in multi‑color mode.
  - MOB bitmap data is interpreted as bit pairs (two horizontal bitmap bits → one displayed horizontal color sample). The interpretation uses two global multi‑color registers plus the MOB's per‑MOB color register.
  - Because each displayed horizontal color sample consumes two bitmap bits, horizontal resolution is effectively halved (each horizontal dot is doubled), reducing the MOB resolution to 12×21 while preserving the same overall MOB graphic size.
  - Up to three displayed colors plus transparency are available per MOB in multi‑color mode; two of these colors (the multi‑color #0 and multi‑color #1) are shared among all MOBs.

## Source Code
```text
Multi-color MOB bit-pair interpretation table:

BIT PAIR  =>  COLOR DISPLAYED
00        =>  Transparent
01        =>  MOB Multi-color #0   (VIC-II register 37 -> $D025)
10        =>  MOB Color            (per-MOB color registers 39-46 -> $D027-$D02E)
11        =>  MOB Multi-color #1   (VIC-II register 38 -> $D026)

Registers (VIC-II offsets -> absolute $D000 base):

  28 ($1C)  -> $D01C  : MOB Multi-color register (MnMC bits select multi-color per MOB)
  37 ($25)  -> $D025  : MOB Multi-color #0 (shared)
  38 ($26)  -> $D026  : MOB Multi-color #1 (shared)
  39-46     -> $D027-$D02E : MOB Color registers (per-MOB 4-bit color, used in standard mode and as '10' in multi-color mode)
```

## Key Registers
- $D01C - VIC-II - MOB Multi-color register (MnMC bits; per‑MOB multi‑color enable)
- $D025 - VIC-II - MOB Multi-color #0 (shared multi-color)
- $D026 - VIC-II - MOB Multi-color #1 (shared multi-color)
- $D027-$D02E - VIC-II - MOB Color registers (per‑MOB 4‑bit color registers; MOB 0–7)

## References
- "mob_magnification_controls" — How magnification interacts with multi-color resolution
- "mob_priority_and_foreground_behavior" — How MOB color data interacts with background/foreground priority

## Labels
- D01C
- D025
- D026
- D027
