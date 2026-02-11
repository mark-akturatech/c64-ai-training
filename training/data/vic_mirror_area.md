# Commodore 64 Complete Memory Map — VIC-II mirror area $D02F-$D3FF (sta.c64.org)

**Summary:** Describes the VIC-II mirror region $D02F-$D3FF on the C64 where VIC-II register images are repeated every $40 bytes (mirror copies of the VIC-II register set). Searchable terms: $D02F-$D3FF, $D000-$D02E, VIC-II, mirror, $40.

## Mirror Area
The address range $D02F-$D3FF contains repeated images of the VIC-II register block. Within this region the VIC-II register set is mirrored (register images are repeated) with a stride of $40 bytes. These mirror copies provide additional aliased addresses that access the same internal VIC-II registers as the primary VIC-II register block.

Note: $40 (hex) equals 64 bytes; the mirror spacing is every $40 bytes.

## Key Registers
- $D000-$D02E - VIC-II - Primary VIC-II register set (original VIC-II register locations)
- $D02F-$D0FF - VIC-II - mirror images of VIC-II registers (repeated every $40 bytes)
- $D100-$D1FF - VIC-II - mirror images of VIC-II registers (repeated every $40 bytes)
- $D200-$D2FF - VIC-II - mirror images of VIC-II registers (repeated every $40 bytes)
- $D300-$D3FF - VIC-II - mirror images of VIC-II registers (repeated every $40 bytes)

## References
- "sta.c64.org" — Commodore 64 Complete Memory Map (source)
- "vic_screen_control_registers" — expands on original VIC-II register set locations
