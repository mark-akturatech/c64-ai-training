# Set the real-time clock ($FFDB)

**Summary:** KERNAL entry $FFDB — set the 3‑byte system clock (jiffies, 1/60 s). Place the new time in Y,X,A (A = most significant byte / MSB) then call the routine (JSR $FFDB).

## Description
The C64 system clock (referred to as "jiffies") advances every 1/60th of a second via an IRQ handler. The clock is stored as a 3‑byte value and the KERNAL accepts a new clock value in the processor registers before calling $FFDB:

- Register convention when calling: Y = least significant byte (LSB), X = middle byte, A = most significant byte (MSB).
- Call using JSR $FFDB to update the system clock with the Y/X/A value.

The documented operational range is 0 .. 5,184,000 jiffies (24 hours + 1 jiffy); when that limit is reached the clock resets to zero.

**[Note: Source may contain an error — three bytes can represent values up to 16,777,215 ($FFFFFF), but the KERNAL documents and behavior limit the clock to 5,184,000 jiffies (24 hours) and wrap there.]**

## References
- "ffde_read_the_realtime_clock" — reading the 3‑byte clock value
- "ffea_increment_realtime_clock" — IRQ increment routine that updates the clock every 1/60s
