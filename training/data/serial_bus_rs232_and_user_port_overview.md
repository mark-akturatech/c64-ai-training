# CIA #2 Data Ports A and B ($DD00-$DD01)

**Summary:** CIA #2 Data Port A ($DD00) and Data Port B ($DD01) — bit-level mappings for the Commodore 64 Serial Bus (ATN, clock, data in/out), RS-232 signals (PA2, PB0-PB7), and the User Port (PB0-PB7, PA2 plus CNT/SP/handshake lines). Notes: Serial Bus uses PA bits 3,4,5,6,7; RS-232 uses PA2 and multiple PB bits; CIA #2 timers commonly provide RS-232 timing.

## Description
These two CIA #2 data registers are the primary interface for three distinct I/O uses on the C64:

- Serial Bus (IEC-style, daisy-chained): bit-serial protocol used by the 1541 drive and 1525 printer. It is substantially slower than parallel IEEE but supports multiple devices on one bus. Data direction for each line is controlled by the CIA Data Direction Registers.

- RS-232 via the User Port: the built-in RS-232 wiring uses PA bit 2 (SOUT) for transmitted data and PB bits (0–7) for receive and control/status signals (SIN, RTS, DTR, RI, DCD, CTS, DSR). CIA #2 timers are typically used to generate baud timing for RS-232 transfers.

- User Port general-purpose TTL I/O: all PB pins and PA2 are routed to the DB-25 connector; additional pins provide the two CIA serial ports (SP1/SP2), CNT1/CNT2 timer/edge inputs, and handshaking lines (PC2/FLAG2). These allow serial-to-parallel conversion, event counting, frequency measurement, interval timing, and hardware handshaking.

Precise bit usage summary (see Source Code for verbatim mapping table):
- Data Port A:
  - Bit 7: Serial Bus DATA IN (Serial Bus data input)
  - Bit 6: Serial Bus CLOCK IN
  - Bit 5: Serial Bus DATA OUT
  - Bit 4: Serial Bus CLOCK OUT
  - Bit 3: Serial Bus ATN (Attention)
  - Bit 2: RS-232 / User Port Transmitted Data (SOUT)
  - Bits 1–0: not used by Serial Bus / RS-232 in standard wiring (general-purpose)
- Data Port B:
  - Bit 7: RS-232 Data Set Ready (DSR)
  - Bit 6: RS-232 Clear To Send (CTS)
  - Bit 5: user general-purpose (also available on User Port pin J)
  - Bit 4: RS-232 Carrier Detect (DCD)
  - Bit 3: RS-232 Ring Indicator (RI)
  - Bit 2: RS-232 Data Terminal Ready (DTR)
  - Bit 1: RS-232 Request To Send (RTS)
  - Bit 0: RS-232 Received Data (SIN)

Notes:
- The Serial Bus lines are bidirectional (separate IN/OUT bits) and byte transfer is done bit-serially (one bit per clock pulse).
- The RS-232 wiring uses TTL-level signals on the User Port; an external level shifter/modem is required for true RS-232 voltage levels.
- CNT and SP pins (SP1/SP2, CNT1/CNT2) connect the CIA shift registers and timer/counter inputs to the User Port for serial conversion and counting/timing operations.
- Direction (input/output) for any PA/PB bit is controlled by the CIA Data Direction Registers (CIA #2 DDRs).

## Source Code
```text
Location Range: 56576-56577 ($DD00-$DD01)
CIA #2 Data Ports A and B

Data Port A (PA, $DD00) usage:
  Bit 7 - Serial Bus DATA IN (Serial device -> C64)
  Bit 6 - Serial Bus CLOCK IN
  Bit 5 - Serial Bus DATA OUT (C64 -> Serial device)
  Bit 4 - Serial Bus CLOCK OUT
  Bit 3 - Serial Bus ATN (Attention)
  Bit 2 - RS-232 Transmitted Data (SOUT) / User Port PA2
  Bit 1 - general-purpose / User Port
  Bit 0 - general-purpose / User Port

Data Port B (PB, $DD01) usage (RS-232 / User Port):
  Bit 7 - DSR (Data Set Ready)
  Bit 6 - CTS (Clear To Send)
  Bit 5 - (User Port pin J) general-purpose
  Bit 4 - DCD (Carrier Detect)
  Bit 3 - RI  (Ring Indicator)
  Bit 2 - DTR (Data Terminal Ready)
  Bit 1 - RTS (Request To Send)
  Bit 0 - SIN (Received Data)

User Port / DB-25 pin mapping (original listing)
User  CIA   RS-232 DB-25  Description
Pin   Line   Pin
1                    Ground
2                    +5 Volts (100 milliamps maximum)
3                    RESET (grounding this pin causes a cold start)
4     CNT1           CIA #1 Serial Port and Timer Counter
5     SP1            CIA #1 Serial Data Port
6     CNT2           CIA #2 Serial Port and Timer Counter
7     SP2            CIA #2 Serial Data Port
8     PC2            CIA #2 handshaking line
9                    Connected to the ATN line of the Serial Bus
10                   9 Volts AC (+ phase, 50 milliamps maximum)
11                   9 volts AC (- phase, 50 milliamps maximum)
12                   Ground
A            1       Ground
B     FLAG2          CIA #2 handshaking line
C     PB0    3       Port B Bit 0--RS-232 Received Data (SIN)
D     PB1    4       Port B Bit 1--RS-232 Request to Send (RTS)
E     PB2    20      Port B Bit 2--RS-232 Data Terminal Ready (DTR)
F     PB3    22      Port B Bit 3--RS-232 Ring Indicator (RI)
H     PB4    8       Port B Bit 4--RS-232 Carrier Detect (DCD)
J     PB5            Port B Bit 5
K     PB6    5       Port B Bit 6--RS-232 Clear to Send (CTS)
L     PB7    6       Port B Bit 7--RS-232 Data Set Ready (DSR)
M     PA2    2       Port A Bit 2--RS-232 Transmitted Data (SOUT)
N            7       Ground
```

## Key Registers
- $DD00-$DD01 - CIA #2 - Data Port A (PA) and Data Port B (PB) — Serial Bus, RS-232, User Port signals

## References
- "ci2pra_ci2prb" — expands on bit-level mapping of serial and RS-232 signals to CIA #2 ports
- "user_port_pinout" — expands on User Port DB-25 / connector pin mapping