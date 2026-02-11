# CIA 6526 — Port B Data Register (PRB) — Offset $01 (CIA1 $DC01, CIA2 $DD01)

**Summary:** PRB ($01) is the Port B Data Register for the CIA 6526 (addresses $DC01 for CIA1 and $DD01 for CIA2). Read/Write; each bit maps to PB0–PB7. Pin direction is controlled by DDRB ($03). PB6/PB7 may be used as Timer A/B toggle or pulse outputs.

## Overview
PRB is a general-purpose 8-bit parallel I/O register (Port B). Each bit corresponds to a physical PB pin (PB0–PB7). The direction of each PB pin is controlled by the Data Direction Register B (DDRB, offset $03): a DDRB bit = 0 configures the corresponding PB pin as input, DDRB bit = 1 configures it as output.

CIA1 ($DC01) uses Port B for keyboard row scanning and joystick 1 signals; PB6 and PB7 can optionally be driven by Timer A/B toggle/pulse outputs. CIA2 ($DD01) exposes the user port and RS‑232 related signals; several PB bits are defined as inputs or outputs for modem/serial control.

## Source Code
```text
Port B Data Register (PRB) - Offset $01
Read/Write. Each bit corresponds to a pin on Port B.
Direction is controlled by DDRB (offset $03):
  0 = input, 1 = output

CIA 1 ($DC01) - Port B Connections:
  Bit 0  - Keyboard row 0 / Joystick 1 Up
  Bit 1  - Keyboard row 1 / Joystick 1 Down
  Bit 2  - Keyboard row 2 / Joystick 1 Left
  Bit 3  - Keyboard row 3 / Joystick 1 Right
  Bit 4  - Keyboard row 4 / Joystick 1 Fire
  Bit 5  - Keyboard row 5
  Bit 6  - Keyboard row 6 / Timer A toggle/pulse output
  Bit 7  - Keyboard row 7 / Timer B toggle/pulse output

CIA 2 ($DD01) - Port B Connections:
  Bit 0  - User Port PB0 / RS-232 RXD (input)
  Bit 1  - User Port PB1 / RS-232 RTS (output)
  Bit 2  - User Port PB2 / RS-232 DTR (output)
  Bit 3  - User Port PB3 / RS-232 RI (input)
  Bit 4  - User Port PB4 / RS-232 DCD (input)
  Bit 5  - User Port PB5
  Bit 6  - User Port PB6 / Timer A toggle/pulse output
  Bit 7  - User Port PB7 / Timer B toggle/pulse output
```

## Key Registers
- $DC01 - CIA1 - Port B Data Register (PRB), PB0–PB7 (keyboard rows / joystick 1 / Timer A/B outputs)
- $DC03 - CIA1 - Data Direction Register B (DDRB), controls PRB pin directions
- $DD01 - CIA2 - Port B Data Register (PRB), PB0–PB7 (user port / RS-232 / Timer A/B outputs)
- $DD03 - CIA2 - Data Direction Register B (DDRB), controls PRB pin directions

## References
- "ddra_ddrb" — expands on DDRB controls PRB pin directions
- "timer_a_16bit" — expands on Timer A toggle/pulse on PB6
- "timer_b_16bit" — expands on Timer B toggle/pulse on PB7
- "cia1_detailed_connections" — expands on keyboard scanning using Port B (rows)

## Labels
- PRB
- DDRB
