# CIA#1 Timer Control ($DC0E-$DC0F) and Image Mirror Area ($DC10-$DCFF)

**Summary:** CIA#1 timer control registers at $DC0E/$DC0F (Timer A/B Control) manage timer operations, including start/stop, output mode, and count source. The CIA#1 image mirror region $DC10-$DCFF contains repeated register images every $10 bytes.

**Timer Control Registers**

- **$DC0E (CIA#1 Timer A Control):** This register controls Timer A's operation.

  - **Bit 0:** Start/Stop control.
    - 0: Stop timer.
    - 1: Start timer.
  - **Bit 1:** Output mode.
    - 0: Toggle output on underflow.
    - 1: Generate pulse on underflow.
  - **Bit 2:** Force load.
    - 0: No action.
    - 1: Load timer with latch value.
  - **Bit 3:** Run mode.
    - 0: Continuous mode.
    - 1: One-shot mode.
  - **Bits 4-5:** Input mode.
    - 00: Count system cycles.
    - 01: Count positive edges on CNT pin.
    - 10: Count underflows of Timer B.
    - 11: Count underflows of Timer B when CNT pin is high.
  - **Bit 6:** Serial port mode.
    - 0: Serial port disabled.
    - 1: Serial port enabled.
  - **Bit 7:** Time-of-Day clock mode.
    - 0: Writing to TOD registers sets the clock time.
    - 1: Writing to TOD registers sets the alarm time.

- **$DC0F (CIA#1 Timer B Control):** This register controls Timer B's operation and has a similar bit layout to Timer A Control, with differences in the input mode selection.

  - **Bit 0:** Start/Stop control.
    - 0: Stop timer.
    - 1: Start timer.
  - **Bit 1:** Output mode.
    - 0: Toggle output on underflow.
    - 1: Generate pulse on underflow.
  - **Bit 2:** Force load.
    - 0: No action.
    - 1: Load timer with latch value.
  - **Bit 3:** Run mode.
    - 0: Continuous mode.
    - 1: One-shot mode.
  - **Bits 4-5:** Input mode.
    - 00: Count system cycles.
    - 01: Count positive edges on CNT pin.
    - 10: Count underflows of Timer A.
    - 11: Count underflows of Timer A when CNT pin is high.
  - **Bit 6:** Serial port mode.
    - 0: Serial port disabled.
    - 1: Serial port enabled.
  - **Bit 7:** Time-of-Day clock mode.
    - 0: Writing to TOD registers sets the clock time.
    - 1: Writing to TOD registers sets the alarm time.

**Mirror Area Mapping**

The CIA#1 registers are mirrored every $10 (16 decimal) bytes within the $DC10-$DCFF range. This means each register at $DC00-$DC0F is repeated at intervals of $10 bytes throughout this address space.

For example:

- $DC00 (Data Port A) is mirrored at $DC10, $DC20, ..., up to $DCF0.
- $DC01 (Data Port B) is mirrored at $DC11, $DC21, ..., up to $DCF1.
- This pattern continues for all registers up to $DC0F.

This mirroring occurs because the CIA chip only decodes the lower 4 bits of the address, leading to repeated register images every 16 bytes.

## Source Code
```text
Timer Control:

$DC0E   Timer A Control         Start, output mode, and count source
$DC0F   Timer B Control         Start, output mode, and count source

Mirror Area:

$DC10-$DCFF  CIA#1 Images       Register images (repeated every $10 bytes)
```

## Key Registers
- $DC0E - CIA#1 - Timer A Control (Start, output mode, count source)
- $DC0F - CIA#1 - Timer B Control (Start, output mode, count source)
- $DC10-$DCFF - CIA#1 - Register images (mirrored every $10 bytes)

## References
- "cia1_timers" — expands on timer counters and control registers