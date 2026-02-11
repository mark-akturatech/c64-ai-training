# MOS 6567/6569 (VIC-II) — Bus access behavior with the 6510

**Summary:** Describes VIC-II and 6510 memory-access timing: both perform a memory access every clock period; VIC accesses in the first phase (φ2 low) and the CPU in the second (φ2 high). Covers VIC-generated RAS/CAS/clock, DRAM refresh (5 refresh accesses per raster line), BA/AEC takeover behavior, and the ability to force a takeover via $D011.

## Memory access behavior
Both the 6510 and the VIC-II perform a memory access on every single clock cycle (no wait states, no caches). The 6510 issues read and write accesses; the VIC-II performs reads only. Even when the CPU is executing an internal operation that does not require memory (for example part of an indexed addressing operation), it still performs a memory read and discards the data.

The VIC-II is the bus timing master: it generates the system clocks and the DRAM RAS/CAS signals used to access the dynamic RAM for both chips. The VIC also performs DRAM refresh by reading five refresh addresses on each raster line.

Access division in one φ2 period:
- Phase 1 (φ2 low): VIC-II accesses memory.
- Phase 2 (φ2 high): 6510 accesses memory.
AEC closely follows φ2 so the CPU and VIC can alternate memory accesses without colliding (AEC high allows CPU to drive addresses; AEC low indicates the VIC may drive addresses).

## Bus take-over sequence (BA / AEC interaction)
When the VIC needs more cycles than the per-phase scheme provides (notably: character pointer fetches require an extra 40 cycles per line; sprite data fetches require 2 extra cycles per sprite), it forces a bus takeover so it can perform additional memory accesses.

Key points of the takeover:
- The VIC pulls BA low to request the bus. BA goes low three VIC cycles before actual takeover. Three cycles is chosen because the 6510 will perform at most three successive write accesses.
- After those three cycles (the maximum 6510 write-run), AEC remains low during the second phase (φ2 high) so that the VIC can continue to output addresses and use what would normally be the CPU phase.
- The textual "p" accesses in diagrams denote CPU accesses that only happen if they are writes; a first "p" read stops the CPU (since it must not output addresses once AEC falls), and after three "p" accesses the VIC takes over.
- The CPU still outputs addresses on a "p" read access while AEC is still high; once AEC goes low the VIC drives the bus.

The VIC register $D011 can be modified to force bus takeovers at unusual times (see VIC register documentation). Detailed per-line timing and forcing behavior are covered in timing_of_raster_line.

(See the ASCII timing diagram in the Source Code section.)

## Source Code
```text
       _ _ _ _ _ _ _ _ _ _ _ _ _ _ _    _ _ _ _ _ _ _ _ _ _ _ _ _
 �2   _ _ _ _ _ _ _ _ _ _ _ _ _ ..._ _ _ _ _ _ _ _ _ _ _ _ _
      ______________                       __________________
 BA                 ____________...________
       _ _ _ _ _ _ _ _ _                  _ _ _ _ _ _ _ _ _
 AEC  _ _ _ _ _ _ _ _ _ ______..._________ _ _ _ _ _ _ _ _

 Chip VPVPVPVPVPVPVPVpVpVpVVVVVV...VVVVVVVVVPVPVPVPVPVPVPVP

           1       |  2  |       3        |       4
         Normal    |Take-| VIC has taken  |  VIC releases
      bus activity |over | over the bus   |    the bus
```

Additional quoted notes from source (reference):
```text
- VIC performs character pointer fetches: +40 cycles when required.
- VIC performs sprite data fetches: +2 cycles per sprite.
- BA will go low 3 cycles before the VIC takes over the bus completely.
- The 6510 never does more than 3 write accesses in succession.
- By appropriately modifying the VIC register $D011, it is possible to force a bus take-over at extraordinary times.
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register block (includes $D011 which can force/affect bus takeover timing)

## References
- "6510_processor" — RDY/AEC signals and CPU bus behavior
- "timing_of_raster_line" — detailed per-cycle access schedule including BA/AEC/IRQ