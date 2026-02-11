# 6520 Interrupt Request Lines (/IRQA, /IRQB)

**Summary:** Describes the 6520 /IRQA and /IRQB active-low interrupt request lines, their linkage to CRA/CRB interrupt flag bits (bits 6 and 7), and how CA1/CA2/CB1/CB2 transitions set those flags and can be masked by control bits.

## Interrupt Request Line (/IRQA, /IRQB)
The 6520 provides two active-low Interrupt Request outputs: /IRQA and /IRQB. Each line can assert (go low) to interrupt the CPU either directly or via external interrupt-priority circuitry.

Each Interrupt Request line is driven by two interrupt flag bits located in the corresponding Control Register (CRA for port A, CRB for port B). Specifically, the flag bits occupy bit positions 6 and 7 of CRA/CRB and serve as the interface between peripheral input signals and the processor interrupt inputs. When a flag is set it can cause the associated /IRQ line to assert low.

Each interrupt flag has a corresponding interrupt-disable control bit in the same control register; these bits permit the processor to enable or disable the interrupt source from each of the four input lines (CA1, CA2, CB1, CB2) without clearing the flag. The four interrupt flags are set by active transitions on CA1, CA2, CB1, and CB2 (the behavior of which — edge or level — is configurable and detailed in the control-register description).

Control of which active transition (edge/level/polarity) sets each flag is defined in CRA/CRB; that control determines what peripheral signal change will set the flag and thus potentially assert /IRQA or /IRQB.

## References
- "6520_control_registers" — CRA/CRB bits layout and how flags are stored

## Labels
- IRQA
- IRQB
- CRA
- CRB
- CA1
- CA2
- CB1
- CB2
