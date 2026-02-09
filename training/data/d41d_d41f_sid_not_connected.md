# C64 I/O Map: SID $D41D-$D41F (Not Connected)

**Summary:** $D41D-$D41F are unused SID addresses on the C64; the SID has 29 implemented registers within a 32-address allocation, so these three addresses read as $FF and ignore writes. Searchable terms: $D41D, $D41E, $D41F, SID, $FF, register mirroring.

## Description
The SID chip was allocated space for 32 I/O addresses but implements only 29 registers. The three remaining addresses in that allocation ($D41D-$D41F) are not connected: reading from any of these addresses always returns $FF (255) and writing to them has no effect on the SID.

This is distinct from SID register mirroring (see references) where implemented registers are repeated across a larger address range; $D41D-$D41F are not mirrored SID registers but genuinely unused (read-only $FF behavior).

## Key Registers
- $D41D-$D41F - SID - Not connected; reads return $FF, writes have no effect

## References
- "sid_register_image_mirroring" — SID register mirroring in $D420-$D7FF