# CIA #2 Data Port B ($DD01) — User Port / RS-232 status and control

**Summary:** CIA #2 Data Port B at $DD01 (C64 user port / RS-232) — bit definitions for RS-232 and user lines: bit 7 DSR, bit 6 CTS, bit 5 user, bit 4 CD, bit 3 RI, bit 2 DTR, bit 1 RTS, bit 0 Received Data (RXD). Direction for each bit is controlled by DDRB ($DD03).

## Description
This register is the CIA #2 (base $DD00) Port B data register used for the User Port / RS-232 signals on the C64. Each bit corresponds to a user/RS-232 line as listed below. The effective direction (input or output) of each bit is controlled by the Data Direction Register B (DDRB) at $DD03 (1 = output, 0 = input).

Bit assignments (MSB = bit 7):
- Bit 7 — Data Set Ready (DSR)
- Bit 6 — Clear To Send (CTS)
- Bit 5 — User-defined (general-purpose)
- Bit 4 — Carrier Detect (CD)
- Bit 3 — Ring Indicator (RI)
- Bit 2 — Data Terminal Ready (DTR)
- Bit 1 — Request To Send (RTS)
- Bit 0 — Received Data (RXD / Received Data)

Typical usage: when connected to user-port/RS-232 circuitry, these bits reflect or drive the corresponding modem/serial control and data lines. Use DDRB ($DD03) to configure each line direction as required.

**[Note: Source may contain an error — the decimal address given (56577) does not match $DD01. Correct decimal for $DD01 is 56513.]**

## Source Code
```text
  DD01       56577                 Data Port B (User Port, RS-232)
                            7      User / RS-232 Data Set Ready
                            6      User / RS-232 Clear to Send
                            5      User
                            4      User / RS-232 Carrier Detect
                            3      User / RS-232 Ring Indicator
                            2      User / RS-232 Data Terminal Ready
                            1      User / RS-232 Request to Send
                            0      User / RS-232 Received Data
```

## Key Registers
- $DD01 - CIA 2 - Data Port B (User Port / RS-232 status & control)

## References
- "cia2_overview_and_dd00_port_a" — expands on CIA #2 Data Port A and VIC memory bank select