# CIA 6526 Serial Data Register (SDR) — Offset $0C

**Summary:** SDR ($0C) — an 8-bit bidirectional shift register in the CIA 6526 used for synchronous serial I/O; mode selected by CRA bit 6 (output when 1, input when 0). Uses SP and CNT pins and Timer A as the clock source for output mode; generates an interrupt when a full byte is transferred.

## Operation
The Serial Data Register (SDR) is an 8-bit shift register providing a bidirectional synchronous serial port.

Output mode (CRA bit 6 = 1)
- Data written to SDR is shifted out MSB-first on the SP pin.
- Timer A underflows provide the shift clock (one shifted bit per Timer A underflow).
- The actual clock signal appears on the CNT pin at half the Timer A underflow rate.
- An interrupt is generated when all 8 bits have been shifted out (byte complete).
- If new data is written to SDR before the current byte finishes shifting, the new byte will begin immediately after the current byte completes.

Input mode (CRA bit 6 = 0)
- An external clock on the CNT pin provides the shift clock.
- Data is sampled and shifted in on SP on each positive edge of CNT.
- An interrupt is generated when 8 bits have been received.
- The received byte is read from SDR after the transfer completes.

## Key Registers
- $DC0C - CIA1 - Serial Data Register (SDR) at offset $0C
- $DD0C - CIA2 - Serial Data Register (SDR) at offset $0C

## References
- "control_register_a" — expands on CRA bit 6 selection of serial input/output mode and Timer A as shift clock  
- "serial_shift_register_notes" — practical notes on using the SDR, baud limits, SP/CNT behavior  
- "interrupt_control_register_icr" — SDR transfer completion flags and interrupt handling (ICR)

## Labels
- SDR
