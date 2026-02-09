# CIA (6526) PORT B Handshaking and PRA/PRB/DDRA/DDRB Bit Layouts

**Summary:** Describes 6526 handshaking using the /PC output and /FLAG input for PORT B, 16-bit transfer ordering (PORT A then PORT B), and per-bit layouts for PRA, PRB, DDRA and DDRB (PA0-PA7, PB0-PB7, DPAx/DPBx).

## Handshaking
- /PC (Peripheral Control) is an output that goes low for one CPU cycle immediately following a read or write access to PORT B; use this pulse to signal "data ready" (after write) or "data accepted" (after read) on PORT B.
- For 16-bit transfers using both ports, perform the transfer on PORT A first, then PORT B; the PORT B access generates the /PC handshake pulse for the pair.
- /FLAG is a negative-edge-sensitive input. It can accept another 6526's /PC output or be used as a general-purpose interrupt input; any negative transition on /FLAG sets the /FLAG interrupt bit.

## Source Code
```text
+-----+---------+------+------+------+------+------+------+------+------+
| REG |  NAME   |  D7  |  D6  |  D5  |  D4  |  D3  |  D2  |  D1  |  D0  |
+-----+---------+------+------+------+------+------+------+------+------+
|  0  |   PRA   |  PA7 |  PA6 |  PA5 |  PA4 |  PA3 |  PA2 |  PA1 |  PA0 |
|  1  |   PRB   |  PB7 |  PB6 |  PB5 |  PB4 |  PB3 |  PB2 |  PB1 |  PB0 |
|  2  |  DDRA   | DPA7 | DPA6 | DPA5 | DPA4 | DPA3 | DPA2 | DPA1 | DPA0 |
|  3  |  DDRB   | DPB7 | DPB6 | DPB5 | DPB4 | DPB3 | DPB2 | DPB1 | DPB0 |
+-----+---------+------+------+------+------+------+------+------+------+
```

## Key Registers
- $DC00-$DC03 - CIA 1 - PRA (port A), PRB (port B), DDRA (data direction A), DDRB (data direction B)
- $DD00-$DD03 - CIA 2 - PRA (port A), PRB (port B), DDRA (data direction A), DDRB (data direction B)

## References
- "6526_io_ports_overview" — expands on General I/O port behavior and PB6/PB7 timer outputs
- "6526_timers_overview" — expands on use of PB6/PB7 for timer outputs which override DDRB