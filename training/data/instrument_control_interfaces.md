# COMMODORE 64 — INSTRUMENT CONTROL

**Summary:** Details hardware interfaces for instrument control and industrial use on the Commodore 64, including connector pinouts, signal definitions, electrical levels, and software considerations for the serial port (IEC), RS-232 port, user port, and optional IEEE-488 (GPIB) cartridge.

**Instrument Control Ports**

The Commodore 64 offers several interfaces for connecting to instruments, printers, plotters, and industrial equipment:

- **Serial Port (IEC):** The standard Commodore IEC serial peripheral bus used primarily for disk drives and printers.
- **RS-232 Port:** Accessible via the user port, enabling serial communication with RS-232-compatible instruments.
- **User Port:** A general-purpose I/O port designed for custom interfacing and control applications.
- **IEEE-488 Cartridge (Optional):** An add-on cartridge that implements the IEEE-488 (GPIB) interface for instrumentation and industrial systems.

### Serial Port (IEC)

The IEC serial port on the Commodore 64 uses a 6-pin DIN connector with the following pinout:

| Pin | Name   | Description                                                                 |
|-----|--------|-----------------------------------------------------------------------------|
| 1   | /SRQIN | Service request input; allows peripherals to request service from the host. |
| 2   | GND    | Ground.                                                                     |
| 3   | /ATN   | Attention line; indicates the start of a serial data transfer.              |
| 4   | /CLK   | Clock line; used for timing data on the serial bus.                         |
| 5   | /DATA  | Data line; transmits data one bit at a time.                                |
| 6   | /RESET | Resets peripherals and the C64.                                             |

The IEC bus operates with TTL-level signals (0 to +5V), and the timing is managed by the computer's software.

### RS-232 Port

The RS-232 interface is implemented through the user port, which provides TTL-level signals (0 to +5V) rather than standard RS-232 voltage levels. Therefore, an RS-232 level shifter is required to interface with standard RS-232 devices. The user port's pinout for RS-232 signals is as follows:

| Pin | Name  | RS-232 Signal | Description                     |
|-----|-------|---------------|---------------------------------|
| A   | GND   | GND           | Protective Ground               |
| B+C | FLAG2+PB0 | RxD       | Receive Data (connect to both)  |
| D   | PB1   | RTS           | Request To Send                 |
| E   | PB2   | DTR           | Data Terminal Ready             |
| F   | PB3   | RI            | Ring Indicator                  |
| H   | PB4   | DCD           | Data Carrier Detect             |
| K   | PB6   | CTS           | Clear To Send                   |
| L   | PB7   | DSR           | Data Set Ready                  |
| M   | PA2   | TxD           | Transmit Data                   |
| N   | GND   | GND           | Signal Ground                   |

