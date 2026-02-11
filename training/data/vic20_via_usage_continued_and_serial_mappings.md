# VIC-20 6522 VIA @ $9120-$912F (timers, latches, CA/CB, joystick/keyboard, serial)

**Summary:** The 6522 VIA registers at $9120-$912F provide timers (T1/T2), two 8-bit parallel ports with DDRs and output latches (PA/PB), programmable control lines CA1/CA2 and CB1/CB2 (PCR/ACR control), a shift register (serial), and interrupt mapping (IFR/IER). This node describes the functional roles used on the VIC‑20, including joystick select lines, keyboard column inputs, and serial clock/data, and provides detailed wiring assignments and register definitions.

**Overview**

The Rockwell/MOS 6522 VIA offers:

- Two general-purpose 8-bit I/O ports (Port A and Port B) with direction registers (DDRA, DDRB) and latches. On the VIC‑20, these ports are utilized for keyboard column scanning, joystick select/reads, and other glue-logic signals.
- Two 16-bit timers: Timer 1 (T1) with latch and high/low bytes, and Timer 2 (T2) with a 16-bit count; one-shot and continuous modes are selectable via the Auxiliary Control Register (ACR).
- A shift register (SR) for serial-in/serial-out operations, with selectable clock sources (internal timer, external CA2/CB2, or system clock) controlled by the ACR.
- Control lines (CA1, CA2, CB1, CB2) configurable for input edge/level sensing or output handshake/toggle modes via the Peripheral Control Register (PCR) and ACR.
- Interrupt Flag Register (IFR) and Interrupt Enable Register (IER) providing per-source interrupt status and enables; writes to IER set/clear masks, and IFR contains pending flags, which are cleared by reading/writing the corresponding device or by clearing flags.

This chunk documents these functions as they apply to the VIC‑20 mapping at $9120-$912F and provides detailed wiring assignments and register definitions.

**Timer Controls**

- **Timer 1 (T1):** Holds a 16-bit count (low and high bytes). T1 can operate in one-shot or continuous mode (reloading from latch) depending on ACR settings. When T1 expires, it sets the T1 interrupt flag in the IFR.
- **Timer 2 (T2):** A 16-bit timer typically used for baud-rate/timing tasks; T2 sets its IFR bit upon underflow. T2 can clock the shift register depending on ACR settings.
- **Operation:** Writing to the low or high bytes reloads/starts timers as per standard 6522 semantics (low byte load latches the low, high write latches the high and can start the timer).
- **VIC‑20 Usage:** Timers are commonly used to generate SR clocks (serial) or provide periodic scanning intervals for keyboard/joystick routines.

**Latch Controls and I/O Ports (PA/PB, DDRA/DDRB, ORA/ORB)**

- **Ports A and B:** Readable/writable 8-bit registers. Each has an associated DDR (data direction register) bit: 1 = output, 0 = input. The output value is held in the port latch; reads return the latched value for outputs and pin state for inputs (6522 behavior).
- **VIC‑20 Specifics:** The VIA supports ORA with handshake variants. On the VIC‑20, the ORA/ORB latches drive external glue logic that multiplexes keyboard columns and joystick select lines.
- **Keyboard Scanning:** Some port bits are driven low/high to select a column while others are read as inputs for key row states.
- **Joystick Selection:** Port lines typically act as outputs to enable reading of paddle/joystick lines on the companion port pins.

**CA1/CA2 and CB1/CB2 Controls (PCR and ACR Interactions)**

- **CA1/CB1:** Edge- or level-sensitive input control pins that can generate interrupts on transitions (configurable by PCR).
- **CA2/CB2:** Configurable as inputs with interrupt-on-edge or as outputs with several modes (handshake, pulse, toggled output). The PCR encodes per-line mode:
  - **Input Modes:** Positive or negative edge detection, latching behavior for CA2/CB2.
  - **Output Modes:** Open-drain or push-pull-like handshake pulses and automatic handshaking when used with ORA/ORB handshake operations.
- **ACR Influence:** Contains control bits affecting timer linking and shift-register clock selection, interacting with CA2/CB2 when used as external clock sources for the SR.
- **VIC‑20 Usage:** CA/CB lines are used for simple GPIO-like strobes (keyboard/joystick latching/select) and for serial handshaking depending on cartridge/peripheral requirements.

**Interrupt Status and Enable Mapping (IFR/IER)**

- **IFR (Interrupt Flag Register):** Contains a bit for each interrupt source (Timer1, Timer2, Shift Register, CA1, CA2, CB1, CB2, and possibly port change). A set bit indicates the source has triggered.
- **IER (Interrupt Enable Register):** Used to enable/disable individual interrupts. The IER uses a set/clear mechanism: writes with bit 7 set enable the corresponding interrupts; writes with bit 7 clear disable them.
- **IRQ Behavior:** The 6522 asserts its global IRQ output when any enabled IFR bit is set. Software should clear IFR bits by servicing the source (reading/writing the appropriate registers) or by explicit register accesses as documented in the 6522 datasheet.
- **VIC‑20 Mapping:** The VIA IRQ is connected into the system IRQ chain as per VIC‑20 schematics; details of how IRQ combines with other chips are outside this chunk.

**Joystick Select Lines, Keyboard Column Inputs, and Serial Clock/Data**

- **VIA Port Utilization on VIC‑20:**
  - **Joystick Select/Reads:** Certain PB/PA bits act as joystick strobe/select and read lines; the joystick fire/axis switches appear on corresponding input pins read via the port registers.
  - **Keyboard Matrix Scanning:** Port outputs drive column selects and inputs read row states; reads of PA/PB return pressed-key states when the correct column is asserted.
  - **Serial Communication:** The VIA shift register (SR) provides serial-in/out; its clock source is chosen in ACR (Timer1, Timer2, external CA2/CB2, or system clock). The SR data bit is shifted via the SR register, and CA2/CB2 can be used as external clock or handshake lines depending on PCR/ACR settings.

- **Concrete Signal-to-Port-Bit Wiring:**
  - **Joystick Connections:**
    - **VIA #1 (at $9110):**
      - **Port A:**
        - **Bit 2 (PA2):** Joystick Switch 0 (Up)
        - **Bit 3 (PA3):** Joystick Switch 1 (Down)
        - **Bit 4 (PA4):** Joystick Switch 2 (Left)
        - **Bit 5 (PA5):** Joystick Fire Button
    - **VIA #2 (at $9120):**
      - **Port B:**
        - **Bit 7 (PB7):** Joystick Switch 3 (Right)
  - **Keyboard Connections:**
    - **VIA #2 (at $9120):**
      - **Port B:**
        - **Bits 0-7 (PB0-PB7):** Keyboard Column Selects
      - **Port A:**
        - **Bits 0-7 (PA0-PA7):** Keyboard Row Inputs

These assignments are based on the VIC‑20's hardware design, where specific VIA port bits are connected to corresponding joystick switches and keyboard matrix lines.

**Implementation Notes**

- **Configure DDRA/DDRB:** Set before using port bits as outputs to avoid bus contention.
- **Set CA2/CB2 Modes:** Use PCR to configure CA2/CB2 in the appropriate handshake or clock mode when interfacing with external devices or for SR clocking.
- **Select SR Clock Source:** Use ACR to choose the SR clock source and to set Timer1 continuous vs. one-shot behavior.
- **Manage Interrupts:** Use IER writes with bit 7 to atomically enable/disable specific VIA interrupt sources.

## Labels
- ORA
- ORB
- DDRA
- DDRB
- ACR
- PCR
- IFR
- IER
