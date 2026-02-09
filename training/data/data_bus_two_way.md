# Two-way data bus (650x)

**Summary:** Describes the 650x two-way data bus: 8-bit bidirectional data lines used for CPU read and write cycles, interaction with the address bus and selected memory devices, and includes Figure 1.2 (two-way data bus). Contains terms useful for searches: data bus, address bus, read/write direction, 8 bits, Figure 1.2.

## The Data Bus
The data bus on 650x systems is an 8-bit, bidirectional set of lines that carries data between the CPU and selected memory or peripherals after an address has been placed on the address bus and a device has been selected. The bus is shared by multiple devices; only the device selected by the address (and control signals) should drive the bus at any time.

- Width: 8 bits (8 wires) — (8 bits => 256 possible values).
- Read cycle: the selected memory/peripheral places an 8-bit value onto the bus; the 650x samples those lines and loads the value into the processor.
- Write cycle: the 650x drives an 8-bit value onto the bus; the selected memory/peripheral latches and stores that value.
- Direction and timing are controlled by dedicated control signals (read/write strobes and timing lines). These control signals determine when a device may drive the bus and when the CPU samples it (see Incomplete for missing specifics).

## Source Code
```text
Example data byte on the 8-bit data bus:
01011011

           +------+
           |      | -> ADDRESS BUS  ->            ->          ->
           |      o--------o--------------o--------------o--------
           |      o--------+o-------------+o-------------+o-------
           |      o--------++o------------++o------------++o------
           |      o--------+++o-----------+++o-----------+++o-----
           |      |        ||||           ||||           ||||
           |      |       |||||          |||||          |||||
           | 650x |       v||||          v||||          v||||
           |      |        ||||           ||||           ||||
           |      |DATA BUS||||   <->     ||||    <->    |||| <->
           |      o------o-++++---------o-++++---------o-++++-----
           |      o-----o+-++++--------o+-++++--------o+-++++-----
           |      o----o++-++++-------o++-++++-------o++-++++-----
           |      o---o+++-++++------o+++-++++------o+++-++++-----
           |      |   |||| ||||      |||| ||||      |||| ||||
           +------+  ^|||| ||||     ^|||| ||||     ^|||| ||||
                     ||||| ||||     ||||| ||||     ||||| ||||
                     v|||| ||||     v|||| ||||     v|||| ||||
                      |||| ||||      |||| ||||      |||| ||||
                   +--oooo-oooo-+  +-oooo-oooo-+  +-oooo-oooo-+
                   |            |  |           |  |           |
                   |   Memory   |  |  Memory   |  |  Memory   |
                   |    Chip    |  |   Chip    |  |   Chip    |
                   |("Selected")|  |   (not    |  |   (not    |
                   |            |  | selected) |  | selected) |
                   +------------+  +-----------+  +-----------+

           Figure 1.2  Two-way data bus
```

## Incomplete
- Missing: Detailed names and timing diagrams for the control signals that govern data bus direction and sampling (e.g., explicit R/W strobe, ready/strobe timing, bus-enable/tri-state timing).
- Missing: Explicit timing relationships showing when the CPU drives the bus vs when memory/peripheral must drive it (waveform or cycle timing table referenced but not present).

## References
- "bus_overview_650x" — expands on address bus selection process and complements this description
- "number_ranges" — relates data bus width (8 bits) to 256 possible values per memory location