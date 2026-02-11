# $DC03 — CIDDRB (Data Direction Register B)

**Summary:** $DC03 is the CIA1 Data Direction Register B (DDRB) on the C64; each bit 0–7 selects the direction of the corresponding Port B pin (0 = input, 1 = output). This register works together with Port B data register (PRB, $DC01).

## Description
DDRB controls whether each physical pin of CIA1 Port B is an input or an output. Writing a 1 to a bit makes that Port B pin an output; writing a 0 makes it an input. The PRB register ($DC01) provides the data for outputs and reads the pin state for inputs (i.e., PRB reads the latched/output value or external pin level depending on DDRB). Use DDRB to configure Port B pins before driving them to avoid bus conflicts.

## Source Code
```text
$DC03        CIDDRB       Data Direction Register B

                     Bit 0    Select Bit 0 of Data Port B for input or output (0=input, 1=output)
                     Bit 1    Select Bit 1 of Data Port B for input or output (0=input, 1=output)
                     Bit 2    Select Bit 2 of Data Port B for input or output (0=input, 1=output)
                     Bit 3    Select Bit 3 of Data Port B for input or output (0=input, 1=output)
                     Bit 4    Select Bit 4 of Data Port B for input or output (0=input, 1=output)
                     Bit 5    Select Bit 5 of Data Port B for input or output (0=input, 1=output)
                     Bit 6    Select Bit 6 of Data Port B for input or output (0=input, 1=output)
                     Bit 7    Select Bit 7 of Data Port B for input or output (0=input, 1=output)
```

## Key Registers
- $DC03 - CIA 1 - Data Direction Register B (DDRB): bits 0–7 select Port B pin direction (0 = input, 1 = output)

## References
- "cia_data_direction_registers" — expands on Use of DDRs for port direction

## Labels
- CIDDRB
- DDRB
