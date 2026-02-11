# Table of IRQ vectors ($FD9B)

**Summary:** IRQ vector table located at $FD9B (decimal 64923) listing four 6502 two-byte vectors pointing to cassette write part 1, cassette write part 2, the standard keyboard-scan IRQ, and the cassette read routine.

## Description
This table (base address 64923 / $FD9B) contains four IRQ vectors used by the system. Each entry is a 2-byte 6502 pointer (little-endian) referencing the start addresses of system IRQ/runtime routines:

- Vector 1 → Part 1 of cassette write routine at 64618 ($FC6A)  
- Vector 2 → Part 2 of cassette write routine at 64461 ($FBCD)  
- Vector 3 → Standard scan keyboard IRQ at 59953 ($EA31)  
- Vector 4 → Cassette read routine at 63788 ($F92C)

## Source Code
```text
Table base (decimal/hex):
64923    $FD9B

Entries (vector → target address):
1) Vector 1 -> 64618  ($FC6A)   ; cassette write, part 1
2) Vector 2 -> 64461  ($FBCD)   ; cassette write, part 2
3) Vector 3 -> 59953  ($EA31)   ; standard scan keyboard IRQ
4) Vector 4 -> 63788  ($F92C)   ; cassette read routine
```

## References
- "tape_motor_and_pointer_routines" — expands on IRQ entries referencing cassette read/write routines
- "ioinit_initialize_cia_and_sid" — expands on IRQ timing setup (CIA timers) as part of system I/O initialization