# CIA #2 Data Direction Registers ($DD02-$DD03)

**Summary:** CIA #2 Data Direction Registers at $DD02 (DDRA) and $DD03 (DDRB) control the direction of Port A and Port B bits on the 6526 CIA (1 = output, 0 = input). Defaults: DDRA = 63 ($3F) (bits 0–5 outputs, bits 6–7 inputs); DDRB = 0 ($00) (all inputs). Opening the RS-232 device forces PB1/PB2 (bits 1 and 2 of Port B) to outputs.

## Description
These two CIA #2 registers set each corresponding port bit as input or output. A bit value of 1 configures the corresponding Port bit as an output; 0 configures it as an input (short note: 1 = output, 0 = input).

- DDRA ($DD02) controls direction for Port A. Default value is 63 decimal ($3F), so bits 0–5 are outputs and bits 6–7 are inputs.
- DDRB ($DD03) controls direction for Port B. Default value is 0 ($00), so all Port B bits are inputs by default.
- When the system opens the RS-232 device, PB1 and PB2 (Port B bit 1 and bit 2) are changed to outputs by the I/O layer.

For operational details of the DDR behavior (edge cases, handshaking, and interaction with port output registers), see the CIA #1 Data Direction Registers entry at decimal 56322 ($DC02).

## Source Code
```text
Register map (CIA #2)
$DD00 - $DD0F : CIA #2 registers (base $DD00)
$DD02 - DDRA - Data Direction Register A
    Default: %00111111 (0x3F, 63)  ; bits 0-5 = outputs, bits 6-7 = inputs
$DD03 - DDRB - Data Direction Register B
    Default: %00000000 (0x00, 0)    ; all bits inputs by default
Notes:
- On RS-232 open: Port B bit 1 (PB1) and bit 2 (PB2) are set to outputs.
- For byte direction: 1 = output, 0 = input.
Reference: See CIA #1 DDR entry at $DC02 for detailed operational description.
```

## Key Registers
- $DD02-$DD03 - CIA #2 - Data Direction Registers A and B

## References
- "dd02_c2ddra" — detailed bit-by-bit description of Data Direction Register A
- "dd03_c2ddrb" — detailed bit-by-bit description of Data Direction Register B
- "CIA #1 Data Direction Registers ($DC02 / 56322)" — operational details and behavior comparisons with CIA #1

## Labels
- DDRA
- DDRB
