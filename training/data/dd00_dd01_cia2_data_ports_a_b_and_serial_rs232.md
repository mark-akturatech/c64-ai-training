# CIA #2 Data Ports A and B ($DD00-$DD01)

**Summary:** CIA #2 data ports at $DD00-$DD01 map the C64 Serial Bus and RS-232/User Port signals (Serial Bus bits: data/clock/ATN; RS-232: DSR/CTS/DCD/RI/DTR/RTS/SIN; User Port exposes Port B and PA2). CIA timers and shift/CNT lines interact with these ports for serial timing and conversion.

**CIA #2 Data Ports (Serial Bus & RS-232)**
These two CIA registers are the interface points for the C64 Serial Bus, the RS-232 functions, and the external User Port connector.

- **Serial Bus**
  - Implemented as a bit-serial, multi-drop (daisy-chained) bus similar to the PET IEEE bus; each byte is transmitted one bit at a time, making it at least eight times slower than parallel IEEE transfers.
  - Commonly used for the 1541 disk drive and the 1525 printer.
  - CIA #1 Timer B is used by the Serial Bus for timing (see referenced timer overview).

- **Data Port A ($DD00)**
  - Controls and reads Serial Bus signals:
    - Bit 7 — Serial Bus Data Input
    - Bit 6 — Serial Bus Clock Input
    - Bit 5 — Serial Bus Data Output
    - Bit 4 — Serial Bus Clock Output
    - Bit 3 — Serial Bus ATN (attention) output
  - Also provides the RS-232 data output line:
    - Bit 2 — RS-232 data output (connected to the User Port)
  - Remaining bits behave as general-purpose I/O per the Data Direction Register.

- **Data Port B ($DD01)**
  - Hosts the primary RS-232/status lines (also available on the User Port):
    - Bit 7 — DSR (Data Set Ready)
    - Bit 6 — CTS (Clear To Send)
    - Bit 4 — DCD (Carrier Detect)
    - Bit 3 — RI (Ring Indicator)
    - Bit 2 — DTR (Data Terminal Ready)
    - Bit 1 — RTS (Request To Send)
    - Bit 0 — SIN (Serial data input)
  - These lines are TTL-level and their direction (input/output) is governed by the Port B Data Direction Register.

- **User Port mapping and hardware access**
  - All Port B data lines and Port A bit 2 are brought out to the User Port connector on the rear of the machine; these are the same signals used by the RS-232 device.
  - The User Port also connects to the CIA shift registers (8-bit serial shift) and the two CNT lines — enabling serial-to-parallel and parallel-to-serial conversions, event/frequency counting, and timer interactions.
  - Direction must be configured via each CIA Data Direction Register to use lines as inputs or outputs.

- **CIA timers and serial timing**
  - CIA #2 timers are commonly used to generate RS-232 bit timing.
  - The interplay between CIA shift registers, CNT lines, and timers makes the CIA flexible for many interfacing tasks such as baud-rate generation and bit-level timing control.

**User Port Pinout and RS-232 Mapping**

The Commodore 64 User Port is a 24-pin edge connector that provides access to various signals, including those used for RS-232 communication. Below is the pinout of the User Port, detailing the corresponding CIA #2 signals and their RS-232 equivalents:

| Pin | Signal | CIA #2 Connection | RS-232 Equivalent | Description |
|-----|--------|-------------------|-------------------|-------------|
| 1   | GND    |                   | GND               | Protective Ground |
| 2   | +5V    |                   |                   | +5 VDC (100 mA max) |
| 3   | /RESET |                   |                   | Reset, forces a cold start; also a reset output for devices |
| 4   | CNT1   |                   |                   | Counter 1, from CIA #1 |
| 5   | SP1    |                   |                   | Serial Port 1, from CIA #1 |
| 6   | CNT2   |                   |                   | Counter 2, from CIA #2 |
| 7   | SP2    |                   |                   | Serial Port 2, from CIA #2 |
| 8   | /PC2   |                   |                   | Handshaking line, from CIA #2 |
| 9   | ATN    |                   |                   | Serial Attention In |
| 10  | +9V AC |                   |                   | +9 VAC (+ phase) (100 mA max) |
| 11  | +9V AC |                   |                   | +9 VAC (- phase) (100 mA max) |
| 12  | GND    |                   |                   | Ground |
| A   | GND    |                   |                   | Ground |
| B   | /FLAG2 |                   |                   | Flag 2 |
| C   | PB0    | Bit 0 of Port B   | RxD               | Receive Data (must be applied to both pins B and C) |
| D   | PB1    | Bit 1 of Port B   | RTS               | Ready To Send |
| E   | PB2    | Bit 2 of Port B   | DTR               | Data Terminal Ready |
| F   | PB3    | Bit 3 of Port B   | RI                | Ring Indicator |
| H   | PB4    | Bit 4 of Port B   | DCD               | Data Carrier Detect |
| J   | PB5    | Bit 5 of Port B   |                   | Data 5 |
| K   | PB6    | Bit 6 of Port B   | CTS               | Clear To Send |
| L   | PB7    | Bit 7 of Port B   | DSR               | Data Set Ready |
| M   | PA2    | Bit 2 of Port A   | TxD               | Transmit Data |
| N   | GND    |                   | GND               | Signal Ground |

**Note:** The RS-232 signals on the User Port are at TTL voltage levels (0V and +5V) and are inverted compared to standard RS-232 levels. Therefore, an external level shifter (e.g., using a MAX232 IC) is required to interface with standard RS-232 devices. Additionally, the RxD signal must be connected to both pins B and C on the User Port. ([hardwarebook.info](https://www.hardwarebook.info/C64_RS232_User_Port?utm_source=openai))

## Key Registers
- $DD00-$DD01 - CIA #2 - Data Ports A (Serial Bus, RS-232 PA2) and B (RS-232/status lines, User Port)

## References
- "user_port_pinout" — expands on Pin mapping of the User Port to CIA #2 signals and RS-232 DB-25
- "dd04_dd07_timers_overview" — expands on CIA #2 timers used for RS-232 timing