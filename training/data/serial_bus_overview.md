# Commodore 64 Serial Bus

**Summary:** Describes the Commodore 64 serial bus (daisy‑chain), device addressing (addresses $04–$1F / 4–31), supported devices (e.g., VIC-1541 disk drive, VIC-1525 printer), up to 5 devices, and the three operation roles: CONTROLLER, TALKER, LISTENER.

## The serial bus (daisy-chain)
The serial bus is a daisy‑chain arrangement that lets the Commodore 64 communicate with peripherals such as the VIC-1541 disk drive and the VIC-1525 graphics printer. The bus supports up to five devices connected at once. All devices physically connected to the bus see every transmission placed on it.

## Operation roles: CONTROLLER, TALKER, LISTENER
- CONTROLLER: The device that controls bus operation. Only the Commodore 64 can act as the controller.
- TALKER: A device that transmits data onto the bus.
- LISTENER: A device that receives data from the bus.

The C64 acts as the controller and may also act as a TALKER (for example, when sending data to a printer) or as a LISTENER (for example, when loading from a disk drive). Other devices may be LISTENERS, TALKERS, or both; the VIC-1541 disk drive is an example of a device that can be both TALKER and LISTENER, while the VIC-1525 printer is typically a LISTENER.

## Addressing and routing
- Each device on the serial bus has a device address used by the C64 to route data and control access. Address range: 4–31.
- The Commodore 64 issues commands to a specific device address to make that device TALK or LISTEN.
  - Command a device to TALK: the addressed device begins placing data on the serial bus.
  - Command a device to LISTEN: the addressed device prepares to receive data (either from the C64 or another device).
- Only one device may TALK at a time; multiple TALKERS cause data collisions and system failure.
- Any number of devices may LISTEN simultaneously to a single TALKER.

## References
- "serial_bus_common_addresses" — common device addresses used on the serial bus
- "serial_bus_secondary_address_and_open_syntax" — how to OPEN a connection and use secondary addresses for device setup
- "serial_bus_signal_lines_and_pinout" — physical serial I/O signal lines and pin mapping
