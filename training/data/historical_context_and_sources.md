# A 256-Byte Autostart Fast Loader for the Commodore 64

**Summary:** This project presents a single-sector (256-byte) autostart fast loader for the Commodore 64 and 1541 disk drive. It integrates fast serial protocols, drive code uploading, and screen-off optimization into a compact implementation. The complete source code and build instructions are available at the referenced GitHub repository.

**Historical Context**

Prior to this work, individual fast-loader techniques—such as fast serial protocols, uploading code to the 1541 drive, and screen-off optimization—existed separately. The novelty of this project lies in integrating these techniques into a single-sector autostart loader, demonstrating the feasibility of a fully functional fast loader within the severe size constraints of a 256-byte disk sector. This approach was commonly used in many C64 disk-based demos and utilities.

The complete source code, assembly, build instructions, and project history are hosted at:

https://github.com/mist64/fastboot1541

## Key Registers

The fast loader utilizes the following key registers:

- **C64 Side:**
  - `$DD00` (Data Direction Register for Port A): Configures the direction of the data lines.
  - `$DD01` (Data Register for Port A): Controls the state of the data lines.
  - `$D011` (VIC-II Control Register 1): Used to turn off the screen during loading to optimize timing.

- **1541 Drive Side:**
  - `$1800` (VIA Port B Data Register): Manages the data lines for communication.
  - `$1802` (VIA Data Direction Register B): Sets the direction of the data lines.
  - `$1C00` (VIA Timer 1 Low Byte): Utilized for timing control in the fast serial protocol.

## References

- "code_assembly" — expands on complete source code and assembly organization
- "overview" — expands on summary of the single-sector bootloader concept
