# CIA #2 – Data Direction, Timers, TOD, Serial, ICR ($DD02-$DD0D)

**Summary:** CIA #2 registers $DD02-$DD0D cover Data Direction Registers (C2DDRA/C2DDRB), Timers A/B (TI2ALO/TI2AHI/TI2BLO/TI2BHI), the Time-of-Day clock (TO2TEN/TO2SEC/TO2MIN/TO2HRS in BCD), the serial data port (CI2SDR) and the Interrupt Control Register (CI2ICR). The C64 OS uses CIA#2 timers for RS-232 timing; the TOD and CI2SDR are present but not used by the OS; the FLAG line on CIA#2 is exposed via the User Port and can generate interrupts.

## Data Direction Registers (C2DDRA / C2DDRB)
C2DDRA ($DD02) and C2DDRB ($DD03) control the direction of the corresponding CIA #2 Port A and Port B pins. Each bit selects input (0) or output (1) for the matching data port bit. Typical usage: configure RS‑232 lines or user port lines via these DDRs.

## Timers A and B (TI2ALO / TI2AHI / TI2BLO / TI2BHI)
TI2ALO/TI2AHI ($DD04/$DD05) and TI2BLO/TI2BHI ($DD06/$DD07) are the low/high bytes for Timers A and B on CIA #2. They mirror CIA #1 timer operation (downcounting, underflow interrupts, latch/read behaviour). The C64 OS primarily uses CIA #2 timers for RS-232 send/receive timing. For behavioral details (start/stop, one-shot/continuous modes, underflow effects), see CIA timer documentation (CIA #1 timer entries).

## Time-of-Day Clock (TO2TEN / TO2SEC / TO2MIN / TO2HRS)
The CIA #2 TOD registers at $DD08-$DD0B hold a human-readable BCD time (tenths, seconds, minutes, hours). The C64 OS does not use CIA #2 TOD. Fields and BCD encoding are provided in the register map below.

## Serial Data Port (CI2SDR)
CI2SDR ($DD0C) is the CIA #2 serial shift register (MSB first). It provides bit-serial I/O independent of the system VIA; the C64 OS does not use CIA #2’s serial port. Use with corresponding serial control bits in the CIA if implementing bit-serial protocols.

## Interrupt Control Register (CI2ICR)
CI2ICR ($DD0D) mirrors CIA #1 interrupt semantics: read-back status bits indicate which source(s) caused an interrupt; write enables/disables individual interrupts or sets/clears bits (write 1 to set, write 0 to clear when appropriate). Bit 4 corresponds to FLAG line events; the FLAG line on CIA #2 is wired to the User Port and can be used for handshaking and to generate interrupts. Bit layout and behaviours (which bits are readable vs. writable and their meanings) are included in the Source Code map below.

