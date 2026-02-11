# CIA #1 (6526) — $DC00-$DC0F (56320-56335)

**Summary:** CIA #1 (6526) registers $DC00-$DC0F (56320–56335) provide the C64 with two programmable I/O ports (keyboard matrix, joysticks, paddles), two timers (Timer A/B, chainable), a Time‑Of‑Day (TOD) clock, serial port lines, and an interrupt control/status register (IRQ to the 6510). Timers are used for keyboard scanning (≈1/60s) and tape I/O timing.

**Overview**
The Complex Interface Adapter (CIA) #1 at $DC00-$DC0F is the primary I/O controller for user input and low-speed peripherals on the C64. Its main responsibilities include:
- Two 8‑bit bidirectional data ports (Port A and Port B) used for keyboard matrix scanning, joystick inputs, and paddles (Port A is commonly used for keyboard column select and paddles).
- Data Direction Registers (DDR) to configure each I/O pin as input or output.
- Two programmable 16‑bit timers (Timer A and Timer B) which can generate interrupts; timers may be used standalone or chained for longer intervals.
- A Time‑Of‑Day (TOD) clock and alarm facility (used by some software for timing tasks).
- A serial port interface (for the C64 serial bus) via the CIA’s handshake lines.
- An interrupt control and flag register, with sources including timer expirations, TOD alarm, serial port events, and I/O pin conditions. The CIA asserts IRQ on the 6510 when enabled interrupt sources occur.

Operational notes extracted from the source:
- The CIA’s timers are used by the system for periodic keyboard scanning; a 1/60 second interval is typical for keyboard matrix polling.
- Timers are also used to produce the timing required by the tape routines (complex timing sequences for reading/writing tapes).
- CIA #1’s interrupt line is wired to the CPU IRQ; software reading/clearing the CIA interrupt flags is required to acknowledge interrupts.

**Register Map**
The following table details the registers of CIA #1, including their addresses and functions:

| Address | Register Name | Description |
|---------|---------------|-------------|
| $DC00   | Data Port A   | Bidirectional data port A |
| $DC01   | Data Port B   | Bidirectional data port B |
| $DC02   | Data Direction Register A (DDRA) | Configures direction of Port A pins (1=output, 0=input) |
| $DC03   | Data Direction Register B (DDRB) | Configures direction of Port B pins (1=output, 0=input) |
| $DC04   | Timer A Low Byte (TALO) | Low byte of Timer A count |
| $DC05   | Timer A High Byte (TAHI) | High byte of Timer A count |
| $DC06   | Timer B Low Byte (TBLO) | Low byte of Timer B count |
| $DC07   | Timer B High Byte (TBHI) | High byte of Timer B count |
| $DC08   | Time‑Of‑Day Clock 1/10 Seconds (TOD10) | TOD clock tenths of a second |
| $DC09   | Time‑Of‑Day Clock Seconds (TODSEC) | TOD clock seconds |
| $DC0A   | Time‑Of‑Day Clock Minutes (TODMIN) | TOD clock minutes |
| $DC0B   | Time‑Of‑Day Clock Hours (TODHRS) | TOD clock hours (bit 7: AM/PM flag) |
| $DC0C   | Serial Data Register (SDR) | Serial data shift register |
| $DC0D   | Interrupt Control Register (ICR) | Controls and indicates interrupt sources |
| $DC0E   | Control Register A (CRA) | Controls Timer A operation |
| $DC0F   | Control Register B (CRB) | Controls Timer B operation |

**Bit-Level Register Details**
Each register has specific bit-level configurations:

- **Data Ports (Port A and Port B):**
  - **Port A ($DC00):**
    - Bits 7-0: Bidirectional data lines.
  - **Port B ($DC01):**
    - Bits 7-0: Bidirectional data lines.

- **Data Direction Registers (DDRA and DDRB):**
  - **DDRA ($DC02):**
    - Bits 7-0: 1 = Output, 0 = Input.
  - **DDRB ($DC03):**
    - Bits 7-0: 1 = Output, 0 = Input.

