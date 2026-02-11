# Serial Data Register (SDR) — 6526 CIA Serial Port

**Summary:** The Serial Data Register (SDR) in the 6526 Complex Interface Adapter (CIA) functions as an 8-bit buffered synchronous shift register with selectable input and output modes. It utilizes the CNT pin for clocking, supports MSB-first data format, and can generate interrupts upon completion of data transfer. The CNT and SP pins are open-drain, facilitating multi-device configurations.

**Description**

The 6526 CIA's serial port operates as an 8-bit buffered synchronous shift register, configurable for either input or output modes.

**Input Mode:**

- **Data Reception:** Data on the SP pin is shifted into the shift register on the rising edge of the CNT signal.
- **Data Transfer:** After 8 CNT pulses, the shift register contents are transferred to the Serial Data Register (SDR).
- **Interrupt Generation:** An interrupt is generated to signal the CPU that new data is available in the SDR. This interrupt is reported via the CIA's Interrupt Control Register (ICR).
- **Data Format:** Serial input uses a Most Significant Bit (MSB)-first format.

**Output Mode:**

- **Baud Rate Generation:** Timer A is utilized as the baud-rate generator for serial output.
- **Clock and Data Transmission:** The CNT pin outputs the clock derived from Timer A; data is shifted out on the SP pin, synchronized to CNT pulses.
- **Data Shifting:** Data is shifted out at half the underflow rate of Timer A (i.e., one data shift per two Timer A underflows).
- **Transmission Initiation:** Transmission begins when the CPU writes to the SDR, provided Timer A is running in continuous mode.
- **Data Validity:** On a CNT pulse, the SDR is loaded into the shift register, and a bit is shifted; the shifted data becomes valid on the falling edge of CNT and remains valid until the next falling edge.
- **Interrupt Generation:** After 8 CNT pulses, an interrupt is generated to indicate that the byte has been transmitted (serial output empty). If the SDR is re-written before the interrupt, the new byte is automatically loaded, enabling continuous streaming if the CPU keeps the SDR one byte ahead of the shift register.
- **Idle State:** If no further data is supplied, after the 8th CNT pulse, CNT returns high, and SP holds the level of the last bit transmitted.
- **Data Format:** Output format is MSB-first.

**Bus Topology and Multi-6526 Operation:**

- **Open-Drain Configuration:** The CNT and SP outputs are open-drain, allowing multiple 6526 devices to share a common serial bus.
- **Master/Slave Configuration:** One 6526 can be configured as the master (sourcing data and clock), while others act as slaves.
- **Protocol Management:** Master/slave selection and protocol are managed by the system, which can be implemented over the serial bus or via dedicated handshake lines.

**Timing and Behavior Notes:**

- **Shift Edge (Input):** Data is shifted on the rising edge of CNT.
- **Data Valid Edge (Output):** Data on SP becomes valid on the falling edge of CNT and remains valid until the next falling edge.
- **Synchronous Operation:** The serial port operates synchronously; an external clock (CNT) or a Timer-derived clock must be present.
- **Interrupt Generation:** Interrupts are generated after every 8 CNT pulses, corresponding to a byte boundary, for both input completion and output completion.

**Note:** The source text contains a reference to "02 divided by 4," which is interpreted as the system clock (φ2) divided by 4, indicating the maximum rate reference.

## Source Code

```text
Serial Data Register (SDR) Format:

+-----+---------+------+------+------+------+------+------+------+------+
|  C  |   SDR   |  S7  |  S6  |  S5  |  S4  |  S3  |  S2  |  S1  |  S0  |
+-----+---------+------+------+------+------+------+------+------+------+

Notes:
- S7..S0: Serial data bits (MSB = S7 shifted out/received first)
- C: Control/status bit field in source listing header (contextual; SDR is 8 data bits)
```

**Timing Diagram:**

```text
Serial Input Timing:

CNT:  ────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────
          │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │
          └────┘    └────┘    └────┘    └────┘    └────┘    └────┘    └────┘    └────┘

SP:   ----<D7>---<D6>---<D5>---<D4>---<D3>---<D2>---<D1>---<D0>---

Notes:
- Data (D7 to D0) is sampled on the rising edge of CNT.
- After 8 CNT pulses, the shift register contents are transferred to the SDR.
- An interrupt is generated to signal the CPU that new data is available.
```

```text
Serial Output Timing:

CNT:  ────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────
          │    │    │    │    │    │    │    │    │    │    │    │    │    │    │    │
          └────┘    └────┘    └────┘    └────┘    └────┘    └────┘    └────┘    └────┘

SP:   ----<D7>---<D6>---<D5>---<D4>---<D3>---<D2>---<D1>---<D0>---

Notes:
- Data (D7 to D0) is output on SP, changing on the falling edge of CNT.
- Data remains valid until the next falling edge of CNT.
- After 8 CNT pulses, an interrupt is generated to indicate that the byte has been transmitted.
```

## Key Registers

- **Serial Data Register (SDR):** Located at offset $0C within the CIA register block.

## References

- "control_registers_cra_crb" — CRA/CRB and SPMODE (selects serial port input vs output, ties to TIMER A)
- "interrupt_control_icr" — ICR and Serial port full/empty interrupt reporting

## Labels
- SDR
