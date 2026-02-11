# UNLSN ($FFAE / 65454) — KERNAL: Send UNLISTEN on serial bus

**Summary:** KERNAL routine at $FFAE (decimal 65454) that transmits an UNLISTEN command on the C64 IEC serial bus to stop all previously listening devices; error status returned via READST. Stack requirement: 8. Use: JSR UNLSN.

## Description
This KERNAL routine issues an UNLISTEN command on the IEC serial bus, commanding all devices that were previously told to LISTEN to stop receiving data from the Commodore 64. It is normally used when the C64 has finished sending data to external devices and wants the bus freed for other uses.

Behavior and metadata:
- Call address: $FFAE (hex) / 65454 (decimal)
- Purpose: Transmit UNLISTEN to all previously listening devices on the serial bus
- Communication registers: None
- Preparatory routines: None
- Error returns: See READST (error/status is reported via the standard KERNAL READST routine)
- Stack requirements: 8
- Registers affected: A (accumulator)
- Typical usage: Call once after finishing data transmission to ensure devices release the bus

## Source Code
```asm
; Example: simple call to UNLSN
    JSR UNLSN        ; Call KERNAL UNLSN (equivalently JSR $FFAE)
```

## References
- "listen_kernal_routine" — complements LISTEN; expands on UNLSN behavior and LISTEN/UNLSN interaction

## Labels
- UNLSN
