# CIDDRB ($DC03) — Data Direction Register B (CIA 1)

**Summary:** CIDDRB at $DC03 (decimal 56323) is the CIA 1 Data Direction Register B that selects each Data Port B bit direction: 0 = input, 1 = output. Searchable terms: $DC03, CIDDRB, CIA 1, Data Direction Register, Data Port B, DDRB.

## Description
CIDDRB is an 8-bit data-direction register for Data Port B of CIA 1. Each bit controls the direction of the corresponding pin of Port B: writing a 0 configures that port bit as an input, writing a 1 configures it as an output. The register is addressed at hex $DC03 (decimal 56323).

## Source Code
```text
Register: CIDDRB (Data Direction Register B)
Address:  $DC03  (decimal 56323)

Bit 7: Select Bit 7 of Data Port B for input or output (0=input, 1=output)
Bit 6: Select Bit 6 of Data Port B for input or output (0=input, 1=output)
Bit 5: Select Bit 5 of Data Port B for input or output (0=input, 1=output)
Bit 4: Select Bit 4 of Data Port B for input or output (0=input, 1=output)
Bit 3: Select Bit 3 of Data Port B for input or output (0=input, 1=output)
Bit 2: Select Bit 2 of Data Port B for input or output (0=input, 1=output)
Bit 1: Select Bit 1 of Data Port B for input or output (0=input, 1=output)
Bit 0: Select Bit 0 of Data Port B for input or output (0=input, 1=output)
```

## Key Registers
- $DC03 - CIA 1 - Data Direction Register B (selects direction for Data Port B bits 0..7)

## References
- "cia_data_direction_registers_overview" — expands on default DDR values and usage