# IEC Serial Bus — Layer 3: TALK/LISTEN (Bus Arbitration)

**Summary:** IEC serial bus arbitration (TALK/LISTEN) implements role assignment and address-based routing on top of the physical/protocol layers; it follows IEEE-488 style arbitration and is used by the Commodore IEC bus for controller-driven communications (terms: IEC, TALK/LISTEN, IEEE-488, controller, device address).

## Overview
Layer 3 provides bus arbitration for the IEC serial bus by adopting the IEEE-488 style TALK/LISTEN model. Arbitration is explicit: a single designated controller (the computer) issues commands to assign roles to other participants and routes messages by device address. The controller itself does not possess a bus address.

Key points:
- The model is controller-centric: the controller initiates and manages all role assignments and transfers.
- Devices are addressed; commands from the controller assign TALK (transmit) or LISTEN (receive) roles to addressed devices.
- Address-based routing ensures that only the intended device(s) assume TALK or LISTEN roles, allowing controlled device-to-device or controller-to-device communication.
- The arbitration semantics derive from IEEE-488 conventions (e.g., dedicated controller, role assignment), adapted to the IEC serial bus command set.

## Operation (concise)
- Controller issues role-assignment commands to devices by address.
- Devices receiving a TALK command enter talker state and drive the data line; devices receiving a LISTEN command enter listener state and accept data.
- Addressing and role assignment are used to start and stop communication sessions; the controller orchestrates sequencing and prevents conflicting drivers on the bus.

## References
- "command_codes" — expands on the controller commands used to assign TALK/LISTEN roles
- "practical_command_sequences" — provides example talk/listen sequences and usage patterns
