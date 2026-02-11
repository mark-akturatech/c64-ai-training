# C64 I/O Map: $D420-$D7FF — SID register images / mirroring

**Summary:** The SID chip (29 documented registers) is decoded as a 32-byte window at its base ($D400-$D41F); the larger 1K area ($D400-$D7FF) is produced by mirroring those 32 locations every 32 bytes. Use only the base SID addresses to avoid confusion ($D400-$D41F).

## Description
The SID on the C64 only decodes 32 address locations (2^5 = 32) even though the I/O area reserved for it is 1K ($D400-$D7FF). Because the higher address lines within that 1K block are not decoded by the SID, the block is partitioned into 32-byte mirrors: every address that differs by a multiple of $20 (32 decimal) maps to the same internal SID register.

Practical implications:
- Any access at $D400 + N is equivalent to $D400 + (N & $1F). For example, $D420 maps to the same SID register as $D400.
- The SID still exposes 29 documented registers within the 32-byte decode window; the remaining locations in that 32-byte window are unused or reserved.
- To avoid ambiguity and accidental side effects (and to make code easier to read/maintain), address the SID with its canonical base range ($D400-$D41F) rather than other mirrored addresses in the 1K block.

Technical note (address decoding): because only the low 5 address bits are used by the SID, the effective SID offset = (address & $1F). This is why the 1K block appears as repeated 32-byte images.

## Key Registers
- $D400-$D41F - SID - primary SID register set (29 documented registers, 32-byte decode)
- $D420-$D4FF - SID - mirror images of $D400-$D41F (repeated every $20 bytes)
- $D500-$D5FF - SID - mirror images of $D400-$D41F (repeated every $20 bytes)
- $D600-$D6FF - SID - mirror images of $D400-$D41F (repeated every $20 bytes)
- $D700-$D7FF - SID - mirror images of $D400-$D41F (repeated every $20 bytes)

## References
- "sid_overview_intro" — expands on SID base register set and behavior
