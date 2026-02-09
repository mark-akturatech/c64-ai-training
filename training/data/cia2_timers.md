# CIA#2 Timers ($DD04-$DD07)

**Summary:** CIA 2 timer registers $DD04-$DD07 provide two 16-bit timers (Timer A and Timer B) used for timing and generating interrupts for devices on the system bus; each timer is read/write and accessed as low/high bytes at consecutive addresses.

## Description
Timer A and Timer B in Complex Interface Adapter 2 (CIA#2) are 16-bit, read/write counters used by the system for timing and to trigger interrupts for devices on the system bus. They are mapped to the C64 I/O area at $DD04–$DD07. Each 16-bit timer is accessed as two consecutive 8-bit registers: the low byte at the lower address and the high byte at the next address.

- Timer A: $DD04 (low byte), $DD05 (high byte)
- Timer B: $DD06 (low byte), $DD07 (high byte)

These timers can be loaded, read, and decremented by the CIA hardware; they are commonly used for timed events and for generating IRQs when they underflow (see referenced material for control-register interaction and interrupt flags).

## Source Code
```text
$DD04-$DD05  Timer A            16-bit timer counter (read/write)
$DD06-$DD07  Timer B            16-bit timer counter (read/write)
```

## Key Registers
- $DD04-$DD07 - CIA 2 - Timer A (low/high) and Timer B (low/high) 16-bit counters

## References
- "cia2_port_control" — expands on CIA#2 ports and timers used for system control