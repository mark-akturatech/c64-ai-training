# 6520 Control Registers (CRA and CRB)

**Summary:** Describes the 6520 PIA Control Registers CRA and CRB: bit-level layout (bits 7/6 = interrupt status /IRQA,/IRQB), CA1/CA2 and CB1/CB2 control fields, and the DDRA/DDRB access bit used to select Data Direction Registers versus Output Registers. Notes that CRA/CRB are frequently read/written to enable/disable interrupts and change peripheral modes.

## Control Register Overview
CRA and CRB control interrupt inputs (CA1, CA2, CB1, CB2) and peripheral control lines (CA2, CB2). Each control register contains:
- Two interrupt-status bits (bits 7 and 6) that reflect the state of the interrupt input lines; these are used by the CPU during an interrupt service routine to determine the source of the interrupt (/IRQA for CRA, /IRQB for CRB).
- A multi-bit CA2/CB2 control field (middle bits) that configures CA2/CB2 behavior and edge/level sensitivity as described by the peripheral interface (see device-specific CA2/CB2 options).
- A single-bit selector that controls whether accesses target the Data Direction Register (DDRx) or the Output Register (ORx) for the corresponding port (DDRA/ORA via CRA, DDRB/ORB via CRB).
- A CA1/CB1 control bit (bit 0) to configure CA1/CB1 behavior.

These control bits are accessed repeatedly during normal operation to enable/disable interrupts, change CA2/CB2 modes, or switch between DDR and output register addressing.

## Source Code
```text
               7      6      5      4      3      2      1      0
            +------+------+------+------+------+------+------+------+
        CRA | IRQ  | IRQ  |    CA2 CONTROL     | DDRA | CA1 CONTROL |
            |  A1  |  A2  |                    |ACCESS|             |
            +------+------+------+------+------+------+------+------+

            +------+------+------+------+------+------+------+------+
        CRB | IRQ  | IRQ  |    CA2 CONTROL     | DDRB | CB1 CONTROL |
            |  B1  |  B2  |                    |ACCESS|             |
            +------+------+------+------+------+------+------+------+

        Figure I.2
```

Additional descriptive excerpt retained from source:
- The Control Registers allow the microprocessor to control the operation of the interrupt lines (CA1, CA2, CB1, CB2) and peripheral control lines (CA2, CB2).
- A single bit in each register controls addressing of the Data Direction Registers (DDRA, DDRB) and the Output Registers (ORA, ORB).
- Bits 6 and 7 in each control register indicate the status of the interrupt input lines (CA1, CA2, CB1, CB2) and are normally interrogated by the microprocessor during the interrupt service program to determine the source of an active interrupt.
- The various bits in the control registers will be accessed many times during a program to enable or disable interrupts, change operating modes, etc., as required by the peripheral device being controlled.

## References
- "6520_ddr" — expands on Data Direction Registers referenced by CRA/CRB
- "control_of_irqa" — expands on how CRA bits affect /IRQA

## Labels
- CRA
- CRB
