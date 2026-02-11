# Commodore 64 User Port — mapping to CIA lines and RS-232 DB-25 pins

**Summary:** User Port pin mapping to CIA signals (CIA1/CIA2: CNT1/SP1, CNT2/SP2, PC2, FLAG2, PB0–PB7, PA2), RS‑232 DB‑25 pins (SIN, RTS, DTR, RI, DCD, CTS, DSR, SOUT), and power/ground lines; includes voltage/power limits (+5V 100 mA max, 9VAC ± phases 50 mA max) and RESET/ATN pin notes.

## Mapping and notes
- The C64 User Port exposes direct CIA signals from both CIA chips and carries a small RS‑232-to-CIA convenience mapping. PB0–PB7 (CIA port B) and PA2 (CIA port A bit 2) appear on lettered User Port pins; PC2 and FLAG2 are the CIA handshake lines exposed to the port. CNT/SP lines from both CIAs (serial/timer count and serial data) are also present.
- Important control pins:
  - RESET (User Port pin 3): grounding causes a cold start (hardware reset).
  - ATN (User Port pin 9): connected to the serial bus ATN line (attention).
- Power and ground:
  - +5V on User Port pin 2 — 100 milliamps maximum available from the port.
  - 9VAC on pins 10 and 11 (each phase) — 50 milliamps maximum each.
  - Grounds on pins 1, 12, A and DB‑25 pin 1 / DB‑25 pin 7 also listed as ground.
- The RS‑232 DB‑25 numbers in the table are a convenience mapping; signals are actually the CIA port bits wired to the User Port — use CIA direction registers (DDR) to configure as inputs/outputs as appropriate.
- This chunk preserves the original pin-to-signal and DB‑25 mapping table below for exact wiring/reference.

## Source Code
```text
                          | User Port Pin | CIA Line | RS-232 DB-25 Pin |      Description
----------------------------------------------------------------------------------------------------------------
                          | 1             |          | 1                |      Ground
                          | 2             |          |                  | +5 Volts (100 milliamps maximum)
                          | 3             |          |                  | RESET (grounding this pin causes a cold start)
                          | 4             | CNT1     |                  | CIA #1 Serial Port and Timer Counter
                          | 5             | SP1      |                  | CIA #1 Serial Data Port
                          | 6             | CNT2     |                  | CIA #2 Serial Port and Timer Counter
                          | 7             | SP2      |                  | CIA #2 Serial Data Port
                          | 8             | PC2      |                  | CIA #2 handshaking line
                          | 9             |          |                  | Connected to the ATN line of the Serial Bus
                          | 10            |          |                  | 9 Volts AC (+ phase, 50 milliamps maximum)
                          | 11            |          |                  | 9 volts AC (- phase, 50 milliamps maximum)
                          | 12            |          |                  |      Ground
                          | A             |          | 1                |      Ground
                          | B             | FLAG2    |                  | CIA #2 handshaking line
                          | C             | PB0      | 3                | Port B Bit 0 -- RS-232 Received Data (SIN)
                          | D             | PB1      | 4                | Port B Bit 1 -- RS-232 Request to Send (RTS)
                          | E             | PB2      | 20               | Port B Bit 2 -- RS-232 Data Terminal Ready (DTR)
                          | F             | PB3      | 22               | Port B Bit 3 -- RS-232 Ring Indicator (RI)
                          | H             | PB4      | 8                | Port B Bit 4 -- RS-232 Carrier Detect (DCD)
                          | J             | PB5      |                  | Port B Bit 5
                          | K             | PB6      | 5                | Port B Bit 6 -- RS-232 Clear to Send (CTS)
                          | L             | PB7      | 6                | Port B Bit 7 -- RS-232 Data Set Ready (DSR)
                          | M             | PA2      | 2                | Port A Bit 2 -- RS-232 Transmitted Data (Sout)
                          | N             |          | 7                |      Ground
```

## Key Registers
- $DC00-$DC0F - CIA 1 - Port A/Port B, DDRs, timers, serial, IRQ and control registers (CIA1 registers accessible at $DC00-$DC0F)
- $DD00-$DD0F - CIA 2 - Port A/Port B, DDRs, timers, serial, IRQ and control registers (CIA2 registers accessible at $DD00-$DD0F)

## References
- "dd00_dd01_cia2_data_ports_a_b_and_serial_rs232" — explains which CIA bits appear on User Port pins
- "cia2_pc2_handshake_signal" — expands on PC2 handshake behavior on read/write of Port B