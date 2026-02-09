# CIA #1 Data Direction Registers ($DC02-$DC03)

**Summary:** $DC02-$DC03 are CIA #1 Data Direction Registers DDRA and DDRB; each bit selects direction for the corresponding Data Port bit (1 = output, 0 = input). Defaults used for keyboard scanning: DDRA = $FF (all outputs), DDRB = $00 (all inputs).

## Description
These two bytes control the direction of data flow on CIA #1's parallel I/O ports:

- Each bit in DDRA ($DC02) controls the direction of the corresponding bit in Data Port A (1 = output, 0 = input).  
- Each bit in DDRB ($DC03) controls the direction of the corresponding bit in Data Port B (1 = output, 0 = input).  
- Example: bit 7 of DDRA determines whether bit 7 of Port A is an input or an output.

The documented default values correspond to the keyboard scanning arrangement: the keyboard column index is written to Data Port A (so Port A lines are outputs), and the keyboard row is read from Data Port B (so Port B lines are inputs).

## Source Code
(omitted — no code or tables in the source)

## Key Registers
- $DC02-$DC03 - CIA 1 - Data Direction Registers A and B (per-bit direction: 1=output, 0=input)

## References
- "ciapra_data_port_register_a" — expands on reasons to set DDR bits before reading keyboard or external devices