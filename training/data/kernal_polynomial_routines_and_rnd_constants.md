# KERNAL ROM: POLY1/POLY2 Function Evaluation and RND (RMULC/RADDC) Entries

**Summary:** Describes KERNAL BASIC math/evaluation routines POLY1 ($E043) and POLY2 ($E059), the RND routine ($E097) and its five-byte floating-point constants RMULC ($E08D) and RADDC ($E092), and how RND seeds/read uses CIA #1 Timer A and TOD registers ($DC04-$DC05, $DC08-$DC09). Includes seed location 139 ($008B).

**Function Series Evaluation Routines**

POLY1 (decimal 57411, $E043) and POLY2 (decimal 57433, $E059) are KERNAL/BASIC evaluation helpers:

- **POLY1 ($E043):** A helper used to evaluate more complex expressions; it calls POLY2 for intermediate evaluation.
- **POLY2 ($E059):** The main series-evaluation routine. It evaluates expressions by walking a table of operand/operator entries and performing the required operations in sequence to compute the final value.

Both routines operate on the BASIC interpreter's floating-point accumulator and evaluation tables (BASIC internals).

**RND, RMULC, RADDC — Algorithm and Seeding Behavior**

- **RMULC ($E08D, decimal 57485):** Holds the five-byte floating-point constant 25214903917 (decimal), which is approximately 5.877472E-39 in BASIC's floating-point format.
- **RADDC ($E092, decimal 57490):** Holds the five-byte floating-point constant 11 (decimal), which is approximately 2.9387359E-39 in BASIC's floating-point format.
- **Seed Location:** Memory location 139 (decimal) = $008B (zero-page) stores the current seed used by RND.
- **RND ($E097, decimal 57495) Behavior Depending on Argument X:**
  - **X > 0 (Positive):** The next RND value is produced by multiplying the seed (at $008B) by RMULC, adding RADDC, then scrambling the resulting bytes. This yields the next value in a long pseudo-random sequence.
  - **X < 0 (Negative):** The argument value itself is scrambled and written into the seed, allowing reproducible sequences from a known seed.
  - **X = 0:** RND loads four bytes into the floating-point accumulator from CIA #1: Timer A low, Timer A high, TOD tenths-of-second, and TOD seconds. That assembled value becomes the new seed; subsequent calls like RND(1) produce the sequence. Note: on the C64, this is imperfect because the OS does not start the TOD clock and TOD bytes are BCD-based, limiting entropy for RND(0).

## Source Code

```text
Addresses (KERNAL ROM entries)
  POLY1   = $E043   (57411)   ; Function Series Evaluation Subroutine 1 (calls POLY2)
  POLY2   = $E059   (57433)   ; Function Series Evaluation Subroutine 2 (main evaluator)
  RMULC   = $E08D   (57485)   ; 5-byte floating-point multiplicative constant for RND
  RADDC   = $E092   (57490)   ; 5-byte floating-point additive constant for RND
  RND     = $E097   (57495)   ; Random number routine

RND algorithm (summary)
  - Seed at $008B (location 139 decimal)
  - For X>0: NewSeed = scramble( (Seed * RMULC) + RADDC )
  - For X<0: Seed = scramble(X)   ; set seed from argument
  - For X=0: Seed loaded from CIA#1 registers:
      - Timer A low byte  = $DC04
      - Timer A high byte = $DC05
      - TOD tenths         = $DC08
      - TOD seconds        = $DC09
  - RMULC/RADDC stored in 5-byte BASIC floating-point format (MSB..LSB ordering per BASIC FP)

Notes:
  - RMULC and RADDC are in BASIC 5-byte FP format used by the BASIC/FPU routines.
  - The "scramble" step is the KERNAL/BASIC byte-level transformation used to mix FP bytes into the seed.
  - RND(0) entropy on C64 is limited: OS does not start TOD and TOD registers are BCD-encoded.
```

## Key Registers

- **$008B:** RAM - RND seed location (decimal 139)
- **$DC04-$DC05:** CIA 1 - Timer A low/high (used by RND(0) seed)
- **$DC08-$DC09:** CIA 1 - TOD tenths-of-second / TOD seconds (used by RND(0) seed)

## References

- "time_of_day_clock_tod_description_and_usage" — TOD registers, their format (BCD), and limitations for RND(0) seeding
- "Commodore 64 Programmer's Reference Guide" — Detailed information on KERNAL routines and floating-point constants
- "Random Numbers in Machine Language for Commodore 64" — Explanation of RND function and its behavior

## Labels
- POLY1
- POLY2
- RMULC
- RADDC
- RND
