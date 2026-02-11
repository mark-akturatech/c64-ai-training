# $DC02 — CIDDRA (CIA1 Data Direction Register A)

**Summary:** CIA1 Data Direction Register A at $DC02 selects direction for each bit of Data Port A (0 = input, 1 = output). Searchable terms: $DC02, CIDDRA, CIA1, Data Direction Register, DDR, Port A.

## Register Description
CIDDRA ($DC02) controls the direction of the eight pins of CIA1 Data Port A on a per-bit basis. Each bit in the register corresponds to the same-numbered bit on Port A; setting a bit to 1 makes that Port A pin an output, clearing a bit to 0 makes it an input.

- Bit = 0 → Port A bit configured as input
- Bit = 1 → Port A bit configured as output

This register is the CIA1 Data Direction Register for Port A and is used whenever software must switch individual port lines between input and output modes.

## Source Code
```text
$DC02        CIDDRA       Data Direction Register A

                     0    Select Bit 0 of Data Port A for input or output (0=input, 1=output)
                     1    Select Bit 1 of Data Port A for input or output (0=input, 1=output)
                     2    Select Bit 2 of Data Port A for input or output (0=input, 1=output)
                     3    Select Bit 3 of Data Port A for input or output (0=input, 1=output)
                     4    Select Bit 4 of Data Port A for input or output (0=input, 1=output)
                     5    Select Bit 5 of Data Port A for input or output (0=input, 1=output)
                     6    Select Bit 6 of Data Port A for input or output (0=input, 1=output)
                     7    Select Bit 7 of Data Port A for input or output (0=input, 1=output)
```

## Key Registers
- $DC00-$DC0F - CIA 1 - Port A/B data and control registers (including Data Direction Register A at $DC02)

## References
- "cia_data_direction_registers" — expands on Use of DDRs for port direction

## Labels
- CIDDRA
