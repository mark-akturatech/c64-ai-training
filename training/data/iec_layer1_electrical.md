# IEC Standard Serial (Layer 1) — Electrical & Connector Details

**Summary:** Physical-layer description of the Commodore IEC (Standard Serial) bus: female 6‑pin DIN connectors, pinout (SRQ, GND, ATN, CLK, DATA, RESET), daisy‑chaining, and inverted open‑collector logic (5V = logical 0, 0V = logical 1) with multi‑device sharing implications.

**Connector & pinout**
- **Connector:** Female 6‑pin DIN 45322 on both computers and peripherals. Daisy‑chainable: multiple devices share the same bus wiring.
- **Signal lines (pin numbers are DIN 6‑pin positions):**
  - **Pin 1 — SRQ (Service Request):** Largely unused on C64 IEC implementations.
  - **Pin 2 — GND (Signal Ground):** Common ground reference.
  - **Pin 3 — ATN (Attention):** Command signaling (master/device command mode).
  - **Pin 4 — CLK (Clock):** Sender‑controlled handshake line.
  - **Pin 5 — DATA (Data):** Serial data and receiver handshake.
  - **Pin 6 — RESET:** Bus reset capability.

**Notes:**
- **CLK and DATA** implement a sender/receiver handshake during byte transfers (see "byte_transfer_sequence" reference).
- The physical wiring is intended for daisy‑chaining many devices on a single shared bus.

**Open‑collector (inverted) logic and sharing behavior**
- **All IEC signal lines use inverted open‑collector (wired‑OR) logic:**
  - **Electrical:** Released state → pulled up to +5V; driven low → 0V.
  - **Logical mapping (inverted):** 5V = logical 0; 0V = logical 1.
- **Shared‑bus behavior:**
  - Any device can actively pull a line to logical 1 by driving the line to 0V.
  - A line reads logical 0 only when **all devices release the line** (allowing the pull‑up to return it to +5V).
  - This wired‑OR/open‑collector arrangement permits multi‑device sharing without contention: a single device asserting (pulling low) dominates.
  - Enables collective ready/acknowledge schemes (e.g., all devices must release DATA for the line to read 0).
  - A single device can hold a line asserted (logical 1) regardless of other devices’ outputs.
- **Practical consequences:**
  - Devices must avoid actively driving opposite levels (push‑pull) — use open‑collector outputs or equivalent.
  - Pull‑ups provide the released state; their value and placement affect timing and noise immunity.

**Pull‑up resistors**
- **Value:** Each device on the bus typically has 1kΩ resistors pulling both Clock (CLK) and Data (DATA) lines to +5V. ([github.com](https://github.com/dhansel/IECDevice?utm_source=openai))
- **Placement:** These pull-up resistors are present in each device connected to the bus, including both the computer and peripherals. ([github.com](https://github.com/dhansel/IECDevice?utm_source=openai))

**Note:** The cumulative effect of multiple pull-up resistors in parallel reduces the overall resistance, increasing the current required to pull the line low. This should be considered when connecting multiple devices to ensure that the bus drivers can handle the increased current.

**Bus characteristics**
- **Maximum recommended cable length:** Approximately 1.8 meters (6 feet). ([en.wikipedia.org](https://en.wikipedia.org/wiki/Commodore_bus?utm_source=openai))
- **Recommended cable type/shielding:** Standard IEC cables are typically unshielded; however, using shielded cables can improve noise immunity, especially in electrically noisy environments.
- **Maximum number of devices:** Up to 31 devices can be daisy-chained on the bus. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Commodore_bus?utm_source=openai))

**Note:** While the bus can support up to 31 devices, practical limitations such as signal degradation and increased capacitance may reduce the maximum reliable number of devices, especially when using longer cables.

**Electrical timing constraints and capacitance limits**
- **Timing constraints:** The IEC bus protocol requires that all devices on the bus react to an ATN request (ATN signal going high to low) by pulling the DATA line low within 1 millisecond. Failure to meet this timing can result in communication errors. ([github.com](https://github.com/dhansel/IECDevice?utm_source=openai))
- **Capacitance limits:** Each device on the bus adds capacitance to the lines. While specific capacitance values are not readily available, it's important to minimize capacitance to maintain signal integrity. Using shorter cables and limiting the number of devices can help reduce total bus capacitance.

**Protection details for bus drivers**
- **Current limits:** Devices connected to the IEC bus should ensure that their drivers can sink the necessary current when pulling lines low. For example, with 1kΩ pull-up resistors to +5V, each device must sink 5mA per line. With multiple devices, this current requirement increases accordingly. ([github.com](https://github.com/dhansel/IECDevice?utm_source=openai))
- **Diode/clamping recommendations:** To protect against voltage spikes and transients, it's advisable to include clamping diodes on the bus lines. These diodes can prevent voltage levels from exceeding the supply rails, thereby protecting the bus drivers from potential damage.

**Connector wiring diagram**
The IEC bus uses a 6-pin DIN connector with the following pinout:


**Pin assignments:**
- **Pin 1:** SRQ (Service Request)
- **Pin 2:** GND (Ground)
- **Pin 3:** ATN (Attention)
- **Pin 4:** CLK (Clock)
- **Pin 5:** DATA (Data)
- **Pin 6:** RESET

**Shielding/ground connections:** The connector's metal shield is typically connected to ground to provide shielding against electromagnetic interference.

**Note:** The above diagram represents the female socket as viewed from the front. When wiring cables, ensure that the pin numbers correspond correctly to maintain proper signal connections.

## Source Code

```text
  2   4   5
   o   o   o
    \  |  /
     \ | /
  1 o  o  o 3
       6
```


## References
- "byte_transfer_sequence" — expands on how CLK/DATA are used during byte transfers
- "open_collector_consequences" — expands on open‑collector details and signaling implications