# CIA 6526 Serial (Shift) Register — Synchronous Serial Port

**Summary:** CIA 6526 synchronous serial port (SDR $0C) supports output (CRA bit 6 = 1) and input (CRA bit 6 = 0) modes; uses Timer A or external CNT clock, shifts MSB-first on SP, and raises an interrupt on 8-bit transfer completion (ICR SP flag). Maximum baud in output mode ≈ PHI2/4 (≈250 kbit/s).

## Serial Shift Register
The CIA's 8-bit shift register (SDR) implements a synchronous serial port with two modes selected by Control Register A (CRA) bit 6.

Output mode (CRA bit 6 = 1)
- Host writes the byte to SDR ($0C).
- Timer A provides the shift clock for the transfer.
- Data is shifted out MSB-first on the SP pin.
- The CNT pin outputs the shift clock at half the Timer A rate.
- An interrupt is generated when the byte transfer completes (sets the ICR SP flag).
- Maximum achievable baud ≈ PHI2/4 (≈250 kbit/s).

Input mode (CRA bit 6 = 0)
- An external clock on CNT shifts data into the CIA.
- Data is sampled on the SP pin and shifted into the SDR (MSB-first).
- An interrupt is generated after 8 bits are received (ICR SP flag).
- CPU reads the received byte from SDR ($0C).

Notes
- CRA bit 6 selects serial direction (1 = output, 0 = input). See Control Register A for full bit meanings and Timer A linkage.
- The SP pin is the serial data line; CNT is the clock/control line.
- Transfer completion signals are routed via the Interrupt Control Register (ICR) — the SP flag indicates SDR transfer completion.

## Key Registers
- $DC0C / $DD0C - CIA (6526) - Serial Data Register (SDR) — write to send (output mode), read to receive (input mode)

## References
- "serial_data_register_sdr" — expands on SDR operation details and SP/CNT usage  
- "control_register_a" — expands on CRA bit 6 and Timer A linkage to SDR  
- "interrupt_control_register_icr" — expands on ICR SP flag set on SDR transfer completion

## Labels
- SDR
