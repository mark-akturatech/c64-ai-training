# IOBASE ($E500) — return D1PRA low/high in X/Y (KERNAL)

**Summary:** Routine at $E500 (KERNAL ROM) sets X/Y to the low/high bytes of D1PRA (6526 device 1 Port A) and returns; implements LDX #<D1PRA ; LDY #>D1PRA ; RTS. Useful to obtain the CIA1 base address for device 1 I/O.

**Description**
This KERNAL helper routine (labelled IOBASE) loads the 16-bit address of D1PRA into the X and Y registers: X = low byte, Y = high byte, then returns with RTS. It performs no memory accesses and does not modify A, the stack, or flags (other than side effects of the loads). Callers typically JSR $E500 to obtain the CIA1 base address for device 1 operations.

Notes:
- D1PRA denotes the CIA 1 Port A register (device 1 Port A) — CIA1 base is $DC00.
- Calling convention: no parameters; on return X = low(D1PRA) and Y = high(D1PRA).

## Source Code
```asm
.; Routine at $E500: IOBASE — returns low/high byte of D1PRA in X/Y and RTS
.,E500 A2 00    LDX #$00        IOBASE LDX #<D1PRA
.,E502 A0 DC    LDY #$DC        LDY    #>D1PRA
.,E504 60       RTS             RTS
                                ;
```

## Key Registers
- $DC00-$DC0F - CIA 1 - device 1 registers (D1PRA at $DC00, Port A data register)

## References
- "io_devices_and_constants" — expands on D1PRA/6526 device1 register addresses

## Labels
- IOBASE
- D1PRA
