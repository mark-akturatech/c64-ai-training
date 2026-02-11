# CIA 6526 — 40‑Pin DIP Pinout & Pin Functions

**Summary:** 6526 CIA (Complex Interface Adapter) 40‑pin DIP pinout and per‑pin functions for PA0–PA7, PB0–PB7, /PC, TOD, PHI2, /IRQ, /RES, /CS, FLAG, SP, CNT, D0–D7, R/W, RS0–RS3; includes ordering/package suffix info.

## Pin Descriptions
Concise overview of important signals and behavior (see Source Code for the full ASCII diagram and complete per‑pin listing):
- PA0–PA7, PB0–PB7: two 8‑bit parallel I/O ports (bidirectional). Port B accesses can generate the /PC strobe on read/write.
- /PC: active‑low Port Control strobe (pulse) driven on Port B read/write to indicate data availability.
- TOD: Time‑Of‑Day clock input; typically receives mains frequency reference (50 Hz PAL / 60 Hz NTSC).
- /IRQ: active‑low interrupt request output, open‑drain; asserted when an enabled interrupt condition occurs (see Interrupt Control Register).
- FLAG: negative edge‑triggered external interrupt input (can be sampled to generate internal interrupts).
- PHI2: system clock input (Phase‑2).
- D0–D7: bidirectional 8‑bit data bus to the CPU.
- R/W: CPU Read/Write control input (indicates CPU bus phase).
- RS0–RS3: register select address lines (select CIA internal register).
- SP (Serial Port) and CNT (Counter/Clock): used by the serial shift register and for timer/counting functions.
- Vss (GND) and Vcc (+5V): power pins.

Refer to the Source Code section for the exact pin numbers and the full per‑pin text descriptions.

## Ordering Information
- Frequency suffix: no suffix = 1 MHz, A = 2 MHz
- Package suffix: C = Ceramic, P = Plastic

## Source Code
```text
 3. PIN CONFIGURATION (40-Pin DIP)
 =============================================================

               +-----+--+-----+
      Vss   1 |            40 | CNT
      PA0   2 |            39 | SP
      PA1   3 |            38 | RS3
      PA2   4 |            37 | RS2
      PA3   5 |            36 | RS1
      PA4   6 |            35 | RS0
      PA5   7 |            34 | RW
      PA6   8 |     6526   33 | D7
      PA7   9 |            32 | D6
      PB0  10 |            31 | D5
      PB1  11 |            30 | D4
      PB2  12 |            29 | D3
      PB3  13 |            28 | D2
      PB4  14 |            27 | D1
      PB5  15 |            26 | D0
      PB6  16 |            25 | PHI2
      PB7  17 |            24 | FLAG
     /PC   18 |            23 | /CS
      TOD  19 |            22 | /RES
      Vcc  20 |            21 | /IRQ
               +------+-------+

Pin Descriptions:
  Vss (1)      - Ground
  PA0-PA7      - Port A I/O lines (pins 2-9)
  PB0-PB7      - Port B I/O lines (pins 10-17)
  /PC (18)     - Port Control output, active low pulse on read/write
                 of Port B. Indicates data is available.
  TOD (19)     - Time-of-Day clock input. Receives mains frequency
                 (50 Hz PAL / 60 Hz NTSC)
  Vcc (20)     - +5V supply
  /IRQ (21)    - Interrupt Request output (active low, open drain).
                 Goes LOW when an interrupt condition matches a set
                 bit in the Interrupt Control Register.
  /RES (22)    - Reset input (active low)
  /CS (23)     - Chip Select (active low)
  FLAG (24)    - Negative edge-triggered interrupt input
  PHI2 (25)    - System clock input (Phase 2)
  D0-D7        - Bidirectional data bus (pins 26-33)
  R/W (34)     - Read/Write control from CPU
  RS0-RS3      - Register Select address lines (pins 35-38)
  SP (39)      - Serial Port data line (bidirectional)
  CNT (40)     - Counter/clock line for timers and shift register
```

## References
- "port_a_data_register_pra" — expands on Port A (PA0–PA7) functions
- "port_b_data_register_prb" — expands on Port B (PB0–PB7) functions
- "serial_shift_register_notes" — expands on SP and CNT usage for the serial shift register