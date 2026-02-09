# 6526 I/O ports: PRA, PRB, DDRA, DDRB

**Summary:** Describes the 6526 (CIA) Peripheral Data Registers (PRA/PRB) and Data Direction Registers (DDRA/DDRB), DDR bit semantics (1=output, 0=input), port read behaviour (reads reflect actual PA0-PA7/PB0-PB7 pin states), passive+active pull-ups for CMOS/TTL compatibility, two-TTL-load drive capability, and PB6/PB7 timer-output multiplexing. Includes absolute C64 addresses for CIA1 ($DC00-$DC03) and CIA2 ($DD00-$DD03).

## Functional description
Ports A and B each implement:
- An 8-bit Peripheral Data Register (PR; PRA/PRB) and an 8-bit Data Direction Register (DDR; DDRA/DDRB).
- DDR bits: 1 = the corresponding PR bit is an output; 0 = the corresponding PR bit is an input.
- On a read of PRA/PRB the value returned reflects the actual state of the physical port pins (PA0–PA7, PB0–PB7) regardless of whether the bit is configured as input or output.
- Both ports include passive pull-up devices and active pull-ups, providing compatibility with CMOS and TTL input characteristics.
- Each port can source/sink up to two TTL load equivalents (two-TTL-load drive capability).
- PB6 and PB7 have dual roles: normal general-purpose I/O and timer output functions (they provide timer output signals in addition to regular I/O).

## Source Code
```text
6526 (CIA) - Partial register map (offsets and names)

Offset  Name   Description
$00     PRA    Peripheral Data Register A (PA0-PA7)
$01     PRB    Peripheral Data Register B (PB0-PB7)
$02     DDRA   Data Direction Register A (1=output, 0=input)
$03     DDRB   Data Direction Register B (1=output, 0=input)

C64 absolute addresses (CIA1 base $DC00, CIA2 base $DD00):
CIA1:
$DC00 - PRA
$DC01 - PRB
$DC02 - DDRA
$DC03 - DDRB

CIA2:
$DD00 - PRA
$DD01 - PRB
$DD02 - DDRA
$DD03 - DDRB
```

## Key Registers
- $DC00-$DC03 - CIA1 (6526) - PRA/PRB/DDRA/DDRB (Peripheral Data and Data Direction Registers for Port A and Port B)
- $DD00-$DD03 - CIA2 (6526) - PRA/PRB/DDRA/DDRB (Peripheral Data and Data Direction Registers for Port A and Port B)

## References
- "6526_register_map" — expands on register addresses for PRA/PRB/DDRA/DDRB
- "6526_handshaking_and_port_bit_map" — per-bit layout and handshaking signals
- "6526_timers_overview" — relation of PB6/PB7 to timer outputs