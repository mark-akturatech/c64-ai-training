# $DC0C CIASDR — CIA Serial Data Register (CIA1)

**Summary:** $DC0C (CIASDR) is the CIA1 serial data register for bit-serial transfers (MSB first); Control Register A ($DC0E / 56334) selects input/output mode and Timer A clocks transmission in output mode. Uses User Port SP (pin 5) and CNT (pin 4); generates an interrupt after 8 bits. Typically unused by the C64 OS.

## Description
The CIASDR at $DC0C is the on-chip serial port register of CIA1 (User Port). It performs bit-serial transfers, sending or receiving one bit at a time with the most-significant bit (bit 7) first.

- Modes (selected by Control Register A, $DC0E / decimal 56334):
  - Input mode: each incoming bit is sampled from SP (User Port pin 5) when a transition/clock appears on CNT (User Port pin 4). After eight bits are received, the assembled byte is placed in the Serial Data Register and the CIA interrupt for serial completion is generated.
  - Output mode: writing a byte to CIASDR starts transmission (provided Timer A is running and in continuous mode). Bits are output on SP (pin 5); CNT (pin 4) toggles to indicate bit transfers. After eight bits have been transmitted, the CIA interrupt for serial completion is generated and the next byte may be written.

- Timing and clocking:
  - Output bit rate is derived from Timer A; the serial clock used for bit timing is half the Timer A rate (byte transmission requires Timer A running in the appropriate mode).
  - Transmission starts immediately when a byte is written to $DC0C if Timer A is active in continuous mode.

- Practical notes from the source:
  - The C64’s OS does not use this CIA serial port; the machine uses the standard parallel data ports for the system serial routines instead.
  - For detailed control bits and timer clock selection, see the documentation for Control Register A ($DC0E).

## Source Code
```text
; CIA1 serial registers (reference)
; $DC00 base = CIA 1

$DC0C  CIASDR   - Serial Data Register (bit-serial data, MSB first)
$DC0E  CIACRA   - Control Register A (select input/output serial mode; Timer A clock/select)
; Decimal equivalents:
; $DC0C = 56332
; $DC0E = 56334

; User Port pins used:
; SP  = User Port pin 5  (serial data in/out)
; CNT = User Port pin 4  (serial clock/control)
```

## Key Registers
- $DC0C - CIA 1 - Serial Data Register (CIASDR), bit-serial data (MSB first)
- $DC0E - CIA 1 - Control Register A (CRA), selects serial input/output mode and Timer A clocking

## References
- "dc0e_ciacra_control_register_a" — expands on Control bits to set serial mode and timer clock selection

## Labels
- CIASDR
- CIACRA
