# CIA #2 PC2 (User Port) Handshake

**Summary:** Describes the CIA #2 peripheral-control handshake line PC2 (User Port), which pulses low for one cycle after a read or write of CIA #2 Port B ($DD01), allowing external hardware to detect Port B data transfers.

## Behavior
The CIA #2 PC2 line is exposed on the C64 User Port and is used as a handshaking signal for external devices. PC2 will be driven low for one cycle immediately following any read or write access to Port B of CIA #2. External peripherals can monitor this edge to detect that data has been read from or written to CIA #2 Port B.

This feature is not applicable to CIA #1 because that CIA's corresponding PC line is not wired to the C64 external connectors; only CIA #2's PC2 is accessible from the User Port.

## Source Code
(Reference material not provided in this chunk.)

## Key Registers
- $DD01 - CIA #2 - Port B (read/write triggers PC2 low pulse)

## References
- "user_port_pinout" — User Port pin mapping and which User Port pin carries CIA #2 PC2