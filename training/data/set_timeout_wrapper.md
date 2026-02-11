# set_timeout_on_serial_bus — wrapper at $FFA2 (JMP $FE21)

**Summary:** ROM wrapper at $FFA2 (JMP $FE21) used to set the IEC serial-bus timeout flag; controlled by bit 7 of the accumulator (0 = enable timeouts, 1 = disable). Related terms: $FFA2, $FE21, IEC/serial bus, DAV handshake, 64 ms timeout, ROM routine.

**Description**
This ROM entry is a tiny wrapper at $FFA2 that immediately jumps to the actual implementation at $FE21 to set the serial (IEC) bus timeout flag. The routine controls whether the C64 will wait for a peripheral device during the DAV handshake:

- When the timeout flag is set, the computer will wait up to 64 milliseconds for the device to respond to DAV before treating the handshake as failed and leaving the sequence.
- The caller places the control value in the accumulator: bit 7 = 0 enables timeouts; bit 7 = 1 disables timeouts.
- The timeout mechanism is used, for example, to indicate "file not found" during an OPEN attempt on disk devices.

The timeout flag is stored at memory location $0285. The routine at $FE21 reads the accumulator and sets or clears this flag accordingly:

- If bit 7 of the accumulator is 0, the routine stores the accumulator's value into $0285, enabling timeouts.
- If bit 7 of the accumulator is 1, the routine stores the accumulator's value into $0285, disabling timeouts.

This mechanism allows the system to control the timeout behavior of the serial bus by modifying the value at $0285 based on the accumulator's bit 7.

## Source Code
```asm
; set timeout on serial bus
; this routine sets the timeout flag for the serial bus. When the timeout flag is
; set, the computer will wait for a device on the serial port for 64 milliseconds.
; If the device does not respond to the computer's DAV signal within that time the
; computer will recognize an error condition and leave the handshake sequence. When
; this routine is called and the accumulator contains a 0 in bit 7, timeouts are
; enabled. A 1 in bit 7 will disable the timeouts.
; NOTE: The timeout feature is used to communicate that a disk file is not found
; on an attempt to OPEN a file.
.,FFA2 4C 21 FE    JMP $FE21       ; set timeout on serial bus

; Implementation at $FE21
; Reads the accumulator and sets/clears the timeout flag at $0285
.,FE21 85 85       STA $0285       ; Store A into $0285
.,FE23 60          RTS             ; Return from subroutine
```

## Key Registers
- **$0285**: Serial bus timeout flag. Bit 7 controls timeout behavior:
  - Bit 7 = 0: Timeouts enabled.
  - Bit 7 = 1: Timeouts disabled.

## References
- "set_timeout_on_serial_bus" — expands on implementation at $FE21
- Commodore 64 Programmer's Reference Guide: Input/Output Guide - Serial Port (cont.)

## Labels
- SET_TIMEOUT_ON_SERIAL_BUS
- SERIAL_TIMEOUT_FLAG
