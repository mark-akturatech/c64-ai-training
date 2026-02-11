# MACHINE - Intro to 6520 interrupt input/peripheral control lines (CA1, CA2, CB1, CB2)

**Summary:** Overview of the 6520 interrupt input/peripheral control lines CA1, CA2, CB1, CB2 and their relation to the two 8-bit ports PA0-PA7 and PB0-PB7 (6520 PIA). Describes their role as peripheral-control and interrupt input signals for Port A and Port B.

## Overview
The 6520 provides four dedicated control/interrupt lines that augment the two general-purpose I/O ports:
- CA1 and CA2 are the control/interrupt lines associated with Port A (PA0–PA7).
- CB1 and CB2 are the control/interrupt lines associated with Port B (PB0–PB7).

These lines are not general-purpose data pins; they provide special peripheral-control functions and interrupt input capability to the respective port, allowing external devices to signal events or participate in control/handshake schemes with the 6520-controlled port pins.

## References
- "6520_peripheral_a_ca1_ca2" — detailed behavior of CA1 and CA2  
- "6520_peripheral_b_cb1_cb2" — detailed behavior of CB1 and CB2

## Labels
- CA1
- CA2
- CB1
- CB2
