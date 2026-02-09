# ROM wrapper at $FFB4 — JMP to $ED09 (serial-bus TALK command)

**Summary:** Entry point $FFB4 is a ROM wrapper that JMPs to $ED09 to command a device on the C64 serial bus to TALK; the accumulator (A) must contain the device number ($04..$1E / 4..30). Contains the machine-code JMP ($4C) to $ED09.

## Description
This ROM entry is a minimal wrapper whose opcode at $FFB4 is an unconditional JMP to $ED09. The routine at $ED09 (not included here) converts the device number in the accumulator to a serial-bus talk address and transmits the TALK command on the IEC serial bus.

Preconditions:
- A (accumulator) must contain the device number 4..30 (decimal) before calling.

Behavior summary:
- $FFB4 contains JMP $ED09 — control is transferred to the implementation at $ED09 which performs the conversion and sends the TALK command on the serial bus.

Usage (example):
- Load device number into A, then call the wrapper (typical call is JSR $FFB4):
  - LDA #$04  ; device 4
  - JSR $FFB4 ; transfer control to the TALK implementation via $ED09

## Source Code
```asm
.,FFB4 4C 09 ED JMP $ED09       command serial bus device to TALK
```

## References
- "serial_bus_control" — expands on TALK implementation (external)