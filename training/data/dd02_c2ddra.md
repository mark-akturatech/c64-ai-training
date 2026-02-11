# CIA 2 Data Direction Register A ($DD02 / C2DDRA)

**Summary:** CIA 2 Data Direction Register A at $DD02 (C2DDRA) selects input (0) or output (1) for each bit of Data Port A (PA0..PA7); bits 0–7 correspond to PA0–PA7 respectively.

## Description
$DD02 (C2DDRA) is the Data Direction Register for CIA 2 Port A. Each bit of the register configures the corresponding bit line of Data Port A as an input or an output:

- Bit 0 — PA0 direction (0 = input, 1 = output)  
- Bit 1 — PA1 direction (0 = input, 1 = output)  
- Bit 2 — PA2 direction (0 = input, 1 = output)  
- Bit 3 — PA3 direction (0 = input, 1 = output)  
- Bit 4 — PA4 direction (0 = input, 1 = output)  
- Bit 5 — PA5 direction (0 = input, 1 = output)  
- Bit 6 — PA6 direction (0 = input, 1 = output)  
- Bit 7 — PA7 direction (0 = input, 1 = output)

Use this register to control which PA lines drive outputs and which float to be read as inputs.

## Key Registers
- $DD02 - CIA 2 - Data Direction Register A (C2DDRA): bits 0-7 select input(0)/output(1) for PA0..PA7

## References
- "dd00_ci2pra_data_port_register_a" — shows which signals are affected by these direction bits

## Labels
- C2DDRA
