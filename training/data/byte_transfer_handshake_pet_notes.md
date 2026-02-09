# IEC/IEEE-488 Byte Transfer (3-wire handshake) — PET implementation notes

**Summary:** Describes the 3-wire byte-transfer handshake used on the IEC/IEEE-488 bus (NRFD, DAV, NDAC) and PET-specific behavior: REN grounded, SRQ unused in software, default 64 microsecond timeout, and KERNAL SETTMO to disable timeouts.

## Byte Transfer Mechanism
The bus uses a 3-wire handshake between sender and receivers:
- Receivers signal readiness with NRFD = 0.
- The sender places the byte on the data lines (DIO) and signals data-valid with DAV = 1.
- Receivers acknowledge acceptance with NDAC = 0.

This sequence implements byte-by-byte transfer flow control using the three control lines NRFD, DAV, and NDAC.

## PET-Specific Implementation Notes
- REN is held grounded (logically true) on PET implementations.
- The SRQ line is not used by PET software (no software support for SRQ).
- The default timeout for sender and receiver operations is 64 microseconds.
- Timeouts can be disabled via the KERNAL call SETTMO.

## References
- "ieee488_physical_and_signals" — expands on control and handshake lines