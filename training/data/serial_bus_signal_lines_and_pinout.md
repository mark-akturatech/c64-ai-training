# COMMODORE 64 serial bus pin mapping (6-pin DIN)

**Summary:** Six serial bus signal lines (pins 1–6) used for Commodore 64 serial I/O: /SERIAL SRQ (pin 1, input), GND (pin 2), SERIAL ATN (pin 3, output), SERIAL CLK (pin 4, bidirectional), SERIAL DATA (pin 5, bidirectional), and /RESET (pin 6). Covers signal names, directions, and an ASCII connector diagram.

## Serial I/O signals
Six physical lines on the Commodore 64 serial connector carry the data, control and timing between the C64 and external serial devices. The set includes three inputs and three outputs (counting bidirectional lines appropriately). Below are the signal names and directions as given:

- Pin 1 — /SERIAL SRQ IN  
  - Active-low service-request (input into the C64).
- Pin 2 — GND  
  - Signal ground reference.
- Pin 3 — SERIAL ATN OUT  
  - Attention line driven by the C64 (control).
- Pin 4 — SERIAL CLK IN/OUT  
  - Serial clock, bidirectional (timing).
- Pin 5 — SERIAL DATA IN/OUT  
  - Serial data, bidirectional (data).
- Pin 6 — /RESET  
  - Reset line (active-low).

These lines implement the Commodore serial bus signalling used for communication with disk drives, printers and other peripherals. Directionality above is taken from the original mapping (IN, OUT, IN/OUT).

## Source Code
```text
There are 6 lines used in serial bus operations - input and 3 output.
  The 3 input lines bring data, control, and timing signals into the Com-
  modore 64. The 3 output lines send data, control, and timing signals from
  the Commodore 64 to external devices on the serial bus.

  Serial I/O
                                                       ++ ++
  +-------+----------------------+                    / +-+ \
  |  Pin  |         Type         |                   /5     1\
  +-------+----------------------+                  +  O   O  +
  |   1   |  /SERIAL SRQ IN      |                  |    6    |
  |   2   |  GND                 |                  |    O    |
  |   3   |  SERIAL ATN OUT      |                  |         |
  |   4   |  SERIAL CLK IN/OUT   |                  +  O   O  +
  |   5   |  SERIAL DATA IN/OUT  |                   \4  O  2/
  |   6   |  /RESET              |                    \  3  /
  +-------+----------------------+                     +---+
```

## References
- "serial_bus_overview" — overview of serial bus roles and addressing  
- "serial_bus_common_addresses" — examples of device addresses used on the bus