# KERNAL: RDTIM ($FFDE) — Read system clock

**Summary:** RDTIM is the KERNAL routine at $FFDE (65502) that reads the system clock (jiffies, 1/60s resolution). Returns three bytes in A (MSB), X (middle), Y (LSB); stack requirement 2.

## Description
RDTIM reads the system clock, whose resolution is 1/60 second (jiffies). The routine returns a 24-bit time value across registers in big-endian order:
- A = most significant byte (MSB)
- X = middle byte
- Y = least significant byte (LSB)

Call it via JSR $FFDE (or JSR RDTIM if the symbol is available). No preparatory routines or error codes. Stack usage is 2 bytes. Registers A, X and Y are overwritten by the call.

Typical use: store the three returned bytes to memory (LSB at the first address, MSB at the highest) if you need the 24-bit time value for later comparison or conversion.

## Source Code
```asm
; Example: read system clock and store 3-byte time at label TIME (TIME..TIME+2)
        JSR $FFDE        ; JSR RDTIM
        STY TIME         ; store LSB
        STX TIME+1       ; store middle byte
        STA TIME+2       ; store MSB

; Labels
TIME    .BYTE 0,0,0
```

## Key Registers
- $FFDE - KERNAL - RDTIM entrypoint (call to read system clock; returns A=MSB, X=middle, Y=LSB)

## References
- "settim_kernal_routine" — covers SETTIM (setting the system clock)

## Labels
- RDTIM
