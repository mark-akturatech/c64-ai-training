# RND(numeric)

**Summary:** RND is the C64 BASIC floating-point pseudorandom function; its behaviour depends on the sign of the numeric argument (positive, zero, negative) and it can be scaled to produce integer ranges or a range between limits. RND(0) reads the hardware "jiffy" clock; positive arguments return the repeatable pseudorandom sequence seeded at power-up; negative arguments re-seed the generator each call.

## Description
RND(<numeric>) returns a floating-point value in the range 0.0 to 1.0. The <numeric> argument is ignored except for its sign:

- Positive argument: returns values from a repeatable pseudorandom sequence seeded at system power-up. Useful when you want a reproducible sequence for testing.
- Zero argument: generates a number derived directly from the free-running hardware "jiffy" clock (system timing source).
- Negative argument: re-seeds the pseudorandom generator on each call, producing non-repeatable results.

Notes:
- "seed" (starting value) controls the generated sequence.
- The function is floating-point; to produce integers, scale and convert to integer using INT().

Common scaling formulas (expressed generically):
- 0..N-1 integers: INT(RND(1)*N)
- 1..N integers: INT(RND(1)*N)+1
- Floating in [L, U): RND(1)*(U-L)+L

## Source Code
```basic
EXAMPLES of RND Function:

  220 PRINT INT(RND(0)*50)               (Return random integers 0-49)

  100 X=INT(RND(1)*6)+INT(RND(1)*6)+2    (Simulates 2 dice)

  100 X=INT(RND(1)*1000)+1               (Random integers from 1-1000)

  100 X=INT(RND(1)*150)+100              (Random numbers from 100-249)

  100 X=RND(1)*(U-L)+L                   (Random numbers between
                                          upper (U) and lower (L) limits)
```

## References
- "time_and_timers" — interaction with the hardware jiffy clock (RND(0) uses clock)