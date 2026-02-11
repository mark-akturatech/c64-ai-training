# SET REAL TIME CLOCK (Wrapper at $FFDB → $F6E4)

**Summary:** ROM wrapper at $FFDB that JMPs to $F6E4 to set the Commodore 64 system real-time clock; time value is a 3-byte jiffies count in Y/X/A (A = most significant). The clock is updated by an interrupt every 1/60th second and rolls over after 5,184,000 jiffies.

## Description
This KERNAL entry sets the system realtime clock, a 3-byte jiffies counter maintained by an interrupt routine that increments the clock every 1/60th of a second (jiffies). The clock stores a value from 0 up to 5,184,000 jiffies (24 hours × 60 jiffies/sec = 5,184,000); when the count reaches 5,184,000 it wraps to zero.

Calling convention:
- Before calling, load the desired time in jiffies into registers Y, X, and A, with A holding the most significant byte (order: Y = LSB, X = middle, A = MSB).
- Call the wrapper at $FFDB (typical call: JSR $FFDB) — the byte at $FFDB is a JMP to the actual implementation at $F6E4.

Behavior notes:
- The 3 bytes represent an unsigned 24-bit jiffies count.
- The set routine expects the bytes in Y/X/A as specified; incorrect byte order will produce an incorrect clock value.
- The wrapper at $FFDB simply jumps to $F6E4 (the real routine). The routine at $F6E4 performs the clock write (details of F6E4 are in the "real_time_clock" reference).

## Source Code
```asm
.,FFDB 4C E4 F6 JMP $F6E4       set real time clock
```

## References
- "real_time_clock" — expands on the $F6E4 clock set routine (implementation details)

## Labels
- SET_REAL_TIME_CLOCK
