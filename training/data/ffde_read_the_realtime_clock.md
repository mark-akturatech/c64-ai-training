# KERNAL $FFDE — Read real-time clock (jiffies)

**Summary:** KERNAL entry at $FFDE returns the system real-time clock in jiffies in A,X,Y (A = most significant byte). Searchable terms: $FFDE, KERNAL, jiffies, AXY, JSR $FFDE.

## Description
JSR $FFDE reads the KERNAL real-time clock and returns a 24-bit jiffies counter across the CPU registers A (MSB), X (middle byte), and Y (LSB). The accumulator contains the most significant byte.

- Call: JSR $FFDE
- Return: A = jiffies high byte, X = jiffies middle byte, Y = jiffies low byte
- The full 24-bit jiffies value is reconstructed as (A<<16) | (X<<8) | Y.
- Note: "jiffies" is the KERNAL time unit (system tick rate depends on machine video timing, e.g. PAL/NTSC).

## Source Code
```asm
        ; Read real-time clock (jiffies) into A,X,Y
        JSR $FFDE          ; After return: A = MSB, X = mid, Y = LSB

        ; Example: store returned bytes into zero page
        STA JIFFY+0        ; store A (MSB)
        STX JIFFY+1        ; store X (mid)
        STY JIFFY+2        ; store Y (LSB)

        ; Reconstruct 24-bit jiffies in code (conceptual)
        ; JIFFIES = (A << 16) | (X << 8) | Y
```

## Key Registers
- $FFDE - KERNAL - Read the real-time clock (returns jiffies in A,X,Y; A = MSB)

## References
- "ffdb_set_the_realtime_clock" — expands on setting the clock value (related KERNAL routine)

## Labels
- READ_REALTIME_CLOCK
