# CIA 2 Data Direction Register B ($DD03 / C2DDRB)

**Summary:** CIA 2 Data Direction Register B at $DD03 (C2DDRB) controls the direction of Data Port B (PB0–PB7) on the 6526/6522-compatible CIA; each bit selects input (0) or output (1) for the corresponding PB line.

## Description
Each bit of $DD03 (C2DDRB) configures the direction for the matching Data Port B pin (PB0..PB7) on CIA #2:
- Bit = 0: the corresponding PB line is configured as input.
- Bit = 1: the corresponding PB line is configured as output.

Bits map directly to PB0 through PB7 (bit0 → PB0, bit1 → PB1, …, bit7 → PB7). This register only sets direction; the actual output values are written/read via the Data Port B register (see CIA Data Port B documentation).

## Source Code
```text
$DD03   C2DDRB   Data Direction Register B (CIA #2)

Bit 7  Bit 6  Bit 5  Bit 4  Bit 3  Bit 2  Bit 1  Bit 0
  7      6      5      4      3      2      1      0
Select Bit 7 of Data Port B for input or output (0=input, 1=output)
Select Bit 6 of Data Port B for input or output (0=input, 1=output)
Select Bit 5 of Data Port B for input or output (0=input, 1=output)
Select Bit 4 of Data Port B for input or output (0=input, 1=output)
Select Bit 3 of Data Port B for input or output (0=input, 1=output)
Select Bit 2 of Data Port B for input or output (0=input, 1=output)
Select Bit 1 of Data Port B for input or output (0=input, 1=output)
Select Bit 0 of Data Port B for input or output (0=input, 1=output)
```

## Key Registers
- $DD03 - CIA 2 - Data Direction Register B (C2DDRB): bits 0..7 = PB0..PB7 direction (0=input, 1=output)

## References
- "dd01_ci2prb_data_port_register_b" — shows which signals are affected by these direction bits

## Labels
- C2DDRB