## Source Code
```text
56578         $DD02          C2DDRA
Data Direction Register A

Bit 0:  Select Bit 0 of data Port A for input or output (0=input, 1=output)
Bit 1:  Select Bit 1 of data Port A for input or output (0=input, 1=output)
Bit 2:  Select Bit 2 of data Port A for input or output (0=input, 1=output)
Bit 3:  Select Bit 3 of data Port A for input or output (0=input, 1=output)
Bit 4:  Select Bit 4 of data Port A for input or output (0=input, 1=output)
Bit 5:  Select Bit 5 of data Port A for input or output (0=input, 1=output)
Bit 6:  Select Bit 6 of data Port A for input or output (0=input, 1=output)
Bit 7:  Select Bit 7 of data Port A for input or output (0=input, 1=output)

56579         $DD03          C2DDRB
Data Direction Register B

Bit 0:  Select Bit 0 of data Port B for input or output (0=input, 1=output)
Bit 1:  Select Bit 1 of data Port B for input or output (0=input, 1=output)
Bit 2:  Select Bit 2 of data Port B for input or output (0=input, 1=output)
Bit 3:  Select Bit 3 of data Port B for input or output (0=input, 1=output)
Bit 4:  Select Bit 4 of data Port B for input or output (0=input, 1=output)
Bit 5:  Select Bit 5 of data Port B for input or output (0=input, 1=output)
Bit 6:  Select Bit 6 of data Port B for input or output (0=input, 1=output)
Bit 7:  Select Bit 7 of data Port B for input or output (0=input, 1=output)

Location Range: 56580-56583 ($DD04-$DD07)
Timer A and B Low and High Bytes

These four timer registers are used to control Timers A and B.  For
details on the operation of these timers, see the entry for Location
Range 56324-56327 ($DC04-$DC07).

The 64 Operating System uses the CIA #2 Timers A and B mostly for
timing RS-232 send and receive operations.  Serial Bus timing uses CIA
#1 Timer B.

56580         $DD04          TI2ALO
Timer A (low byte)

56581         $DD05          TI2AHI
Timer A (high byte)

56582         $DD06          TI2BLO
Timer B (low byte)

56583         $DD07          TI2BHI
Timer B (high byte)

Location Range: 56584-56587 ($DD08-$DD0B)
Time of Day Clock

In addition to the two general purpose timers, the 6526 CIA chip has a
special purpose Time of Day Clock, which keeps time in a format that
humans can understand a little more easily than microseconds.  For
more information about this clock, see the entry for Location Range
56328-56331 ($DC08-$DC0B).  The 64's Operating system does not make
use of these registers.

56584         $DD08          TO2TEN
Time of Day Clock Tenths of Seconds

Bits 0-3:  Time of Day tenths of second digit (BCD)
Bits 4-7:  Unused

56585         $DD09          TO2SEC
Time of Day Clock Seconds

Bits 0-3:  Second digit of Time of Day seconds (BCD)
Bits 4-6:  First digit of Time of Day seconds (BCD)
Bit 7:  Unused

56586         $DD0A          TO2MIN
Time of Day Clock Minutes

Bits 0-3:  Second digit of Time of Day minutes (BCD)
Bits 4-6:  First digit of Time of Day minutes (BCD)
Bit 7:  Unused

56587         $DD0B          TO2HRS
Time of Day Clock Hours

Bits 0-3:  Second digit of Time of Day hours (BCD)
Bit 4:  First digit of Time of Day hours (BCD)
Bits 5-6:  Unused
Bit 7:  AM/PM flag (1=PM, 0=AM)

56588         $DD0C          CI2SDR
Serial Data Port

The CIA chip has an on-chip serial port, which allows you to send or
receive a byte of data one bit at a time, with the most significant
bit (Bit 7) being transferred first.  For more information about its
use, see the entry for location 56332 ($DC0C).  The 64's Operating
System does not use this facility.

56589         $DD0D          CI2ICR
Interrupt Control Register

Bit 0:  Read / did Timer A count down to 0?  (1=yes)
        Write/ enable or disable Timer A interrupt (1=enable, 0=disable)
Bit 1:  Read / did Timer B count down to 0?  (1=yes)
        Write/ enable or disable Timer B interrupt (1=enable, 0=disable)
Bit 2:  Read / did Time of Day Clock reach the alarm time?  (1=yes)
        Write/ enable or disable TOD clock alarm interrupt (1=enable,
        0=disable)
Bit 3:  Read / did the serial shift register finish a byte?  (1=yes)
        Write/ enable or disable serial shift register interrupt (1=enable,
        0=disable)
Bit 4:  Read / was a signal sent on the FLAG line?  (1=yes)
        Write/ enable or disable FLAG line interrupt (1=enable, 0=disable)
Bit 5:  Not used
Bit 6:  Not used
Bit 7:  Read / did any CIA #2 source cause an interrupt?  (1=yes)
        Write/ set or clear bits of this register (1=bits written with 1 will
        be set, 0=bits written with 1 will be cleared)
```

## Key Registers
- $DD02-$DD03 - CIA-II - Data Direction Registers A/B (C2DDRA, C2DDRB)
- $DD04-$DD07 - CIA-II - Timer A/B low/high bytes (TI2ALO, TI2AHI, TI2BLO, TI2BHI)
- $DD08-$DD0B - CIA-II - Time-of-Day clock (TO2TEN, TO2SEC, TO2MIN, TO2HRS) — BCD
- $DD0C       - CIA-II - Serial Data Register (CI2SDR)
- $DD0D       - CIA-II - Interrupt Control Register (CI2ICR)

## References
- "ci2pra_ci2prb_and_data_direction_defaults" — expands on default DDR setups and RS-232 opening effects
- "ciaicr_interrupt_control" — expands on interrupt control semantics similar to CIA #1

## Labels
- C2DDRA
- C2DDRB
- TI2ALO
- TI2AHI
- TI2BLO
- TI2BHI
- CI2SDR
- CI2ICR
