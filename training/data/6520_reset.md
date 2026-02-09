# MACHINE — 6520 Reset (/RES) behaviour

**Summary:** The active-low /RES input on the 6520 resets the contents of all internal 6520 registers to logic zero; it is suitable for use as a power-on reset or as a master reset during operation.

## Reset (/RES)
The /RES signal is active low (asserted when driven to logic 0). When /RES is asserted, the contents of all 6520 registers are cleared to logic zero. The line may be used both as a power-on reset and as a master reset during normal system operation.