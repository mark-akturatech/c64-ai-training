# 6520 Peripheral Output Registers (ORA, ORB)

**Summary:** ORA and ORB are 6520 Peripheral Output Registers that store output data for the Peripheral I/O port; writing 0 drives the corresponding line low (< 0.4V) and writing 1 drives it high. ORA controls Peripheral A lines; ORB controls Peripheral B lines.

## Operation
The Peripheral Output Registers hold the output values that appear on the Peripheral I/O port. Writing a "0" into a bit in ORA causes the corresponding line on the Peripheral A port to go low (< 0.4V) if that line is programmed to act as an output. Writing a "1" causes the corresponding output to go high. ORB controls the lines of the Peripheral B port in the same manner.

## Labels
- ORA
- ORB
