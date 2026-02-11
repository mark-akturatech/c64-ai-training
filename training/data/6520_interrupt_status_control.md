# Interrupt Status Control (CA1/CA2/CB1/CB2)

**Summary:** Logic that interprets Control Register A/B contents to detect active transitions on CA1/CA2/CB1/CB2, set the corresponding interrupt flags, and perform the peripheral-line operations required for proper interrupt handling (affecting /IRQA and /IRQB).

## Interrupt Status Control
The Interrupt Status Control (A,B) handles the four peripheral control/interrupt lines CA1, CA2, CB1 and CB2. For each group (A and B) the logic:

- Interprets the corresponding Control Register bits.
- Detects active transitions on the associated interrupt input pins (CA1/CA2 for A, CB1/CB2 for B).
- Sets the appropriate interrupt flag(s) when the specified transition condition is met.
- Performs the necessary actions (as specified by the Control Register) to drive and maintain correct operation of those peripheral interface lines and to request CPU service via the chip’s interrupt outputs.

Operational details and the precise Control Register bit interactions (including effects on /IRQA and /IRQB and the CA2/CB2 output behaviors) are documented in the referenced control_of_irqa and control_of_irqb entries.

## References
- "control_of_irqa" — details for CA1/CA2 control bits and interaction with /IRQA  
- "control_of_irqb" — details for CB1/CB2 control bits and interaction with /IRQB

## Labels
- CA1
- CA2
- CB1
- CB2
- IRQA
- IRQB
