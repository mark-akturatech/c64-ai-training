# 6520 Peripheral Interface Adapter (PIA) overview

**Summary:** The 6520 PIA is an I/O device that interfaces a microprocessor to external peripherals using two 8-bit bi-directional peripheral ports, an 8-bit microprocessor data bus, and four interrupt/control lines; it includes interrupt-control logic and is programmed by the CPU during system initialization for flexible peripheral control.

## Overview
The 6520 acts as a bridge between a CPU and external peripherals (printers, displays, keyboards, etc.). It exposes:
- Two 8-bit bi-directional peripheral data ports for direct connection to external devices.
- An 8-bit microprocessor data bus interface to transfer data and control information to/from the CPU.
- Four interrupt input / peripheral-control lines used for signalling and control.
- Internal logic to detect peripheral events and generate interrupt requests to the CPU.

## Hardware interfaces
- Peripheral ports: Two independent 8-bit ports that can be driven by the CPU or read from peripherals (bi-directional).
- Microprocessor bus: Standard 8-bit data bus connection for CPU read/write operations and to program/control the PIA.
- Control/handshake lines: Four dedicated lines for auxiliary control or interrupt inputs from peripherals.

## Interrupts and control logic
- The PIA monitors peripheral-control lines and contains logic to assert interrupts to the CPU when configured conditions are met.
- Interrupt/control lines are separate from the data ports and provide simple peripheral-driven interrupt capability without additional external logic.
- The device supports configuration via CPU writes so interrupt behaviour and control-line direction can be tailored to the attached peripherals.

## Programming and initialization
- The PIA is typically configured (direction, interrupt enable/disable, control-line behaviour) by the system firmware or OS during system initialization.
- After initialization the CPU uses standard read/write cycles on the microprocessor data bus to exchange data with the peripheral ports and to change PIA control registers as needed.

## Typical use cases
- Simple peripheral interfacing where byte-wide data and a few hardware control or interrupt lines suffice.
- Replacing external glue logic by using the PIA's control and interrupt features to handle device handshaking and event signalling.

## References
- "6520_pia_block_diagram" — block diagram showing data bus, control and peripheral ports