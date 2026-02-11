# BAUDOF ($0299-$029A)

**Summary:** BAUDOF ($0299-$029A) holds the prescaler (time-per-bit) used by CIA #2 timers A and B to drive NMI RS-232 receive/transmit routines; uses system CLOCK (NTSC 1,022,730 Hz, PAL 985,250 Hz) and prescaler formula PRESCALER = ((CLOCK/BAUDRATE)/2) - 100. Standard prescaler tables live in ROM at $FEC2 (NTSC) and $E4EC (PAL); control register at $0293 selects standard baud rates.

## Description
This RAM location contains the prescaler value used by CIA #2 timers A and B. The CIA timers trigger NMI interrupts that run the RS-232 receive and transmit routines CLOCK/PRESCALER times per second each.

- CLOCK = system crystal frequency:
  - NTSC: 1,022,730 Hz
  - PAL: 985,250 Hz
- PRESCALER is loaded into CIA #2 timer latches (low byte, high byte) and is read/written at the CIA timer addresses (see Key Registers).
- Formula to compute the prescaler for a desired serial BAUDRATE:
  - PRESCALER = ((CLOCK / BAUDRATE) / 2) - 100

The KERNAL/ROM contains lookup tables of two-byte prescaler values for standard RS-232 baud rates (the NTSC table starts with the two-byte value for 50 baud). The control register at $0293 (see Key Registers) makes the standard baud rates available; the NTSC table is at $FEC2 and the PAL table is at $E4EC.

## Key Registers
- $0299-$029A - RAM - BAUDOF prescaler (time-per-bit) used by CIA #2 timers A and B for RS-232 NMI timing
- $0293 - RAM - RS-232 control register (selects standard baud rates)
- $DD04-$DD05 - CIA 2 - Timer A latch (low, high) — used as prescaler value for RS-232 timing
- $DD06-$DD07 - CIA 2 - Timer B latch (low, high) — used as prescaler value for RS-232 timing
- $FEC2 - ROM - NTSC prescaler table (two-byte entries, starts with 50 baud)
- $E4EC - ROM - PAL prescaler table (two-byte entries; PAL equivalents of NTSC values)

## References
- "rs232_bitnum" — expands on bit padding / word length for RS-232
- "rs232_status_error_bits" — expands on when to read buffer / GET#2 and error status bits

## Labels
- BAUDOF
