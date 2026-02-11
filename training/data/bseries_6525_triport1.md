# B-Series 6525 Tri Port 1 ($DE00-$DE07)

**Summary:** Register map and bit-field layout for the B-Series 6525 Tri Port 1 at $DE00-$DE07, detailing port bit assignments (NRFD, NDAC, EOI, DAV, ATN, REN, Cassette Sense/Motor/Out, ARB, Rx, Tx, SRQ, IFC), Data Direction Registers ($DE03/$DE04), and interrupt/control flags (IRQ, ACIA, IP, ALM, IEEE, PWR, CA/CB graphics, IRQ stack, Active Interrupt Register).

**Register Overview**

This section documents the 8-byte I/O window for the B-Series 6525 Tri Port 1 device mapped at $DE00-$DE07.

- **$DE00 – Port A:** Contains IEEE-488/parallel handshake lines and control signals.
  - **Bit 7:** NRFD (Not Ready for Data)
  - **Bit 6:** NDAC (Not Data Accepted)
  - **Bit 5:** EOI (End Or Identify)
  - **Bit 4:** DAV (Data Valid)
  - **Bit 3:** ATN (Attention)
  - **Bit 2:** REN (Remote Enable)
  - **Bits 1-0:** Unused

- **$DE01 – Port B:** Contains cassette control and network signals.
  - **Bit 7:** Cassette Sense
  - **Bit 6:** Cassette Motor
  - **Bit 5:** Cassette Out
  - **Bit 4:** ARB (Arbitration)
  - **Bit 3:** Rx (Receive)
  - **Bit 2:** Tx (Transmit)
  - **Bit 1:** SRQ (Service Request)
  - **Bit 0:** IFC (Interface Clear)

- **$DE02 – Port C:** Not used in this configuration.

- **$DE03 – Data Direction Register A (DDRA):** Controls the direction of each bit in Port A.
  - **Bit 7:** NRFD direction
  - **Bit 6:** NDAC direction
  - **Bit 5:** EOI direction
  - **Bit 4:** DAV direction
  - **Bit 3:** ATN direction
  - **Bit 2:** REN direction
  - **Bits 1-0:** Unused

- **$DE04 – Data Direction Register B (DDRB):** Controls the direction of each bit in Port B.
  - **Bit 7:** Cassette Sense direction
  - **Bit 6:** Cassette Motor direction
  - **Bit 5:** Cassette Out direction
  - **Bit 4:** ARB direction
  - **Bit 3:** Rx direction
  - **Bit 2:** Tx direction
  - **Bit 1:** SRQ direction
  - **Bit 0:** IFC direction

- **$DE05 – Interrupt Register:** Contains various interrupt and status flags.
  - **Bit 7:** IRQ (Interrupt Request)
  - **Bit 6:** Unused
  - **Bit 5:** ACIA (Asynchronous Communications Interface Adapter)
  - **Bit 4:** IP (Interrupt Pending)
  - **Bit 3:** ALM (Alarm)
  - **Bit 2:** IEEE (IEEE-488 Service Request)
  - **Bit 1:** PWR (Power)
  - **Bit 0:** Unused

- **$DE06 – Control Register:** Manages control functions.
  - **Bit 7:** CB (Control Bit)
  - **Bit 6:** Unused
  - **Bit 5:** CA (Control Bit)
  - **Bit 4:** Unused
  - **Bit 3:** Unused
  - **Bit 2:** Unused
  - **Bit 1:** IRQ/PC (Interrupt Request/Program Counter)
  - **Bit 0:** Switch

- **$DE07 – Active Interrupt Register:** Indicates active interrupts.

**Note:** Each bit in the Data Direction Registers ($DE03 and $DE04) determines the direction of the corresponding bit in Ports A and B, respectively. A bit value of 0 configures the pin as an input, while a value of 1 configures it as an output.

## Source Code

```text
B-Series 6525 Tri Port 1
------------------------

      +-------+-------+-------+-------+-------+-------+-------+-------+
$DE00 | NRFD  | NDAC  |  EOI  |  DAV  |  ATN  |  REN  |       |       | 56832
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DE01 |       Cassette        |        Network        |  SRQ  |  IFC  | 56833
      | Sense | Motor |  Out  |  ARB  |  Rx   |  Tx   |       |       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DE02 |                                                               | 56834
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DE03 |               Data Direction Register for $DE00               | 56835
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DE04 |               Data Direction Register for $DE01               | 56836
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DE05 |  IRQ  |       | ACIA  |  IP   |  ALM  | IEEE  |  PWR  |       | 56837
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DE06 |  CB   |       |  CA   |       |       |       | IRQ/PC|Switch | 56838
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DE07 |                   Active Interrupt Register                   | 56839
      +-------+-------+-------+-------+-------+-------+-------+-------+

---
Additional information can be found by searching:
- "bseries_6525_triport2" which expands on second tri port adapter mapping ($DF00-$DF07)
```

## Key Registers

- **$DE00-$DE07 – 6525 Tri Port 1:** Port bits (NRFD/NDAC/EOI/DAV/ATN/REN), cassette and network bits (Cassette Sense/Motor/Out, ARB/Rx/Tx), Data Direction Registers, Interrupt/Control, and Active Interrupt Register.

## References

- "bseries_6525_triport2" — Mapping and details for the second tri port adapter ($DF00-$DF07).

## Labels
- PORTA
- PORTB
- PORTC
- DDRA
- DDRB
- INTERRUPT_REGISTER
- CONTROL_REGISTER
- ACTIVE_INTERRUPT_REGISTER
