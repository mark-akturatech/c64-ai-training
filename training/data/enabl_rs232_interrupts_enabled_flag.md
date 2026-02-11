# ENABL ($2A1): RS-232 NMI flag byte

**Summary:** ENABL at $2A1 stores the active NMI interrupt flag byte copied from CIA 2 Interrupt Control Register $DD0D; bits indicate RS-232 states (Waiting for Receiver Edge, Receiving, Transmitting) used by NMI-driven RS-232 handling.

## Description
This byte (label ENABL, program address $2A1 / decimal 673) holds the active NMI interrupt flag value read from CIA 2 Interrupt Control Register $DD0D (CIA #2). The bits are used to represent RS-232 interface states for NMI-driven serial I/O.

Bit meanings:
- Bit 4 (value 16) — System is Waiting for Receiver Edge
- Bit 1 (value 2)  — System is Receiving Data
- Bit 0 (value 1)  — System is Transmitting Data

The value in ENABL is used by the RS-232 interrupt-driven logic to determine current transmit/receive state and to coordinate interactions with transmit/receive buffers (see referenced chunk for FIFO/buffer indices and NMI handling).

## Key Registers
- $2A1 - Program variable (ENABL) - Active NMI interrupt flag byte (copied from $DD0D)
- $DD0D - CIA 2 - Interrupt Control Register (source of the NMI flag bits)

## References
- "rs232_fifo_buffer_indices" — Interacts with transmit/receive buffers and NMI-driven RS-232 handling

## Labels
- ENABL
