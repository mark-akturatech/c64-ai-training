# CIA#2 Port Control ($DD00-$DD03)

**Summary:** CIA#2 (Complex Interface Adapter) registers $DD00-$DD03 control the C64 VIC bank selection, the serial bus lines, RS-232 and user-port signals, and the data-direction for Ports A and B (DDRs). Searchable terms: $DD00, $DD01, $DD02, $DD03, CIA#2, VIC bank selection, Port A, Port B, DDR.

## Description
CIA#2 is mapped at $DD00-$DDFF; the low four registers are the port controls used by the system to select the VIC-II memory bank, control the serial bus, and present RS-232 / user-port signals to the I/O connector.

- Port A (CIA#2 $DD00) is used for VIC bank selection and serial bus control. The exact bit assignments for VIC bank selection are covered in the referenced "vic_bank_selection" chunk.
- Port B (CIA#2 $DD01) presents RS-232 and user-port control signals.
- Port A DDR (CIA#2 $DD02) is the data direction register for Port A: bits set = output, bits clear = input.
- Port B DDR (CIA#2 $DD03) is the data direction register for Port B: bits set = output, bits clear = input.

The DDR registers control whether each corresponding Port bit is driven by the CIA or sampled as an input from the external connector. For detailed bit-level bank-selection and serial/user-port assignments, see the referenced chunks.

## Source Code
```text
CIA #2: Complex Interface Adapter ($DD00-$DDFF)

Port Control:

$DD00   Port A                  VIC bank selection and serial bus control
$DD01   Port B                  RS232 and user port control
$DD02   Port A DDR              Data direction register for Port A
$DD03   Port B DDR              Data direction register for Port B
```

## Key Registers
- $DD00-$DD03 - CIA-II - Port A / Port B and Data Direction Registers (VIC bank selection, serial bus, RS232/user-port control)

## References
- "vic_bank_selection" — expands on VIC bank selection bits on CIA#2 Port A
- "io_area_header" — expands on I/O area mapping and device controls