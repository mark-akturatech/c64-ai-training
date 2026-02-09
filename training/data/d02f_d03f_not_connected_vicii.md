# C64 I/O Map: VIC-II Not Connected $D02F-$D03F

**Summary:** VIC-II not-connected I/O range $D02F-$D03F (17 addresses) — reads return $FF ($255) and writes are ignored; these addresses do not access memory.

## Not-Connected VIC-II Addresses ($D02F-$D03F)
The VIC-II provides 47 register bytes inside a 64-byte I/O slot. The remaining 17 byte addresses in that slot are not connected to any internal register or memory. Access behavior for the unused addresses:

- Read: Always returns $FF (decimal 255).
- Write: Ignored — writing to these addresses does not change any internal state and subsequent reads still return $FF.

This behavior applies to the entire contiguous range $D02F-$D03F.

## Source Code
(omitted — no code or register tables in source)

## Key Registers
- $D02F-$D03F - VIC-II - Not connected; reads return $FF, writes ignored

## References
- "vicii_color_registers_border_bg_and_sprite_colors" — expands on VIC-II register address space and color-related registers