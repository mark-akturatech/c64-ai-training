# COMMODORE 64 - USER port (6526 CIA)

**Summary:** The USER port is the Commodore 64’s general-purpose external connector wired to CIA 1 (6526 at $DC00-$DC0F), providing programmable I/O for devices such as printers, the Votrax Type'n'Talk, modems, or another computer; line direction is controlled via the CIA Data Direction Registers (DDR).

**Overview**
The USER port exposes a group of parallel and handshake lines intended to connect the C64 to external hardware. Typical uses include printers, speech synthesizers (Votrax Type'n'Talk), serial modems, and direct links to other computers.

Physically, the USER port signals are directly connected to one of the system 6526 Complex Interface Adapters (CIA chips). By programming that CIA’s port registers and Data Direction Registers (DDR) you can configure individual USER-port lines as inputs or outputs and read/write their logic state (DDR: 1 = output, 0 = input).

The USER port is a 24-pin edge connector with the following pinout:

| Pin | Signal | Description |
|-----|--------|-------------|
| 1   | GND    | Ground |
| 2   | +5V    | +5 VDC (100 mA max) |
| 3   | /RESET | Reset, forces a cold start; also a reset output for devices |
| 4   | CNT1   | Counter 1, from CIA #1 |
| 5   | SP1    | Serial Port 1, from CIA #1 |
| 6   | CNT2   | Counter 2, from CIA #2 |
| 7   | SP2    | Serial Port 2, from CIA #2 |
| 8   | /PC2   | Handshaking line, from CIA #2 |
| 9   | ATN    | Serial Attention In |
| 10  | +9V AC | +9 VAC (+ phase) (100 mA max) |
| 11  | +9V AC | +9 VAC (- phase) (100 mA max) |
| 12  | GND    | Ground |
| A   | GND    | Ground |
| B   | /FLAG2 | Flag 2 |
| C   | PB0    | Data 0 |
| D   | PB1    | Data 1 |
| E   | PB2    | Data 2 |
| F   | PB3    | Data 3 |
| H   | PB4    | Data 4 |
| J   | PB5    | Data 5 |
| K   | PB6    | Data 6 |
| L   | PB7    | Data 7 |
| M   | PA2    | Port A2 |
| N   | GND    | Ground |

*Note: Pins are labeled 1-12 and A-N.*

To configure the direction of the USER port lines, the Data Direction Registers (DDR) of the 6526 CIA are used. Each bit in the DDR corresponds to a line on the port: setting a bit to 1 configures the line as an output, while setting it to 0 configures it as an input.

For example, to set PB0 (pin C) as an output and all other PB lines as inputs:


To set PB0 as an input and PB1 as an output:


To write a value to PB1 (assuming it's set as an output):


To read the value of PB0 (assuming it's set as an input):


*Note: $DC01 is the Data Register B (PRB), and $DC03 is the Data Direction Register B (DDRB) of CIA 1.*

## Source Code

```assembly
LDA #%00000001  ; Binary: 00000001
STA $DC03       ; Store to Data Direction Register B (DDRB)
```

```assembly
LDA #%00000010  ; Binary: 00000010
STA $DC03       ; Store to DDRB
```

```assembly
LDA #%00000010  ; Binary: 00000010
STA $DC01       ; Store to Data Register B (PRB)
```

```assembly
LDA $DC01       ; Load from PRB
AND #%00000001  ; Mask all but PB0
```

```text
USER Port Pinout:

  1  2  3  4  5  6  7  8  9 10 11 12
  ---------------------------------
 | 1  2  3  4  5  6  7  8  9 10 11 12 |  (top view)
 | A  B  C  D  E  F  H  J  K  L  M  N |
  ---------------------------------
```

## Key Registers
- $DC00-$DC0F - CIA 1 - Port registers and Data Direction Registers for USER port I/O and related CIA controls

## References
- "user_port_connector_and_pin_descriptions" — connector diagram and detailed USER-port pin descriptions
- "user_port_data_direction_register_ddr_usage" — how the 6526 CIA programs port lines (DDR usage and examples)

## Labels
- PRB
- DDRB