- **Timer Control Registers (CRA and CRB):**
  - **CRA ($DC0E):**
    - Bit 7: Start/Stop Timer A (1 = Start, 0 = Stop).
    - Bit 6: PB6 Toggle Mode (1 = Toggle, 0 = Pulse).
    - Bit 5: Timer A Run Mode (1 = Continuous, 0 = One-shot).
    - Bit 4: Force Load Timer A (1 = Load).
    - Bit 3: Input Mode (1 = Count CNT pulses, 0 = System clock).
    - Bits 2-0: Unused.
  - **CRB ($DC0F):**
    - Bit 7: Start/Stop Timer B (1 = Start, 0 = Stop).
    - Bit 6: PB7 Toggle Mode (1 = Toggle, 0 = Pulse).
    - Bit 5: Timer B Run Mode (1 = Continuous, 0 = One-shot).
    - Bit 4: Force Load Timer B (1 = Load).
    - Bit 3: Input Mode (1 = Count CNT pulses, 0 = System clock).
    - Bits 2-0: Timer B Mode Select.

- **Interrupt Control Register (ICR) ($DC0D):**
  - Bit 7: Set/Clear Control (1 = Set, 0 = Clear).
  - Bit 6: Timer B Interrupt.
  - Bit 5: Timer A Interrupt.
  - Bit 4: TOD Alarm Interrupt.
  - Bit 3: Serial Port Interrupt.
  - Bit 2: Flag Interrupt.
  - Bit 1: Unused.
  - Bit 0: Unused.

**Keyboard Matrix Mapping**
The C64 keyboard is organized in a matrix where specific rows and columns correspond to certain keys. Port A ($DC00) is typically used to select keyboard columns, while Port B ($DC01) reads the rows. The exact mapping is as follows:

- **Port A ($DC00):** Outputs to select columns.
- **Port B ($DC01):** Inputs to read rows.

By setting a specific bit in Port A low (0) and reading Port B, the pressed keys in that column can be determined.

**Joystick and Paddle Inputs**
Joysticks and paddles are connected to the C64 via the CIA ports:

- **Joystick Port 1:**
  - **Port A ($DC00):**
    - Bit 0: Up.
    - Bit 1: Down.
    - Bit 2: Left.
    - Bit 3: Right.
    - Bit 4: Fire.
- **Joystick Port 2:**
  - **Port B ($DC01):**
    - Bit 0: Up.
    - Bit 1: Down.
    - Bit 2: Left.
    - Bit 3: Right.
    - Bit 4: Fire.

Paddles are connected to analog inputs and are read via the SID chip, not the CIA.

**Time‑Of‑Day (TOD) Clock**
The TOD clock operates in a 12-hour AM/PM format using Binary-Coded Decimal (BCD):

- **Registers:**
  - $DC08: 1/10 Seconds.
  - $DC09: Seconds.
  - $DC0A: Minutes.
  - $DC0B: Hours (bit 7: AM/PM flag, 0 = AM, 1 = PM).

The TOD clock can be set and read by writing to or reading from these registers. An alarm can be set by writing to the same registers while the alarm flag is set.

**Serial Port Operation**
The CIA's serial port is used for communication with peripherals like disk drives:

- **Pins:**
  - **CB1:** Serial Clock Input/Output.
  - **CB2:** Serial Data Input/Output.

The serial port operates by shifting data in or out of the Serial Data Register ($DC0C) synchronized with the serial clock.

**Example Usage Code**
Below is an example of setting up Timer A to generate an interrupt at regular intervals:


**Register Timing and Access Considerations**
When reading multi-byte registers like the timers or TOD clock, it's important to read the low byte first to ensure data consistency. Writing to the control registers can have immediate effects on the operation of the timers and serial port, so care must be taken to configure them correctly to avoid unintended behavior.

## Source Code

```assembly
; Set Timer A to count down from 31250 (approx. 1/60 second at 1 MHz)
LDA #$4E
STA $DC04 ; Timer A Low Byte
LDA #$7A
STA $DC05 ; Timer A High Byte

; Enable Timer A interrupt
LDA #%00000001
STA $DC0D

; Start Timer A in continuous mode
LDA #%00010001
STA $DC0E

; Enable global interrupts
CLI
```


## References
- "ciapra_data_port_register_a" — expands on CIA #1 Data Port A usage (keyboard column select / paddles)
- "cia_timers_and_tod" — expands on CIA timers and Time‑Of‑Day clock functionality

## Labels
- DATA_PORT_A
- DATA_PORT_B
- DDRA
- DDRB
- TALO
- TAHI
- ICR
- CRA
