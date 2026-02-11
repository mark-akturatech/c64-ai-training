# RNDX ($008B-$008F) — RND function seed (five-byte floating point)

**Summary:** $008B-$008F (RNDX) stores the five-byte floating-point seed used by BASIC's RND function; initial ROM seed bytes are $80,$4F,$C7,$52,$58. RND(X) behavior depends on the sign of X: X=0 seeds from hardware timers, X>0 returns the next pseudorandom value, X<0 scrambles the seed from X's floating-point representation (common seeding: RND(-TI), RND(-RND(0))).

## Description
This zero-page location (decimal 139–143, hex $008B–$008F) contains the five-byte floating-point seed value that BASIC's RND function uses.

- Initial seed (copied from ROM): decimal 128, 79, 199, 82, 88 (hex $80, $4F, $C7, $52, $58).
- RND(X) semantics (sign of X matters; numeric magnitude ignored):
  - X = 0: RND generates a seed value from chip-level hardware timers (uses timing/interrupt state).
  - X > 0: RND returns the next value in the pseudorandom arithmetic sequence (deterministic given the current seed).
  - X < 0: the seed value is replaced by a scrambled floating-point representation derived from X (used to explicitly seed the generator).
- Determinism: given a specific seed value, the sequence produced by RND is repeatable (useful for debugging).
- Common seeding idioms:
  - RND(-TI) — traditional Commodore method (TI is the BASIC timer variable) because RND(0) was unreliable on early PETs.
  - RND(-RND(0)) — suggested to produce a more random seed on the C64 in practice.
- Caveat: RND(0) is noted as not working reliably on some systems; see kernel location 57495 ($E097) for related behavior on the C64.

## Source Code
```text
139-143       $8B-$8F        RNDX
RND Function Seed Value

Initial ROM seed bytes (decimal): 128, 79, 199, 82, 88
Initial ROM seed bytes (hex): $80, $4F, $C7, $52, $58

Behavior summary (from original source):
- If X = 0: seed generated from chip-level hardware timers.
- If X > 0: return next number in arithmetic pseudorandom sequence.
- If X < 0: seed changed to scrambled floating-point representation of X.

Notes:
- Same seed => same pseudorandom series.
- Traditional seeding: RND(-TI).
- RND(0) may not function correctly on early PETs; on C64 see location 57495 ($E097).
- RND(-RND(0)) may yield a more random seed.
```

## Key Registers
- $008B-$008F - BASIC workspace - five-byte floating-point seed for the RND function (initial ROM seed $80,$4F,$C7,$52,$58)

## References
- "kernal_work_area_and_io_status" — expands on RND/seed interaction with timer/IRQ behavior discussed in the Kernal section
- "chrget_subroutine" — expands on text parsing and notes about interrupts near CHRGET that can influence timing/randomness

## Labels
- RNDX
