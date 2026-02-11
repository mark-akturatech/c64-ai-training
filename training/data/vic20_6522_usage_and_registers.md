# VIC-20 6522 (VIA) Usage at $9110-$911F

**Summary:** This document details the mapping of the VIC-20's 6522 Versatile Interface Adapter (VIA) registers at addresses $9110–$911F. It includes RS-232 and parallel port signal assignments (DSR, CTS, DCD*, RI*, DTR, RTS), Data Direction Registers ($9112/$9113), Timer 1 and Timer 2 along with their latches ($9114–$9119), the shift register ($911A), control register functions for CB1/CB2/CA1/CA2 (tape/RS-232/Restore), and the VIA status/interrupt enable bits ($911D/$911E). Additionally, the document provides the pin configuration of the 6522 VIA and the bit-position layouts for individual VIA registers.

**VIA Usage and Signal Mapping**

The VIC-20 utilizes a 6522 VIA at addresses $9110–$911F to manage serial (RS-232) and user-port/tape/joystick functions:

- **$9110 — Port B Data Register (ORB/IRB):**
  - **Bit 7 (PB7):** Data In
  - **Bit 6 (PB6):** RTS Out
  - **Bit 5 (PB5):** DTR Out
  - **Bit 4 (PB4):** RI* In (active low)
  - **Bit 3 (PB3):** DCD* In (active low)
  - **Bit 2 (PB2):** Unused
  - **Bit 1 (PB1):** CTS In
  - **Bit 0 (PB0):** DSR In

- **$9111 — Port A Data Register (ORA/IRA):** Unused (see $911F for joystick/serial inputs).

- **$9112 — Data Direction Register B (DDRB):** Controls the direction (input/output) for signals on $9110.

- **$9113 — Data Direction Register A (DDRA):** Controls the direction for signals on $911F.

- **$9114/$9115 — Timer 1 Low/High Byte (T1C-L/T1C-H):** Used for RS-232 send speed or tape write timing.

- **$9116/$9117 — Timer 1 Latch Low/High Byte (T1L-L/T1L-H):** Holds the reload value for Timer 1.

- **$9118/$9119 — Timer 2 Low/High Byte (T2C-L/T2C-H):** Used for RS-232 input timing.

- **$911A — Shift Register (SR):** Not utilized in this configuration.

- **$911B — Auxiliary Control Register (ACR):** Configures Timer 1/Timer 2 modes, shift register control, and latch controls for Port B/Port A.

- **$911C — Peripheral Control Register (PCR):**
  - **CA1:** Restore key input.
  - **CA2:** Tape motor control.
  - **CB1:** RS-232 input control.
  - **CB2:** RS-232 send control.

- **$911D — Interrupt Flag Register (IFR):** Indicates interrupt status for Timer 1, Timer 2, CB1 (RS-232 in), CA1 (Restore), etc.

- **$911E — Interrupt Enable Register (IER):** Enables/disables interrupts for Timer 1, Timer 2, CB1 (RS-232), CA1 (Restore); shift register marked as unused.

- **$911F — Port A Data Register (ORA/IRA):**
  - **Bit 7 (PA7):** Serial Clock In
  - **Bit 6 (PA6):** Serial Data In
  - **Bit 5 (PA5):** Up (Joystick)
  - **Bit 4 (PA4):** Down (Joystick)
  - **Bit 3 (PA3):** Left (Joystick)
  - **Bit 2 (PA2):** Joystick Button
  - **Bit 1 (PA1):** Tape Sense
  - **Bit 0 (PA0):** ATN Out

**Notes:**

- $9111 is explicitly unused; refer to $911F for joystick/serial input mapping.
- The shift register at $911A is not utilized in this VIC-20 configuration.
- Asterisks (*) denote active-low signals.

**6522 VIA Pin Configuration**

The 6522 VIA is a 40-pin integrated circuit with the following pin configuration:


**Pin Descriptions:**

- **PA0–PA7:** Peripheral Port A lines.
- **PB0–PB7:** Peripheral Port B lines.
- **CA1, CA2:** Control lines for Port A.
- **CB1, CB2:** Control lines for Port B.
- **CS1, CS2:** Chip Select inputs.
- **R/W:** Read/Write control input.
- **Φ2:** Phase 2 clock input.
- **IRQ:** Interrupt request output.
- **VCC:** Power supply (+5V).
- **VSS:** Ground.

**Bit-Position Layouts for VIA Registers**

The 6522 VIA registers are 8-bit wide, with each bit serving specific functions:

- **Data Registers (ORA/IRA, ORB/IRB):**
  - **Bit 7:** PB7/PA7
  - **Bit 6:** PB6/PA6
  - **Bit 5:** PB5/PA5
  - **Bit 4:** PB4/PA4
  - **Bit 3:** PB3/PA3
  - **Bit 2:** PB2/PA2
  - **Bit 1:** PB1/PA1
  - **Bit 0:** PB0/PA0

- **Data Direction Registers (DDRA, DDRB):**
  - **Bit 7:** Direction for PA7/PB7
  - **Bit 6:** Direction for PA6/PB6
  - **Bit 5:** Direction for PA5/PB5
  - **Bit 4:** Direction for PA4/PB4
  - **Bit 3:** Direction for PA3/PB3
  - **Bit 2:** Direction for PA2/PB2
  - **Bit 1:** Direction for PA1/PB1

## Source Code

```text
       +----+--+----+
  PA0  |1   |  | 40 | VCC
  PA1  |2   |  | 39 | PA7
  PA2  |3   |  | 38 | PA6
  PA3  |4   |  | 37 | PA5
  PA4  |5   |  | 36 | PA4
  PA5  |6   |  | 35 | CA1
  PA6  |7   |  | 34 | CA2
  PA7  |8   |  | 33 | PB7
  PB0  |9   |  | 32 | PB6
  PB1  |10  |  | 31 | PB5
  PB2  |11  |  | 30 | PB4
  PB3  |12  |  | 29 | PB3
  PB4  |13  |  | 28 | PB2
  PB5  |14  |  | 27 | PB1
  PB6  |15  |  | 26 | PB0
  PB7  |16  |  | 25 | CB1
  CB2  |17  |  | 24 | CB2
  VSS  |18  |  | 23 | R/W
  IRQ  |19  |  | 22 | CS2
  CS1  |20  |  | 21 | Φ2
       +----+--+----+
```

## Labels
- ORB
- ORA
- DDRB
- DDRA
- ACR
- PCR
- IFR
- IER
