# Commodore 64 — Cassette Connector (6-Pin) Pinout

**Summary:** The Commodore 64's cassette interface utilizes a 6-pin edge connector to interface with the Datasette and compatible tape recorders. This document details the connector's pinout, signal descriptions, electrical characteristics, and mechanical specifications.

**Pin Mapping and Signal Descriptions**

The cassette connector comprises six pins labeled A through F, corresponding to physical positions 1 through 6 on the connector. The pin assignments and signal descriptions are as follows:

- **A / 1 — GND:** Ground reference.
- **B / 2 — +5V:** +5 Volts DC power supply.
- **C / 3 — CASSETTE MOTOR:** Motor control signal; outputs approximately +6 VDC to control the cassette motor.
- **D / 4 — CASSETTE READ:** Audio/read input signal from the cassette.
- **E / 5 — CASSETTE WRITE:** Audio/write output signal to the cassette.
- **F / 6 — CASSETTE SENSE:** Detects the state of the cassette's control buttons (e.g., play, rewind, fast-forward).

The CASSETTE MOTOR signal is controlled by the computer to start or stop the cassette motor. The CASSETTE READ and WRITE signals handle data transfer between the computer and the cassette tape. The CASSETTE SENSE signal monitors the status of the cassette's control buttons but cannot differentiate between them. A mechanical interlock prevents multiple buttons from being pressed simultaneously. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Commodore_Datasette?utm_source=openai))

**Electrical Characteristics**

- **CASSETTE MOTOR (Pin C/3):** Outputs approximately +6 VDC to power the cassette motor. The motor power is derived from the computer's unregulated supply via a transistor circuit. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Commodore_Datasette?utm_source=openai))

- **CASSETTE READ (Pin D/4):** Receives digital data from the cassette. The read data enters on pin D/4 of the connector and is processed by the computer's Complex Interface Adapter (CIA). ([next.gr](https://www.next.gr/circuits/computer-interface/commodore-64-cassette-interface-c38453?utm_source=openai))

- **CASSETTE WRITE (Pin E/5):** Sends digital data to the cassette. The write data signal is output to the connector on pin E/5. ([next.gr](https://www.next.gr/circuits/computer-interface/commodore-64-cassette-interface-c38453?utm_source=openai))

- **CASSETTE SENSE (Pin F/6):** Monitors the state of the cassette's control buttons. The sense signal detects when the play, rewind, or fast-forward buttons are pressed but cannot differentiate between them. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Commodore_Datasette?utm_source=openai))

**Mechanical Specifications**

- **Connector Type:** 12-pin edge connector with 6 contacts on each side, labeled A–F on one side and 1–6 on the other.

- **Contact Material:** Gold-plated brass with bifurcated contacts for reliable signal transmission.

- **Contact Resistance:** 10 mΩ.

- **Current Rating:** 3 A per contact.

- **Insulation Resistance:** 100 GΩ.

- **Withstanding Voltage:** 1600 V for 1 minute.

- **Temperature Rating:** -55°C to +120°C.

- **Insulator Material:** Polyphenylene.

These specifications ensure a durable and reliable connection between the Commodore 64 and its cassette peripherals. ([memotronics.com](https://www.memotronics.com/commodore-pet-cbm-64-c64-sx64-128-vic-20-cassette-port-connector-eyelet-10-pcs/?utm_source=openai))

**Wiring and Shielding**

The cassette connector's wiring typically follows standard color codes, with each wire corresponding to a specific signal. Proper shielding and grounding are essential to minimize electrical noise and ensure data integrity during cassette operations. The connector's design includes solder eyelets for secure wire attachment, facilitating robust connections. ([memotronics.com](https://www.memotronics.com/commodore-pet-cbm-64-c64-sx64-128-vic-20-cassette-port-connector-eyelet-10-pcs/?utm_source=openai))

**Mounting Orientation**

The connector is designed for straightforward alignment and insertion into the Commodore 64's cassette port. The edge connector's pin labels (A–F and 1–6) assist in correct orientation, ensuring proper signal alignment and reliable operation.

## Source Code

```text
  Cassette

  +-------+--------------------+
  |  Pin  |        Type        |
  +-------+--------------------+
  |  A-1  |  GND               |              1 2 3 4 5 6
  |  B-2  |  +5V               |          +---@-@-@-@-@-@---+
  |  C-3  |  CASSETTE MOTOR    |          |                 |
  |  D-4  |  CASSETTE READ     |          +---@-@-@-@-@-@---+
  |  E-5  |  CASSETTE WRITE    |              A B C D E F
  |  F-6  |  CASSETTE SENSE    |
  +-------+--------------------+
```

## References

- ([en.wikipedia.org](https://en.wikipedia.org/wiki/Commodore_Datasette?utm_source=openai))
- ([next.gr](https://www.next.gr/circuits/computer-interface/commodore-64-cassette-interface-c38453?utm_source=openai))
- ([memotronics.com](https://www.memotronics.com/commodore-pet-cbm-64-c64-sx64-128-vic-20-cassette-port-connector-eyelet-10-pcs/?utm_source=openai))
