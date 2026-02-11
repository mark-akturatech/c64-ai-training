# IEEE-488 (PET/CBM) — Physical Connector & Signal Summary

**Summary:** This document provides a detailed overview of the IEEE-488 (GPIB) parallel bus as implemented in Commodore PET/CBM systems, including physical connectors, signal lines, and protocol specifics. It covers the 24-pin PET edge connector, the standard 24-pin micro-ribbon IEEE-488 connector, and the associated signal assignments. Additionally, it includes byte-transfer timing diagrams and PET-specific timeout values relevant to the handshake process.

**Connector Types and Physical Layout**

- **PET/CBM Edge Connector:**
  - Commodore PET/CBM computers utilize a proprietary 24-pin edge connector for IEEE-488 interfacing. This connector features two rows of 12 contacts, labeled numerically (1–12) on the upper row and alphabetically (A–N) on the lower row. The keying slots are located between pins 2–3 and 9–10 to ensure correct orientation.

- **Standard IEEE-488 Connector:**
  - External IEEE-488 devices typically use the standard 24-pin micro-ribbon (Centronics-style) connector. This connector allows for daisy-chaining multiple devices along the bus, facilitated by connectors with both male and female sides.

**Signal Lines and Protocol**

- **Data and Control Organization:**
  - **Data Lines (DIO1–DIO8):** An 8-bit parallel data bus used for data transfer.
  - **Handshake Lines:**
    - **NRFD (Not Ready For Data):** Indicates that the device is not ready to receive data.
    - **DAV (Data Valid):** Signifies that valid data is present on the data lines.
    - **NDAC (No Data Accepted):** Indicates that the device has not yet accepted the data.
  - **Control Lines:**
    - **EOI (End Or Identify):** Marks the end of a data transfer or is used for device identification.
    - **ATN (Attention):** Places the bus in command mode; used by the controller.
    - **SRQ (Service Request):** Device requests service from the controller; often unused in PET systems.
    - **REN (Remote Enable):** Puts the device in remote state; commonly grounded in PET systems.
    - **IFC (Interface Clear):** Resets the bus state.

- **Byte Transfer Handshake:**
  - The byte transfer process involves the coordination of the DAV, NRFD, and NDAC lines to ensure proper data flow. The timing diagram below illustrates the sequence of signals during a typical byte transfer:
