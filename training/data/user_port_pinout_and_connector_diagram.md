# Commodore 64 — User I/O (User Port) pinout and connector diagram

**Summary:** User Port (24-pin) pinout listing pins 1–12 and lettered pins A–N with signal names and notes (GND, +5V max 100 mA, /RESET, CNT1, SP1, CNT2, SP2, /PC2, SERIAL ATN OUT, 9VAC pins, /FLAG2, PB0–PB7, PA2). Includes printed connector pin-order diagram for the 24-pin user port.

## Description
This chunk documents the physical pinout for the Commodore 64 User I/O (user) port. The port presents two rows: one side numbered 1–12 and the opposite side lettered A–N (as printed on the PCB connector). Signals include power and ground, two 9 VAC lines (limited), a +5 V output (limited to 100 mA), control/timer lines (CNT1/CNT2, SP1/SP2), serial attention output (SER. ATN OUT), active-low control lines (/RESET, /PC2, /FLAG2) and an 8-bit parallel port labeled PB0–PB7 plus PA2. Use the printed connector diagram to determine physical orientation when wiring connectors or adapters.

Notes preserved from source:
- +5 V output is limited to MAX. 100 mA.
- Both 9 VAC pins carry the same note (MAX. 100 mA) in the original table.
- Pin labeling uses numeric (1–12) and alphabetic (A–N) designations across the two rows as shown in the connector diagram.

## Source Code
```text
+-----+---------------+-----------+   +-----+---------------+-----------+
| Pin |      Type     |    Note   |   | Pin |      Type     |    Note   |
+-----+---------------+-----------+   +-----+---------------+-----------+
|   1 |  GND          |           |   |  A  |  GND          |           |
|   2 |  +5V          |MAX. 100 mA|   |  B  |  /FLAG2       |           |
|   3 |  /RESET       |           |   |  C  |  PB0          |           |
|   4 |  CNT1         |           |   |  D  |  PB1          |           |
|   5 |  SP1          |           |   |  E  |  PB2          |           |
|   6 |  CNT2         |           |   |  F  |  PB3          |           |
|   7 |  SP2          |           |   |  H  |  PB4          |           |
|   8 |  /PC2         |           |   |  I  |  PB5          |           |
|   9 |  SER. ATN OUT |           |   |  K  |  PB6          |           |
|  10 |  9 VAC        |MAX. 100 mA|   |  L  |  PB7          |           |
|  11 |  9 VAC        |MAX. 100 mA|   |  M  |  PA2          |           |
|  12 |  GND          |           |   |  N  |  GND          |           |
+-----+---------------+-----------+   +-----+---------------+-----------+
```

```text
Printed connector pin-order diagram (24-pin user port):
                                             1 1 1
                           1 2 3 4 5 6 7 8 9 0 1 2
                        +--@-@-@-@-@-@-@-@-@-@-@-@--+
                        |                           |
                        +--@-@-@-@-@-@-@-@-@-@-@-@--+
                           A B C D E F H J K L M N
```

## References
- "control_ports_joystick_paddle_pinouts" — expands on Control ports (game I/O) for joystick and paddles
- "cassette_connector_pinout" — expands on Cassette connector (adjacent peripheral port)
