# CIA Timer Registers: TIMALO/TIMAHI/TIMBLO/TIMBHI ($DC04-$DC07)

**Summary:** CIA 1 timer registers $DC04-$DC07 hold the low/high bytes for Timer A and Timer B (16-bit little-endian timer values). These are the TIMALO/TIMAHI and TIMBLO/TIMBHI registers used by the 6526 (CIA) timers.

## Description
These four CIA 1 registers form the 16-bit counters used by the CIA timers:
- TIMALO/TIMAHI ($DC04/$DC05) — low and high bytes of Timer A.
- TIMBLO/TIMBHI ($DC06/$DC07) — low and high bytes of Timer B.

The pairings are little-endian: the low byte is at the lower address, the high byte at the next address. Programs read and write these bytes to examine or initialize the 16-bit timer values. (See the referenced "dc04_dc07_timers" for expanded details on latching, loading and the interaction with CIA control registers.)

## Source Code
```text
$DC04        TIMALO       Timer A (low byte)

$DC05        TIMAHI       Timer A (high byte)

$DC06        TIMBLO       Timer B (low byte)

$DC07        TIMBHI       Timer B (high byte)
```

## Key Registers
- $DC04-$DC05 - CIA 1 - Timer A low/high (16-bit little-endian)
- $DC06-$DC07 - CIA 1 - Timer B low/high (16-bit little-endian)

## References
- "dc04_dc07_timers" — expands on Timer operation and latch/load behavior

## Labels
- TIMALO
- TIMAHI
- TIMBLO
- TIMBHI
