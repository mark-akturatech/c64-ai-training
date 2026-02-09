# CIA Interrupt Conditions (CRA / CRB)

**Summary:** CRA/CRB interrupt logic for the CIA chips: /IRQA goes low when (CRA-7=1 AND CRA-0=1) OR (CRA-6=1 AND CRA-3=1); /IRQB goes low when (CRB-7=1 AND CRB-0=1) OR (CRB-6=1 AND CRB-3=1). Applies to CIA1 ($DC00-$DC0F) and CIA2 ($DD00-$DD0F).

## Interrupt conditions
- /IRQA (CIA interrupt A output) is asserted low when either:
  - CRA-7 = 1 AND CRA-0 = 1, OR
  - CRA-6 = 1 AND CRA-3 = 1.
- /IRQB (CIA interrupt B output) is asserted low when either:
  - CRB-7 = 1 AND CRB-0 = 1, OR
  - CRB-6 = 1 AND CRB-3 = 1.

The flags named above act as the link between peripheral interrupt signals and the processor interrupt inputs. The interrupt-disable bits (the bits referred to above that enable/disable) allow the CPU to control whether those peripheral conditions generate the CPU interrupt.

## Key Registers
- $DC00-$DC0F - CIA 1 - control, timer and interrupt registers (contains CRA/CRB interrupt control bits)
- $DD00-$DD0F - CIA 2 - control, timer and interrupt registers (contains CRA/CRB interrupt control bits)

## References
- "MACHINE - Summary of interrupt conditions" — original brief summary of CRA/CRB interrupt logic