# CIA 6526 Port A Data Register (PRA) — Offset $00 (CIA1 $DC00, CIA2 $DD00)

**Summary:** PRA ($00) is the Port A data register for CIA6526 (CIA1 at $DC00, CIA2 at $DD00); read/write, bits PA0–PA7 correspond to physical Port A pins and their functions (keyboard columns, joystick/paddle, VIC‑II bank select, serial bus, RS‑232). Direction of each bit is set by DDRA (offset $02).

## Register Description
Read/Write. Each bit in PRA corresponds to a Port A pin (PA0–PA7). Port direction is controlled by DDRA (offset $02):
- DDRA bit = 0 → pin configured as input
- DDRA bit = 1 → pin configured as output

CIA 1 ($DC00) — Port A connections (PRA bits PA0..PA7):
- Bit 0 (PA0) — Keyboard column 0 / Joystick 2 Up
- Bit 1 (PA1) — Keyboard column 1 / Joystick 2 Down
- Bit 2 (PA2) — Keyboard column 2 / Joystick 2 Left
- Bit 3 (PA3) — Keyboard column 3 / Joystick 2 Right
- Bit 4 (PA4) — Keyboard column 4 / Joystick 2 Fire
- Bit 5 (PA5) — Keyboard column 5 / Paddle fire button
- Bit 6 (PA6) — Keyboard column 6 / Paddle selection
- Bit 7 (PA7) — Keyboard column 7 / Disable NMI (can directly disable NMI when used)

CIA 2 ($DD00) — Port A connections (PRA bits PA0..PA7):
- Bit 0 (PA0) — VIC‑II Bank Select bit 0 (active low)
- Bit 1 (PA1) — VIC‑II Bank Select bit 1 (active low)
- Bit 2 (PA2) — RS‑232 TXD (output)
- Bit 3 (PA3) — Serial bus ATN OUT
- Bit 4 (PA4) — Serial bus CLOCK OUT
- Bit 5 (PA5) — Serial bus DATA OUT
- Bit 6 (PA6) — Serial bus CLOCK IN (input)
- Bit 7 (PA7) — Serial bus DATA IN (input)

VIC‑II bank selection (uses CIA2 Port A bits PA1:PA0, active low):
- %11 (3) = Bank 0 → VIC sees $0000–$3FFF (default)
- %10 (2) = Bank 1 → VIC sees $4000–$7FFF
- %01 (1) = Bank 2 → VIC sees $8000–$BFFF
- %00 (0) = Bank 3 → VIC sees $C000–$FFFF

Note: the bank select bits are active low (value is effectively inverted).

## Source Code
```text
PRA - Port A Data Register (Offset $00)
Read/Write. Bits correspond to PA0..PA7. Direction controlled by DDRA (offset $02):
  0 = input, 1 = output

CIA1 ($DC00) - Port A Connections:
  Bit 0  - Keyboard column 0 / Joystick 2 Up
  Bit 1  - Keyboard column 1 / Joystick 2 Down
  Bit 2  - Keyboard column 2 / Joystick 2 Left
  Bit 3  - Keyboard column 3 / Joystick 2 Right
  Bit 4  - Keyboard column 4 / Joystick 2 Fire
  Bit 5  - Keyboard column 5 / Paddle fire button
  Bit 6  - Keyboard column 6 / Paddle selection
  Bit 7  - Keyboard column 7 / Disable NMI (directly if active)

CIA2 ($DD00) - Port A Connections:
  Bit 0  - VIC-II Bank Select Bit 0 (active low)
  Bit 1  - VIC-II Bank Select Bit 1 (active low)
  Bit 2  - RS-232 TXD (output)
  Bit 3  - Serial Bus ATN OUT
  Bit 4  - Serial Bus CLOCK OUT
  Bit 5  - Serial Bus DATA OUT
  Bit 6  - Serial Bus CLOCK IN (input)
  Bit 7  - Serial Bus DATA IN (input)

VIC-II Bank Selection (CIA2 PA1:PA0, active low):
  %11 (3) = Bank 0: $0000-$3FFF (default)
  %10 (2) = Bank 1: $4000-$7FFF
  %01 (1) = Bank 2: $8000-$BFFF
  %00 (0) = Bank 3: $C000-$FFFF
```

## Key Registers
- $DC00 - CIA 1 - Port A Data Register (PRA) — PA0..PA7: keyboard columns 0–7, joystick 2 directions/fire, paddle signals, PA7 can disable NMI
- $DD00 - CIA 2 - Port A Data Register (PRA) — PA0..PA7: VIC‑II bank select (PA1:PA0, active low), RS‑232 TXD, serial bus ATN/CLOCK/DATA IN/OUT

## References
- "ddra_ddrb" — expands on DDRA controls for PRA pin directions
- "cia2_detailed_connections" — expands on VIC‑II bank selection uses of CIA2 Port A bits 0–1
- "cia1_detailed_connections" — expands on keyboard and joystick connections on CIA1 Port A

## Labels
- PRA
- DDRA
