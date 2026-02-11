# ROM: Wrapper at $FFB1 — LISTEN command to serial bus ($ED0C)

**Summary:** ROM entry at $FFB1 is a wrapper (JMP $ED0C) that invokes the LISTEN routine at $ED0C in the C64 ROM. Before calling, the accumulator (A) must contain the device number ($04–$1F); the routine converts that to a listen address and transmits a LISTEN command on the serial bus.

## Description
This ROM wrapper provides a canonical entry point to command a peripheral on the IEC serial bus to enter LISTEN mode. Callers must load the accumulator with a valid device number in the range 4..31 (decimal) before executing the routine at $FFB1. The wrapper simply performs an unconditional jump to the implementation at $ED0C, which:
- converts the device number in A into the corresponding IEC listen address, and
- transmits the LISTEN command over the serial bus so the target device will go into listen/receive mode ready for data.

The entry is a single JMP instruction; the real work happens at $ED0C in the ROM.

## Source Code
```asm
.; Wrapper: command devices on the serial bus to LISTEN
.,FFB1 4C 0C ED    JMP $ED0C       ; command devices on the serial bus to LISTEN
```

## References
- "serial_bus_control" — expands on LISTEN implementation (converts device number to listen address and transmits on IEC bus)

## Labels
- LISTEN
