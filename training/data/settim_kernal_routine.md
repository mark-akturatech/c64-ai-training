# KERNAL SETTIM ($FFDB)

**Summary:** SETTIM is the KERNAL routine at $FFDB (65499) that sets the 3-byte system clock (jiffies, 1/60 sec). Call with A = MSB, X = middle byte, Y = LSB; stack usage 2, no registers affected on return.

## Description
SETTIM writes the 3-byte system clock used by the interrupt-driven timer that increments once per jiffy (1/60th of a second). The clock is stored as a 3-byte value (MSB, middle, LSB) and can count up to 5,184,000 jiffies (which equals 24 hours); when that limit is reached the clock wraps to zero.

Calling convention and behavior:
- Call address: $FFDB (hex) / 65499 (decimal)
- Input registers:
  - A = most significant byte (MSB)
  - X = middle byte
  - Y = least significant byte (LSB)
- Preparatory routines: None required
- Stack requirements: 2 (JSR pushes return address)
- Error returns: None
- Registers affected: None (no registers are modified on return)
- Timing unit: jiffy = 1/60 second
- Wrap behavior: value wraps to 0 after 5,184,000 jiffies

How to use (high-level):
1. Load A with MSB of the 3-byte jiffies value.
2. Load X with the middle byte.
3. Load Y with the LSB.
4. JSR to SETTIM ($FFDB).

## Source Code
```asm
; Example: Set the clock to 10 minutes = 3600 jiffies
; (A = MSB, X = middle, Y = LSB)
        LDA #$00        ; MOST SIGNIFICANT
        LDX #>3600      ; middle byte (high byte of 16-bit constant)
        LDY #<3600      ; LEAST SIGNIFICANT
        JSR $FFDB       ; JSR SETTIM
```

## Key Registers
- $FFDB - KERNAL - SETTIM call address (Set 3-byte system clock; A=MSB, X=middle, Y=LSB)

## References
- "rdtim_kernal_routine" — expands on RDTIM (reads the clock set by SETTIM)

## Labels
- SETTIM
