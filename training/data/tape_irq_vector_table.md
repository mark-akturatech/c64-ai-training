# Tape IRQ Vectors in Kernal ROM ($FD9B-$FDA1)

**Summary:** Tape IRQ vector bytes stored in the C64 Kernal ROM at $FD9B-$FDA1 (four two-byte little-endian vectors). Each vector holds a low/high address pointing to a tape-related IRQ handler and is mapped to an IRQ slot ($08, $0A, $0C, $0E).

## Description
This table contains four two-byte 6502 vectors (low byte then high byte) used by the tape subsystem to install IRQ handlers into the Kernal's IRQ-slot table:

- The vectors occupy $FD9B, $FD9D, $FD9F, $FDA1 (8 bytes total).
- Each vector contains a little-endian address (low, high) pointing to the actual IRQ routine in ROM.
- The four vectors are associated with tape IRQ slots:
  - $FD9B — write tape leader IRQ (IRQ slot $08)
  - $FD9D — tape write IRQ (IRQ slot $0A)
  - $FD9F — normal IRQ vector (IRQ slot $0C)
  - $FDA1 — read tape bits IRQ (IRQ slot $0E)
- These vectors are referenced/managed by routines such as set_tape_vector and the tape write IRQ routine (see References).

## Source Code
```asm
.:FD9B 6A FC                    $08 write tape leader IRQ routine
.:FD9D CD FB                    $0A tape write IRQ routine
.:FD9F 31 EA                    $0C normal IRQ vector
.:FDA1 2C F9                    $0E read tape bits IRQ routine
```

## References
- "set_tape_vector" — expands on uses of vectors stored in this table
- "tape_write_irq_routine" — expands on uses of the tape write IRQ vector