Note: The Receive Data (RxD) signal must be applied to both pins B and C. ([old.pinouts.ru](https://old.pinouts.ru/SerialPorts/C64Rs232UserPort_pinout.shtml?utm_source=openai))

Standard RS-232 voltage levels are:

- **Logic '0' (Mark):** -3V to -15V
- **Logic '1' (Space):** +3V to +15V

Voltages between -3V and +3V are undefined. ([en.wikipedia.org](https://en.wikipedia.org/wiki/RS-232?utm_source=openai))

The RS-232 standard also defines several control lines for handshaking:

- **RTS (Request to Send):** Indicates the DTE is ready to send data.
- **CTS (Clear to Send):** Indicates the DCE is ready to receive data.
- **DTR (Data Terminal Ready):** Indicates the DTE is ready to communicate.
- **DSR (Data Set Ready):** Indicates the DCE is ready to communicate.
- **DCD (Data Carrier Detect):** Indicates a connection has been established.
- **RI (Ring Indicator):** Indicates an incoming call.

These control lines facilitate proper handshaking and flow control between devices. ([en.wikipedia.org](https://en.wikipedia.org/wiki/RS-232?utm_source=openai))

### User Port

The user port is a 24-pin edge connector providing both digital I/O lines and power:

| Pin | Name  | Description                                                                 |
|-----|-------|-----------------------------------------------------------------------------|
| 1   | GND   | Ground.                                                                     |
| 2   | +5V   | +5 VDC (100 mA max).                                                        |
| 3   | /RESET| Reset; forces a cold start when grounded.                                   |
| 4   | CNT1  | Counter 1 from CIA #1.                                                      |
| 5   | SP1   | Serial Port 1 from CIA #1.                                                  |
| 6   | CNT2  | Counter 2 from CIA #2.                                                      |
| 7   | SP2   | Serial Port 2 from CIA #2.                                                  |
| 8   | /PC2  | Handshaking line from CIA #2.                                               |
| 9   | ATN   | Serial attention in.                                                        |
| 10  | 9VAC  | 9 VAC (+ phase) (100 mA max).                                               |
| 11  | 9VAC  | 9 VAC (- phase) (100 mA max).                                               |
| 12  | GND   | Ground.                                                                     |
| A   | GND   | Ground.                                                                     |
| B   | /FLAG2| Flag 2.                                                                     |
| C   | PB0   | Data 0.                                                                     |
| D   | PB1   | Data 1.                                                                     |
| E   | PB2   | Data 2.                                                                     |
| F   | PB3   | Data 3.                                                                     |
| H   | PB4   | Data 4.                                                                     |
| J   | PB5   | Data 5.                                                                     |
| K   | PB6   | Data 6.                                                                     |
| L   | PB7   | Data 7.                                                                     |
| M   | PA2   | PA2.                                                                        |
| N   | GND   | Ground.                                                                     |

The user port operates with TTL-level signals (0 to +5V). Each data line (PB0–PB7) can be individually programmed as input or output. The port also provides handshake lines for managing data transfers. ([hardwarebook.info](https://www.hardwarebook.info/C64-128_User_Port?utm_source=openai))

### IEEE-488 Cartridge

The IEEE-488 (GPIB) interface can be added to the Commodore 64 via an external cartridge. One such example is the INTERPOD IEEE-488 Interface, which connects to the IEC bus and provides both IEEE-488 and RS-232C ports. This interface operates transparently, requiring no additional ROM or software on the computer. ([mikenaberezny.com](https://mikenaberezny.com/hardware/c64-128/interpod-ieee-488-interface/?utm_source=openai))

Another example is the BrainBoxes GPIB cartridge, which connects to the expansion port and includes:

- SN75160 and SN75161 IEEE-488 transceivers.
- EPROM containing the cartridge firmware.
- 74-series logic ICs for address decoding and control logic.

This design offloads the electrical and timing requirements of the IEEE-488 bus from the CPU, resulting in a robust and electrically compliant interface. ([phol-labs.com](https://phol-labs.com/brainboxes-gpib-a-rare-ieee-488-cartridge-for-the-commodore-64-128/?utm_source=openai))

To utilize the IEEE-488 interface, appropriate software drivers or APIs are required, which are typically provided with the cartridge.

### Example Wiring Diagram

Below is an example wiring diagram for connecting a standard RS-232 device to the Commodore 64 user port:


Note: A level shifter circuit is required between the Commodore 64 and the RS-232 device to convert TTL-level signals to standard RS-232 voltage levels.

### Software Routines for Instrument Control

To communicate with instruments via the RS-232 interface, the Commodore 64 requires software routines to handle serial communication. These routines typically involve:

- Config

## Source Code

```text
Commodore 64 User Port (TTL)       RS-232 Device (Standard Levels)
-------------------------------     -------------------------------
Pin M (PA2)  --------------------->  Pin 2 (RxD)
Pin B+C (FLAG2+PB0) <--------------  Pin 3 (TxD)
Pin D (PB1)  --------------------->  Pin 4 (RTS)
Pin K (PB6)  <---------------------  Pin 5 (CTS)
Pin E (PB2)  --------------------->  Pin 20 (DTR)
Pin L (PB7)  <---------------------  Pin 6 (DSR)
Pin A (GND)  ----------------------  Pin 7 (GND)
```
