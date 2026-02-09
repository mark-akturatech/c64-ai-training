# Control Port 1 & Control Port 2 — C64 9-pin game I/O connector pinouts

**Summary:** Pinouts for the Commodore 64 9-pin Control Port 1 and Control Port 2 (game I/O): digital joystick lines JOYA0–3 / JOYB0–3, paddle analog inputs POT AX/AY / POT BX/BY, BUTTON A/B (and LP), +5V supply (max 50 mA), and GND.

## Pin descriptions
- Connector: 9-pin D-sub style game/controller connector used for joysticks and paddles.
- Digital lines:
  - JOYA0–3 (Control Port 1) and JOYB0–3 (Control Port 2) — the four digital joystick/fire-direction signals per port.
- Analog (paddle) inputs:
  - Control Port 1: POT AX (pin 9) and POT AY (pin 5).
  - Control Port 2: POT BX (pin 9) and POT BY (pin 5).
- Buttons:
  - Control Port 1: BUTTON A / LP (pin 6) — button A or light-pen input (source labels as "BUTTON A/LP").
  - Control Port 2: BUTTON B (pin 6).
- Power and ground:
  - Pin 7: +5V supply (MAX. 50 mA) — intended to power active/optical controllers (limited current).
  - Pin 8: GND — common ground reference.
- Notes:
  - The joystick lines are digital inputs read by the C64 (active low/OFF vs ON depends on joystick wiring).
  - Paddle inputs are potentiometer voltage inputs measured via the CIA timer circuitry (analog behavior handled by the system).

## Source Code
```text
Control Port 1
+-----+-------------+-----------+
| Pin |    Type     |   Note    |
|  1  |    JOYA0    |           |
|  2  |    JOYA1    |           |
|  3  |    JOYA2    |           |
|  4  |    JOYA3    |           |
|  5  |    POT AY   |           |
|  6  | BUTTON A/LP |           |
|  7  |     +5V     | MAX. 50mA |
|  8  |     GND     |           |
|  9  |   POT AX    |           |
+-----+-------------+-----------+

Control Port 2
+-----+-------------+-----------+
| Pin |    Type     |   Note    |
|  1  |    JOYB0    |           |
|  2  |    JOYB1    |           |
|  3  |    JOYB2    |           |
|  4  |    JOYB3    |           |
|  5  |    POT BY   |           |
|  6  |  BUTTON B   |           |
|  7  |     +5V     | MAX. 50mA |
|  8  |     GND     |           |
|  9  |   POT BX    |           |
+-----+-------------+-----------+
```

## Key Registers
- (none) — This chunk documents physical connector pinouts, not memory-mapped registers.

## References
- "appendix_i_pinouts_intro" — Overview of pinout categories in Appendix I
- "user_port_pinout_and_connector_diagram" — Other I/O port (User Port) pinouts and signals