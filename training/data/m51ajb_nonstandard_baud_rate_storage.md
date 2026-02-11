# M51AJB ($0295-$0296) — RS-232 nonstandard bit timing (user-defined baud prescaler)

**Summary:** KERNAL variables M51AJB at $0295-$0296 (decimal 661–662) store a user-defined RS-232 baud prescaler used when the low nybble of M51CTR ($0293) is 0; software emulation is not implemented. Commodore specified PRESCALER = (system_clock / baud / 2) - 100, stored low-byte then high-byte. System clocks: NTSC 1.02273 MHz, PAL 0.98525 MHz.

## Description
These two KERNAL locations (M51AJB) are reserved to hold a nonstandard baud-rate prescaler for the RS-232/6551-like functionality. They are used only when the low nybble of the control byte M51CTR at $0293 is zero. The current Commodore KERNAL release does not implement software emulation of the nonstandard-baud feature, so these locations are presently nonfunctional; they are provided to match the 6551 UART model.

If/when the feature is implemented, Commodore specifies the value to store as:
PRESCALER = (system_clock / baud / 2) - 100

Storage order is low byte first, then high byte (little-endian).

System clock frequencies to use in the formula:
- NTSC (American): 1.02273 MHz
- PAL (European): 0.98525 MHz

No further behavior (timing rounding, integer truncation, allowed prescaler ranges) is defined in this source; implementation details are left to the emulator/driver.

## Source Code
```text
Name / locations:
  Decimal: 661-662
  Hex:    $0295-$0296
  Label:  M51AJB
  Purpose: RS-232 nonstandard bit timing prescaler (low byte, high byte)

Behavior (Commodore-specified, if implemented):
  PRESCALER = (system_clock / baud / 2) - 100
  Stored as: low byte, then high byte (little-endian)

System clock values:
  NTSC: 1.02273 MHz
  PAL:  0.98525 MHz

Related variable:
  M51CTR at $0293 — RS-232 control register; low nybble = 0 selects nonstandard prescaler
```

## Key Registers
- $0293 - KERNAL - M51CTR: RS-232 control register (low nybble = 0 enables nonstandard prescaler)
- $0295-$0296 - KERNAL - M51AJB: Nonstandard baud prescaler (low byte, high byte)

## References
- "baudoftime_prescaler" — expands on intended BAUDOF prescaler usage and implementation notes

## Labels
- M51AJB
- M51CTR
