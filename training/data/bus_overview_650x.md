# MACHINE — Bus concept and 650x address bus

**Summary:** Describes the bus concept and the 650x family (6502, 6510, 6509, 7501), and explains the 16-line address bus: the CPU sends voltages on sixteen wires (an address) so address decoding selects one memory/device chip among many (Figure 1.1).

## The Bus
A bus is a group of wires used together and connected to multiple circuits; groups of signals (e.g., address, data, control) run from one chip to another and on to the next. The PET, CBM, and VIC-20 use the 6502; the Commodore 64 uses the 6510; the Commodore B series uses the 6509; the PLUS/4 uses the 7501. These (and related parts such as 6504) are referred to here as the 650x family.

A 650x CPU has very little internal storage and must read instructions and data from external memory. To request information, the 650x outputs voltages on a group of sixteen wires called the address bus. Each of those sixteen lines can be high or low; the resulting pattern is the binary address that identifies a specific memory location or device.

Every memory or mapped device chip is connected to the address bus and monitors the sixteen address lines. Each chip compares the bus address against the range it responds to (address decoding). Exactly one chip should identify the address as its own and enable itself to communicate with the CPU; all other chips remain inactive and do not participate in the data transfer.

Figure 1.1 (below) illustrates a 650x connected to three memory chips via the address bus.

## Source Code
```text
               +------+
               |      | ->          ->          ->         ->
               |      o-------o-----------o-----------o--------
               |      o-------+o----------+o----------+o-------
               | 650x o-------++o---------++o---------++o------
               |      o-------+++o--------+++o--------+++o-----
               |      |       ||||        ||||        ||||
               |      |      |||||       |||||       |||||
               +------+      v||||       v||||       v||||
                              ||||        ||||        ||||
                           +--oooo--+  +--oooo--+  +--oooo--+
                           |        |  |        |  |        |
                           | Memory |  | Memory |  | Memory |
                           |  Chip  |  |  Chip  |  |  Chip  |
                           |        |  |        |  |        |
                           +--------+  +--------+  +--------+

               Figure 1.1  Address bus connecting 650x & 3 chips
```

## References
- "data_bus_two_way" — explains data flow once a chip is selected
- "memory_elements_and_mapped_io" — describes types of devices attached to the address bus (RAM/ROM/IO)
